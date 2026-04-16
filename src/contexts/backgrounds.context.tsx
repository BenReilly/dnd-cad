import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { getBackgrounds } from '../utils/firebase.utils';
import { Background, BackgroundContextType } from '../types/Characters.Types';

export const BackgroundsContext = createContext<BackgroundContextType>({
  Backgrounds: [],
});

export const BackgroundsProvider = ({ children }: PropsWithChildren) => {
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const fetchedBackgrounds = await getBackgrounds();
      setBackgrounds(fetchedBackgrounds);
    };

    fetchBackgrounds();
  }, []);

  return (
    <BackgroundsContext.Provider value={{ Backgrounds: backgrounds }}>
      {children}
    </BackgroundsContext.Provider>
  );
};
