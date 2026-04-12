import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

const CharSheetTextField: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField
      {...props}
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