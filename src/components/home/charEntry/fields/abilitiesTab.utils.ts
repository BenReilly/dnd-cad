import { Abilities, Skill } from '../../../../types/Characters.Types';

export type AbilityKey = keyof Abilities;

export type AbilityValues = { [K in AbilityKey]: number | null };

export const ABILITY_ORDER: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const getSaveCheckboxKey = (ability: AbilityKey) => `${ability}.proficient`;

export const getSkillProficientKey = (skillKey: string) => `${skillKey}.proficient`;

export const getSkillExpertiseKey = (skillKey: string) => `${skillKey}.expertise`;

export const groupSkillsByAbility = (skills: Skill[]): Record<AbilityKey, Skill[]> => {
  const grouped: Record<AbilityKey, Skill[]> = {
    str: [],
    dex: [],
    con: [],
    int: [],
    wis: [],
    cha: [],
  };

  skills.forEach((skill) => {
    grouped[skill.ability].push(skill);
  });

  ABILITY_ORDER.forEach((ability) => {
    grouped[ability].sort((a, b) => a.display.localeCompare(b.display));
  });

  return grouped;
};

export const getSaveModifier = (
  baseModifier: number | null | undefined,
  proficient: boolean,
  proficiencyBonus: number,
) => {
  return (baseModifier ?? 0) + (proficient ? proficiencyBonus : 0);
};

export const getSkillModifier = (
  baseModifier: number | null | undefined,
  proficient: boolean,
  expertise: boolean,
  proficiencyBonus: number,
) => {
  const proficiencyContribution = expertise
    ? proficiencyBonus * 2
    : proficient
      ? proficiencyBonus
      : 0;

  return (baseModifier ?? 0) + proficiencyContribution;
};

export const applySkillSelectionRules = (
  previousValues: Record<string, boolean>,
  newValues: Record<string, boolean>,
  skills: Skill[],
) => {
  const constrainedValues = { ...newValues };

  skills.forEach((skill) => {
    const proficientKey = getSkillProficientKey(skill.key);
    const expertiseKey = getSkillExpertiseKey(skill.key);

    const wasProficient = previousValues[proficientKey] ?? false;
    const wasExpertise = previousValues[expertiseKey] ?? false;
    const isProficient = newValues[proficientKey] ?? false;
    const isExpertise = newValues[expertiseKey] ?? false;

    if (!wasExpertise && isExpertise) {
      constrainedValues[proficientKey] = true;
    } else if (wasProficient && !isProficient) {
      constrainedValues[expertiseKey] = false;
    }
  });

  return constrainedValues;
};
