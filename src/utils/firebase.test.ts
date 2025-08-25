import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  mockedCharacterData,
  mockedCharacterSummaries,
  mockedClassData,
  mockedRaceData,
  mockedUser,
  mockedUserData,
} from './mockedTestData';
import * as firestore from 'firebase/firestore';
import {
  createUserDoc,
  getCharacterDetail,
  getCharacters,
  getClasses,
  getRaces,
  getUser,
} from './firebase.utils';
import { UserData } from '../types/User.Types';

const mocks = vi.hoisted(() => {
  return {
    mockCollection: vi.fn(),
    mockDoc: vi.fn(),
    mockGetDoc: vi.fn(),
    mockGetDocs: vi.fn(),
    mockSetDoc: vi.fn(),
    mockGetFirestore: vi.fn(() => ({})),
    mockQuery: vi.fn(),
  };
});

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof firestore>();
  return {
    ...actual,
    collection: mocks.mockCollection,
    doc: mocks.mockDoc,
    getDoc: mocks.mockGetDoc,
    getDocs: mocks.mockGetDocs,
    setDoc: mocks.mockSetDoc,
    getFirestore: mocks.mockGetFirestore,
    query: mocks.mockQuery,
  };
});

describe('firebase utility functions', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockUserDocRef = {
    id: 'mock-user-doc',
    path: `users/${mockedUser.uid}`,
  } as firestore.DocumentReference<UserData>;

  const mockCollectionRef = { id: 'mock-collection' };

  describe('createUserDoc', () => {
    it('creates a user if one does not exist', async () => {
      mocks.mockDoc.mockReturnValue(mockUserDocRef);
      mocks.mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      });

      await createUserDoc(mockedUser);

      expect(mocks.mockSetDoc).toHaveBeenCalledWith(
        mockUserDocRef,
        expect.objectContaining({
          uid: mockedUser.uid,
          uname: mockedUser.displayName,
          email: mockedUser.email,
          uavatar: mockedUser.photoURL,
          create_date: expect.any(Date),
        }),
      );
    });

    it('does not create a user if one already exists', async () => {
      mocks.mockDoc.mockReturnValue('mockUserDocRef');
      mocks.mockGetDoc.mockResolvedValue({ exists: () => true });

      await createUserDoc(mockedUser);

      expect(firestore.setDoc).not.toHaveBeenCalled();
    });

    it('reports the error when one is thrown', async () => {
      const createerr = new Error('borked');
      mocks.mockDoc.mockReturnValue(mockUserDocRef);
      mocks.mockGetDoc.mockResolvedValue({ exists: () => false });
      mocks.mockSetDoc.mockRejectedValue(createerr);

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const result = await createUserDoc(mockedUser);

      expect(spy).toHaveBeenCalledWith('Could not create user', createerr);
      expect(result).toBeNull();
      spy.mockRestore();
    });
  });

  describe('getUser', () => {
    it('returns null if no document is found', async () => {
      mocks.mockDoc.mockReturnValue(mockUserDocRef);
      mocks.mockGetDoc.mockResolvedValue({ exists: () => false });

      const result = await getUser('someUID');
      expect(result).toBeNull();
    });

    it('turns timestamp into a Date', async () => {
      mocks.mockDoc.mockReturnValue(mockUserDocRef);
      mocks.mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockedUserData,
      });

      const result = await getUser(mockedUserData.uid);

      expect(result?.create_date).toBeInstanceOf(Date);
      expect((result?.create_date as Date).toISOString()).toBe(
        '2024-10-03T21:21:10.000Z',
      );
    });

    it('returns a user doc if one is found', async () => {
      mocks.mockDoc.mockReturnValue(mockUserDocRef);
      mocks.mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockedUserData,
      });

      const result = await getUser(mockedUserData.uid);
      expect(result).toEqual({
        uid: mockedUserData.uid,
        uname: mockedUserData.uname,
        email: mockedUserData.email,
        create_date: expect.any(Date),
      });
    });

    it('reports the error if an error is thrown', async () => {
      const err = new Error('borked');
      mocks.mockDoc.mockReturnValue(mockUserDocRef);
      mocks.mockGetDoc.mockRejectedValue(err);

      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = await getUser('some UID');
      expect(spy).toHaveBeenCalledWith('Error fetching user document:', err);
      expect(result).toBeNull();
      spy.mockRestore();
    });
  });

  describe('getRaces', () => {
    it('returns an array of Race[]', async () => {
      mocks.mockDoc.mockReturnValue(mockCollectionRef);
      mocks.mockGetDocs.mockResolvedValue({
        docs: mockedRaceData.map((race) => ({
          data: () => race,
        })),
      });

      const result = await getRaces();
      expect(result).toEqual(mockedRaceData);
    });
  });

  describe('getClasses', () => {
    it('returns an array of Class[]', async () => {
      mocks.mockDoc.mockReturnValue(mockCollectionRef);
      mocks.mockGetDocs.mockResolvedValue({
        docs: mockedClassData.map((cclass) => ({
          data: () => cclass,
        })),
      });

      const result = await getClasses();
      expect(result).toEqual(mockedClassData);
    });
  });

  describe('getCharacters', () => {
    it('returns an array of characters', async () => {
      mocks.mockDoc.mockReturnValue(mockCollectionRef);
      mocks.mockGetDocs.mockResolvedValue({
        docs: mockedCharacterSummaries.map((character) => ({
          data: () => character,
        })),
      });
      const result = await getCharacters();
      expect(result).toEqual(mockedCharacterSummaries);
    });
  });

  describe('getCharacterDetail', () => {
    it('returns a full character', async () => {
      mocks.mockDoc.mockReturnValue(mockUserDocRef);
      mocks.mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockedCharacterData,
      });

      const result = await getCharacterDetail('77zg0SMUQcgD1AggYI1V');
      expect(result).toEqual(mockedCharacterData);
    });
  });
});
