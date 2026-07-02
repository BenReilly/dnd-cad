import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { getBackgrounds, getSkills } from '../utils/firebase.utils';
import {
  Background,
  BackgroundContextType,
  Skill,
  SkillsContextType,
} from '../types/Characters.Types';

export const BackgroundsContext = createContext<BackgroundContextType>({
  Backgrounds: [],
});

export const SkillsContext = createContext<SkillsContextType>({
  Skills: [],
});

export const CharacterOptionsProvider = ({ children }: PropsWithChildren) => {
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [fetchedBackgrounds, fetchedSkills] = await Promise.all([
        getBackgrounds(),
        getSkills(),
      ]);

      setBackgrounds(fetchedBackgrounds);
      setSkills(fetchedSkills);
    };

    fetchOptions();
  }, []);

  return (
    <BackgroundsContext.Provider value={{ Backgrounds: backgrounds }}>
      <SkillsContext.Provider value={{ Skills: skills }}>
        {children}
      </SkillsContext.Provider>
    </BackgroundsContext.Provider>
  );
};
