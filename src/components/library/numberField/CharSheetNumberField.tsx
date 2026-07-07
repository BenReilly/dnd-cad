import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type SlotPropsWithStyle = {
  style?: React.CSSProperties;
};

interface CharSheetNumberFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'size' | 'type' | 'value'> {
  fieldSize?: 'full' | 'large' | 'medium' | 'small' | 'tiny';
  value: number | null;
  onValueChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  showPositiveSign?: boolean;
  hideStepper?: boolean;
  useGrouping?: boolean;
  sx?: SxProps<Theme>;
}

const sizeMap = {
  full: '100%',
  large: '500px',
  medium: '300px',
  small: '175px',
  tiny: '100px',
};

const clampValue = (value: number, min?: number, max?: number) => {
  const minClamped = min === undefined ? value : Math.max(min, value);
  return max === undefined ? minClamped : Math.min(max, minClamped);
};

const formatValue = (
  value: number | null,
  showPositiveSign: boolean,
  useGrouping: boolean,
) => {
  if (value === null) {
    return '';
  }

  const absoluteValue = useGrouping
    ? Math.abs(value).toLocaleString('en-US')
    : String(Math.abs(value));

  if (value < 0) {
    return `-${absoluteValue}`;
  }

  return showPositiveSign && value > 0 ? `+${absoluteValue}` : absoluteValue;
};

const parseInputValue = (value: string) => {
  const normalized = value.trim().replace(/,/g, '').replace(/^\+/, '');
  if (normalized === '' || normalized === '-') {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const CharSheetNumberField: React.FC<CharSheetNumberFieldProps> = ({
  fieldSize = 'medium',
  value,
  onValueChange,
  min,
  max,
  step = 1,
  showPositiveSign = false,
  hideStepper = false,
  useGrouping = false,
  slotProps: userSlotProps,
  onBlur,
  disabled,
  sx: userSx,
  ...props
}: CharSheetNumberFieldProps & { slotProps?: TextFieldProps['slotProps'] }) => {
  const width = sizeMap[fieldSize];
  const inputSlotProps = userSlotProps?.input as SlotPropsWithStyle | undefined;
  const inputLabelSlotProps = userSlotProps?.inputLabel as
    | SlotPropsWithStyle
    | undefined;
  const [displayValue, setDisplayValue] = useState(
    formatValue(value, showPositiveSign, useGrouping),
  );

  useEffect(() => {
    setDisplayValue(formatValue(value, showPositiveSign, useGrouping));
  }, [showPositiveSign, useGrouping, value]);

  const setNextValue = (nextValue: number | null) => {
    onValueChange(
      nextValue === null ? null : clampValue(nextValue, min, max),
    );
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    setDisplayValue(rawValue);

    const parsedValue = parseInputValue(rawValue);
    if (parsedValue !== null || rawValue.trim() === '') {
      setNextValue(parsedValue);
    }
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDisplayValue(formatValue(value, showPositiveSign, useGrouping));
    onBlur?.(event);
  };

  const increment = () => setNextValue((value ?? 0) + step);
  const decrement = () => setNextValue((value ?? 0) - step);

  const mergedSlotProps = {
    ...userSlotProps,
    htmlInput: {
      ...(userSlotProps?.htmlInput ?? {}),
      inputMode: 'numeric' as const,
    },
    input: {
      ...(userSlotProps?.input ?? {}),
      ...(hideStepper
        ? {}
        : {
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    mr: '-6px',
                  }}
                >
                  <IconButton
                    aria-label="Increment"
                    disabled={
                      disabled || (max !== undefined && value !== null && value >= max)
                    }
                    onClick={increment}
                    size="small"
                    sx={{ height: 14, p: 0, width: 20 }}
                  >
                    <ArrowDropUpIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="Decrement"
                    disabled={
                      disabled || (min !== undefined && value !== null && value <= min)
                    }
                    onClick={decrement}
                    size="small"
                    sx={{ height: 14, p: 0, width: 20 }}
                  >
                    <ArrowDropDownIcon fontSize="small" />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
          }),
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
      disabled={disabled}
      onBlur={handleBlur}
      onChange={handleChange}
      slotProps={mergedSlotProps}
      sx={[
        {
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
          '& .MuiInputBase-root.Mui-disabled .MuiOutlinedInput-input': {
            color: '#ccc',
            WebkitTextFillColor: '#ccc',
            opacity: 1,
          },
          '& .MuiOutlinedInput-root.Mui-disabled': {
            color: '#ccc',
            WebkitTextFillColor: '#ccc',
          },
          '& .MuiIconButton-root': {
            color: '#ccc',
          },
        },
        ...(Array.isArray(userSx) ? userSx : userSx ? [userSx] : []),
      ]}
      type="text"
      value={displayValue}
    />
  );
};

export default CharSheetNumberField;
