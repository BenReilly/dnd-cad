import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { getClasses, getRaces } from '../utils/firebase.utils';
import {
  CharClassFormat,
  Race,
  RaceAndClassContextType,
} from '../types/Characters.Types';

export const RaceClassContext = createContext<RaceAndClassContextType>({
  Races: [],
  Classes: [],
});

export const RaceClassProvider = ({ children }: PropsWithChildren) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [classes, setClasses] = useState<CharClassFormat[]>([]);

  const value = { Races: races, Classes: classes };

  useEffect(() => {
    const fetchRacesAndClasses = async () => {
      const fetchedRaces = await getRaces();
      const fetchedClasses = await getClasses();

      setRaces(fetchedRaces);
      setClasses(fetchedClasses);
    };
    fetchRacesAndClasses();
  }, []);
  return (
    <RaceClassContext.Provider value={value}>
      {children}
    </RaceClassContext.Provider>
  );
};
