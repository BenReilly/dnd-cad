import { ChangeEvent } from 'react';
import CharSheetTextField from '../../../library/textField/CharSheetTextField';
import CharSheetAutocomplete from '../../../library/select/CharSheetAutocomplete';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import { characterFieldStyles } from './characterFieldStyles';

type Option = { value: string; label: string };

const MAX_XP = Number.MAX_SAFE_INTEGER;

const normalize = (value: string) => value.trim().toLowerCase();

const findBestMatchingOption = (input: string, options: Option[]) => {
  const normalizedInput = normalize(input);
  if (!normalizedInput) {
    return undefined;
  }

  return (
    options.find(
      (option) => normalize(option.label) === normalizedInput || normalize(option.value) === normalizedInput,
    ) ||
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

export interface CharacterIdentityFieldsProps {
  name: string;
  setName: (name: string) => void;
  nameTouched: boolean;
  setNameTouched: (touched: boolean) => void;
  nameError: string;
  setNameError: (error: string) => void;
  xp: number | null;
  setXp: (xp: number | null) => void;
  background: string;
  setBackground: (background: string) => void;
  backgroundOptions: { value: string; label: string }[];
}

const CharacterIdentityFields = ({
  name,
  setName,
  nameTouched,
  setNameTouched,
  nameError,
  setNameError,
  xp,
  setXp,
  background,
  setBackground,
  backgroundOptions,
}: CharacterIdentityFieldsProps) => {
  const selectedBackgroundOption =
    backgroundOptions.find((option) => normalize(option.value) === normalize(background)) ?? null;

  const commitBackgroundSelection = () => {
    const trimmedInput = background.trim();
    if (!trimmedInput) {
      return;
    }

    const matchingOption = findBestMatchingOption(trimmedInput, backgroundOptions);
    if (matchingOption) {
      setBackground(matchingOption.value);
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
    if (nameTouched) {
      if (!value.trim()) {
        setNameError('Name is required.');
      } else {
        setNameError('');
      }
    }
  };

  return (
    <>
      <div style={characterFieldStyles.fieldBlock}>
        <CharSheetTextField
          value={name}
          onChange={handleNameChange}
          onBlur={() => {
            setNameTouched(true);
            if (!name.trim()) {
              setNameError('Name is required.');
            }
          }}
          label="Name*"
          variant="outlined"
          fieldSize="large"
          error={!!nameError}
          helperText={nameError}
        />
      </div>
      <div style={characterFieldStyles.fieldBlock}>
        <CharSheetNumberField
          value={xp}
          onValueChange={(value) => {
            if (value === null || value === undefined) {
              setXp(null);
              return;
            }

            setXp(Math.max(0, Math.trunc(value)));
          }}
          label="Total XP"
          variant="outlined"
          fieldSize="large"
          hideStepper
          max={MAX_XP}
          useGrouping
        />
      </div>
      <div style={characterFieldStyles.fieldBlock}>
        <CharSheetAutocomplete
          value={selectedBackgroundOption}
          inputValue={background}
          onInputChange={(_, newInputValue) => setBackground(newInputValue)}
          onChange={(_, newValue) => {
            if (newValue) {
              setBackground(typeof newValue === 'string' ? newValue : newValue.value);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              commitBackgroundSelection();
            }, 0);
          }}
          options={backgroundOptions}
          fieldSize="medium"
          label="Background"
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            return option.label;
          }}
          isOptionEqualToValue={(option, value) => {
            if (typeof option === 'string' || typeof value === 'string') {
              const optVal = typeof option === 'string' ? option : option.value;
              const valVal = typeof value === 'string' ? value : value.value;
              return optVal === valVal;
            }
            return option.value === value.value;
          }}
        />
      </div>
    </>
  );
};

export default CharacterIdentityFields;
