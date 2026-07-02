import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import CharEntry from './charEntry.component';
import { RaceClassContext } from '../../../../src/contexts/racesAndClasses.context.tsx';
import { BackgroundsContext, SkillsContext } from '../../../../src/contexts/characterOptions.context.tsx';
import { Skill } from '../../../../src/types/Characters.Types';

describe('CharEntry integration', () => {
  it.skip('updates skill modifier when attribute changes', async () => {
    const user = userEvent.setup();

    const skills: Skill[] = [
      { key: 'sleight', display: 'Sleight of Hand', attribute: 'dex' },
    ];

    const { container } = render(
      <RaceClassContext.Provider value={{ Races: [], Classes: [] }}>
        <BackgroundsContext.Provider value={{ Backgrounds: [] }}>
          <SkillsContext.Provider value={{ Skills: skills }}>
            <CharEntry />
          </SkillsContext.Provider>
        </BackgroundsContext.Provider>
      </RaceClassContext.Provider>
    );

    // Find the Dexterity input by its name attribute and type 14
    const dexInput = container.querySelector('input[name="dex"]') as HTMLInputElement;
    await user.clear(dexInput);
    await user.type(dexInput, '14');

    // Wait for Sleight of Hand modifier to update to +2 within that skill row
    const skillLabel = await screen.findByText('Sleight of Hand');
    const skillRow = skillLabel.parentElement?.parentElement as HTMLElement;
    const mod = await within(skillRow).findByDisplayValue('+2');
    expect(mod).toBeInTheDocument();
  });
});
