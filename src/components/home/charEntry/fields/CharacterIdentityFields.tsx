import { ChangeEvent } from 'react';
import CharSheetTextField from '../../../library/textField/CharSheetTextField';
import CharSheetAutocomplete from '../../../library/select/CharSheetAutocomplete';

export interface CharacterIdentityFieldsProps {
  name: string;
  setName: (name: string) => void;
  nameTouched: boolean;
  setNameTouched: (touched: boolean) => void;
  nameError: string;
  setNameError: (error: string) => void;
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
  background,
  setBackground,
  backgroundOptions,
}: CharacterIdentityFieldsProps) => {
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
      <div style={{ padding: '8px', marginBottom: '5px' }}>
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
      <div style={{ padding: '8px', marginBottom: '5px' }}>
        <CharSheetAutocomplete
          value={background ? backgroundOptions.find(opt => opt.value === background) || { value: background, label: background } : null}
          inputValue={background}
          onInputChange={(_, newInputValue) => setBackground(newInputValue)}
          onChange={(_, newValue) => {
            if (newValue) {
              setBackground(typeof newValue === 'string' ? newValue : newValue.value);
            }
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
