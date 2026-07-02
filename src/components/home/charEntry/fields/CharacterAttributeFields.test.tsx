import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CharacterAttributeFields from './CharacterAttributeFields';

describe('CharacterAttributeFields', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultAttributes = {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  };

  const defaultModifiers = {
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
  };

  it('renders all six attribute labels', () => {
    render(
      <CharacterAttributeFields
        attributes={defaultAttributes}
        modifiers={defaultModifiers}
        onAttributeChange={() => {}}
      />,
    );

    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getByText('Dexterity')).toBeInTheDocument();
    expect(screen.getByText('Constitution')).toBeInTheDocument();
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Wisdom')).toBeInTheDocument();
    expect(screen.getByText('Charisma')).toBeInTheDocument();
  });

  it('calls onAttributeChange when a field value changes', () => {
    const onAttributeChange = vi.fn();
    const { container } = render(
      <CharacterAttributeFields
        attributes={defaultAttributes}
        modifiers={defaultModifiers}
        onAttributeChange={onAttributeChange}
      />,
    );

    const strengthInput = container.querySelector('input[name="str"]') as HTMLInputElement;
    fireEvent.change(strengthInput, { target: { value: '15' } });

    expect(onAttributeChange).toHaveBeenCalledWith('str', 15);
  });

  it('renders a form error when provided', () => {
    render(
      <CharacterAttributeFields
        attributes={defaultAttributes}
        modifiers={defaultModifiers}
        onAttributeChange={() => {}}
        formError="Attribute values are invalid"
      />,
    );

    expect(screen.getByText('Attribute values are invalid')).toBeInTheDocument();
  });
});
