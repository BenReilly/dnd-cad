import React from 'react';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import { Abilities } from '../../../../types/Characters.Types';

const abilityBoxSx = {
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
};

const borderlessModifierSx = {
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
};

interface AbilityFieldProps {
  ability: keyof Abilities;
  attrLabel: string;
  value: number | null | undefined;
  modifier: number | null | undefined;
  setAbility: (ability: keyof Abilities, val: number | null) => void;
  error?: boolean;
  helperText?: string | null;
  layout?: 'horizontal' | 'vertical';
  showAttrLabel?: boolean;
}

const AbilityField: React.FC<AbilityFieldProps> = ({
  ability,
  attrLabel,
  value,
  modifier,
  setAbility,
  error,
  helperText,
  layout = 'horizontal',
  showAttrLabel = true,
}) => {
  const isVertical = layout === 'vertical';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: isVertical ? 'stretch' : 'center',
        flexDirection: isVertical ? 'column' : 'row',
        gap: isVertical ? 18 : 16,
        marginBottom: 8,
      }}
    >
      {showAttrLabel ? <span style={{ minWidth: 90, fontWeight: 600 }}>{attrLabel}</span> : null}
      <CharSheetNumberField
        value={value ?? null}
        onValueChange={(val) => {
          if (val === null || val === undefined) return setAbility(ability, null);
          const safe = Math.max(1, Math.min(20, Math.floor(val)));
          setAbility(ability, safe);
        }}
        label="Score"
        min={1}
        max={20}
        fieldSize="tiny"
        hideStepper
        name={String(ability)}
        error={!!error}
        sx={abilityBoxSx}
        slotProps={{
          htmlInput: {
            'aria-label': `${attrLabel} Ability Score`,
          },
        }}
      />
      <CharSheetNumberField
        value={modifier ?? null}
        onValueChange={() => {}}
        label="Modifier"
        fieldSize="tiny"
        showPositiveSign
        hideStepper
        sx={borderlessModifierSx}
        slotProps={{
          htmlInput: {
            readOnly: true,
            'aria-label': `${attrLabel} modifier`,
          },
          input: {
            style: {
              color: '#ccc',
              WebkitTextFillColor: '#ccc',
              opacity: 1,
            },
          },
          inputLabel: { style: { color: '#ccc' } },
        }}
      />
      {helperText ? (
        <span
          style={{
            marginLeft: isVertical ? 0 : 8,
            marginTop: isVertical ? 2 : 0,
            color: '#d32f2f',
            fontSize: 12,
            whiteSpace: 'nowrap',
            opacity: error ? 1 : 0.9,
          }}
        >
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export default AbilityField;