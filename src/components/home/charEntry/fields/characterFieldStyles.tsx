import AddIcon from '@mui/icons-material/Add';
import { CSSProperties, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export const characterFieldStyles = {
  addButton: {
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    display: 'inline-flex',
    gap: '8px',
    padding: 0,
  },
  addButtonText: {
    fontSize: '0.9rem',
    lineHeight: 1,
  },
  fieldBlock: {
    marginBottom: '5px',
    padding: '8px',
  },
  fieldColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: '220px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: 8,
  },
  fieldRow: {
    alignItems: 'flex-start',
    display: 'flex',
    gap: '8px',
  },
  formError: {
    color: 'red',
    fontSize: '0.875rem',
    marginTop: '8px',
  },
  sectionBlock: {
    marginTop: '20px',
    padding: '8px',
  },
} satisfies Record<string, CSSProperties>;

export const characterFieldIconSx = {
  color: '#fff',
  height: 20,
  strokeWidth: 2,
  width: 20,
} satisfies SxProps<Theme>;

export const abilityBoxSx = {
  width: '72px',
  '& .MuiOutlinedInput-root': {
    height: '72px',
  },
  '& .MuiOutlinedInput-input': {
    boxSizing: 'border-box',
    fontSize: '18px',
    height: '72px',
    padding: 0,
    textAlign: 'center',
  },
} satisfies SxProps<Theme>;

export const borderlessModifierSx = {
  ...abilityBoxSx,
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
} satisfies SxProps<Theme>;

interface AddFieldRowButtonProps {
  ariaLabel: string;
  children: ReactNode;
  onClick: () => void;
}

export const AddFieldRowButton = ({
  ariaLabel,
  children,
  onClick,
}: AddFieldRowButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    style={characterFieldStyles.addButton}
  >
    <AddIcon sx={characterFieldIconSx} />
    <span style={characterFieldStyles.addButtonText}>{children}</span>
  </button>
);
