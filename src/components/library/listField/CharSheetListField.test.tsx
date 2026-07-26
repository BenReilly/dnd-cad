import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import CharSheetListField from './CharSheetListField';

const ControlledListField = ({
  initialItems = [],
  onItemsChange,
}: {
  initialItems?: string[];
  onItemsChange?: (items: string[]) => void;
}) => {
  const [items, setItems] = useState(initialItems);
  const handleItemsChange = (nextItems: string[]) => {
    setItems(nextItems);
    onItemsChange?.(nextItems);
  };

  return (
    <CharSheetListField
      label="Items"
      items={items}
      onItemsChange={handleItemsChange}
    />
  );
};

describe('CharSheetListField', () => {
  it('renders a text field and Add button', () => {
    render(<ControlledListField />);

    expect(screen.getByLabelText('Items')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('splits on comma input and clears the field', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, {
      target: { value: 'sword,shield' },
    });

    expect(screen.getByText('sword')).toBeInTheDocument();
    expect(screen.getByText('shield')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('splits on Enter key and clears the field', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, {
      target: { value: 'rope' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('rope')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('splits on Add button click and clears the field', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, {
      target: { value: 'map, rations' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('map')).toBeInTheDocument();
    expect(screen.getByText('rations')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('splits pasted comma text that starts with alphanumeric', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, {
      target: { value: 'gem,potion' },
    });

    expect(screen.getByText('gem')).toBeInTheDocument();
    expect(screen.getByText('potion')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('splits pasted comma text when the field was already populated', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, {
      target: { value: 'existing text' },
    });
    fireEvent.change(input, {
      target: { value: 'axe,cloak' },
    });

    expect(screen.getByText('axe')).toBeInTheDocument();
    expect(screen.getByText('cloak')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('enters error state when value starts with a non-alphanumeric character', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, {
      target: { value: ',sword' },
    });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('Value must start with a letter or number.'),
    ).toBeInTheDocument();
  });

  it('clears error state after editing to valid alphanumeric start', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, {
      target: { value: '!bad' },
    });
    fireEvent.change(input, {
      target: { value: 'good' },
    });

    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(
      screen.queryByText('Value must start with a letter or number.'),
    ).not.toBeInTheDocument();
  });

  it('sets error state when Add is clicked on invalid value', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, {
      target: { value: '#nope' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('Value must start with a letter or number.'),
    ).toBeInTheDocument();
  });

  it('does nothing when Add is clicked while blank', () => {
    const handleItemsChange = vi.fn();
    render(<ControlledListField onItemsChange={handleItemsChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(handleItemsChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'sword' })).not.toBeInTheDocument();
  });

  it('does nothing when Add is clicked with whitespace-only input', () => {
    const handleItemsChange = vi.fn();
    render(<ControlledListField onItemsChange={handleItemsChange} />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(handleItemsChange).not.toHaveBeenCalled();
  });

  it('trims leading and trailing whitespace before creating a chip', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, { target: { value: '  arrow  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('arrow')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('does not show an error for input that starts with whitespace followed by alphanumeric', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, { target: { value: '  sword' } });

    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows an error when the first non-whitespace character is not alphanumeric', () => {
    render(<ControlledListField />);
    const input = screen.getByLabelText('Items');

    fireEvent.change(input, { target: { value: '  !bad' } });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('Value must start with a letter or number.'),
    ).toBeInTheDocument();
  });

  it('renders chips with the outlined variant', () => {
    render(<ControlledListField initialItems={['arrow']} />);

    const chip = screen.getByText('arrow').closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-outlined');
  });

  it('removes a chip when its delete button is clicked', () => {
    const handleItemsChange = vi.fn();
    render(
      <ControlledListField
        initialItems={['sword', 'shield']}
        onItemsChange={handleItemsChange}
      />,
    );

    expect(screen.getByText('sword')).toBeInTheDocument();

    const swordChip = screen.getByText('sword').closest('.MuiChip-root') as HTMLElement;
    fireEvent.click(within(swordChip).getByTestId('CancelIcon'));

    expect(screen.queryByText('sword')).not.toBeInTheDocument();
    expect(screen.getByText('shield')).toBeInTheDocument();
    expect(handleItemsChange).toHaveBeenCalledWith(['shield']);
  });

  it('calls onItemsChange with remaining items after deletion', () => {
    const handleItemsChange = vi.fn();
    render(
      <ControlledListField
        initialItems={['a', 'b', 'c']}
        onItemsChange={handleItemsChange}
      />,
    );

    const bChip = screen.getByText('b').closest('.MuiChip-root') as HTMLElement;
    fireEvent.click(within(bChip).getByTestId('CancelIcon'));

    expect(handleItemsChange).toHaveBeenCalledWith(['a', 'c']);
  });
});
