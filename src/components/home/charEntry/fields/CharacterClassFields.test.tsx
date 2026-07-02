import { render, screen, fireEvent } from '@testing-library/react';
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
  const handleClassChange = vi.fn();
  const handleOtherClassChange = vi.fn();
  const handleSubclassChange = vi.fn();
  const handleOtherSubclassChange = vi.fn();
  const handleLevelChange = vi.fn();
  const duplicateClassDescription = vi.fn();

  it('renders class select and add button', () => {
    render(
      <CharacterClassFields
        classDescriptions={[baseClassDescription]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleClassChange={handleClassChange}
        handleOtherClassChange={handleOtherClassChange}
        handleSubclassChange={handleSubclassChange}
        handleOtherSubclassChange={handleOtherSubclassChange}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
      />
    );
    expect(screen.getByLabelText(/Character Class/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add another character class/i })).toBeInTheDocument();
  });

  it('shows Other Class Name field when "Other" is selected', () => {
    render(
      <CharacterClassFields
        classDescriptions={[
          { ...baseClassDescription, classSelection: 'other' }
        ]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleClassChange={handleClassChange}
        handleOtherClassChange={handleOtherClassChange}
        handleSubclassChange={handleSubclassChange}
        handleOtherSubclassChange={handleOtherSubclassChange}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
      />
    );
    expect(screen.getByLabelText(/Other Class Name/i)).toBeInTheDocument();
  });

  it('calls duplicateClassDescription when add button is clicked', () => {
    render(
      <CharacterClassFields
        classDescriptions={[baseClassDescription]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleClassChange={handleClassChange}
        handleOtherClassChange={handleOtherClassChange}
        handleSubclassChange={handleSubclassChange}
        handleOtherSubclassChange={handleOtherSubclassChange}
        handleLevelChange={handleLevelChange}
        duplicateClassDescription={duplicateClassDescription}
        classOptions={classOptions}
        Classes={Classes}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add another character class/i }));
    expect(duplicateClassDescription).toHaveBeenCalled();
  });

  it('shows error helper text when error conditions are met', () => {
    render(
      <CharacterClassFields
        classDescriptions={[
          { ...baseClassDescription, touched: true, classSelection: '' }
        ]}
        setClassDescriptionValue={setClassDescriptionValue}
        handleClassChange={handleClassChange}
        handleOtherClassChange={handleOtherClassChange}
        handleSubclassChange={handleSubclassChange}
        handleOtherSubclassChange={handleOtherSubclassChange}
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
});
