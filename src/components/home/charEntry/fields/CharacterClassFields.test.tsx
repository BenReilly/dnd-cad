import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CharacterClassFields from './CharacterClassFields';
import { ClassDescription, CharClassFormat } from '../../../../types/Characters.Types';

describe('CharacterClassFields', () => {
  const baseClassDescription: ClassDescription = {
    classSelection: '',
    otherClassText: '',
    level: null,
    subclass: '',
    subclassOther: '',
    touched: false,
    otherTouched: false,
    subclassTouched: false,
    otherSubclassTouched: false,
  };
  const classOptions = [
    { value: 'Fighter', label: 'Fighter' },
    { value: 'Wizard', label: 'Wizard' },
  ];
  const Classes: CharClassFormat[] = [
    { class_name: 'Fighter', subclass_format: '<subclass>', subclass_title: 'Archetype', subclasses: ['Champion', 'Battle Master'] },
    { class_name: 'Wizard', subclass_format: '<subclass>', subclass_title: 'School', subclasses: ['Evocation', 'Illusion'] },
  ];
  const setClassDescriptionValue = vi.fn();
  const handleLevelChange = vi.fn();
  const duplicateClassDescription = vi.fn();

  it('renders class select and add button', () => {
    render(
      <CharacterClassFields
        classDescriptions={[baseClassDescription]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
      />
    );
    expect(screen.getByRole('combobox', { name: 'Character Class*' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add another character class/i })).toBeInTheDocument();
  });

  it('shows Other Class Name field when "Other" is selected', () => {
    render(
      <CharacterClassFields
        classDescriptions={[
          { ...baseClassDescription, classSelection: 'other' }
        ]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
      />
    );
    expect(screen.getByLabelText(/Other Class Name/i)).toBeInTheDocument();
  });

  it('calls duplicateClassDescription when add button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CharacterClassFields
        classDescriptions={[baseClassDescription]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
      />
    );
    await user.click(screen.getByRole('button', { name: /add another character class/i }));
    expect(duplicateClassDescription).toHaveBeenCalled();
  });

  it('shows error helper text when error conditions are met', () => {
    render(
      <CharacterClassFields
        classDescriptions={[
          { ...baseClassDescription, touched: true, classSelection: '' }
        ]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
        formError={"At least one valid character class is required."}
      />
    );
    expect(screen.getByText(/Please select a character class/i)).toBeInTheDocument();
    expect(screen.getByText(/At least one valid character class is required/i)).toBeInTheDocument();
  });
  it('filters class options as the user types', async () => {
    const user = userEvent.setup();
    render(
      <CharacterClassFields
        classDescriptions={[baseClassDescription]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
      />
    );

    const classInput = screen.getByRole('combobox', { name: 'Character Class*' });
    await user.click(classInput);
    await user.type(classInput, 'wiz');

    await waitFor(() => expect(screen.queryByRole('option', { name: 'Fighter' })).not.toBeInTheDocument());
    expect(screen.getByRole('option', { name: 'Wizard' })).toBeInTheDocument();
  });

  it('promotes unmatched class input to Other on blur', async () => {
    const user = userEvent.setup();
    render(
      <CharacterClassFields
        classDescriptions={[baseClassDescription]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
      />
    );

    const classInput = screen.getByRole('combobox', { name: 'Character Class*' });
    await user.click(classInput);
    await user.type(classInput, 'Artificer');
    await user.tab();

    await waitFor(() =>
      expect(setClassDescriptionValue).toHaveBeenCalledWith(
        0,
        expect.objectContaining({
          classSelection: 'other',
          otherClassText: 'Artificer',
          subclass: 'other',
        }),
      ),
    );
  });
});
