import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BackgroundsContext } from '../../../contexts/backgrounds.context';
import { RaceClassContext } from '../../../contexts/racesAndClasses.context';
import CharEntry from './charEntry.component';

const renderCharEntry = () =>
  render(
    <RaceClassContext.Provider
      value={{
        Races: [{ race_name: 'Elf', subraces: [] }],
        Classes: [
          {
            class_name: 'Wizard',
            subclass_format: '<subclass_title> of <subclass>',
            subclass_title: 'School',
            subclasses: [],
          },
        ],
      }}
    >
      <BackgroundsContext.Provider value={{ Backgrounds: [] }}>
        <CharEntry />
      </BackgroundsContext.Provider>
    </RaceClassContext.Provider>,
  );

const selectOption = (comboboxName: RegExp, optionName: string) => {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: comboboxName }));
  fireEvent.click(screen.getByRole('option', { name: optionName }));
};

describe('CharEntry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders optional combat stat number fields', () => {
    vi.spyOn(console, 'log').mockImplementation(() => null);
    renderCharEntry();
    fireEvent.click(screen.getByRole('tab', { name: 'Combat' }));

    expect(screen.getByLabelText('AC')).toBeInTheDocument();
    expect(screen.getByLabelText('INIT')).toBeInTheDocument();
    expect(screen.getByLabelText('Speed')).toBeInTheDocument();
    expect(screen.getByLabelText('Insp.')).toBeInTheDocument();
  });

  it('keeps subrace visible but disabled until a race is selected', () => {
    vi.spyOn(console, 'log').mockImplementation(() => null);
    renderCharEntry();

    expect(screen.getByLabelText('Subrace')).toBeDisabled();

    selectOption(/Race/, 'Elf');

    expect(screen.getByLabelText('Subrace')).not.toBeDisabled();
  });

  it('keeps subclass visible but disabled until a class is selected', () => {
    vi.spyOn(console, 'log').mockImplementation(() => null);
    renderCharEntry();

    expect(screen.getByLabelText('Subclass')).toBeDisabled();

    selectOption(/Character Class/, 'Wizard');

    expect(screen.getByLabelText('Subclass')).not.toBeDisabled();
  });

  it('submits a valid character when combat stat fields are blank', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => null);
    renderCharEntry();

    fireEvent.change(screen.getByLabelText('Name*'), {
      target: { value: 'Meridian' },
    });
    selectOption(/Race/, 'Elf');
    selectOption(/Character Class/, 'Wizard');

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    const submittedCharacter = consoleLog.mock.calls.find(
      ([value]) =>
        typeof value === 'object' &&
        value !== null &&
        'charId' in value,
    )?.[0];

    expect(submittedCharacter).toMatchObject({
      name: 'Meridian',
      race: 'Elf',
      class: [{ name: 'Wizard' }],
    });
  });

  it('scrolls the first invalid field into view when submit fails validation', async () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      setTimeout(() => callback(0), 0);
      return 0;
    });

    renderCharEntry();

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });
});
