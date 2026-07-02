import { render, screen, fireEvent } from '@testing-library/react';
import CharacterRaceFields, { CharacterRaceFieldsProps } from './CharacterRaceFields';
import { describe, it, expect } from 'vitest';

describe('CharacterRaceFields', () => {
  const defaultProps: CharacterRaceFieldsProps = {
    raceSelection: '',
    setRaceSelection: () => {},
    raceTouched: false,
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

  it('calls setRaceSelection and resets fields on race change', () => {
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
    // MUI Select requires mouseDown and click for option selection
    fireEvent.mouseDown(screen.getByLabelText('Race*'));
    fireEvent.click(screen.getByText('Elf'));
    expect(setRaceSelection).toHaveBeenCalled();
    expect(setOtherRaceText).toHaveBeenCalledWith('');
    expect(setOtherRaceTouched).toHaveBeenCalledWith(false);
    expect(setSubraceSelection).toHaveBeenCalledWith('');
    expect(setOtherSubraceText).toHaveBeenCalledWith('');
    expect(setOtherSubraceTouched).toHaveBeenCalledWith(false);
  });
});
