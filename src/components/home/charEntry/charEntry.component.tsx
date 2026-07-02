import { useContext, useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { Button } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CharacterIdentityFields from './fields/CharacterIdentityFields';
import CharacterRaceFields from './fields/CharacterRaceFields';
import CharacterClassFields from './fields/CharacterClassFields';
import CharacterCombatStatsFields from './fields/CharacterCombatStatsFields';
import CharacterAttributeFields from './fields/CharacterAttributeFields';
import CharacterSkillFields, { CharacterSkillFieldsHandle } from './fields/CharacterSkillFields';

import { Attributes, ClassDescription, RaceAndClassContextType, BackgroundContextType, Race, CharClassFormat, HitDie, Character, Skill, SkillsContextType } from '../../../types/Characters.Types';
import { RaceClassContext } from '../../../contexts/racesAndClasses.context';
import { BackgroundsContext, SkillsContext } from '../../../contexts/characterOptions.context.tsx';

const emptyClassDescription = (): ClassDescription => ({
  classSelection: '',
  otherClassText: '',
  level: null,
  subclass: '',
  subclassOther: '',
  touched: false,
  otherTouched: false,
  subclassTouched: false,
  otherSubclassTouched: false,
});

// Removed unused styles object after refactor

const CharEntry = () => {
  const { Classes, Races } = useContext<RaceAndClassContextType>(RaceClassContext);
  const { Backgrounds } = useContext<BackgroundContextType>(BackgroundsContext);
  const { Skills } = useContext<SkillsContextType>(SkillsContext);
  const skills: Skill[] = Skills ?? [];
  const charId = 'someIdHere';
  const user_doc = 'eje';
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [nameError, setNameError] = useState('');
  const [raceSelectionState, setRaceSelectionState] = useState('');
  // Custom setter for raceSelection to auto-set subraceSelection
  const setRaceSelection = (value: string) => {
    setRaceSelectionState(value);
    if (value === 'other') {
      setSubraceSelection('other');
    }
  };
  const [raceTouched, setRaceTouched] = useState(false);
  const [otherRaceText, setOtherRaceText] = useState('');
  const [otherRaceTouched, setOtherRaceTouched] = useState(false);
  const [subraceSelection, setSubraceSelection] = useState('');
  const [otherSubraceText, setOtherSubraceText] = useState('');
  const [otherSubraceTouched, setOtherSubraceTouched] = useState(false);
  const [classDescriptions, setClassDescriptions] = useState<
    ClassDescription[]
  >([emptyClassDescription()]);
  const [totalLevel, setTotalLevel] = useState<number>(() =>
    classDescriptions.reduce((sum, cd) => sum + (cd.level ?? 1), 0),
  );
  const [proficiencyBonus, setProficiencyBonus] = useState<number>(
    Math.floor((totalLevel - 1) / 4) + 2,
  );
  const [background, setBackground] = useState('');
  const [ac, setAc] = useState<number | null>(null);
  const [initiative, setInitiative] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [inspiration, setInspiration] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [attributes, setAttributes] = useState<{ [K in keyof Attributes]: number | null }>({
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  });
  const [attributeErrors, setAttributeErrors] = useState<Record<string, boolean>>({});
  const [attributeFormError, setAttributeFormError] = useState('');

  // Hit Dice state
  const hitDieSizes = ['6', '8', '10', '12'];
  const emptyHitDie = (): HitDie => ({ qty: 0, die: 0 });
  const [hitDice, setHitDice] = useState<HitDie[]>([emptyHitDie()]);
  const [hitDiceTouched, setHitDiceTouched] = useState<boolean[]>([false]);
  // Hit Dice handlers
  const handleHitDieQtyChange = (index: number, value: number | null) => {
    setHitDice((prev) => prev.map((hd, i) => i === index ? { ...hd, qty: value ?? 0 } : hd));
  };
  const handleHitDieDieChange = (index: number, value: string | null) => {
    setHitDice((prev) => prev.map((hd, i) => i === index ? { ...hd, die: value ? parseInt(value) : 0 } : hd));
  };
  const addHitDieRow = () => {
    setHitDice((prev) => [...prev, emptyHitDie()]);
    setHitDiceTouched((prev) => [...prev, false]);
  };
  const setHitDieTouched = (index: number) => {
    setHitDiceTouched((prev) => prev.map((t, i) => i === index ? true : t));
  };

  const skillFieldsRef = useRef<CharacterSkillFieldsHandle>(null);

  const classOptions = Classes.map((classItem: CharClassFormat) => ({
    value: classItem.class_name,
    label: classItem.class_name,
  })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));

  const backgroundOptions = Backgrounds.map((bg: { bg_name: string }) => ({
    value: bg.bg_name,
    label: bg.bg_name,
  })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));




  // Race and Subrace options for CharacterRaceFields
  const raceOptions = Races.map((raceItem: Race) => ({
    value: raceItem.race_name,
    label: raceItem.race_name,
  })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));

  const selectedRace = Races.find((raceItem: Race) => raceItem.race_name === raceSelectionState);
  const subraceOptions = selectedRace?.subraces?.map((subrace: string) => ({ value: subrace, label: subrace })) || [];

  const setClassDescriptionValue = (
    index: number,
    values: Partial<{
      classSelection: string;
      otherClassText: string;
      level: number | null;
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

  const handleClassChange = (index: number, event: SelectChangeEvent<unknown>) => {
    const value = String(event.target.value);
    if (value === 'other') {
      setClassDescriptionValue(index, { classSelection: value, subclass: 'other', touched: true });
    } else {
      setClassDescriptionValue(index, { classSelection: value, subclass: '', touched: true });
    }
  };

  const handleOtherClassChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setClassDescriptionValue(index, { otherClassText: event.target.value, otherTouched: true });
  };

  const handleSubclassChange = (index: number, event: SelectChangeEvent<unknown>) => {
    const value = String(event.target.value);
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
    value: number | null,
  ) => {
    setClassDescriptionValue(index, { level: value });
  };

  const getAttributeModifier = (score: number | null | undefined): number | null => {
    if (typeof score !== 'number' || Number.isNaN(score)) return null;
    return Math.floor((score - 10) / 2);
  };

  const attributeModifiers: { [K in keyof Attributes]: number | null } = {
    str: getAttributeModifier(attributes.str),
    dex: getAttributeModifier(attributes.dex),
    con: getAttributeModifier(attributes.con),
    int: getAttributeModifier(attributes.int),
    wis: getAttributeModifier(attributes.wis),
    cha: getAttributeModifier(attributes.cha),
  };

  const handleAttributeChange = (attribute: keyof Attributes, value: number | null) => {
    setAttributes((prev) => ({ ...prev, [attribute]: value }));
    setAttributeErrors((prev) => ({ ...prev, [attribute]: false }));
    if (attributeFormError) {
      setAttributeFormError('');
    }
  };

  const validateAttributes = () => {
    const attrKeys: (keyof Attributes)[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const attrValues = attrKeys.map((key) => attributes[key]);
    const allAttrsBlank = attrValues.every((value) => value === null || value === undefined);
    const allAttrsInRange = attrValues.every(
      (value) => typeof value === 'number' && value >= 1 && value <= 20,
    );

    if (!allAttrsBlank && !allAttrsInRange) {
      setAttributeFormError(
        'Either leave all attributes blank or set each attribute to a value between 1 and 20.',
      );
      const errs: Record<string, boolean> = {};
      attrKeys.forEach((key) => {
        const value = attributes[key];
        errs[String(key)] = value === null || value === undefined;
      });
      setAttributeErrors(errs);
      return false;
    }

    setAttributeFormError('');
    setAttributeErrors({});
    return allAttrsBlank ? null : (attributes as Attributes);
  };

  const duplicateClassDescription = (index: number) => {
    setClassDescriptions((current) => {
      const next = [...current];
      next.splice(index + 1, 0, emptyClassDescription());
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
    if (entry.level !== null && !entry.classSelection) {
      return false;
    }
    if (entry.subclass === 'other' && entry.classSelection !== 'other' && entry.subclassOther.trim().length === 0) {
      return false;
    }
    return true;
  });

  const classArray = validClassDescriptions.map((entry) => ({
    name: entry.classSelection === 'other' ? entry.otherClassText : entry.classSelection,
    level: entry.level ?? undefined,
    subclass: entry.subclass === 'other' ? entry.subclassOther : entry.subclass === 'none' ? undefined : entry.subclass || undefined,
  }));

  // Update totalLevel whenever classDescriptions change (use 1 if level is blank)
  useEffect(() => {
    const sum = classDescriptions.reduce((acc, cd) => acc + (cd.level ?? 1), 0);
    console.log('totalLevel', sum);
    setTotalLevel(sum);
  }, [classDescriptions]);

  // Update proficiency bonus whenever totalLevel changes
  useEffect(() => {
    const pb = Math.floor((totalLevel - 1) / 4) + 2;
    console.log('proficiencyBonus', pb);
    setProficiencyBonus(pb);
  }, [totalLevel]);

  const showRaceSelectionError = raceTouched && !raceSelectionState;
  const showOtherRaceError =
    raceSelectionState === 'other' && otherRaceTouched && otherRaceText.trim() === '';
  const showOtherSubraceError =
    subraceSelection === 'other' &&
    otherSubraceTouched &&
    otherSubraceText.trim() === '';

  // Hit Dice validation: each row is valid if both fields are blank or both are filled
  const validHitDice = hitDice.filter((hd) => (hd.qty === 0 && hd.die === 0) || (hd.qty > 0 && hitDieSizes.includes(hd.die.toString())));
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasError = false;

    // Name required
    if (!name.trim()) {
      setNameTouched(true);
      setNameError('Name is required.');
      hasError = true;
    } else if (nameError) {
      hasError = true;
    }

    // Race required
    if (!raceSelectionState) {
      setRaceTouched(true);
      hasError = true;
    }
    if (raceSelectionState === 'other' && otherRaceText.trim() === '') {
      setRaceTouched(true);
      setOtherRaceTouched(true);
      hasError = true;
    }
    if (
      subraceSelection === 'other' &&
      raceSelectionState !== 'other' &&
      otherSubraceText.trim() === ''
    ) {
      setOtherSubraceTouched(true);
      hasError = true;
    }

    // Class required
    if (classArray.length === 0) {
      setFormError('At least one valid character class is required.');
      // Mark all class fields as touched to show errors
      setClassDescriptions((current) =>
        current.map((item) => ({ ...item, touched: true, otherTouched: true, subclassTouched: true, otherSubclassTouched: true }))
      );
      hasError = true;
    } else {
      setFormError('');
    }

    // Hit Dice validation
    if (hitDice.length > 0 && hitDice.some((hd) => !((hd.qty === 0 && hd.die === 0) || (hd.qty > 0 && hitDieSizes.includes(hd.die.toString()))))) {
      setFormError('Each Hit Die row must have both fields blank or both filled.');
      hasError = true;
    }

    const attributeValidationResult = validateAttributes();
    if (attributeValidationResult === false) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setFormError('');

    // Build a Character-like object with only valid (non-empty, non-undefined) fields
    const character: Partial<Character> = {};
    if (charId) character.charId = charId;
    if (user_doc) character.user_doc = user_doc;
    if (name && name.trim()) character.name = name.trim();
    if (raceSelectionState && (raceSelectionState !== 'other' || otherRaceText.trim())) {
      character.race = raceSelectionState === 'other' ? otherRaceText.trim() : raceSelectionState;
    }
    const subraceValue = subraceSelection === 'other' ? otherSubraceText.trim() : subraceSelection === 'none' ? undefined : subraceSelection || undefined;
    if (subraceValue) character.subrace = subraceValue;
    if (classArray && classArray.length > 0) {
      character.class = classArray as unknown as Character['class'];
    }
    // Only attach hitDice with qty > 0 and die > 0
    const filteredHitDice = validHitDice.filter(hd => hd.qty > 0 && hd.die > 0);
    if (filteredHitDice.length > 0) character.hitDice = filteredHitDice;
    if (background && background.trim()) character.background = background.trim();
    if (typeof ac === 'number') character.ac = ac;
    if (typeof initiative === 'number') character.initiative = initiative;
    if (typeof speed === 'number') character.speed = speed;
    if (typeof inspiration === 'number') character.inspiration = inspiration;
    if (attributeValidationResult && attributeValidationResult !== null) {
      character.attributes = attributeValidationResult;
    }

    const skillStates = skillFieldsRef.current?.getSkillStates() ?? {};
    character.skills = skills.map((skill) => ({
      key: skill.key,
      display: skill.display,
      attribute: skill.attribute,
      proficient: skillStates[skill.key]?.proficient ?? false,
      specialized: skillStates[skill.key]?.specialized ?? false,
    }));

    console.log(character);
  };

  return (
    <div>
      <h3>Character Entry</h3>
      <form noValidate onSubmit={handleSubmit}>
        <CharacterIdentityFields
          name={name}
          setName={setName}
          nameTouched={nameTouched}
          setNameTouched={setNameTouched}
          nameError={nameError}
          setNameError={setNameError}
          background={background}
          setBackground={setBackground}
          backgroundOptions={backgroundOptions}
        />

        
        <input type="hidden" name="charId" value={charId} />
        <input type="hidden" name="user_doc" value={user_doc} />
        <input
          type="hidden"
          name="race"
          value={raceSelectionState === 'other' ? otherRaceText : raceSelectionState}
        />
        {subraceSelection && subraceSelection !== 'none' && subraceSelection !== '' && (
          <input
            type="hidden"
            name="subrace"
            value={subraceSelection === 'other' ? otherSubraceText : subraceSelection}
          />
        )}
        <input type="hidden" name="class" value={JSON.stringify(classArray)} />
        <input type="hidden" name="background" value={background} />
        <input type="hidden" name="ac" value={ac ?? ''} />
        <input type="hidden" name="initiative" value={initiative ?? ''} />
        <input type="hidden" name="speed" value={speed ?? ''} />
        <input type="hidden" name="inspiration" value={inspiration ?? ''} />
        <CharacterRaceFields
          raceSelection={raceSelectionState}
          setRaceSelection={setRaceSelection}
          raceTouched={raceTouched}
          setRaceTouched={setRaceTouched}
          otherRaceText={otherRaceText}
          setOtherRaceText={setOtherRaceText}
          otherRaceTouched={otherRaceTouched}
          setOtherRaceTouched={setOtherRaceTouched}
          subraceSelection={subraceSelection}
          setSubraceSelection={setSubraceSelection}
          otherSubraceText={otherSubraceText}
          setOtherSubraceText={setOtherSubraceText}
          otherSubraceTouched={otherSubraceTouched}
          setOtherSubraceTouched={setOtherSubraceTouched}
          raceOptions={raceOptions}
          subraceOptions={subraceOptions}
          showRaceSelectionError={showRaceSelectionError}
          showOtherRaceError={showOtherRaceError}
          showOtherSubraceError={showOtherSubraceError}
        />
        <CharacterClassFields
          classDescriptions={classDescriptions}
          setClassDescriptionValue={setClassDescriptionValue}
          handleClassChange={handleClassChange}
          handleOtherClassChange={handleOtherClassChange}
          handleSubclassChange={handleSubclassChange}
          handleOtherSubclassChange={handleOtherSubclassChange}
          handleLevelChange={handleLevelChange}
          duplicateClassDescription={duplicateClassDescription}
          classOptions={classOptions}
          Classes={Classes}
          formError={formError}
        />
        <CharacterCombatStatsFields
          ac={ac}
          setAc={setAc}
          initiative={initiative}
          setInitiative={setInitiative}
          speed={speed}
          setSpeed={setSpeed}
          inspiration={inspiration}
          setInspiration={setInspiration}
          hitDice={hitDice}
          hitDiceTouched={hitDiceTouched}
          handleHitDieQtyChange={handleHitDieQtyChange}
          handleHitDieDieChange={handleHitDieDieChange}
          addHitDieRow={addHitDieRow}
          setHitDieTouched={setHitDieTouched}
          hitDieSizes={hitDieSizes}
        />

        <CharacterAttributeFields
          attributes={attributes}
          modifiers={attributeModifiers}
          onAttributeChange={handleAttributeChange}
          attributeErrors={attributeErrors}
          formError={attributeFormError}
        />

        <CharacterSkillFields
          ref={skillFieldsRef}
          skills={skills}
          attributeModifiers={attributeModifiers}
          proficiencyBonus={proficiencyBonus}
        />

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
