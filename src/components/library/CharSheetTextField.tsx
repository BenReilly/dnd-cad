import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface CharSheetTextFieldProps
  extends Omit<TextFieldProps, 'size'> {
  fieldSize?: 'full' | 'large' | 'medium' | 'small' | 'tiny';
}

const sizeMap = {
  full: '100%',
  large: '500px',
  medium: '300px',
  small: '175px',
  tiny: '50px',
};

const CharSheetTextField: React.FC<CharSheetTextFieldProps> = ({
  fieldSize = 'medium',
  ...props
}: CharSheetTextFieldProps) => {
  const width = sizeMap[fieldSize];

  return (
    <TextField
      {...(props as TextFieldProps)}
      sx={{
        width,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ccc',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ccc',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ccc',
        },
      }}
      slotProps={{
        input: {
          style: {
            fontFamily: '"Quintessential", serif',
            fontWeight: 400,
            fontStyle: 'normal',
            color: '#ccc',
          },
        },
        inputLabel: {
          style: {
            fontFamily: '"Quintessential", serif',
            fontWeight: 400,
            fontStyle: 'normal',
            color: '#ccc',
          },
        },
      }}
    />
  );
};

export default CharSheetTextField;