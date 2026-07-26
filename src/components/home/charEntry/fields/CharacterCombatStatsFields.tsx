import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import CharSheetAutocomplete from '../../../library/select/CharSheetAutocomplete';
import CharacterAttackFields from './CharacterAttackFields';
import { AttackFieldErrors } from './CharacterAttackFields';
import { CharacterEntryState } from '../charEntry.state';
import { Attack, HitDie } from '../../../../types/Characters.Types';
import React from 'react';
import {
  AddFieldRowButton,
  characterFieldStyles,
} from './characterFieldStyles';

interface CharacterCombatStatsFieldsProps {
  ac?: number;
  initiative?: number;
  speed?: number;
  inspiration?: number;
  hitDice: HitDie[];
  attacks: Attack[];
  updateCharacter: (patch: Partial<CharacterEntryState>) => void;
  hitDiceTouched: boolean[];
  handleHitDieQtyChange: (index: number, value: number | null) => void;
  handleHitDieDieChange: (index: number, value: string | null) => void;
  addHitDieRow: () => void;
  setHitDieTouched: (index: number) => void;
  hitDieSizes: string[];
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
  fieldBlock: { padding: '15px', marginBottom: '5px' },
  combatStats: { display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '20px', padding: '8px' },
};

const CharacterCombatStatsFields = ({
  ac,
  initiative,
  speed,
  inspiration,
  hitDice,
  attacks,
  updateCharacter,
  hitDiceTouched,
  handleHitDieQtyChange,
  handleHitDieDieChange,
  addHitDieRow,
  setHitDieTouched,
  hitDieSizes,
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
}: CharacterCombatStatsFieldsProps) => {
  // Validation helpers
  const isBlankOrPositiveInt = (val: number | undefined) => val === undefined || (Number.isInteger(val) && val > 0);
  const isBlankOrZeroOrPositiveInt = (val: number | undefined) => val === undefined || val === 0 || (Number.isInteger(val) && val > 0);
  const isBlankOrZeroOrInt = (val: number | undefined) => val === undefined || val === 0 || Number.isInteger(val);

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
    <div style={styles.fieldBlock}>
      <div>
        <h3>Combat</h3>
        <div className="combatStats" style={styles.combatStats}>
          <CharSheetNumberField
            value={ac ?? null}
            onValueChange={(val) => updateCharacter({ ac: val === null || val === undefined ? undefined : Math.max(0, Math.floor(val)) })}
            label="AC"
            variant="outlined"
            fieldSize="tiny"
            error={ac !== undefined && !isBlankOrPositiveInt(ac)}
            helperText={ac !== undefined && !isBlankOrPositiveInt(ac) ? 'Must be blank or positive integer' : undefined}
          />
          <CharSheetNumberField
            value={initiative ?? null}
            onValueChange={(val) => updateCharacter({ initiative: val ?? undefined })}
            label="INIT"
            variant="outlined"
            fieldSize="tiny"
            showPositiveSign
            error={initiative !== undefined && !isBlankOrZeroOrInt(initiative)}
            helperText={initiative !== undefined && !isBlankOrZeroOrInt(initiative) ? 'Must be blank, 0, or integer' : undefined}
          />
          <CharSheetNumberField
            value={speed ?? null}
            onValueChange={(val) => {
              if (val === null || val === undefined) {
                updateCharacter({ speed: undefined });
              } else {
                // Round to nearest multiple of 5, minimum 0
                const rounded = Math.max(0, Math.round(val / 5) * 5);
                updateCharacter({ speed: rounded });
              }
            }}
            label="Speed"
            variant="outlined"
            fieldSize="tiny"
            step={5}
            error={speed !== undefined && (speed <= 0 || speed % 5 !== 0)}
            helperText={speed !== undefined && (speed <= 0 || speed % 5 !== 0) ? 'Must be blank or a positive multiple of 5' : undefined}
          />
          <CharSheetNumberField
            value={inspiration ?? null}
            onValueChange={(val) => updateCharacter({ inspiration: val === null || val === undefined ? undefined : Math.max(0, Math.floor(val)) })}
            label="Insp."
            variant="outlined"
            fieldSize="tiny"
            error={inspiration !== undefined && !isBlankOrZeroOrPositiveInt(inspiration)}
            helperText={inspiration !== undefined && !isBlankOrZeroOrPositiveInt(inspiration) ? 'Must be blank, 0, or positive integer' : undefined}
          />
        </div>
      </div>
      <div style={characterFieldStyles.sectionBlock}>
        <label style={characterFieldStyles.fieldLabel}>Hit Dice</label>
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
        <AddFieldRowButton
          ariaLabel="Add another hit die row"
          onClick={addHitDieRow}
        >
          add another hit die row
        </AddFieldRowButton>
      </div>
      <CharacterAttackFields
        attacks={attacks}
        handleAttackNameChange={handleAttackNameChange}
        handleAttackBonusChange={handleAttackBonusChange}
        handleAttackTypeChange={handleAttackTypeChange}
        handleAttackNormalRangeChange={handleAttackNormalRangeChange}
        handleAttackLongRangeChange={handleAttackLongRangeChange}
        handleAttackDamageQtyChange={handleAttackDamageQtyChange}
        handleAttackDamageSizeChange={handleAttackDamageSizeChange}
        handleAttackDamageModChange={handleAttackDamageModChange}
        attackFieldErrors={attackFieldErrors}
        attackFormError={attackFormError}
        attackDamageSizes={attackDamageSizes}
        addAttackRow={addAttackRow}
      />
    </div>
  );
};

export default CharacterCombatStatsFields;
