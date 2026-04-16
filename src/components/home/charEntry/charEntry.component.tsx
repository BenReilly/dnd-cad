import { useContext, useState, ChangeEvent, FormEvent, Fragment } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CharSheetTextField from '../../library/textField/CharSheetTextField';
import CharSheetSelect from '../../library/select/CharSheetSelect';
import { RaceClassContext } from '../../../contexts/racesAndClasses.context';

const CharEntry = () => {
  const { Classes, Races } = useContext(RaceClassContext);
  const charId = 'someIdHere';
  const user_doc = 'eje';
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [nameError, setNameError] = useState('');
  const [raceSelection, setRaceSelection] = useState('');
  const [raceTouched, setRaceTouched] = useState(false);
  const [otherRaceText, setOtherRaceText] = useState('');
  const [otherRaceTouched, setOtherRaceTouched] = useState(false);
  const [subraceSelection, setSubraceSelection] = useState('');
  const [otherSubraceText, setOtherSubraceText] = useState('');
  const [otherSubraceTouched, setOtherSubraceTouched] = useState(false);
  const [classDescriptions, setClassDescriptions] = useState([
    { classSelection: '', otherClassText: '', level: '', subclass: '', subclassOther: '', touched: false, otherTouched: false, subclassTouched: false, otherSubclassTouched: false },
  ]);
  const [formError, setFormError] = useState('');

  const classOptions = Classes.map((classItem) => ({
    value: classItem.class_name,
    label: classItem.class_name,
  })).sort((a, b) => a.label.localeCompare(b.label));

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
    if (nameTouched) {
      if (!value.trim()) {
        setNameError('Name is required.');
      } else {
        setNameError('');
      }
    }
  };

  const raceOptions = Races.map((raceItem) => ({
    value: raceItem.race_name,
    label: raceItem.race_name,
  })).sort((a, b) => a.label.localeCompare(b.label));

  const selectedRace = Races.find((raceItem) => raceItem.race_name === raceSelection);
  const subraceOptions = selectedRace?.subraces?.map((subrace) => ({ value: subrace, label: subrace })) || [];

  const handleRaceChange = (event: any) => {
    const value = event.target.value as string;
    setRaceSelection(value);
    setOtherRaceText('');
    setOtherRaceTouched(false);
    setSubraceSelection('');
    setOtherSubraceText('');
    setOtherSubraceTouched(false);
    if (raceTouched) {
      // keep race error state derived from touch + selection
    }
  };

  const handleOtherRaceChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    setOtherRaceText(value);
    if (otherRaceTouched) {
      // keep other race error state derived from touch + text
    }
  };

  const handleSubraceChange = (event: any) => {
    const value = event.target.value as string;
    setSubraceSelection(value);
    setOtherSubraceText('');
    setOtherSubraceTouched(false);
  };

  const handleOtherSubraceChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setOtherSubraceText(event.target.value);
  };

  const setClassDescriptionValue = (
    index: number,
    values: Partial<{
      classSelection: string;
      otherClassText: string;
      level: string;
      subclass: string;
      subclassOther: string;
      touched: boolean;
      otherTouched: boolean;
      subclassTouched: boolean;
      otherSubclassTouched: boolean;
    }>,
  ) => {
    setClassDescriptions((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ...values,
              ...(values.classSelection && values.classSelection !== 'other'
                ? { otherClassText: '', subclass: '', subclassOther: '' }
                : {}),
              ...(values.subclass && values.subclass !== 'other'
                ? { subclassOther: '' }
                : {}),
            }
          : item,
      ),
    );
  };

  const handleClassChange = (index: number, event: any) => {
    const value = event.target.value as string;
    setClassDescriptionValue(index, { classSelection: value, touched: true });
  };

  const handleOtherClassChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setClassDescriptionValue(index, { otherClassText: event.target.value, otherTouched: true });
  };

  const handleSubclassChange = (index: number, event: any) => {
    const value = event.target.value as string;
    setClassDescriptionValue(index, { subclass: value, subclassTouched: true });
  };

  const handleOtherSubclassChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setClassDescriptionValue(index, { subclassOther: event.target.value, otherSubclassTouched: true });
  };

  const handleLevelChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const rawValue = event.target.value;
    const digits = rawValue.replace(/[^0-9]/g, '');
    if (digits === '') {
      setClassDescriptionValue(index, { level: '' });
      return;
    }
    const numeric = Number(digits);
    const clamped = Math.min(20, Math.max(1, numeric));
    setClassDescriptionValue(index, { level: String(clamped) });
  };

  const duplicateClassDescription = (index: number) => {
    setClassDescriptions((current) => {
      const next = [...current];
      next.splice(index + 1, 0, { classSelection: '', otherClassText: '', level: '', subclass: '', subclassOther: '', touched: false, otherTouched: false, subclassTouched: false, otherSubclassTouched: false });
      return next;
    });
  };

  const validClassDescriptions = classDescriptions.filter((entry) => {
    if (!entry.classSelection) {
      return false;
    }
    if (entry.classSelection === 'other' && entry.otherClassText.trim().length === 0) {
      return false;
    }
    if (entry.level.trim() !== '' && !entry.classSelection) {
      return false;
    }
    if (entry.subclass === 'other' && entry.classSelection !== 'other' && entry.subclassOther.trim().length === 0) {
      return false;
    }
    return true;
  });

  const classArray = validClassDescriptions.map((entry) => ({
    name: entry.classSelection === 'other' ? entry.otherClassText : entry.classSelection,
    level: entry.level ? Number(entry.level) : undefined,
    subclass: entry.subclass === 'other' ? entry.subclassOther : entry.subclass === 'none' ? undefined : entry.subclass || undefined,
  }));

  const showRaceSelectionError = raceTouched && !raceSelection;
  const showOtherRaceError =
    raceSelection === 'other' && otherRaceTouched && otherRaceText.trim() === '';
  const showOtherSubraceError =
    subraceSelection === 'other' &&
    otherSubraceTouched &&
    otherSubraceText.trim() === '';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (nameError) {
      return;
    }

    if (!raceSelection) {
      setRaceTouched(true);
      return;
    }

    if (raceSelection === 'other' && otherRaceText.trim() === '') {
      setRaceTouched(true);
      setOtherRaceTouched(true);
      return;
    }

    if (
      subraceSelection === 'other' &&
      raceSelection !== 'other' &&
      otherSubraceText.trim() === ''
    ) {
      setOtherSubraceTouched(true);
      return;
    }

    if (classArray.length === 0) {
      setFormError('At least one valid character class is required.');
      return;
    }

    setFormError('');

    console.log({
      charId,
      user_doc,
      race: raceSelection === 'other' ? otherRaceText : raceSelection,
      subrace: subraceSelection === 'other' ? otherSubraceText : subraceSelection === 'none' ? undefined : subraceSelection || undefined,
      name,
      class: classArray,
    });
  };

  return (
    <div>
      <h3>Character Entry</h3>
      <form noValidate onSubmit={handleSubmit}>
        <div style={{ padding: '8px', marginBottom: '5px' }}>
          <CharSheetTextField
            value={name}
            onChange={handleNameChange}
            onBlur={() => {
              setNameTouched(true);
              if (!name.trim()) {
                setNameError('Name is required.');
              }
            }}
            label="Name*"
            variant="outlined"
            fieldSize="large"
            error={!!nameError}
            helperText={nameError}
          />
        </div>
        <input type="hidden" name="charId" value={charId} />
        <input type="hidden" name="user_doc" value={user_doc} />
        <input
          type="hidden"
          name="race"
          value={raceSelection === 'other' ? otherRaceText : raceSelection}
        />
        {subraceSelection && subraceSelection !== 'none' && subraceSelection !== '' && (
          <input
            type="hidden"
            name="subrace"
            value={subraceSelection === 'other' ? otherSubraceText : subraceSelection}
          />
        )}
        <input type="hidden" name="class" value={JSON.stringify(classArray)} />
        <div
          className="raceDescription"
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start',
            marginTop: '20px',
            padding: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
            <CharSheetSelect
              value={raceSelection}
              onChange={handleRaceChange}
              onBlur={() => {
                setRaceTouched(true);
              }}
              label="Race*"
              fieldSize="medium"
              options={[...raceOptions, { value: 'other', label: 'Other' }]}
              error={showRaceSelectionError || showOtherRaceError}
              helperText={
                showRaceSelectionError
                  ? 'Please select a race.'
                  : showOtherRaceError
                  ? 'Enter a race name when Other is selected.'
                  : undefined
              }
            />
            {raceSelection === 'other' && (
              <CharSheetTextField
                value={otherRaceText}
                onChange={handleOtherRaceChange}
                onBlur={() => {
                  setOtherRaceTouched(true);
                }}
                label="Other Race Name*"
                variant="outlined"
                fieldSize="medium"
                error={showOtherRaceError}
                helperText={showOtherRaceError ? 'Enter a race name when Other is selected.' : undefined}
              />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
            {(subraceOptions.length > 0 || raceSelection === 'other') && (
              <CharSheetSelect
                value={subraceSelection}
                onChange={handleSubraceChange}
                onBlur={() => setOtherSubraceTouched(true)}
                label="Subrace"
                fieldSize="medium"
                options={[{ value: 'none', label: 'None' }, ...subraceOptions, { value: 'other', label: 'Other' }]}
                error={showOtherSubraceError}
                helperText={showOtherSubraceError ? 'Enter a subrace name when Other is selected.' : undefined}
              />
            )}
            {subraceSelection === 'other' && (
              <CharSheetTextField
                value={otherSubraceText}
                onChange={handleOtherSubraceChange}
                onBlur={() => setOtherSubraceTouched(true)}
                label="Other Subrace Name*"
                variant="outlined"
                fieldSize="medium"
                error={showOtherSubraceError}
                helperText={showOtherSubraceError ? 'Enter a subrace name when Other is selected.' : undefined}
              />
            )}
          </div>
        </div>
        {classDescriptions.map((entry, index) => {
          const showClassSelectionError = entry.touched && entry.classSelection === '';
          const showOtherClassError =
            entry.classSelection === 'other' && entry.otherTouched && entry.otherClassText.trim() === '';
          const showLevelWithoutClassError = entry.level.trim() !== '' && !entry.classSelection;
          const showOtherSubclassError =
            entry.subclass === 'other' && entry.otherSubclassTouched && entry.subclassOther.trim() === '';
          return (
            <Fragment key={`characterClass${index}`}>
              <div
                className="classDescription"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginTop: index === 0 ? '20px' : '6px',
                  padding: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
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
                    <CharSheetTextField
                      value={entry.level}
                      onChange={(event) => handleLevelChange(index, event)}
                      label="Level"
                      variant="outlined"
                      fieldSize="tiny"
                      type="number"
                      slotProps={{ input: { inputProps: { min: 1, max: 20 } } }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
                    <CharSheetSelect
                      value={entry.subclass}
                      onChange={(event) => handleSubclassChange(index, event)}
                      onBlur={() => setClassDescriptionValue(index, { subclassTouched: true })}
                      label="Subclass"
                      fieldSize="medium"
                      options={
                        entry.classSelection === 'other'
                          ? [{ value: 'none', label: 'None' }, { value: 'other', label: 'Other' }]
                          : entry.classSelection && entry.classSelection !== 'other'
                          ? (() => {
                              const selectedClass = Classes.find((c) => c.class_name === entry.classSelection);
                              const subclassOptions =
                                selectedClass?.subclasses?.map((sub) => ({
                                  value: sub,
                                  label: selectedClass.subclass_format
                                    ? selectedClass.subclass_format
                                        .replace('<subclass>', sub)
                                        .replace('<subclass_title>', selectedClass.subclass_title || '')
                                    : sub,
                                })) || [];
                              return [{ value: 'none', label: 'None' }, ...subclassOptions.sort((a, b) => a.label.localeCompare(b.label)), { value: 'other', label: 'Other' }];
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
        <div
          style={{
            marginTop: '6px',
            padding: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => duplicateClassDescription(classDescriptions.length - 1)}
            aria-label="Add another character class"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: '#666',
            }}
          >
            <AddIcon sx={{ width: 20, height: 20, strokeWidth: 2, color: '#fff' }} />
            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{'add another character class'}</span>
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CharEntry;