import React from 'react';
import {
  Select,
  SelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';

interface CharSheetSelectProps extends Omit<SelectProps, 'size'> {
  fieldSize?: 'full' | 'large' | 'medium' | 'small' | 'tiny';
  options?: Array<{ value: string | number; label: string }>;
  helperText?: string;
}

const sizeMap = {
  full: '100%',
  large: '500px',
  medium: '300px',
  small: '175px',
  tiny: '100px',
};

const CharSheetSelect: React.FC<CharSheetSelectProps> = ({
  fieldSize = 'medium',
  options = [],
  helperText,
  label,
  children,
  error,
  ...props
}) => {
  const width = sizeMap[fieldSize];
  const labelText = typeof label === 'string' ? label : undefined;
  const labelId = labelText ? `${labelText.replace(/\s+/g, '-').toLowerCase()}-label` : undefined;

  return (
    <FormControl sx={{ width }} error={error}>
      {label && (
        <InputLabel
          id={labelId}
          sx={{
            fontFamily: '"Quintessential", serif',
            fontWeight: 400,
            fontStyle: 'normal',
            color: '#ccc',
            '&.Mui-focused': {
              color: '#ccc',
            },
          }}
        >
          {label}
        </InputLabel>
      )}
      <Select
        {...props}
        label={label}
        labelId={labelId}
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
          '& .MuiSelect-select': {
            fontFamily: '"Quintessential", serif',
            fontWeight: 400,
            fontStyle: 'normal',
            color: '#ccc',
          },
          '& .MuiSelect-icon': {
            color: '#ccc',
          },
          '& .MuiMenuItem-root': {
            color: 'black',
            fontFamily: '"Quintessential", serif',
            fontWeight: 400,
            fontStyle: 'normal',
          },
          '& .MuiPaper-root': {
            color: 'black',
          },
        }}
      >
        {children ||
          options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontFamily: '"Quintessential", serif',
                fontWeight: 400,
                fontStyle: 'normal',
                color: 'black',
              }}
            >
              {option.label}
            </MenuItem>
          ))}
      </Select>
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

export default CharSheetSelect;