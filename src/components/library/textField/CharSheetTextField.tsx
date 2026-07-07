import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type SlotPropsWithStyle = {
  style?: React.CSSProperties;
};

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
  const inputSlotProps = userSlotProps?.input as SlotPropsWithStyle | undefined;
  const inputLabelSlotProps = userSlotProps?.inputLabel as
    | SlotPropsWithStyle
    | undefined;

  const mergedSlotProps = {
    ...userSlotProps,
    input: {
      ...(userSlotProps?.input ?? {}),
      style: {
        fontFamily: '"Quintessential", serif',
        fontWeight: 400,
        fontStyle: 'normal',
        color: '#ccc',
        ...inputSlotProps?.style,
      },
    },
    inputLabel: {
      ...(userSlotProps?.inputLabel ?? {}),
      style: {
        fontFamily: '"Quintessential", serif',
        fontWeight: 400,
        fontStyle: 'normal',
        color: '#ccc',
        ...inputLabelSlotProps?.style,
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
        '& .MuiOutlinedInput-root:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline': {
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
