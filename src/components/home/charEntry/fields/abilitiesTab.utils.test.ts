import { describe, expect, it } from 'vitest';
import { Skill } from '../../../../types/Characters.Types';
import {
  ABILITY_LABELS,
  ABILITY_ORDER,
  applySkillSelectionRules,
  getSaveModifier,
  getSkillExpertiseKey,
  getSkillModifier,
  getSkillProficientKey,
  groupSkillsByAbility,
} from './abilitiesTab.utils';

describe('abilitiesTab.utils', () => {
  it('defines canonical ability labels and order', () => {
    expect(ABILITY_ORDER).toEqual(['str', 'dex', 'con', 'int', 'wis', 'cha']);
    expect(ABILITY_LABELS.dex).toBe('Dexterity');
    expect(ABILITY_LABELS.cha).toBe('Charisma');
  });

  it('groups skills by ability and sorts each group alphabetically', () => {
    const skills: Skill[] = [
      { key: 'stealth', display: 'Stealth', ability: 'dex' },
      { key: 'acrobatics', display: 'Acrobatics', ability: 'dex' },
      { key: 'athletics', display: 'Athletics', ability: 'str' },
    ];

    const grouped = groupSkillsByAbility(skills);

    expect(grouped.str.map((s) => s.display)).toEqual(['Athletics']);
    expect(grouped.dex.map((s) => s.display)).toEqual(['Acrobatics', 'Stealth']);
    expect(grouped.con).toEqual([]);
  });

  it('computes save and skill modifiers from proficiency state', () => {
    expect(getSaveModifier(3, false, 2)).toBe(3);
    expect(getSaveModifier(3, true, 2)).toBe(5);

    expect(getSkillModifier(3, false, false, 2)).toBe(3);
    expect(getSkillModifier(3, true, false, 2)).toBe(5);
    expect(getSkillModifier(3, true, true, 2)).toBe(7);
  });

  it('enforces expertise/proficient selection rules', () => {
    const skills: Skill[] = [
      { key: 'sleight', display: 'Sleight of Hand', ability: 'dex' },
    ];

    const proficientKey = getSkillProficientKey('sleight');
    const expertiseKey = getSkillExpertiseKey('sleight');

    const initial = { [proficientKey]: false, [expertiseKey]: false };

    const expertiseChecked = { ...initial, [expertiseKey]: true };
    const afterExpertise = applySkillSelectionRules(initial, expertiseChecked, skills);
    expect(afterExpertise).toEqual({ [proficientKey]: true, [expertiseKey]: true });

    const proficientUnchecked = { ...afterExpertise, [proficientKey]: false };
    const afterProficientOff = applySkillSelectionRules(
      afterExpertise,
      proficientUnchecked,
      skills,
    );
    expect(afterProficientOff).toEqual({ [proficientKey]: false, [expertiseKey]: false });
  });
});
