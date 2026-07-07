import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import CharSheetAutocomplete from '../../../library/select/CharSheetAutocomplete';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import CharSheetTextField from '../../../library/textField/CharSheetTextField';
import { Attack } from '../../../../types/Characters.Types';

export type AttackFieldErrors = {
  name: boolean;
  attackBonus: boolean;
  damage: boolean;
  type: boolean;
};

interface CharacterAttackFieldsProps {
  attacks: Attack[];
  handleAttackNameChange: (index: number, value: string) => void;
  handleAttackBonusChange: (index: number, value: number | null) => void;
  handleAttackTypeChange: (index: number, value: string) => void;
  handleAttackNormalRangeChange: (index: number, value: string) => void;
  handleAttackLongRangeChange: (index: number, value: string) => void;
  handleAttackDamageQtyChange: (index: number, value: number | null) => void;
  handleAttackDamageSizeChange: (index: number, value: string | null) => void;
  handleAttackDamageModChange: (index: number, value: number | null) => void;
  attackFieldErrors: AttackFieldErrors[];
  attackFormError?: string;
  attackDamageSizes: string[];
  addAttackRow: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  attackEntry: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  attackRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  attackRowSpacer: {
    minHeight: '8px',
  },
  addButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: '#666',
  },
};

const CharacterAttackFields = ({
  attacks,
  handleAttackNameChange,
  handleAttackBonusChange,
  handleAttackTypeChange,
  handleAttackNormalRangeChange,
  handleAttackLongRangeChange,
  handleAttackDamageQtyChange,
  handleAttackDamageSizeChange,
  handleAttackDamageModChange,
  attackFieldErrors,
  attackFormError,
  attackDamageSizes,
  addAttackRow,
}: CharacterAttackFieldsProps) => {
  const parseDamage = (damage: string): { qty: number | null; size: string | null; mod: number | null } => {
    const match = damage.match(/^(\d*)d(\d*)([+-]\d+)?$/);
    if (!match) {
      return { qty: null, size: null, mod: null };
    }
    return {
      qty: match[1] ? parseInt(match[1], 10) : null,
      size: match[2] ? match[2] : null,
      mod: match[3] ? parseInt(match[3], 10) : null,
    };
  };

  return (
    <div style={{ marginTop: '20px', padding: '8px' }}>
      <label style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 8, display: 'block' }}>Attacks</label>
      {attacks.map((attack, idx) => {
        const parsedDamage = parseDamage(attack.damage);
        const fieldErrors = attackFieldErrors[idx] ?? {
          name: false,
          attackBonus: false,
          damage: false,
          type: false,
        };
        return (
          <div key={idx} style={styles.attackEntry}>
            <div style={styles.attackRow}>
              <CharSheetTextField
                value={attack.name}
                onChange={(event) => handleAttackNameChange(idx, event.target.value)}
                label="Attack Name"
                variant="outlined"
                fieldSize="medium"
                error={fieldErrors.name}
                helperText={fieldErrors.name ? 'Required' : undefined}
              />
              <CharSheetNumberField
                value={attack.attackBonus}
                onValueChange={(value) => handleAttackBonusChange(idx, value)}
                label="Atk Mod"
                variant="outlined"
                fieldSize="tiny"
                showPositiveSign
                error={fieldErrors.attackBonus}
                helperText={fieldErrors.attackBonus ? 'Required' : undefined}
              />
            </div>
            <div style={styles.attackRow}>
              <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>damage</span>
              <CharSheetNumberField
                value={parsedDamage.qty}
                onValueChange={(value) => handleAttackDamageQtyChange(idx, value)}
                label="qty"
                variant="outlined"
                fieldSize="tiny"
                min={0}
                error={fieldErrors.damage}
                helperText={fieldErrors.damage ? 'Required' : undefined}
              />
              <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>d</span>
              <CharSheetAutocomplete
                value={parsedDamage.size ? { value: parsedDamage.size, label: parsedDamage.size } : null}
                inputValue={parsedDamage.size ?? ''}
                onInputChange={(_, newInputValue) => handleAttackDamageSizeChange(idx, newInputValue)}
                onChange={(_, newValue) => handleAttackDamageSizeChange(idx, newValue ? (typeof newValue === 'string' ? newValue : newValue.value) : null)}
                options={attackDamageSizes.map((sz) => ({ value: sz, label: sz }))}
                fieldSize="tiny"
                label="size"
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                isOptionEqualToValue={(option, value) => (typeof option === 'string' ? option : option.value) === (typeof value === 'string' ? value : value?.value)}
                error={fieldErrors.damage}
                helperText={fieldErrors.damage ? 'Required' : undefined}
              />
              <CharSheetNumberField
                value={parsedDamage.mod}
                onValueChange={(value) => handleAttackDamageModChange(idx, value)}
                label="Dmg Mod"
                variant="outlined"
                fieldSize="tiny"
                showPositiveSign
              />
            </div>
            <div style={styles.attackRow}>
              <CharSheetTextField
                value={attack.type}
                onChange={(event) => handleAttackTypeChange(idx, event.target.value)}
                label="Dmg Type"
                variant="outlined"
                fieldSize="small"
                error={fieldErrors.type}
                helperText={fieldErrors.type ? 'Required' : undefined}
              />
              <CharSheetTextField
                value={attack.normalRange === null ? '' : String(attack.normalRange)}
                onChange={(event) => handleAttackNormalRangeChange(idx, event.target.value)}
                label="Normal Range"
                variant="outlined"
                fieldSize="medium"
              />
              <CharSheetTextField
                value={attack.longRange === null ? '' : String(attack.longRange)}
                onChange={(event) => handleAttackLongRangeChange(idx, event.target.value)}
                label="Long Range"
                variant="outlined"
                fieldSize="medium"
              />
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={addAttackRow}
        aria-label="Add another attack row"
        style={styles.addButton}
      >
        <AddIcon sx={{ width: 20, height: 20, strokeWidth: 2, color: '#fff' }} />
        <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{'add another attack row'}</span>
      </button>
      {attackFormError && (
        <div style={{ color: 'red', marginTop: '8px', fontSize: '0.875rem' }}>{attackFormError}</div>
      )}
    </div>
  );
};

export default CharacterAttackFields;