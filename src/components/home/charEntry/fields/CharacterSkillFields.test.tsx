import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import CharacterSkillFields from './CharacterSkillFields';
import { Skill } from '../../../../types/Characters.Types';

describe('CharacterSkillFields', () => {
  it('adds proficiency bonus for proficient and twice for specialized', async () => {
    const user = userEvent.setup();
    const skills: Skill[] = [
      { key: 'sleight', display: 'Sleight of Hand', attribute: 'dex' },
    ];

    render(
      <CharacterSkillFields
        skills={skills}
        attributeModifiers={{ str: 0, dex: 3, con: 0, int: 0, wis: 0, cha: 0 }}
        proficiencyBonus={2}
      />,
    );

    expect(screen.getByText('Sleight of Hand')).toBeInTheDocument();

    // Base modifier from dex only
    expect(screen.getByDisplayValue('+3')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'proficient' }));
    expect(screen.getByDisplayValue('+5')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'specialized' }));
    expect(screen.getByDisplayValue('+7')).toBeInTheDocument();
  });
});
