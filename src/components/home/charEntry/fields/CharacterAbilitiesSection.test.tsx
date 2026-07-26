import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CharacterAbilitiesSection from './CharacterAbilitiesSection';
import { Skill } from '../../../../types/Characters.Types';

const defaultAbilities = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
};

const defaultModifiers = {
  str: 0,
  dex: 0,
  con: 0,
  int: 0,
  wis: 0,
  cha: 0,
};

const defaultCharacter = {
  abilities: defaultAbilities,
  savingThrows: {
    str: false,
    dex: false,
    con: false,
    int: false,
    wis: false,
    cha: false,
  },
  skills: [] as Skill[],
};

describe('CharacterAbilitiesSection', () => {
  it('renders all ability headings and routes ability score changes', () => {
    const onAbilityChange = vi.fn();
    const skills: Skill[] = [];

    const { container } = render(
      <CharacterAbilitiesSection
        abilities={defaultCharacter.abilities}
        savingThrows={defaultCharacter.savingThrows}
        characterSkills={defaultCharacter.skills}
        abilityModifiers={defaultModifiers}
        onAbilityChange={onAbilityChange}
        skills={skills}
        proficiencyBonus={2}
        updateCharacter={() => {}}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Abilities' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Strength' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dexterity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Constitution' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Intelligence' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Wisdom' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Charisma' })).toBeInTheDocument();

    const strengthInput = container.querySelector('input[name="str"]') as HTMLInputElement;
    fireEvent.change(strengthInput, { target: { value: '15' } });

    expect(onAbilityChange).toHaveBeenCalledWith('str', 15);
  });

  it('groups skills under the matching ability in alphabetical order', () => {
    const skills: Skill[] = [
      { key: 'stealth', display: 'Stealth', ability: 'dex' },
      { key: 'acrobatics', display: 'Acrobatics', ability: 'dex' },
      { key: 'athletics', display: 'Athletics', ability: 'str' },
    ];

    const { container } = render(
      <CharacterAbilitiesSection
        abilities={defaultCharacter.abilities}
        savingThrows={defaultCharacter.savingThrows}
        characterSkills={defaultCharacter.skills}
        abilityModifiers={defaultModifiers}
        onAbilityChange={() => {}}
        skills={skills}
        proficiencyBonus={2}
        updateCharacter={() => {}}
      />,
    );

    const dexHeading = screen.getByRole('heading', { name: 'Dexterity' });
    const dexSection = dexHeading.closest('section') as HTMLElement;
    const dexLabels = within(dexSection).getAllByText(/Acrobatics|Stealth/).map((node) => node.textContent);
    expect(dexLabels).toEqual(['Acrobatics', 'Stealth']);

    const strHeading = screen.getByRole('heading', { name: 'Strength' });
    const strSection = strHeading.closest('section') as HTMLElement;
    expect(within(strSection).getByText('Athletics')).toBeInTheDocument();

    const conHeading = screen.getByRole('heading', { name: 'Constitution' });
    const conSection = conHeading.closest('section') as HTMLElement;
    expect(within(conSection).getByText('No skills for this ability.')).toBeInTheDocument();

    const dexInput = container.querySelector('input[name="dex"]') as HTMLInputElement;
    expect(dexInput).toBeInTheDocument();
  });

  it('updates save and skill modifiers with proficiency and expertise, and syncs states via updateCharacter', async () => {
    const user = userEvent.setup();
    const skills: Skill[] = [
      { key: 'sleight', display: 'Sleight of Hand', ability: 'dex' },
    ];
    const updateCharacter = vi.fn();

    render(
      <CharacterAbilitiesSection
        abilities={defaultCharacter.abilities}
        savingThrows={defaultCharacter.savingThrows}
        characterSkills={[{ key: 'sleight', display: 'Sleight of Hand', ability: 'dex', proficient: false, expertise: false }]}
        abilityModifiers={{ ...defaultModifiers, dex: 3 }}
        onAbilityChange={() => {}}
        skills={skills}
        proficiencyBonus={2}
        updateCharacter={updateCharacter}
      />,
    );

    const dexSection = screen.getByRole('heading', { name: 'Dexterity' }).closest('section') as HTMLElement;

    // Save modifier starts at +3
    expect(within(dexSection).getAllByDisplayValue('+3').length).toBeGreaterThan(0);

    const saveProficiencyCheckbox = within(dexSection).getByRole('checkbox', {
      name: 'Dexterity saving throw proficiency',
    });

    await user.click(saveProficiencyCheckbox);
    expect(within(dexSection).getByDisplayValue('+5')).toBeInTheDocument();

    const skillProficiencyCheckbox = within(dexSection).getByRole('checkbox', {
      name: 'Sleight of Hand proficiency',
    });
    await user.click(skillProficiencyCheckbox);
    expect(within(dexSection).getAllByDisplayValue('+5').length).toBeGreaterThan(0);

    const expertiseCheckbox = within(dexSection).getByRole('checkbox', {
      name: 'Sleight of Hand expertise',
    });
    await user.click(expertiseCheckbox);
    expect(within(dexSection).getByDisplayValue('+7')).toBeInTheDocument();

    await user.click(skillProficiencyCheckbox);

    // Verify that updateCharacter was called with skill state { proficient: false, expertise: false }
    const skillCalls = updateCharacter.mock.calls.filter(
      ([patch]) => 'skills' in patch,
    );
    const lastSkillCall = skillCalls[skillCalls.length - 1];
    const sleightSkill = lastSkillCall?.[0]?.skills?.find(
      (s: Skill) => s.key === 'sleight',
    );
    expect(sleightSkill).toEqual(
      expect.objectContaining({ key: 'sleight', proficient: false, expertise: false }),
    );

    // Verify that updateCharacter was called with savingThrows where dex is true
    const saveCallWithDexTrue = updateCharacter.mock.calls.find(
      ([patch]) => patch?.savingThrows?.dex === true,
    );
    expect(saveCallWithDexTrue).toBeDefined();
  });

  it('retains an accessible save label while hiding it visually', () => {
    render(
      <CharacterAbilitiesSection
        abilities={defaultCharacter.abilities}
        savingThrows={defaultCharacter.savingThrows}
        characterSkills={defaultCharacter.skills}
        abilityModifiers={defaultModifiers}
        onAbilityChange={() => {}}
        skills={[]}
        proficiencyBonus={2}
        updateCharacter={() => {}}
      />,
    );

    // FormLabel text exists for assistive technologies even though it is visually hidden.
    expect(screen.getByText('Strength Saving Throw')).toBeInTheDocument();
  });

  it('exposes explicit accessible names for all ability controls', () => {
    const skills: Skill[] = [
      { key: 'athletics', display: 'Athletics', ability: 'str' },
    ];

    render(
      <CharacterAbilitiesSection
        abilities={defaultCharacter.abilities}
        savingThrows={defaultCharacter.savingThrows}
        characterSkills={defaultCharacter.skills}
        abilityModifiers={{ ...defaultModifiers, str: 2 }}
        onAbilityChange={() => {}}
        skills={skills}
        proficiencyBonus={2}
        updateCharacter={() => {}}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Strength Ability Score' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Strength modifier' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Strength saving throw proficiency' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Strength saving throw modifier' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Athletics proficiency' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Athletics expertise' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Athletics modifier' })).toBeInTheDocument();
  });

  it('follows the required keyboard tab sequence for ability controls', async () => {
    const user = userEvent.setup();
    const skills: Skill[] = [
      { key: 'athletics', display: 'Athletics', ability: 'str' },
    ];

    render(
      <CharacterAbilitiesSection
        abilities={defaultCharacter.abilities}
        savingThrows={defaultCharacter.savingThrows}
        characterSkills={defaultCharacter.skills}
        abilityModifiers={{ ...defaultModifiers, str: 2 }}
        onAbilityChange={() => {}}
        skills={skills}
        proficiencyBonus={2}
        updateCharacter={() => {}}
      />,
    );

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Strength Ability Score' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Strength modifier' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Strength saving throw proficiency' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Strength saving throw modifier' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Athletics proficiency' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Athletics expertise' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Athletics modifier' })).toHaveFocus();
  });
});
