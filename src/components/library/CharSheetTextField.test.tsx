import { render, screen } from '@testing-library/react';
import CharSheetTextField from './CharSheetTextField';
import { describe, it, expect } from 'vitest';

describe('CharSheetTextField', () => {
  it('renders with label', () => {
    render(<CharSheetTextField label="Character Name" />);
    expect(screen.getByLabelText('Character Name')).toBeInTheDocument();
  });

  it('renders with default fieldSize (medium = 300px)', () => {
    const { container } = render(
      <CharSheetTextField label="Test" data-testid="test-field" />,
    );
    const textField = container.querySelector('[data-testid="test-field"]');
    const styles = window.getComputedStyle(textField!);
    expect(styles.width).toBe('300px');
  });

  it('renders with fieldSize="full" (100% width)', () => {
    const { container } = render(
      <CharSheetTextField
        label="Test"
        fieldSize="full"
        data-testid="test-field"
      />,
    );
    const textField = container.querySelector('[data-testid="test-field"]');
    const styles = window.getComputedStyle(textField!);
    expect(styles.width).toBe('100%');
  });

  it('renders with fieldSize="large" (500px width)', () => {
    const { container } = render(
      <CharSheetTextField
        label="Test"
        fieldSize="large"
        data-testid="test-field"
      />,
    );
    const textField = container.querySelector('[data-testid="test-field"]');
    const styles = window.getComputedStyle(textField!);
    expect(styles.width).toBe('500px');
  });

  it('renders with fieldSize="small" (175px width)', () => {
    const { container } = render(
      <CharSheetTextField
        label="Test"
        fieldSize="small"
        data-testid="test-field"
      />,
    );
    const textField = container.querySelector('[data-testid="test-field"]');
    const styles = window.getComputedStyle(textField!);
    expect(styles.width).toBe('175px');
  });

  it('renders with fieldSize="tiny" (50px width)', () => {
    const { container } = render(
      <CharSheetTextField
        label="Test"
        fieldSize="tiny"
        data-testid="test-field"
      />,
    );
    const textField = container.querySelector('[data-testid="test-field"]');
    const styles = window.getComputedStyle(textField!);
    expect(styles.width).toBe('50px');
  });

  it('renders with custom color applied to input', () => {
    const { container } = render(
      <CharSheetTextField label="Test" />,
    );
    const input = container.querySelector('input');
    expect(input).toHaveStyle({
      color: '#ccc',
    });
  });

  it('renders with custom color applied to label', () => {
    const { container } = render(
      <CharSheetTextField label="Test Label" />,
    );
    const label = container.querySelector('label');
    expect(label).toHaveStyle({
      color: '#ccc',
    });
  });

  it('passes through TextField props', () => {
    render(
      <CharSheetTextField
        label="Test"
        variant="outlined"
        placeholder="Enter text"
      />,
    );
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('renders with variant="outlined"', () => {
    const { container } = render(
      <CharSheetTextField label="Test" variant="outlined" />,
    );
    const notchedOutline = container.querySelector(
      '.MuiOutlinedInput-notchedOutline',
    );
    expect(notchedOutline).toBeInTheDocument();
  });

  it('accepts and renders disabled state', () => {
    const { container } = render(
      <CharSheetTextField label="Test" disabled />,
    );
    const input = container.querySelector('input');
    expect(input).toBeDisabled();
  });
});


