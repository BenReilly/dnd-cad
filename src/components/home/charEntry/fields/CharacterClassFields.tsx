import { Fragment, ChangeEvent } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import CharSheetSelect from '../../../library/select/CharSheetSelect';
import CharSheetTextField from '../../../library/textField/CharSheetTextField';
import { SelectChangeEvent } from '@mui/material/Select';
import { ClassDescription, CharClassFormat } from '../../../../types/Characters.Types';

interface CharacterClassFieldsProps {
  classDescriptions: ClassDescription[];
  setClassDescriptionValue: (
    index: number,
    values: Partial<ClassDescription>
  ) => void;
  handleClassChange: (index: number, event: SelectChangeEvent<unknown>) => void;
  handleOtherClassChange: (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubclassChange: (index: number, event: SelectChangeEvent<unknown>) => void;
  handleOtherSubclassChange: (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleLevelChange: (index: number, value: number | null) => void;
  duplicateClassDescription: (index: number) => void;
  classOptions: { value: string; label: string }[];
  Classes: CharClassFormat[];
  formError?: string;
}

const styles: { [key: string]: React.CSSProperties } = {
  fieldBlock: { padding: '8px', marginBottom: '5px' },
  flexColumn: { display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' },
  flexRow: { display: 'flex', gap: '8px', alignItems: 'flex-start' },
  classDescription: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px', padding: '8px' },
  classDescriptionFirst: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px', padding: '8px' },
  addButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: '#666',
  },
};

const CharacterClassFields = ({
  classDescriptions,
  setClassDescriptionValue,
  handleClassChange,
  handleOtherClassChange,
  handleSubclassChange,
  handleOtherSubclassChange,
  handleLevelChange,
  duplicateClassDescription,
  classOptions,
  Classes,
  formError,
}: CharacterClassFieldsProps) => {
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
        return (
          <Fragment key={`characterClass${index}`}>
            <div
              className="classDescription"
              style={index === 0 ? styles.classDescriptionFirst : styles.classDescription}
            >
              <div style={styles.flexRow}>
                <div style={styles.flexColumn}>
                  <CharSheetSelect
                    value={entry.classSelection}
                    onChange={(event) => handleClassChange(index, event)}
                    onBlur={() => setClassDescriptionValue(index, { touched: true })}
                    label="Character Class*"
                    fieldSize="medium"
                    options={[...classOptions, { value: 'other', label: 'Other' }]}
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
                      onChange={(event) => handleOtherClassChange(index, event)}
                      onBlur={() => setClassDescriptionValue(index, { otherTouched: true })}
                      label="Other Class Name*"
                      variant="outlined"
                      fieldSize="medium"
                      error={showOtherClassError}
                      helperText={showOtherClassError ? 'Enter a class name when Other is selected.' : undefined}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
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
                <div style={styles.flexColumn}>
                  <CharSheetSelect
                    value={entry.subclass}
                    onChange={(event) => handleSubclassChange(index, event)}
                    onBlur={() => setClassDescriptionValue(index, { subclassTouched: true })}
                    label="Subclass"
                    fieldSize="medium"
                    disabled={!entry.classSelection}
                    options={
                      entry.classSelection === 'other'
                        ? [{ value: 'none', label: 'None' }, { value: 'other', label: 'Other' }]
                        : entry.classSelection && entry.classSelection !== 'other'
                        ? (() => {
                            const selectedClass = Classes.find((c: CharClassFormat) => c.class_name === entry.classSelection);
                            const subclassOptions =
                              selectedClass?.subclasses?.map((sub: string) => ({
                                value: sub,
                                label: selectedClass.subclass_format
                                  ? selectedClass.subclass_format
                                      .replace('<subclass>', sub)
                                      .replace('<subclass_title>', selectedClass.subclass_title || '')
                                  : sub,
                              })) || [];
                            return [
                              { value: 'none', label: 'None' },
                              ...subclassOptions.sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label)),
                              { value: 'other', label: 'Other' },
                            ];
                          })()
                        : []
                    }
                    error={showOtherSubclassError}
                    helperText={showOtherSubclassError ? 'Please enter a subclass name when Other is selected.' : undefined}
                  />
                  {entry.subclass === 'other' && (
                    <CharSheetTextField
                      value={entry.subclassOther}
                      onChange={(event) => handleOtherSubclassChange(index, event)}
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
              <div style={{ color: 'red', marginTop: '8px', fontSize: '0.875rem' }}>{formError}</div>
            )}
          </Fragment>
        );
      })}
      <div style={{ marginTop: '6px', padding: '8px' }}>
        <button
          type="button"
          onClick={() => duplicateClassDescription(classDescriptions.length - 1)}
          aria-label="Add another character class"
          style={styles.addButton}
        >
          <AddIcon sx={{ width: 20, height: 20, strokeWidth: 2, color: '#fff' }} />
          <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{'add another character class'}</span>
        </button>
      </div>
    </>
  );
};

export default CharacterClassFields;
