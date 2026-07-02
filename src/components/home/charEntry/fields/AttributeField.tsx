import React from 'react';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import { Attributes } from '../../../../types/Characters.Types';

interface AttributeFieldProps {
  attribute: keyof Attributes;
  attrLabel: string;
  value: number | null | undefined;
  modifier: number | null | undefined;
  setAttribute: (attribute: keyof Attributes, val: number | null) => void;
  error?: boolean;
  helperText?: string | null;
}

const AttributeField: React.FC<AttributeFieldProps> = ({
  attribute,
  attrLabel,
  value,
  modifier,
  setAttribute,
  error,
  helperText,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
      <span style={{ minWidth: 90, fontWeight: 600 }}>{attrLabel}</span>
      <CharSheetNumberField
        value={value ?? null}
        onValueChange={(val) => {
          if (val === null || val === undefined) return setAttribute(attribute, null);
          const safe = Math.max(1, Math.min(20, Math.floor(val)));
          setAttribute(attribute, safe);
        }}
        min={1}
        max={20}
        fieldSize="tiny"
        name={String(attribute)}
        error={!!error}
      />
      <CharSheetNumberField
        value={modifier ?? null}
        onValueChange={() => {}}
        label="Modifier"
        fieldSize="tiny"
        disabled
        showPositiveSign
        hideStepper
        slotProps={{
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
            marginLeft: 8,
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

export default AttributeField;
