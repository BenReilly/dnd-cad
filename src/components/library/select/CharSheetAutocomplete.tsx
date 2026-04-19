import {
  Autocomplete,
  AutocompleteProps,
  TextField,
  FormControl,
  FormHelperText,
} from '@mui/material';

interface CharSheetAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    'renderInput' | 'size'
  > {
  fieldSize?: 'full' | 'large' | 'medium' | 'small' | 'tiny';
  helperText?: string;
  label?: string;
  error?: boolean;
}

const sizeMap = {
  full: '100%',
  large: '500px',
  medium: '300px',
  small: '175px',
  tiny: '100px',
};

const CharSheetAutocomplete = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>({
  fieldSize = 'medium',
  helperText,
  label,
  error,
  ...props
}: CharSheetAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) => {
  const width = sizeMap[fieldSize];

  return (
    <FormControl sx={{ width }} error={error}>
      <Autocomplete
        {...props}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={error}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
              },
              '& .MuiInputLabel-root': {
                fontFamily: '"Quintessential", serif',
                fontWeight: 400,
                fontStyle: 'normal',
                color: '#ccc',
                '&.Mui-focused': {
                  color: '#ccc',
                },
              },
              '& .MuiAutocomplete-input': {
                fontFamily: '"Quintessential", serif',
                fontWeight: 400,
                fontStyle: 'normal',
                color: '#ccc',
              },
              '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
                color: '#ccc',
              },
            }}
          />
        )}
        sx={{
          '& .MuiAutocomplete-paper': {
            color: 'black',
          },
          '& .MuiAutocomplete-option': {
            fontFamily: '"Quintessential", serif',
            fontWeight: 400,
            fontStyle: 'normal',
            color: 'black',
          },
        }}
      />
      {helperText && (
        <FormHelperText
          sx={{
            fontFamily: '"Quintessential", serif',
            fontWeight: 400,
            fontStyle: 'normal',
            color: '#ccc',
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CharSheetAutocomplete;