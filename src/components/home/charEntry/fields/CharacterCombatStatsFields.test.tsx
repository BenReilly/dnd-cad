import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CharacterCombatStatsFields from './CharacterCombatStatsFields';
import { Attack, HitDie } from '../../../../types/Characters.Types';

describe('CharacterCombatStatsFields', () => {
  const hitDieSizes = ['4', '6', '8', '10', '12'];
  const attackDamageSizes = ['4', '6', '8', '10', '12', '20'];
  const baseHitDice: HitDie[] = [{ qty: 0, die: 0 }];
  const baseAttacks: Attack[] = [{ name: '', attackBonus: null, damage: '', normalRange: null, longRange: null, type: '' }];
  const baseAttackFieldErrors = [{ name: false, attackBonus: false, damage: false, type: false }];
  const baseTouched = [false];
  const setAc = vi.fn();
  const setInitiative = vi.fn();
  const setSpeed = vi.fn();
  const setInspiration = vi.fn();
  const handleHitDieQtyChange = vi.fn();
  const handleHitDieDieChange = vi.fn();
  const addHitDieRow = vi.fn();
  const setHitDieTouched = vi.fn();
  const handleAttackNameChange = vi.fn();
  const handleAttackBonusChange = vi.fn();
  const handleAttackTypeChange = vi.fn();
  const handleAttackNormalRangeChange = vi.fn();
  const handleAttackLongRangeChange = vi.fn();
  const handleAttackDamageQtyChange = vi.fn();
  const handleAttackDamageSizeChange = vi.fn();
  const handleAttackDamageModChange = vi.fn();
  const addAttackRow = vi.fn();

  it('renders AC, INIT, Speed, Inspiration fields', () => {
    render(
      <CharacterCombatStatsFields
        ac={10}
        setAc={setAc}
        initiative={2}
        setInitiative={setInitiative}
        speed={30}
        setSpeed={setSpeed}
        inspiration={1}
        setInspiration={setInspiration}
        hitDice={baseHitDice}
        hitDiceTouched={baseTouched}
        handleHitDieQtyChange={handleHitDieQtyChange}
        handleHitDieDieChange={handleHitDieDieChange}
        addHitDieRow={addHitDieRow}
        setHitDieTouched={setHitDieTouched}
        hitDieSizes={hitDieSizes}
        attacks={baseAttacks}
        handleAttackNameChange={handleAttackNameChange}
        handleAttackBonusChange={handleAttackBonusChange}
        handleAttackTypeChange={handleAttackTypeChange}
        handleAttackNormalRangeChange={handleAttackNormalRangeChange}
        handleAttackLongRangeChange={handleAttackLongRangeChange}
        handleAttackDamageQtyChange={handleAttackDamageQtyChange}
        handleAttackDamageSizeChange={handleAttackDamageSizeChange}
        handleAttackDamageModChange={handleAttackDamageModChange}
        attackFieldErrors={baseAttackFieldErrors}
        attackDamageSizes={attackDamageSizes}
        addAttackRow={addAttackRow}
      />
    );
    expect(screen.getByLabelText(/^AC$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/INIT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Speed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Insp/i)).toBeInTheDocument();
  });

  it('renders hit dice fields and add button', () => {
    render(
      <CharacterCombatStatsFields
        ac={null}
        setAc={setAc}
        initiative={null}
        setInitiative={setInitiative}
        speed={null}
        setSpeed={setSpeed}
        inspiration={null}
        setInspiration={setInspiration}
        hitDice={baseHitDice}
        hitDiceTouched={baseTouched}
        handleHitDieQtyChange={handleHitDieQtyChange}
        handleHitDieDieChange={handleHitDieDieChange}
        addHitDieRow={addHitDieRow}
        setHitDieTouched={setHitDieTouched}
        hitDieSizes={hitDieSizes}
        attacks={baseAttacks}
        handleAttackNameChange={handleAttackNameChange}
        handleAttackBonusChange={handleAttackBonusChange}
        handleAttackTypeChange={handleAttackTypeChange}
        handleAttackNormalRangeChange={handleAttackNormalRangeChange}
        handleAttackLongRangeChange={handleAttackLongRangeChange}
        handleAttackDamageQtyChange={handleAttackDamageQtyChange}
        handleAttackDamageSizeChange={handleAttackDamageSizeChange}
        handleAttackDamageModChange={handleAttackDamageModChange}
        attackFieldErrors={baseAttackFieldErrors}
        attackDamageSizes={attackDamageSizes}
        addAttackRow={addAttackRow}
      />
    );
    expect(screen.getAllByLabelText(/qty/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/size/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /add another hit die row/i })).toBeInTheDocument();
  });

  it('calls addHitDieRow when add button is clicked', () => {
    render(
      <CharacterCombatStatsFields
        ac={null}
        setAc={setAc}
        initiative={null}
        setInitiative={setInitiative}
        speed={null}
        setSpeed={setSpeed}
        inspiration={null}
        setInspiration={setInspiration}
        hitDice={baseHitDice}
        hitDiceTouched={baseTouched}
        handleHitDieQtyChange={handleHitDieQtyChange}
        handleHitDieDieChange={handleHitDieDieChange}
        addHitDieRow={addHitDieRow}
        setHitDieTouched={setHitDieTouched}
        hitDieSizes={hitDieSizes}
        attacks={baseAttacks}
        handleAttackNameChange={handleAttackNameChange}
        handleAttackBonusChange={handleAttackBonusChange}
        handleAttackTypeChange={handleAttackTypeChange}
        handleAttackNormalRangeChange={handleAttackNormalRangeChange}
        handleAttackLongRangeChange={handleAttackLongRangeChange}
        handleAttackDamageQtyChange={handleAttackDamageQtyChange}
        handleAttackDamageSizeChange={handleAttackDamageSizeChange}
        handleAttackDamageModChange={handleAttackDamageModChange}
        attackFieldErrors={baseAttackFieldErrors}
        attackDamageSizes={attackDamageSizes}
        addAttackRow={addAttackRow}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add another hit die row/i }));
    expect(addHitDieRow).toHaveBeenCalled();
  });

  it('renders attack name field and calls addAttackRow when clicked', () => {
    render(
      <CharacterCombatStatsFields
        ac={null}
        setAc={setAc}
        initiative={null}
        setInitiative={setInitiative}
        speed={null}
        setSpeed={setSpeed}
        inspiration={null}
        setInspiration={setInspiration}
        hitDice={baseHitDice}
        hitDiceTouched={baseTouched}
        handleHitDieQtyChange={handleHitDieQtyChange}
        handleHitDieDieChange={handleHitDieDieChange}
        addHitDieRow={addHitDieRow}
        setHitDieTouched={setHitDieTouched}
        hitDieSizes={hitDieSizes}
        attacks={baseAttacks}
        handleAttackNameChange={handleAttackNameChange}
        handleAttackBonusChange={handleAttackBonusChange}
        handleAttackTypeChange={handleAttackTypeChange}
        handleAttackNormalRangeChange={handleAttackNormalRangeChange}
        handleAttackLongRangeChange={handleAttackLongRangeChange}
        handleAttackDamageQtyChange={handleAttackDamageQtyChange}
        handleAttackDamageSizeChange={handleAttackDamageSizeChange}
        handleAttackDamageModChange={handleAttackDamageModChange}
        attackFieldErrors={baseAttackFieldErrors}
        attackDamageSizes={attackDamageSizes}
        addAttackRow={addAttackRow}
      />
    );

    expect(screen.getByLabelText(/Attack Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Atk Mod/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dmg Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Normal Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Long Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dmg Mod/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/qty/i).length).toBeGreaterThan(1);
    expect(screen.getAllByLabelText(/size/i).length).toBeGreaterThan(1);
    fireEvent.click(screen.getByRole('button', { name: /add another attack row/i }));
    expect(addAttackRow).toHaveBeenCalled();
  });
});
