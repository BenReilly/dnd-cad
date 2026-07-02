import { ChangeEvent } from 'react';
import CharSheetSelect from '../../../library/select/CharSheetSelect';
import CharSheetTextField from '../../../library/textField/CharSheetTextField';
import { SelectChangeEvent } from '@mui/material/Select';

export interface CharacterRaceFieldsProps {
  raceSelection: string;
  setRaceSelection: (race: string) => void;
  raceTouched: boolean;
  setRaceTouched: (touched: boolean) => void;
  otherRaceText: string;
  setOtherRaceText: (text: string) => void;
  otherRaceTouched: boolean;
  setOtherRaceTouched: (touched: boolean) => void;
  subraceSelection: string;
  setSubraceSelection: (subrace: string) => void;
  otherSubraceText: string;
  setOtherSubraceText: (text: string) => void;
  otherSubraceTouched: boolean;
  setOtherSubraceTouched: (touched: boolean) => void;
  raceOptions: { value: string; label: string }[];
  subraceOptions: { value: string; label: string }[];
  showRaceSelectionError: boolean;
  showOtherRaceError: boolean;
  showOtherSubraceError: boolean;
}

const CharacterRaceFields = ({
  raceSelection,
  setRaceSelection,
  raceTouched,
  setRaceTouched,
  otherRaceText,
  setOtherRaceText,
  otherRaceTouched,
  setOtherRaceTouched,
  subraceSelection,
  setSubraceSelection,
  otherSubraceText,
  setOtherSubraceText,
  setOtherSubraceTouched,
  raceOptions,
  subraceOptions,
  showRaceSelectionError,
  showOtherRaceError,
  showOtherSubraceError,
}: CharacterRaceFieldsProps) => {
  const handleRaceChange = (event: SelectChangeEvent<unknown>) => {
    const value = String(event.target.value);
    setRaceSelection(value);
    setOtherRaceText('');
    setOtherRaceTouched(false);
    if (value === 'other') {
      setSubraceSelection('other');
    } else {
      setSubraceSelection('');
    }
    setOtherSubraceText('');
    setOtherSubraceTouched(false);
    if (raceTouched) {
      // keep race error state derived from touch + selection
    }
  };

  const handleOtherRaceChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setOtherRaceText(value);
    if (otherRaceTouched) {
      // keep other race error state derived from touch + text
    }
  };

  const handleSubraceChange = (event: SelectChangeEvent<unknown>) => {
    const value = String(event.target.value);
    setSubraceSelection(value);
    setOtherSubraceText('');
    setOtherSubraceTouched(false);
  };

  const handleOtherSubraceChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOtherSubraceText(event.target.value);
  };

  return (
    <div className="raceDescription" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '20px', padding: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
        <CharSheetSelect
          value={raceSelection}
          onChange={handleRaceChange}
          onBlur={() => setRaceTouched(true)}
          label="Race*"
          fieldSize="medium"
          options={[...raceOptions, { value: 'other', label: 'Other' }]}
          error={showRaceSelectionError || showOtherRaceError}
          helperText={
            showRaceSelectionError
              ? 'Please select a race.'
              : showOtherRaceError
              ? 'Enter a race name when Other is selected.'
              : undefined
          }
        />
        {raceSelection === 'other' && (
          <CharSheetTextField
            value={otherRaceText}
            onChange={handleOtherRaceChange}
            onBlur={() => setOtherRaceTouched(true)}
            label="Other Race Name*"
            variant="outlined"
            fieldSize="medium"
            error={showOtherRaceError}
            helperText={showOtherRaceError ? 'Enter a race name when Other is selected.' : undefined}
          />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
        <CharSheetSelect
          value={subraceSelection}
          onChange={handleSubraceChange}
          onBlur={() => setOtherSubraceTouched(true)}
          label="Subrace"
          fieldSize="medium"
          options={[{ value: 'none', label: 'None' }, ...subraceOptions, { value: 'other', label: 'Other' }]}
          error={showOtherSubraceError}
          helperText={showOtherSubraceError ? 'Enter a subrace name when Other is selected.' : undefined}
          disabled={!raceSelection}
        />
        {subraceSelection === 'other' && (
          <CharSheetTextField
            value={otherSubraceText}
            onChange={handleOtherSubraceChange}
            onBlur={() => setOtherSubraceTouched(true)}
            label="Other Subrace Name*"
            variant="outlined"
            fieldSize="medium"
            error={showOtherSubraceError}
            helperText={showOtherSubraceError ? 'Enter a subrace name when Other is selected.' : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterRaceFields;
