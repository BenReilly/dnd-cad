import {
  Attack,
  Character,
  HitDie,
  SavingThrows,
  Skill,
} from '../../../types/Characters.Types';
import { AbilityValues } from './fields/abilitiesTab.utils';

/** In-progress character sheet data; abilities may be partially filled during entry. */
export type CharacterEntryState = Partial<Omit<Character, 'abilities'>> & {
  abilities?: AbilityValues;
};

export const defaultSavingThrows = (): SavingThrows => ({
  str: false,
  dex: false,
  con: false,
  int: false,
  wis: false,
  cha: false,
});

export const defaultAbilityValues = (): AbilityValues => ({
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
});

export const emptyHitDie = (): HitDie => ({ qty: 0, die: 0 });

export const emptyAttack = (): Attack => ({
  name: '',
  attackBonus: null,
  damage: '',
  normalRange: null,
  longRange: null,
  type: '',
});

export const buildInitialSkills = (skills: Skill[]): Skill[] =>
  skills.map((skill) => ({
    key: skill.key,
    display: skill.display,
    ability: skill.ability,
    proficient: false,
    expertise: false,
  }));
