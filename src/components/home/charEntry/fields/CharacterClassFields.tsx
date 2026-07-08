import { CSSProperties, Fragment, useEffect, useState } from 'react';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import CharSheetAutocomplete from '../../../library/select/CharSheetAutocomplete';
import CharSheetTextField from '../../../library/textField/CharSheetTextField';
import { ClassDescription, CharClassFormat } from '../../../../types/Characters.Types';
import {
  AddFieldRowButton,
  characterFieldStyles,
} from './characterFieldStyles';

type Option = { value: string; label: string };

const normalize = (value: string) => value.trim().toLowerCase();

const findMatchingOption = (input: string, options: Option[]) =>
  options.find(
    (option) => normalize(option.label) === normalize(input) || normalize(option.value) === normalize(input),
  );

const findBestMatchingOption = (input: string, options: Option[]) => {
  const normalizedInput = normalize(input);
  if (!normalizedInput) {
    return undefined;
  }

  return (
    findMatchingOption(input, options) ||
    options.find(
      (option) =>
        normalize(option.label).startsWith(normalizedInput) ||
        normalize(option.value).startsWith(normalizedInput),
    ) ||
    options.find(
      (option) =>
        normalize(option.label).includes(normalizedInput) ||
        normalize(option.value).includes(normalizedInput),
    )
  );
};

const selectionToInputValue = (selection: string) => {
  if (!selection) {
    return '';
  }

  return selection === 'other' ? 'Other' : selection === 'none' ? 'None' : selection;
};

interface CharacterClassFieldsProps {
  classDescriptions: ClassDescription[];
  setClassDescriptionValue: (
    index: number,
    values: Partial<ClassDescription>
  ) => void;
  handleLevelChange: (index: number, value: number | null) => void;
  duplicateClassDescription: (index: number) => void;
  classOptions: { value: string; label: string }[];
  Classes: CharClassFormat[];
  formError?: string;
}

const styles: { [key: string]: CSSProperties } = {
  classDescription: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px', padding: '8px' },
  classDescriptionFirst: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px', padding: '8px' },
};

const CharacterClassFields = ({
  classDescriptions,
  setClassDescriptionValue,
  handleLevelChange,
  duplicateClassDescription,
  classOptions,
  Classes,
  formError,
}: CharacterClassFieldsProps) => {
  const classOptionsWithOther = [...classOptions, { value: 'other', label: 'Other' }];
  const [classInputValues, setClassInputValues] = useState<string[]>(() =>
    classDescriptions.map((entry) => selectionToInputValue(entry.classSelection)),
  );
  const [subclassInputValues, setSubclassInputValues] = useState<string[]>(() =>
    classDescriptions.map((entry) => selectionToInputValue(entry.subclass)),
  );

  useEffect(() => {
    setClassInputValues((current) => {
      if (current.length === classDescriptions.length) {
        return current;
      }

      return classDescriptions.map((_, index) => current[index] ?? '');
    });
    setSubclassInputValues((current) => {
      if (current.length === classDescriptions.length) {
        return current;
      }

      return classDescriptions.map((_, index) => current[index] ?? '');
    });
  }, [classDescriptions]);

  const getSubclassOptions = (entry: ClassDescription) => {
    if (entry.classSelection === 'other') {
      return [
        { value: 'none', label: 'None' },
        { value: 'other', label: 'Other' },
      ];
    }

    if (!entry.classSelection) {
      return [];
    }

    const selectedClass = Classes.find((c: CharClassFormat) => c.class_name === entry.classSelection);
    const subclassOptions =
      selectedClass?.subclasses?.map((sub: string) => ({
        value: sub,
        label: selectedClass.subclass_format
          ? selectedClass.subclass_format.replace('<subclass>', sub).replace('<subclass_title>', selectedClass.subclass_title || '')
          : sub,
      })) || [];

    return [
      { value: 'none', label: 'None' },
      ...subclassOptions.sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label)),
      { value: 'other', label: 'Other' },
    ];
  };

  const commitClassInput = (index: number) => {
    const inputValue = classInputValues[index]?.trim();
    if (!inputValue) {
      setClassDescriptionValue(index, { touched: true });
      return;
    }

    const matchingOption = findBestMatchingOption(inputValue, classOptionsWithOther);
    if (matchingOption) {
      setClassDescriptionValue(
        index,
        matchingOption.value === 'other'
          ? { classSelection: 'other', otherClassText: '', subclass: 'other', subclassOther: '', touched: true }
          : { classSelection: matchingOption.value, otherClassText: '', subclass: '', subclassOther: '', touched: true },
      );
      setClassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? matchingOption.label : value)));
      setSubclassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? (matchingOption.value === 'other' ? 'Other' : '') : value)));
      return;
    }

    setClassDescriptionValue(index, {
      classSelection: 'other',
      otherClassText: inputValue,
      subclass: 'other',
      subclassOther: '',
      touched: true,
      otherTouched: true,
    });
    setClassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? 'Other' : value)));
    setSubclassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? 'Other' : value)));
  };

  const commitSubclassInput = (index: number, entry: ClassDescription) => {
    const inputValue = subclassInputValues[index]?.trim();
    if (!inputValue) {
      setClassDescriptionValue(index, { subclassTouched: true });
      return;
    }

    const matchingOption = findBestMatchingOption(inputValue, getSubclassOptions(entry));
    if (matchingOption) {
      setClassDescriptionValue(
        index,
        matchingOption.value === 'other'
          ? { subclass: 'other', subclassOther: '', subclassTouched: true, otherSubclassTouched: true }
          : { subclass: matchingOption.value, subclassOther: '', subclassTouched: true, otherSubclassTouched: false },
      );
      setSubclassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? matchingOption.label : value)));
      return;
    }

    setClassDescriptionValue(index, {
      subclass: 'other',
      subclassOther: inputValue,
      subclassTouched: true,
      otherSubclassTouched: true,
    });
    setSubclassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? 'Other' : value)));
  };

  return (
    <>
      {classDescriptions.map((entry, index) => {
        const showClassSelectionError = entry.touched && entry.classSelection === '';
        const showOtherClassError =
          entry.classSelection === 'other' && entry.otherTouched && entry.otherClassText.trim() === '';
        const showLevelWithoutClassError =
          entry.level !== null && !entry.classSelection;
        // Only show subclass errors if classSelection is NOT 'other'
        const showOtherSubclassError =
          entry.classSelection !== 'other' && entry.subclass === 'other' && entry.otherSubclassTouched && entry.subclassOther.trim() === '';
        const subclassOptions = getSubclassOptions(entry);
        const selectedClassOption = findMatchingOption(entry.classSelection, classOptionsWithOther) ?? null;
        const selectedSubclassOption = findMatchingOption(entry.subclass, subclassOptions) ?? null;
        return (
          <Fragment key={`characterClass${index}`}>
            <div
              className="classDescription"
              style={index === 0 ? styles.classDescriptionFirst : styles.classDescription}
            >
              <div style={characterFieldStyles.fieldRow}>
                <div style={characterFieldStyles.fieldColumn}>
                  <CharSheetAutocomplete
                    value={selectedClassOption}
                    inputValue={classInputValues[index] ?? selectionToInputValue(entry.classSelection)}
                    onInputChange={(_, newInputValue, reason) => {
                      setClassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? newInputValue : value)));
                      if (reason === 'input' && entry.classSelection === 'other') {
                        setClassDescriptionValue(index, {
                          classSelection: '',
                          otherClassText: '',
                          subclass: '',
                          subclassOther: '',
                          otherTouched: false,
                          subclassTouched: false,
                          otherSubclassTouched: false,
                        });
                        setSubclassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? '' : value)));
                      }
                    }}
                    onChange={(_, newValue) => {
                      const selectedValue = newValue && typeof newValue === 'object' ? newValue.value : '';
                      const selectedLabel = newValue && typeof newValue === 'object' ? newValue.label : '';
                      setClassDescriptionValue(
                        index,
                        selectedValue === 'other'
                          ? { classSelection: 'other', otherClassText: '', subclass: 'other', subclassOther: '', touched: true }
                          : { classSelection: selectedValue, otherClassText: '', subclass: '', subclassOther: '', touched: true },
                      );
                      setClassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? selectedLabel : value)));
                      setSubclassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? (selectedValue === 'other' ? 'Other' : '') : value)));
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        commitClassInput(index);
                      }, 0);
                    }}
                    label="Character Class*"
                    fieldSize="medium"
                    options={classOptionsWithOther}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    error={showClassSelectionError || showOtherClassError || showLevelWithoutClassError}
                    helperText={
                      showClassSelectionError
                        ? 'Please select a character class.'
                        : showOtherClassError
                        ? 'Please enter a class name when Other is selected.'
                        : showLevelWithoutClassError
                        ? 'Please select a class when a level is entered.'
                        : undefined
                    }
                  />
                  {entry.classSelection === 'other' && (
                    <CharSheetTextField
                      value={entry.otherClassText}
                      onChange={(event) => setClassDescriptionValue(index, { otherClassText: event.target.value, otherTouched: true })}
                      onBlur={() => setClassDescriptionValue(index, { otherTouched: true })}
                      label="Other Class Name*"
                      variant="outlined"
                      fieldSize="medium"
                      error={showOtherClassError}
                      helperText={showOtherClassError ? 'Enter a class name when Other is selected.' : undefined}
                    />
                  )}
                </div>
                <div style={{ ...characterFieldStyles.fieldColumn, alignItems: 'flex-start', minWidth: undefined }}>
                  <CharSheetNumberField
                    value={entry.level}
                    onValueChange={(value) => handleLevelChange(index, value)}
                    label="Level"
                    variant="outlined"
                    fieldSize="tiny"
                    min={1}
                    max={20}
                  />
                </div>
                <div style={characterFieldStyles.fieldColumn}>
                  <CharSheetAutocomplete
                    value={selectedSubclassOption}
                    inputValue={subclassInputValues[index] ?? selectionToInputValue(entry.subclass)}
                    onInputChange={(_, newInputValue, reason) => {
                      setSubclassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? newInputValue : value)));
                      if (reason === 'input' && entry.subclass === 'other') {
                        setClassDescriptionValue(index, {
                          subclass: '',
                          subclassOther: '',
                          otherSubclassTouched: false,
                        });
                      }
                    }}
                    onChange={(_, newValue) => {
                      const selectedValue = newValue && typeof newValue === 'object' ? newValue.value : '';
                      const selectedLabel = newValue && typeof newValue === 'object' ? newValue.label : '';
                      setClassDescriptionValue(
                        index,
                        selectedValue === 'other'
                          ? { subclass: 'other', subclassOther: '', subclassTouched: true, otherSubclassTouched: true }
                          : { subclass: selectedValue, subclassOther: '', subclassTouched: true, otherSubclassTouched: false },
                      );
                      setSubclassInputValues((current) => current.map((value, valueIndex) => (valueIndex === index ? selectedLabel : value)));
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        commitSubclassInput(index, entry);
                      }, 0);
                    }}
                    label="Subclass"
                    fieldSize="medium"
                    disabled={!entry.classSelection}
                    options={subclassOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    error={showOtherSubclassError}
                    helperText={showOtherSubclassError ? 'Please enter a subclass name when Other is selected.' : undefined}
                  />
                  {entry.subclass === 'other' && (
                    <CharSheetTextField
                      value={entry.subclassOther}
                      onChange={(event) => setClassDescriptionValue(index, { subclassOther: event.target.value, otherSubclassTouched: true })}
                      onBlur={() => setClassDescriptionValue(index, { otherSubclassTouched: true })}
                      label="Other Subclass Name*"
                      variant="outlined"
                      fieldSize="medium"
                      error={showOtherSubclassError}
                      helperText={showOtherSubclassError ? 'Enter a subclass name when Other is selected.' : undefined}
                    />
                  )}
                </div>
              </div>
            </div>
            {index === 0 && formError && (
              <div style={characterFieldStyles.formError}>{formError}</div>
            )}
          </Fragment>
        );
      })}
      <div style={{ marginTop: '6px', padding: '8px' }}>
        <AddFieldRowButton
          ariaLabel="Add another character class"
          onClick={() => duplicateClassDescription(classDescriptions.length - 1)}
        >
          add another character class
        </AddFieldRowButton>
      </div>
    </>
  );
};

export default CharacterClassFields;
