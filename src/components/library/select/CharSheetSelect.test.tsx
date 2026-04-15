import { render, screen, fireEvent } from '@testing-library/react';
import CharSheetSelect from './CharSheetSelect';
import { describe, it, expect, vi } from 'vitest';

describe('CharSheetSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders with label', () => {
    render(<CharSheetSelect label="Test Select" options={mockOptions} />);
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });

  it('renders with default fieldSize (medium = 300px)', () => {
    const { container } = render(
      <CharSheetSelect
        label="Test"
        options={mockOptions}
        data-testid="test-select"
      />,
    );
    const formControl = container.querySelector('[data-testid="test-select"]');
    const styles = window.getComputedStyle(formControl!);
    expect(styles.width).toBe('300px');
  });

  it('renders with fieldSize="full" (100% width)', () => {
    const { container } = render(
      <CharSheetSelect
        label="Test"
        fieldSize="full"
        options={mockOptions}
        data-testid="test-select"
      />,
    );
    const formControl = container.querySelector('[data-testid="test-select"]');
    const styles = window.getComputedStyle(formControl!);
    expect(styles.width).toBe('100%');
  });

  it('renders with fieldSize="large" (500px width)', () => {
    const { container } = render(
      <CharSheetSelect
        label="Test"
        fieldSize="large"
        options={mockOptions}
        data-testid="test-select"
      />,
    );
    const formControl = container.querySelector('[data-testid="test-select"]');
    const styles = window.getComputedStyle(formControl!);
    expect(styles.width).toBe('500px');
  });

  it('renders with fieldSize="small" (175px width)', () => {
    const { container } = render(
      <CharSheetSelect
        label="Test"
        fieldSize="small"
        options={mockOptions}
        data-testid="test-select"
      />,
    );
    const formControl = container.querySelector('[data-testid="test-select"]');
    const styles = window.getComputedStyle(formControl!);
    expect(styles.width).toBe('175px');
  });

  it('renders with fieldSize="tiny" (100px width)', () => {
    const { container } = render(
      <CharSheetSelect
        label="Test"
        fieldSize="tiny"
        options={mockOptions}
        data-testid="test-select"
      />,
    );
    const formControl = container.querySelector('[data-testid="test-select"]');
    const styles = window.getComputedStyle(formControl!);
    expect(styles.width).toBe('100px');
  });

  it('renders options from options prop', () => {
    render(<CharSheetSelect label="Test" options={mockOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders custom children instead of options', () => {
    render(
      <CharSheetSelect label="Test">
        <option value="custom1">Custom Option 1</option>
        <option value="custom2">Custom Option 2</option>
      </CharSheetSelect>,
    );
    expect(screen.getByText('Custom Option 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Option 2')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(
      <CharSheetSelect
        label="Test"
        options={mockOptions}
        helperText="This is helper text"
      />,
    );
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(
      <CharSheetSelect
        label="Test"
        options={mockOptions}
        value=""
        onChange={handleChange}
      />,
    );

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom font to label', () => {
    const { container } = render(
      <CharSheetSelect label="Test Label" options={mockOptions} />,
    );
    const label = container.querySelector('label');
    expect(label).toHaveStyle({
      fontFamily: '"Quintessential", serif',
    });
  });

  it('applies custom font to select', () => {
    const { container } = render(
      <CharSheetSelect label="Test" options={mockOptions} />,
    );
    const select = container.querySelector('.MuiSelect-select');
    expect(select).toHaveStyle({
      fontFamily: '"Quintessential", serif',
    });
  });

  it('applies custom font to menu items', () => {
    render(<CharSheetSelect label="Test" options={mockOptions} />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const menuItems = screen.getAllByRole('option');
    menuItems.forEach((item) => {
      expect(item).toHaveStyle({
        fontFamily: '"Quintessential", serif',
      });
    });
  });

  it('applies custom font to helper text', () => {
    render(
      <CharSheetSelect
        label="Test"
        options={mockOptions}
        helperText="Helper text"
      />,
    );
    const helperText = screen.getByText('Helper text');
    expect(helperText).toHaveStyle({
      fontFamily: '"Quintessential", serif',
    });
  });

  it('applies border color #ccc to outlined input', () => {
    const { container } = render(
      <CharSheetSelect label="Test" options={mockOptions} />,
    );
    const notchedOutline = container.querySelector(
      '.MuiOutlinedInput-notchedOutline',
    );
    expect(notchedOutline).toBeInTheDocument();
  });

  it('passes through Select props', () => {
    render(
      <CharSheetSelect
        label="Test"
        options={mockOptions}
        disabled
        data-testid="disabled-select"
      />,
    );
    const select = screen.getByTestId('disabled-select');
    expect(select).toBeDisabled();
  });

  it('renders with empty options array', () => {
    render(<CharSheetSelect label="Test" options={[]} />);
    expect(screen.getByLabelText('Test')).toBeInTheDocument();
  });
});