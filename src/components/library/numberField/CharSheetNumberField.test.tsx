import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CharSheetNumberField from './CharSheetNumberField';

describe('CharSheetNumberField', () => {
  it('renders with label', () => {
    render(
      <CharSheetNumberField
        label="Level"
        value={1}
        onValueChange={() => null}
      />,
    );

    expect(screen.getByLabelText('Level')).toBeInTheDocument();
  });

  it('renders with default fieldSize (medium = 300px)', () => {
    const { container } = render(
      <CharSheetNumberField
        data-testid="test-field"
        label="Level"
        value={1}
        onValueChange={() => null}
      />,
    );

    const textField = container.querySelector('[data-testid="test-field"]');
    const styles = window.getComputedStyle(textField!);
    expect(styles.width).toBe('300px');
  });

  it('renders with fieldSize="tiny" (100px width)', () => {
    const { container } = render(
      <CharSheetNumberField
        data-testid="test-field"
        fieldSize="tiny"
        label="Level"
        value={1}
        onValueChange={() => null}
      />,
    );

    const textField = container.querySelector('[data-testid="test-field"]');
    const styles = window.getComputedStyle(textField!);
    expect(styles.width).toBe('100px');
  });

  it('displays positive values with a plus sign when requested', () => {
    render(
      <CharSheetNumberField
        label="Modifier"
        showPositiveSign
        value={2}
        onValueChange={() => null}
      />,
    );

    expect(screen.getByLabelText('Modifier')).toHaveValue('+2');
  });

  it('reports numeric values when typed', () => {
    const handleValueChange = vi.fn();
    render(
      <CharSheetNumberField
        label="Modifier"
        value={null}
        onValueChange={handleValueChange}
      />,
    );

    fireEvent.change(screen.getByLabelText('Modifier'), {
      target: { value: '12' },
    });

    expect(handleValueChange).toHaveBeenCalledWith(12);
  });

  it('allows signed values when typed', () => {
    const handleValueChange = vi.fn();
    render(
      <CharSheetNumberField
        label="Modifier"
        value={null}
        onValueChange={handleValueChange}
      />,
    );

    fireEvent.change(screen.getByLabelText('Modifier'), {
      target: { value: '+2' },
    });

    expect(handleValueChange).toHaveBeenCalledWith(2);
  });

  it('formats grouped values with commas when requested', () => {
    render(
      <CharSheetNumberField
        label="Total XP"
        value={1000000}
        onValueChange={() => null}
        useGrouping
      />,
    );

    expect(screen.getByLabelText('Total XP')).toHaveValue('1,000,000');
  });

  it('parses comma-separated values as numbers', () => {
    const handleValueChange = vi.fn();
    render(
      <CharSheetNumberField
        label="Total XP"
        value={null}
        onValueChange={handleValueChange}
        useGrouping
      />,
    );

    fireEvent.change(screen.getByLabelText('Total XP'), {
      target: { value: '1,000,000' },
    });

    expect(handleValueChange).toHaveBeenCalledWith(1000000);
  });

  it('increments and decrements by step', () => {
    const handleValueChange = vi.fn();
    const { rerender } = render(
      <CharSheetNumberField
        label="Level"
        step={2}
        value={4}
        onValueChange={handleValueChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Increment'));
    expect(handleValueChange).toHaveBeenCalledWith(6);

    rerender(
      <CharSheetNumberField
        label="Level"
        step={2}
        value={4}
        onValueChange={handleValueChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Decrement'));
    expect(handleValueChange).toHaveBeenCalledWith(2);
  });

  it('renders stacked triangle controls', () => {
    render(
      <CharSheetNumberField
        label="Level"
        value={4}
        onValueChange={() => null}
      />,
    );

    expect(screen.getByTestId('ArrowDropUpIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowDropDownIcon')).toBeInTheDocument();
  });

  it('clamps values to min and max', () => {
    const handleValueChange = vi.fn();
    const { rerender } = render(
      <CharSheetNumberField
        label="Level"
        max={20}
        value={20}
        onValueChange={handleValueChange}
      />,
    );

    expect(screen.getByLabelText('Increment')).toBeDisabled();

    rerender(
      <CharSheetNumberField
        label="Level"
        min={1}
        value={1}
        onValueChange={handleValueChange}
      />,
    );

    expect(screen.getByLabelText('Decrement')).toBeDisabled();
  });

  it('applies custom color to input and label', () => {
    const { container } = render(
      <CharSheetNumberField
        label="Level"
        value={1}
        onValueChange={() => null}
      />,
    );

    expect(container.querySelector('input')).toHaveStyle({ color: '#ccc' });
    expect(container.querySelector('label')).toHaveStyle({ color: '#ccc' });
  });
});
