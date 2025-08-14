import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { getCharacters } from '../utils/firebase.utils';
import {
  Character,
  CharacterContextType,
  CharacterSummary,
} from '../types/Characters.Types';

export const CharactersContext = createContext<CharacterContextType | null>(
  null,
);

const CharactersProvider = ({ children }: PropsWithChildren) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersSummary, setCharactersSummary] = useState<
    CharacterSummary[]
  >([]);
  useEffect(() => {
    const fetchCharacters = async (): Promise<void> => {
      const fetchedCharacters: Character[] = await getCharacters();
      const characterSummaries = fetchedCharacters.map((char) => {
        const { charId, alignment, background, subclass, subrace, race, name } =
          char;
        const charClass = char.class;
        return {
          charId,
          class: charClass,
          alignment,
          background,
          subclass,
          subrace,
          race,
          name,
        } as CharacterSummary;
      });
      setCharactersSummary(characterSummaries);
      setCharacters(fetchedCharacters);
    };
    fetchCharacters();
  }, []);

  const value = {
    Characters: characters,
    CharacterSummaries: charactersSummary,
  };
  return (
    <CharactersContext.Provider value={value}>
      {children}
    </CharactersContext.Provider>
  );
};

export default CharactersProvider;
