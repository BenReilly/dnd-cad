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
  tiny: '100px',
};

const CharSheetTextField: React.FC<CharSheetTextFieldProps> = ({
  fieldSize = 'medium',
  slotProps: userSlotProps,
  ...props
}: CharSheetTextFieldProps & { slotProps?: TextFieldProps['slotProps'] }) => {
  const width = sizeMap[fieldSize];

  const mergedSlotProps = {
    ...userSlotProps,
    input: {
      ...(userSlotProps?.input ?? {}),
      style: {
        fontFamily: '"Quintessential", serif',
        fontWeight: 400,
        fontStyle: 'normal',
        color: '#ccc',
        ...(userSlotProps?.input as any)?.style,
      },
    },
    inputLabel: {
      ...(userSlotProps?.inputLabel ?? {}),
      style: {
        fontFamily: '"Quintessential", serif',
        fontWeight: 400,
        fontStyle: 'normal',
        color: '#ccc',
        ...(userSlotProps?.inputLabel as any)?.style,
      },
    },
  };

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
      slotProps={mergedSlotProps}
    />
  );
};

export default CharSheetTextField;