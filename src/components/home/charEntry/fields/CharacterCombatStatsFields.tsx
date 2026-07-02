import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import CharSheetAutocomplete from '../../../library/select/CharSheetAutocomplete';
import AddIcon from '@mui/icons-material/Add';
import { HitDie } from '../../../../types/Characters.Types';
import React from 'react';

interface CharacterCombatStatsFieldsProps {
  ac: number | null;
  setAc: (val: number | null) => void;
  initiative: number | null;
  setInitiative: (val: number | null) => void;
  speed: number | null;
  setSpeed: (val: number | null) => void;
  inspiration: number | null;
  setInspiration: (val: number | null) => void;
  hitDice: HitDie[];
  hitDiceTouched: boolean[];
  handleHitDieQtyChange: (index: number, value: number | null) => void;
  handleHitDieDieChange: (index: number, value: string | null) => void;
  addHitDieRow: () => void;
  setHitDieTouched: (index: number) => void;
  hitDieSizes: string[];
}

const styles: { [key: string]: React.CSSProperties } = {
  fieldBlock: { padding: '8px', marginBottom: '5px' },
  combatStats: { display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '20px', padding: '8px' },
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

const CharacterCombatStatsFields = ({
  ac,
  setAc,
  initiative,
  setInitiative,
  speed,
  setSpeed,
  inspiration,
  setInspiration,
  hitDice,
  hitDiceTouched,
  handleHitDieQtyChange,
  handleHitDieDieChange,
  addHitDieRow,
  setHitDieTouched,
  hitDieSizes,
}: CharacterCombatStatsFieldsProps) => {
  // Validation helpers
  const isBlankOrPositiveInt = (val: number | null) => val === null || (Number.isInteger(val) && val > 0);
  const isBlankOrZeroOrPositiveInt = (val: number | null) => val === null || val === 0 || (Number.isInteger(val) && val > 0);
  const isBlankOrZeroOrInt = (val: number | null) => val === null || val === 0 || Number.isInteger(val);

  // Hit Dice: both blank, or qty positive int (not negative/zero) and size in allowed
  const validHitDieSize = (sz: number | null | undefined) => sz !== null && sz !== undefined && hitDieSizes.includes(String(sz));
  const hitDiceErrors = hitDice.map((hd) => {
    const qtyBlank = hd.qty === null || hd.qty === undefined || hd.qty === 0;
    const dieBlank = hd.die === null || hd.die === undefined || hd.die === 0;
    if (qtyBlank && dieBlank) return false;
    if (!qtyBlank && !dieBlank) {
      // Qty must be positive int, die must be valid (number)
      return !(Number.isInteger(hd.qty) && hd.qty > 0 && validHitDieSize(hd.die));
    }
    return true; // one filled, one blank
  });

  return (
    <>
      <div style={styles.fieldBlock}>
        <div className="combatStats" style={styles.combatStats}>
          <CharSheetNumberField
            value={ac}
            onValueChange={(val) => setAc(val === null || val === undefined ? null : Math.max(0, Math.floor(val)))}
            label="AC"
            variant="outlined"
            fieldSize="tiny"
            error={ac !== null && !isBlankOrPositiveInt(ac)}
            helperText={ac !== null && !isBlankOrPositiveInt(ac) ? 'Must be blank or positive integer' : undefined}
          />
          <CharSheetNumberField
            value={initiative}
            onValueChange={setInitiative}
            label="INIT"
            variant="outlined"
            fieldSize="tiny"
            showPositiveSign
            error={initiative !== null && !isBlankOrZeroOrInt(initiative)}
            helperText={initiative !== null && !isBlankOrZeroOrInt(initiative) ? 'Must be blank, 0, or integer' : undefined}
          />
          <CharSheetNumberField
            value={speed}
            onValueChange={(val) => {
              if (val === null || val === undefined) {
                setSpeed(null);
              } else {
                // Round to nearest multiple of 5, minimum 0
                const rounded = Math.max(0, Math.round(val / 5) * 5);
                setSpeed(rounded);
              }
            }}
            label="Speed"
            variant="outlined"
            fieldSize="tiny"
            step={5}
            error={speed !== null && (speed <= 0 || speed % 5 !== 0)}
            helperText={speed !== null && (speed <= 0 || speed % 5 !== 0) ? 'Must be blank or a positive multiple of 5' : undefined}
          />
          <CharSheetNumberField
            value={inspiration}
            onValueChange={(val) => setInspiration(val === null || val === undefined ? null : Math.max(0, Math.floor(val)))}
            label="Insp."
            variant="outlined"
            fieldSize="tiny"
            error={inspiration !== null && !isBlankOrZeroOrPositiveInt(inspiration)}
            helperText={inspiration !== null && !isBlankOrZeroOrPositiveInt(inspiration) ? 'Must be blank, 0, or positive integer' : undefined}
          />
        </div>
      </div>
      <div style={{ marginTop: '20px', padding: '8px' }}>
        <label style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 8, display: 'block' }}>Hit Dice</label>
        {hitDice.map((hd, idx) => {
          const touched = hitDiceTouched[idx];
          const isError = touched && hitDiceErrors[idx];
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CharSheetNumberField
                value={hd.qty === 0 ? null : hd.qty}
                onValueChange={(val) => {
                  // Prevent negative values
                  const safeVal = val === null || val === undefined ? null : Math.max(0, Math.floor(val));
                  handleHitDieQtyChange(idx, safeVal);
                }}
                onBlur={() => setHitDieTouched(idx)}
                label="qty"
                variant="outlined"
                fieldSize="tiny"
                min={0}
                max={20}
                error={isError}
                helperText={isError ? 'Both fields required, qty must be positive' : undefined}
              />
              <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>d</span>
              <CharSheetAutocomplete
                value={hd.die ? { value: hd.die.toString(), label: hd.die.toString() } : null}
                inputValue={hd.die ? hd.die.toString() : ''}
                onInputChange={(_, newInputValue) => handleHitDieDieChange(idx, newInputValue)}
                onChange={(_, newValue) => handleHitDieDieChange(idx, newValue ? (typeof newValue === 'string' ? newValue : newValue.value) : null)}
                options={hitDieSizes.map((sz) => ({ value: sz, label: sz }))}
                fieldSize="tiny"
                label="size"
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                isOptionEqualToValue={(option, value) => (typeof option === 'string' ? option : option.value) === (typeof value === 'string' ? value : value?.value)}
                error={isError}
                helperText={isError ? 'Both fields required, size must be valid' : undefined}
              />
              {isError && <span style={{ color: 'red', fontSize: '0.85rem' }}>Fill both or leave both blank. Qty must be positive, size must be valid.</span>}
            </div>
          );
        })}
        <button
          type="button"
          onClick={addHitDieRow}
          aria-label="Add another hit die row"
          style={styles.addButton}
        >
          <AddIcon sx={{ width: 20, height: 20, strokeWidth: 2, color: '#fff' }} />
          <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{'add another hit die row'}</span>
        </button>
      </div>
    </>
  );
};

export default CharacterCombatStatsFields;
