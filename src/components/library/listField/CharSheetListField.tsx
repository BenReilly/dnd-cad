import React, { ChangeEvent, KeyboardEvent, useMemo, useRef, useState } from 'react';
import { Box, Button, Chip, Stack, TextField, TextFieldProps } from '@mui/material';

interface CharSheetListFieldProps
  extends Omit<TextFieldProps, 'error' | 'onChange' | 'value'> {
  fieldSize?: 'full' | 'large' | 'medium' | 'small' | 'tiny';
  addButtonLabel?: string;
  items?: string[];
  onItemsChange: (items: string[]) => void;
}

const sizeMap = {
  full: '100%',
  large: '500px',
  medium: '300px',
  small: '175px',
  tiny: '100px',
};

const startsWithAlphaNumeric = (value: string) => {
  const trimmed = value.trimStart();
  return trimmed === '' || /^[A-Za-z0-9]/.test(trimmed);
};

const splitCommaSeparatedValues = (value: string) => {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const CharSheetListField: React.FC<CharSheetListFieldProps> = ({
  fieldSize = 'medium',
  addButtonLabel = 'Add',
  items = [],
  onItemsChange,
  label,
  helperText,
  ...props
}) => {
  const width = useMemo(() => sizeMap[fieldSize], [fieldSize]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  const pushItems = (value: string) => {
    const nextItems = splitCommaSeparatedValues(value);
    if (nextItems.length === 0) {
      return;
    }

    const updatedItems = [...items, ...nextItems];
    onItemsChange(updatedItems);
    setInputValue('');
    setHasError(false);
    inputRef.current?.focus();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (nextValue === '') {
      setInputValue('');
      setHasError(false);
      return;
    }

    const isValidStart = startsWithAlphaNumeric(nextValue);
    setInputValue(nextValue);
    setHasError(!isValidStart);

    if (nextValue.includes(',') && isValidStart) {
      pushItems(nextValue);
    }
  };

  const handleAdd = () => {
    if (inputValue.trim() === '') {
      return;
    }

    if (!startsWithAlphaNumeric(inputValue)) {
      setHasError(true);
      return;
    }

    pushItems(inputValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    handleAdd();
  };

  const resolvedHelperText = hasError
    ? 'Value must start with a letter or number.'
    : helperText;

  return (
    <Box sx={{ width }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <TextField
          {...(props as TextFieldProps)}
          fullWidth
          error={hasError}
          helperText={resolvedHelperText}
          inputRef={inputRef}
          label={label}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputValue}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ccc',
            },
            '& .MuiOutlinedInput-root:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ccc',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ccc',
            },
            '& .MuiInputBase-input': {
              fontFamily: '"Quintessential", serif',
              fontWeight: 400,
              fontStyle: 'normal',
              color: '#ccc',
            },
            '& .MuiInputLabel-root': {
              fontFamily: '"Quintessential", serif',
              fontWeight: 400,
              fontStyle: 'normal',
              color: '#ccc',
            },
            '& .MuiFormHelperText-root': {
              fontFamily: '"Quintessential", serif',
              fontWeight: 400,
              fontStyle: 'normal',
            },
          }}
        />
        <Button
          onClick={handleAdd}
          sx={{
            minWidth: '72px',
            height: '56px',
            fontFamily: '"Quintessential", serif',
            textTransform: 'none',
            color: '#ccc',
            borderColor: '#ccc',
          }}
          variant="outlined"
        >
          {addButtonLabel}
        </Button>
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={1} mt={1.5}>
        {items.map((item, index) => (
          <Chip
            key={`${item}-${index}`}
            label={item}
            variant="outlined"
            onDelete={() => {
              const updated = items.filter((_, i) => i !== index);
              onItemsChange(updated);
            }}
            sx={{
              fontFamily: '"Quintessential", serif',
              color: '#ccc',
              borderColor: '#ccc',
              '& .MuiChip-deleteIcon': {
                color: '#ccc',
                '&:hover': {
                  color: '#fff',
                },
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default CharSheetListField;
