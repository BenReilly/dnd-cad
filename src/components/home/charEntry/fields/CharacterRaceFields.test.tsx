import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterRaceFields, { CharacterRaceFieldsProps } from './CharacterRaceFields';
import { describe, it, expect } from 'vitest';

describe('CharacterRaceFields', () => {
  const defaultProps: CharacterRaceFieldsProps = {
    raceSelection: '',
    setRaceSelection: () => {},
    setRaceTouched: () => {},
    otherRaceText: '',
    setOtherRaceText: () => {},
    otherRaceTouched: false,
    setOtherRaceTouched: () => {},
    subraceSelection: '',
    setSubraceSelection: () => {},
    otherSubraceText: '',
    setOtherSubraceText: () => {},
    otherSubraceTouched: false,
    setOtherSubraceTouched: () => {},
    raceOptions: [
      { value: 'Elf', label: 'Elf' },
      { value: 'Human', label: 'Human' },
    ],
    subraceOptions: [
      { value: 'High', label: 'High' },
      { value: 'Wood', label: 'Wood' },
    ],
    showRaceSelectionError: false,
    showOtherRaceError: false,
    showOtherSubraceError: false,
  };

  it('renders race and subrace fields', () => {
    render(<CharacterRaceFields {...defaultProps} />);
    expect(screen.getByLabelText('Race*')).toBeInTheDocument();
    expect(screen.getByLabelText('Subrace')).toBeInTheDocument();
  });

  it('shows other race field when race is other', () => {
    render(<CharacterRaceFields {...defaultProps} raceSelection="other" />);
    expect(screen.getByLabelText('Other Race Name*')).toBeInTheDocument();
  });

  it('shows other subrace field when subrace is other', () => {
    render(<CharacterRaceFields {...defaultProps} subraceSelection="other" />);
    expect(screen.getByLabelText('Other Subrace Name*')).toBeInTheDocument();
  });

  it('calls setRaceSelection and resets fields on race change', async () => {
    const user = userEvent.setup();
    const setRaceSelection = vi.fn();
    const setOtherRaceText = vi.fn();
    const setOtherRaceTouched = vi.fn();
    const setSubraceSelection = vi.fn();
    const setOtherSubraceText = vi.fn();
    const setOtherSubraceTouched = vi.fn();
    render(
      <CharacterRaceFields
        {...defaultProps}
        setRaceSelection={setRaceSelection}
        setOtherRaceText={setOtherRaceText}
        setOtherRaceTouched={setOtherRaceTouched}
        setSubraceSelection={setSubraceSelection}
        setOtherSubraceText={setOtherSubraceText}
        setOtherSubraceTouched={setOtherSubraceTouched}
      />
    );

    const raceInput = screen.getByLabelText('Race*');
    await user.click(raceInput);
    await user.click(screen.getByRole('option', { name: 'Elf' }));
    expect(setRaceSelection).toHaveBeenCalled();
    expect(setOtherRaceText).toHaveBeenCalledWith('');
    expect(setOtherRaceTouched).toHaveBeenCalledWith(false);
    expect(setSubraceSelection).toHaveBeenCalledWith('');
    expect(setOtherSubraceText).toHaveBeenCalledWith('');
    expect(setOtherSubraceTouched).toHaveBeenCalledWith(false);
  });

  it('filters race options as the user types', async () => {
    const user = userEvent.setup();
    render(<CharacterRaceFields {...defaultProps} />);

    const raceInput = screen.getByLabelText('Race*');
    await user.click(raceInput);
    await user.type(raceInput, 'hum');

    await waitFor(() => expect(screen.queryByRole('option', { name: 'Elf' })).not.toBeInTheDocument());
    expect(screen.getByRole('option', { name: 'Human' })).toBeInTheDocument();
  });

  it('promotes unmatched race input to Other on blur', async () => {
    const user = userEvent.setup();
    const setRaceSelection = vi.fn();
    const setOtherRaceText = vi.fn();
    const setOtherRaceTouched = vi.fn();
    const setSubraceSelection = vi.fn();
    const setOtherSubraceText = vi.fn();
    const setOtherSubraceTouched = vi.fn();

    render(
      <CharacterRaceFields
        {...defaultProps}
        setRaceSelection={setRaceSelection}
        setOtherRaceText={setOtherRaceText}
        setOtherRaceTouched={setOtherRaceTouched}
        setSubraceSelection={setSubraceSelection}
        setOtherSubraceText={setOtherSubraceText}
        setOtherSubraceTouched={setOtherSubraceTouched}
      />
    );

    const raceInput = screen.getByLabelText('Race*');
    await user.click(raceInput);
    await user.type(raceInput, 'Dragonborn');
    await user.tab();

    await waitFor(() => expect(setRaceSelection).toHaveBeenCalledWith('other'));
    expect(setOtherRaceText).toHaveBeenCalledWith('Dragonborn');
    expect(setSubraceSelection).toHaveBeenCalledWith('other');
  });
});
