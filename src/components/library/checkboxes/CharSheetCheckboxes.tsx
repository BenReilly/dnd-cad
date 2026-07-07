import React, { ReactNode } from 'react';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  FormLabel,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';

interface BoxConfig {
  id?: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  visualLabel?: ReactNode;
}

interface CharSheetCheckboxesProps {
  id?: string;
  label: string;
  boxes: BoxConfig[];
  values: Record<string, boolean>;
  onChange: (values: Record<string, boolean>) => void;
  labelPlacement?: FormControlLabelProps['labelPlacement'];
  direction?: 'row' | 'column';
  suffixComponent?: ReactNode;
  labelWidth?: string | number;
  disabled?: boolean;
  labelSx?: SxProps<Theme>;
}

const CharSheetCheckboxes: React.FC<CharSheetCheckboxesProps> = ({
  id,
  label,
  boxes,
  values,
  onChange,
  labelPlacement = 'end',
  direction = 'row',
  suffixComponent,
  labelWidth,
  disabled = false,
  labelSx,
}) => {
  // Generate main ID if not provided
  const mainId = id || label.replace(/\s+/g, '-').toLowerCase();

  // Generate checkbox ID from main ID and box label
  const generateCheckboxId = (boxLabel: string, boxId?: string): string => {
    return boxId || `${mainId}.${boxLabel.replace(/\s+/g, '-').toLowerCase()}`;
  };

  const handleCheckboxChange = (checkboxId: string) => {
    onChange({
      ...values,
      [checkboxId]: !values[checkboxId],
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: direction === 'row' ? 'center' : 'flex-start', gap: 2 }}>
      <FormGroup
        sx={{
          flexDirection: direction === 'row' ? 'row' : 'column',
          gap: direction === 'row' ? 1 : 0,
        }}
      >
        {label && (
          <FormLabel
            sx={{
              fontFamily: '"Quintessential", serif',
              fontWeight: 400,
              fontStyle: 'normal',
              color: '#ccc',
              fontSize: '1rem',
              marginBottom: direction === 'column' ? 1 : 0,
              minWidth: labelWidth ?? 'auto',
              width: labelWidth ?? 'auto',
              whiteSpace: 'nowrap',
              ...labelSx,
            }}
          >
            {label}
          </FormLabel>
        )}
        {boxes.map((box) => {
          const checkboxId = generateCheckboxId(box.label, box.id);
          const isChecked = values[checkboxId] ?? box.checked;

          return (
            <FormControlLabel
              key={checkboxId}
              control={
                <Checkbox
                  id={checkboxId}
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(checkboxId)}
                  disabled={box.disabled ?? disabled}
                  inputProps={box.ariaLabel ? { 'aria-label': box.ariaLabel } : undefined}
                  sx={{
                    color: '#ccc',
                    '&.Mui-checked': {
                      color: '#ccc',
                    },
                    '&.Mui-disabled': {
                      color: '#666',
                    },
                  }}
                />
              }
              label={box.visualLabel ?? box.label}
              labelPlacement={labelPlacement}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontFamily: '"Quintessential", serif',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  color: '#ccc',
                  fontSize: '0.9rem',
                },
                '&.Mui-disabled .MuiFormControlLabel-label': {
                  color: '#666',
                },
              }}
            />
          );
        })}
      </FormGroup>
      {suffixComponent && <Box>{suffixComponent}</Box>}
    </Box>
  );
};

export default CharSheetCheckboxes;
