import { ChangeEvent, useState } from 'react';
import CharSheetAutocomplete from '../../../library/select/CharSheetAutocomplete';
import CharSheetTextField from '../../../library/textField/CharSheetTextField';
import { characterFieldStyles } from './characterFieldStyles';

type Option = { value: string; label: string };

const normalize = (value: string) => value.trim().toLowerCase();

const findMatchingOption = (input: string, options: Option[]) =>
  options.find(
    (option) => normalize(option.label) === normalize(input) || normalize(option.value) === normalize(input),
  );

const findBestMatchingOption = (input: string, options: Option[]) => {
  const normalizedInput = normalize(input);
  if (!normalizedInput) {
    return undefined;
  }

  return (
    findMatchingOption(input, options) ||
    options.find(
      (option) =>
        normalize(option.label).startsWith(normalizedInput) ||
        normalize(option.value).startsWith(normalizedInput),
    ) ||
    options.find(
      (option) =>
        normalize(option.label).includes(normalizedInput) ||
        normalize(option.value).includes(normalizedInput),
    )
  );
};

export interface CharacterRaceFieldsProps {
  raceSelection: string;
  setRaceSelection: (race: string) => void;
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
  const raceOptionsWithOther = [...raceOptions, { value: 'other', label: 'Other' }];
  const subraceOptionsWithOther = [{ value: 'none', label: 'None' }, ...subraceOptions, { value: 'other', label: 'Other' }];
  const [raceInputValue, setRaceInputValue] = useState(raceSelection === 'other' ? 'Other' : raceSelection);
  const [subraceInputValue, setSubraceInputValue] = useState(subraceSelection === 'other' ? 'Other' : subraceSelection);

  const handleOtherRaceChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setOtherRaceText(value);
    if (otherRaceTouched) {
      // keep other race error state derived from touch + text
    }
  };

  const commitRaceSelection = () => {
    const trimmedInput = raceInputValue.trim();
    if (!trimmedInput) {
      return;
    }

    const matchingOption = findBestMatchingOption(trimmedInput, raceOptionsWithOther);
    if (matchingOption) {
      setRaceSelection(matchingOption.value);
      setRaceInputValue(matchingOption.label);
      setOtherRaceText('');
      setOtherRaceTouched(false);
      if (matchingOption.value === 'other') {
        setSubraceSelection('other');
        setSubraceInputValue('Other');
      } else {
        setSubraceSelection('');
        setSubraceInputValue('');
        setOtherSubraceText('');
        setOtherSubraceTouched(false);
      }
      return;
    }

    setRaceSelection('other');
    setRaceInputValue('Other');
    setOtherRaceText(trimmedInput);
    setOtherRaceTouched(true);
    setSubraceSelection('other');
    setSubraceInputValue('Other');
    setOtherSubraceText('');
    setOtherSubraceTouched(false);
  };

  const commitSubraceSelection = () => {
    const trimmedInput = subraceInputValue.trim();
    if (!trimmedInput) {
      return;
    }

    const matchingOption = findBestMatchingOption(trimmedInput, subraceOptionsWithOther);
    if (matchingOption) {
      setSubraceSelection(matchingOption.value);
      setSubraceInputValue(matchingOption.label);
      if (matchingOption.value !== 'other') {
        setOtherSubraceText('');
        setOtherSubraceTouched(false);
      }
      return;
    }

    setSubraceSelection('other');
    setSubraceInputValue('Other');
    setOtherSubraceText(trimmedInput);
    setOtherSubraceTouched(true);
  };

  const handleOtherSubraceChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOtherSubraceText(event.target.value);
  };

  return (
    <div className="raceDescription" style={{ ...characterFieldStyles.fieldRow, ...characterFieldStyles.sectionBlock }}>
      <div style={characterFieldStyles.fieldColumn}>
        <CharSheetAutocomplete
          value={findMatchingOption(raceSelection, raceOptionsWithOther) ?? null}
          inputValue={raceInputValue}
          onInputChange={(_, newInputValue, reason) => {
            setRaceInputValue(newInputValue);
            if (reason === 'input' && raceSelection === 'other') {
              setRaceSelection('');
              setOtherRaceText('');
              setOtherRaceTouched(false);
              setSubraceSelection('');
              setSubraceInputValue('');
              setOtherSubraceText('');
              setOtherSubraceTouched(false);
            }
          }}
          onChange={(_, newValue) => {
            const selectedValue = newValue && typeof newValue === 'object' ? newValue.value : '';
            const selectedLabel = newValue && typeof newValue === 'object' ? newValue.label : '';
            setRaceSelection(selectedValue);
            setRaceInputValue(selectedLabel);
            setRaceTouched(true);
            setOtherRaceText('');
            setOtherRaceTouched(false);
            if (selectedValue === 'other') {
              setSubraceSelection('other');
              setSubraceInputValue('Other');
            } else {
              setSubraceSelection('');
              setSubraceInputValue('');
              setOtherSubraceText('');
              setOtherSubraceTouched(false);
            }
          }}
          onBlur={() => {
            setRaceTouched(true);
            setTimeout(() => {
              commitRaceSelection();
            }, 0);
          }}
          label="Race*"
          fieldSize="medium"
          options={raceOptionsWithOther}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
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
      <div style={characterFieldStyles.fieldColumn}>
        <CharSheetAutocomplete
          value={findMatchingOption(subraceSelection, subraceOptionsWithOther) ?? null}
          inputValue={subraceInputValue}
          onInputChange={(_, newInputValue, reason) => {
            setSubraceInputValue(newInputValue);
            if (reason === 'input' && subraceSelection === 'other') {
              setSubraceSelection('');
              setOtherSubraceText('');
              setOtherSubraceTouched(false);
            }
          }}
          onChange={(_, newValue) => {
            const selectedValue = newValue && typeof newValue === 'object' ? newValue.value : '';
            const selectedLabel = newValue && typeof newValue === 'object' ? newValue.label : '';
            setSubraceSelection(selectedValue);
            setSubraceInputValue(selectedLabel);
            setOtherSubraceTouched(true);
            if (selectedValue !== 'other') {
              setOtherSubraceText('');
              setOtherSubraceTouched(false);
            }
          }}
          onBlur={() => {
            setOtherSubraceTouched(true);
            setTimeout(() => {
              commitSubraceSelection();
            }, 0);
          }}
          label="Subrace"
          fieldSize="medium"
          options={subraceOptionsWithOther}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
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
