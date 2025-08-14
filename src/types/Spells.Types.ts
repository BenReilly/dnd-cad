export type Component = {
  material: boolean;
  somatic: boolean;
  verbal: boolean;
  items?: string[];
};

export type Duration = {
  time: string;
  concentration: boolean;
};

export type Spell = {
  components?: Component[];
  duration: Duration;
  name: string;
  level: number | 'cantrip';
  range?: string;
  castingTime?: string;
  ritual?: boolean;
  save?: string;
  prepared: boolean;
  effect?: string;
};

export type SpellSlots = {
  First: number;
  Second: number;
  Third: number;
  Fourth: number;
  Fifth: number;
  Sixth: number;
  Seventh: number;
  Eighth: number;
  Ninth: number;
};

export type SpellSheet = {
  spellAttackBonus: number;
  spellSaveDC: number;
  cantripsKnown: number;
  spellsPrepared: number;
  componentPouch?: string[];
  spellSlots: SpellSlots;
  spellsKnown?: Spell[];
};
