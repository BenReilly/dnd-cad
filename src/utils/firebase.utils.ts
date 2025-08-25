import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  NextOrObserver,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { Character, CharClassFormat, Race } from '../types/Characters.Types';
import { UserData } from '../types/User.Types';
import firebaseConfig from './firebase.config';

// Initialize Firebase
initializeApp(firebaseConfig);

// authentication
// google
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, provider);

// deauthenticate
export const signOutUser = async () => signOut(auth);

export const db = getFirestore();

export const createUserDoc = async (
  userAuth: User,
): Promise<DocumentReference<UserData> | null> => {
  const userDocRef = doc(
    db,
    'users',
    userAuth.uid,
  ) as DocumentReference<UserData>;
  const userSnapshot = await getDoc(userDocRef);
  if (!userSnapshot.exists()) {
    const { displayName, email, photoURL, uid } = userAuth;
    try {
      await setDoc(userDocRef, {
        uid,
        uname: displayName ?? '',
        email: email ?? '',
        uavatar: photoURL ?? undefined,
        create_date: new Date(),
      });
    } catch (err) {
      console.log('Could not create user', err);
      return null;
    }
  }
  return userDocRef;
};

export const getUser = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', uid) as DocumentReference<UserData>;
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      ...data,
      create_date:
        data.create_date instanceof Timestamp
          ? data.create_date.toDate()
          : data.create_date,
    };
  } catch (err) {
    console.error('Error fetching user document:', err);
    return null;
  }
};

// tech debt: getRaces and getClasses almost identical, DRY them
// tech debt: add document IDs to races and classes
export const getRaces = async (): Promise<Race[]> => {
  const collectionRef = collection(db, 'races') as CollectionReference<Race>;
  const querySnapshot = await getDocs(collectionRef);
  const races: Race[] = querySnapshot.docs.map((docSnapshot) =>
    docSnapshot.data(),
  );
  return races;
};

export const getClasses = async (): Promise<CharClassFormat[]> => {
  const collectionRef = collection(
    db,
    'classes',
  ) as CollectionReference<CharClassFormat>;
  const querySnapshot = await getDocs(collectionRef);
  const classes: CharClassFormat[] = querySnapshot.docs.map((docSnapshot) =>
    docSnapshot.data(),
  );
  return classes;
};

export const getCharacters = async (): Promise<Character[]> => {
  const collectionRef = collection(db, 'characters');
  // tech debt: update to use actual user ID
  const q = query(collectionRef, where('userDoc', '==', 'eje'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnapshot) => {
    const character = docSnapshot.data();
    return {
      charId: docSnapshot.id,
      class: character.charClass,
      ...character,
    };
  }) as Character[];
};

export const getCharacterDetail = async (
  characterId: string,
): Promise<Character> => {
  const docRef = doc(db, 'characters', characterId);
  const docSnapshot = await getDoc(docRef);
  return {
    charId: docSnapshot.id,
    ...docSnapshot.data(),
  } as Character;
};

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);
