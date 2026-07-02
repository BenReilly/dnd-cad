import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CharacterCombatStatsFields from './CharacterCombatStatsFields';
import { HitDie } from '../../../../types/Characters.Types';

describe('CharacterCombatStatsFields', () => {
  const hitDieSizes = ['4', '6', '8', '10', '12'];
  const baseHitDice: HitDie[] = [{ qty: 0, die: 0 }];
  const baseTouched = [false];
  const setAc = vi.fn();
  const setInitiative = vi.fn();
  const setSpeed = vi.fn();
  const setInspiration = vi.fn();
  const handleHitDieQtyChange = vi.fn();
  const handleHitDieDieChange = vi.fn();
  const addHitDieRow = vi.fn();
  const setHitDieTouched = vi.fn();

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
      />
    );
    expect(screen.getByLabelText(/AC/i)).toBeInTheDocument();
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
      />
    );
    expect(screen.getByLabelText(/qty/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
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
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add another hit die row/i }));
    expect(addHitDieRow).toHaveBeenCalled();
  });
});
