import { useContext, useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { RaceClassContext } from '../contexts/racesAndClasses.context.js';
import {
  generateStatSet,
  randomArrayElement,
} from '../utils/generatestats.utils.js';

const Generate = () => {
  const { Races, Classes } = useContext(RaceClassContext);

  const [race, setRace] = useState<string>('');
  const [classType, setClassType] = useState<string>('');
  const [statSet, setStatSet] = useState<number[]>([]);

  useEffect(() => {
    if (Races?.length > 0) {
      setRace(randomArrayElement(Races, 'race_name'));
    }
    if (Classes?.length > 0) {
      setClassType(randomArrayElement(Classes, 'class_name'));
    }
    setStatSet(generateStatSet());
  }, [Races, Classes]);

  return (
    <div>
      <h2>Character Generation</h2>
      <p>
        Consider creating {race === 'elf' ? 'an' : 'a'} <strong>{race}</strong>{' '}
        <strong>{classType}</strong> using these stats:
      </p>
      <p>
        {statSet.map((stat, i) => (
          <span className="dnd-stat" key={i}>
            <em>{stat}</em>
          </span>
        ))}
      </p>
    </div>
  );
};

export const Route = createFileRoute('/generate')({
  component: Generate,
});
