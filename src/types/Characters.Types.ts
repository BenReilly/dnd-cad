import { SpellSheet } from './Spells.Types';

export enum Alignment {
  'Lawful Good',
  'Lawful Neutral',
  'Lawful Evil',
  'Neutral Good',
  'Neutral',
  'Neutral Evil',
  'Chaotic Good',
  'Chaotic Neutral',
  'Chaotic Evil',
}

export type Ally = {
  name: string;
  details?: string;
};

export type Attack = {
  name: string;
  attackBonus: number;
  damage: string;
  normalRange: number | null;
  longRange: number | null;
  type: string;
};

export type Attributes = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};

export type CharClass = {
  name: string;
  level?: number;
};

export type CharClassFormat = {
  class_name: string;
  subclass_format: string;
  subclass_title: string;
  subclasses: string[];
};

export type Description = {
  age: number;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  distinguishingFeatures: string;
  appearance: string;
};

export type Equipment = {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
  gear: string[];
};

export type Feature = {
  name: string;
  details?: string;
};

export type HitDie = {
  qty: number;
  die: number;
};

export type Persona = {
  personalityTraits?: string[];
  ideals?: string[];
  bonds?: string[];
  flaws?: string[];
  backstory?: string;
};

export type Race = {
  race_name: string;
  subraces?: string[];
};

export type SavingThrows = {
  str: boolean;
  dex: boolean;
  con: boolean;
  int: boolean;
  wis: boolean;
  cha: boolean;
};

export type Skills = {
  acrobatics: boolean | 'double';
  animalHandling: boolean | 'double';
  arcana: boolean | 'double';
  athletics: boolean | 'double';
  deception: boolean | 'double';
  history: boolean | 'double';
  insight: boolean | 'double';
  intimidation: boolean | 'double';
  investigation: boolean | 'double';
  medicine: boolean | 'double';
  nature: boolean | 'double';
  perception: boolean | 'double';
  performance: boolean | 'double';
  persuasion: boolean | 'double';
  religion: boolean | 'double';
  slightOfHand: boolean | 'double';
  stealth: boolean | 'double';
  survival: boolean | 'double';
};

export type Character = {
  charId: string;
  user_doc: string;
  name: string;
  class: CharClass[];
  subclass?: string;
  background?: string;
  race: string;
  subrace?: string;
  alignment?: Alignment;
  xp?: number;
  attributes?: Attributes;
  inspiration?: number;
  savingThrows?: SavingThrows;
  skills?: Skills;
  ac?: number;
  initiative?: number;
  speed?: number;
  hp?: number;
  hitDice?: HitDie[];
  persona?: Persona;
  attacks?: Attack[];
  featuresAndTraits?: Feature[];
  proficienciesAndLanguages?: string[];
  equipment?: Equipment;
  description?: Description;
  alliesAndAssociations?: Ally;
  additionalFeatures: [string];
  treasure?: [string];
  spells?: SpellSheet;
};

export type CharacterSummary = {
  charId: string;
  class: CharClass[];
  alignment?: Alignment;
  background?: string;
  subclass?: string;
  subrace?: string;
  race: string;
  name: string;
};

export type CharacterContextType = {
  CurrentCharacter?: Character;
  Characters: Character[];
  CharacterSummaries: CharacterSummary[];
};

export type RaceAndClassContextType = {
  Races: Race[];
  Classes: CharClassFormat[];
};
