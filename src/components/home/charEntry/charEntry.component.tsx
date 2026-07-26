import { useCallback, useContext, useEffect, useMemo, useState, FormEvent } from 'react';
import { Button } from '@mui/material';
import CharacterIdentityFields from './fields/CharacterIdentityFields';
import CharacterRaceFields from './fields/CharacterRaceFields';
import CharacterClassFields from './fields/CharacterClassFields';
import CharacterCombatStatsFields from './fields/CharacterCombatStatsFields';
import CharacterTraitFields from './fields/CharacterTraitsFields';
import { AttackFieldErrors } from './fields/CharacterAttackFields';
import CharacterAbilitiesSection from './fields/CharacterAbilitiesSection';
import CharSheetVerticalTabs from '../../library/tabs/CharSheetVerticalTabs';

import {
  Abilities,
  Attack,
  BackgroundContextType,
  CharClassFormat,
  ClassDescription,
  Character,
  HitDie,
  Race,
  RaceAndClassContextType,
  Skill,
  SkillsContextType,
} from '../../../types/Characters.Types';
import {
  buildInitialSkills,
  CharacterEntryState,
  defaultAbilityValues,
  defaultSavingThrows,
  emptyAttack,
  emptyHitDie,
} from './charEntry.state';
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
  const skills: Skill[] = useMemo(() => Skills ?? [], [Skills]);
  const charId = 'someIdHere';
  const user_doc = 'eje';
  const [character, setCharacter] = useState<CharacterEntryState>({
    charId,
    user_doc,
    abilities: defaultAbilityValues(),
    savingThrows: defaultSavingThrows(),
    skills: buildInitialSkills(skills),
    hitDice: [emptyHitDie()],
    attacks: [emptyAttack()],
    proficiencies: [],
    languages: [],
  });
  const updateCharacter = useCallback((patch: Partial<CharacterEntryState>) => {
    setCharacter((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (skills.length === 0) {
      return;
    }

    setCharacter((prev) => {
      const existingSkillByKey = new Map(
        (prev.skills ?? []).map((skill) => [skill.key, skill]),
      );
      const nextSkills = skills.map((skill) => {
        const existingSkill = existingSkillByKey.get(skill.key);
        return {
          key: skill.key,
          display: skill.display,
          ability: skill.ability,
          proficient: existingSkill?.proficient ?? false,
          expertise: existingSkill?.expertise ?? false,
        };
      });
      const currentSkills = prev.skills ?? [];
      const skillsAreSame = currentSkills.length === nextSkills.length
        && nextSkills.every((skill, index) => {
          const currentSkill = currentSkills[index];
          return currentSkill?.key === skill.key
            && currentSkill.display === skill.display
            && currentSkill.ability === skill.ability
            && !!currentSkill.proficient === skill.proficient
            && !!currentSkill.expertise === skill.expertise;
        });

      return skillsAreSame ? prev : { ...prev, skills: nextSkills };
    });
  }, [skills]);
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
  const [formError, setFormError] = useState('');
  const [attackFormError, setAttackFormError] = useState('');
  const abilities = character.abilities ?? defaultAbilityValues();
  const [abilityErrors, setAbilityErrors] = useState<Record<string, boolean>>({});
  const [abilityFormError, setAbilityFormError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Derived values from character state
  const name = character.name ?? '';
  const xp = character.xp;
  const background = character.background ?? '';
  const ac = character.ac;
  const initiative = character.initiative;
  const speed = character.speed;
  const inspiration = character.inspiration;

  // Hit Dice state
  const hitDieSizes = ['6', '8', '10', '12'];
  const attackDamageSizes = ['4', '6', '8', '10', '12', '20'];
  const emptyAttackFieldErrors = (): AttackFieldErrors => ({
    name: false,
    attackBonus: false,
    damage: false,
    type: false,
  });
  const hitDice = character.hitDice ?? [emptyHitDie()];
  const attacks = character.attacks ?? [emptyAttack()];
  const [hitDiceTouched, setHitDiceTouched] = useState<boolean[]>([false]);
  const [attackFieldErrors, setAttackFieldErrors] = useState<AttackFieldErrors[]>([emptyAttackFieldErrors()]);

  const updateHitDice = (updater: (prev: HitDie[]) => HitDie[]) => {
    setCharacter((prev) => ({ ...prev, hitDice: updater(prev.hitDice ?? [emptyHitDie()]) }));
  };
  const updateAttacks = (updater: (prev: Attack[]) => Attack[]) => {
    setCharacter((prev) => ({ ...prev, attacks: updater(prev.attacks ?? [emptyAttack()]) }));
  };

  // Hit Dice handlers
  const handleHitDieQtyChange = (index: number, value: number | null) => {
    updateHitDice((prev) => prev.map((hd, i) => i === index ? { ...hd, qty: value ?? 0 } : hd));
  };
  const handleHitDieDieChange = (index: number, value: string | null) => {
    updateHitDice((prev) => prev.map((hd, i) => i === index ? { ...hd, die: value ? parseInt(value) : 0 } : hd));
  };
  const addHitDieRow = () => {
    updateHitDice((prev) => [...prev, emptyHitDie()]);
    setHitDiceTouched((prev) => [...prev, false]);
  };
  const setHitDieTouched = (index: number) => {
    setHitDiceTouched((prev) => prev.map((t, i) => i === index ? true : t));
  };
  const handleAttackNameChange = (index: number, value: string) => {
    updateAttacks((prev) => prev.map((attack, i) => i === index ? { ...attack, name: value } : attack));
    setAttackFieldErrors((prev) => prev.map((fieldErrors, i) => i === index ? { ...fieldErrors, name: false } : fieldErrors));
    if (attackFormError) setAttackFormError('');
  };
  const handleAttackBonusChange = (index: number, value: number | null) => {
    updateAttacks((prev) => prev.map((attack, i) => i === index ? { ...attack, attackBonus: value } : attack));
    setAttackFieldErrors((prev) => prev.map((fieldErrors, i) => i === index ? { ...fieldErrors, attackBonus: false } : fieldErrors));
    if (attackFormError) setAttackFormError('');
  };
  const handleAttackTypeChange = (index: number, value: string) => {
    updateAttacks((prev) => prev.map((attack, i) => i === index ? { ...attack, type: value } : attack));
    setAttackFieldErrors((prev) => prev.map((fieldErrors, i) => i === index ? { ...fieldErrors, type: false } : fieldErrors));
    if (attackFormError) setAttackFormError('');
  };
  const toNullableNumber = (value: string): number | null => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const handleAttackNormalRangeChange = (index: number, value: string) => {
    const parsedRange = toNullableNumber(value);
    updateAttacks((prev) => prev.map((attack, i) => i === index ? { ...attack, normalRange: parsedRange } : attack));
    if (attackFormError) setAttackFormError('');
  };
  const handleAttackLongRangeChange = (index: number, value: string) => {
    const parsedRange = toNullableNumber(value);
    updateAttacks((prev) => prev.map((attack, i) => i === index ? { ...attack, longRange: parsedRange } : attack));
    if (attackFormError) setAttackFormError('');
  };
  const parseAttackDamage = (damage: string): { qty: number | null; size: string | null; mod: number | null } => {
    const match = damage.match(/^(\d*)d(\d*)([+-]\d+)?$/);
    if (!match) {
      return { qty: null, size: null, mod: null };
    }
    return {
      qty: match[1] ? parseInt(match[1], 10) : null,
      size: match[2] ? match[2] : null,
      mod: match[3] ? parseInt(match[3], 10) : null,
    };
  };
  const buildAttackDamage = (qty: number | null, size: string | null, mod: number | null): string => {
    const hasQty = qty !== null && qty > 0;
    const cleanedSize = size && size.trim().length > 0 ? size.trim() : null;
    const hasSize = cleanedSize !== null;
    const hasMod = mod !== null && mod !== 0;

    if (!hasQty && !hasSize && !hasMod) {
      return '';
    }

    const qtyPart = hasQty ? String(Math.floor(qty as number)) : '';
    const modValue = hasMod ? Math.trunc(mod as number) : null;
    const modPart = modValue === null ? '' : `${modValue > 0 ? '+' : ''}${modValue}`;
    let sizePart = '';
    if (hasSize) {
      const normalizedSize = parseInt(cleanedSize as string, 10);
      if (Number.isNaN(normalizedSize)) {
        return `${qtyPart}d${modPart}`;
      }
      sizePart = String(normalizedSize);
    }

    return `${qtyPart}d${sizePart}${modPart}`;
  };
  const formatAttackDamageForSubmit = (damage: string): string => {
    const parsed = parseAttackDamage(damage);
    if (parsed.qty === null || parsed.size === null) {
      return '';
    }

    const base = `${parsed.qty}d${parsed.size}`;
    if (parsed.mod === null) {
      return base;
    }

    return `${base}${parsed.mod < 1 ? '' : '+'}${parsed.mod}`;
  };
  const handleAttackDamageQtyChange = (index: number, value: number | null) => {
    updateAttacks((prev) => prev.map((attack, i) => {
      if (i !== index) {
        return attack;
      }
      const parsed = parseAttackDamage(attack.damage);
      return { ...attack, damage: buildAttackDamage(value, parsed.size, parsed.mod) };
    }));
    setAttackFieldErrors((prev) => prev.map((fieldErrors, i) => i === index ? { ...fieldErrors, damage: false } : fieldErrors));
    if (attackFormError) setAttackFormError('');
  };
  const handleAttackDamageSizeChange = (index: number, value: string | null) => {
    updateAttacks((prev) => prev.map((attack, i) => {
      if (i !== index) {
        return attack;
      }
      const parsed = parseAttackDamage(attack.damage);
      return { ...attack, damage: buildAttackDamage(parsed.qty, value, parsed.mod) };
    }));
    setAttackFieldErrors((prev) => prev.map((fieldErrors, i) => i === index ? { ...fieldErrors, damage: false } : fieldErrors));
    if (attackFormError) setAttackFormError('');
  };
  const handleAttackDamageModChange = (index: number, value: number | null) => {
    updateAttacks((prev) => prev.map((attack, i) => {
      if (i !== index) {
        return attack;
      }
      const parsed = parseAttackDamage(attack.damage);
      return { ...attack, damage: buildAttackDamage(parsed.qty, parsed.size, value) };
    }));
    setAttackFieldErrors((prev) => prev.map((fieldErrors, i) => i === index ? { ...fieldErrors, damage: false } : fieldErrors));
    if (attackFormError) setAttackFormError('');
  };
  const addAttackRow = () => {
    updateAttacks((prev) => [...prev, emptyAttack()]);
    setAttackFieldErrors((prev) => [...prev, emptyAttackFieldErrors()]);
    if (attackFormError) setAttackFormError('');
  };

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

  const handleLevelChange = (
    index: number,
    value: number | null,
  ) => {
    setClassDescriptionValue(index, { level: value });
  };

  const getAbilityModifier = (score: number | null | undefined): number | null => {
    if (typeof score !== 'number' || Number.isNaN(score)) return null;
    return Math.floor((score - 10) / 2);
  };

  const abilityModifiers: { [K in keyof Abilities]: number | null } = {
    str: getAbilityModifier(abilities.str),
    dex: getAbilityModifier(abilities.dex),
    con: getAbilityModifier(abilities.con),
    int: getAbilityModifier(abilities.int),
    wis: getAbilityModifier(abilities.wis),
    cha: getAbilityModifier(abilities.cha),
  };

  const handleAbilityChange = (ability: keyof Abilities, value: number | null) => {
    const nextAbilities = { ...abilities, [ability]: value };
    updateCharacter({ abilities: nextAbilities });
    setAbilityErrors((prev) => ({ ...prev, [ability]: false }));
    if (abilityFormError) {
      setAbilityFormError('');
    }
  };

  const validateAbilities = () => {
    const abilityKeys: (keyof Abilities)[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const abilityValues = abilityKeys.map((key) => abilities[key]);
    const allAbilitiesBlank = abilityValues.every((value) => value === null || value === undefined);
    const allAbilitiesInRange = abilityValues.every(
      (value) => typeof value === 'number' && value >= 1 && value <= 20,
    );

    if (!allAbilitiesBlank && !allAbilitiesInRange) {
      setAbilityFormError(
        'Either leave all abilities blank or set each ability to a value between 1 and 20.',
      );
      const errs: Record<string, boolean> = {};
      abilityKeys.forEach((key) => {
        const value = abilities[key];
        errs[String(key)] = value === null || value === undefined;
      });
      setAbilityErrors(errs);
      return false;
    }

    setAbilityFormError('');
    setAbilityErrors({});
    return allAbilitiesBlank ? null : (abilities as Abilities);
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
  const totalLevel = classDescriptions.reduce((sum, cd) => sum + (cd.level ?? 1), 0);
  const proficiencyBonus = Math.floor((totalLevel - 1) / 4) + 2;

  const showRaceSelectionError = raceTouched && !raceSelectionState;
  const showOtherRaceError =
    raceSelectionState === 'other' && otherRaceTouched && otherRaceText.trim() === '';
  const showOtherSubraceError =
    subraceSelection === 'other' &&
    otherSubraceTouched &&
    otherSubraceText.trim() === '';

  const scrollFirstInvalidFieldIntoView = (formElement: HTMLFormElement) => {
    const scheduleScroll =
      typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame
        : (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0);

    scheduleScroll(() => {
      const firstInvalidElement = formElement.querySelector<HTMLElement>(
        '[aria-invalid="true"], .MuiFormHelperText-root.Mui-error, .MuiFormControl-root.Mui-error',
      );

      firstInvalidElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    });
  };

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

    const abilityValidationResult = validateAbilities();
    if (abilityValidationResult === false) {
      hasError = true;
    }

    if (hasError) {
      scrollFirstInvalidFieldIntoView(event.currentTarget);
      return;
    }

    setFormError('');

    // Build attacks with final formatting
    const builtAttacks = attacks.map((attack) => {
      const nameValue = attack.name.trim();
      const typeValue = attack.type.trim();

      return {
        name: nameValue,
        attackBonus: attack.attackBonus,
        damage: formatAttackDamageForSubmit(attack.damage),
        normalRange: attack.normalRange,
        longRange: attack.longRange,
        type: typeValue,
      };
    });
    const attackRowsWithInput = builtAttacks.filter(
      (attack) =>
        attack.name.length > 0
        || attack.attackBonus !== null
        || attack.damage.length > 0
        || attack.type.length > 0
        || attack.normalRange !== null
        || attack.longRange !== null,
    );
    const hasInvalidAttackRow = attackRowsWithInput.some(
      (attack) =>
        attack.name.length === 0
        || attack.attackBonus === null
        || attack.damage.length === 0
        || attack.type.length === 0,
    );
    if (hasInvalidAttackRow) {
      const nextAttackFieldErrors = builtAttacks.map((attack) => {
        const rowHasInput =
          attack.name.length > 0
          || attack.attackBonus !== null
          || attack.damage.length > 0
          || attack.type.length > 0
          || attack.normalRange !== null
          || attack.longRange !== null;
        if (!rowHasInput) {
          return emptyAttackFieldErrors();
        }

        return {
          name: attack.name.length === 0,
          attackBonus: attack.attackBonus === null,
          damage: attack.damage.length === 0,
          type: attack.type.length === 0,
        };
      });
      setAttackFieldErrors(nextAttackFieldErrors);
      setAttackFormError('Each attack row must include Name, Atk Mod, Damage, and Dmg Type.');
      scrollFirstInvalidFieldIntoView(event.currentTarget);
      return;
    }
    setAttackFieldErrors(attacks.map(() => emptyAttackFieldErrors()));
    setAttackFormError('');

    // Build the submitted character from state with final transformations
    const filteredHitDice = validHitDice.filter(hd => hd.qty > 0 && hd.die > 0);
    const submittedCharacter: Partial<Character> = {
      ...character,
      name: name.trim() || undefined,
      race: raceSelectionState === 'other'
        ? otherRaceText.trim() || undefined
        : raceSelectionState || undefined,
      subrace: subraceSelection === 'other'
        ? otherSubraceText.trim() || undefined
        : subraceSelection === 'none'
          ? undefined
          : subraceSelection || undefined,
      class: classArray.length > 0
        ? classArray as unknown as Character['class']
        : undefined,
      hitDice: filteredHitDice.length > 0 ? filteredHitDice : undefined,
      attacks: attackRowsWithInput.length > 0 ? attackRowsWithInput : undefined,
      abilities: abilityValidationResult && abilityValidationResult !== null
        ? abilityValidationResult
        : undefined,
      proficiencies: (character.proficiencies?.length ?? 0) > 0 ? character.proficiencies : undefined,
      languages: (character.languages?.length ?? 0) > 0 ? character.languages : undefined,
      background: background && background.trim() ? background.trim() : undefined,
    };

    // Remove undefined fields
    (Object.keys(submittedCharacter) as (keyof Character)[]).forEach((key) => {
      if (submittedCharacter[key] === undefined) {
        delete submittedCharacter[key];
      }
    });

    console.log(submittedCharacter);
  };

  return (
    <div>
      <h3>Character Entry</h3>
      <form noValidate onSubmit={handleSubmit}>
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
        <input type="hidden" name="xp" value={xp ?? ''} />
        <input type="hidden" name="ac" value={ac ?? ''} />
        <input type="hidden" name="initiative" value={initiative ?? ''} />
        <input type="hidden" name="speed" value={speed ?? ''} />
        <input type="hidden" name="inspiration" value={inspiration ?? ''} />
        <CharSheetVerticalTabs
          value={activeTab}
          onChange={setActiveTab}
          ariaLabel="Character entry sections"
          idPrefix="char-entry-tabs"
          tabs={[
            {
              label: 'General',
              content: (
                <>
                  <CharacterIdentityFields
                    name={name}
                    xp={xp}
                    background={background}
                    updateCharacter={updateCharacter}
                    nameTouched={nameTouched}
                    setNameTouched={setNameTouched}
                    nameError={nameError}
                    setNameError={setNameError}
                    backgroundOptions={backgroundOptions}
                  />

                  <CharacterRaceFields
                    raceSelection={raceSelectionState}
                    setRaceSelection={setRaceSelection}
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
                    handleLevelChange={handleLevelChange}
                    duplicateClassDescription={duplicateClassDescription}
                    classOptions={classOptions}
                    Classes={Classes}
                    formError={formError}
                  />
                </>
              ),
            },
            {
              label: 'Abilities',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <CharacterAbilitiesSection
                    abilities={abilities}
                    savingThrows={character.savingThrows ?? defaultSavingThrows()}
                    characterSkills={character.skills ?? []}
                    abilityModifiers={abilityModifiers}
                    onAbilityChange={handleAbilityChange}
                    skills={skills}
                    proficiencyBonus={proficiencyBonus}
                    abilityErrors={abilityErrors}
                    formError={abilityFormError}
                    updateCharacter={updateCharacter}
                  />
                </div>
              ),
            },
            {
              label: 'Combat',
              content: (
                <CharacterCombatStatsFields
                  ac={ac}
                  initiative={initiative}
                  speed={speed}
                  inspiration={inspiration}
                  hitDice={hitDice}
                  attacks={attacks}
                  updateCharacter={updateCharacter}
                  hitDiceTouched={hitDiceTouched}
                  handleHitDieQtyChange={handleHitDieQtyChange}
                  handleHitDieDieChange={handleHitDieDieChange}
                  addHitDieRow={addHitDieRow}
                  setHitDieTouched={setHitDieTouched}
                  hitDieSizes={hitDieSizes}
                  handleAttackNameChange={handleAttackNameChange}
                  handleAttackBonusChange={handleAttackBonusChange}
                  handleAttackTypeChange={handleAttackTypeChange}
                  handleAttackNormalRangeChange={handleAttackNormalRangeChange}
                  handleAttackLongRangeChange={handleAttackLongRangeChange}
                  handleAttackDamageQtyChange={handleAttackDamageQtyChange}
                  handleAttackDamageSizeChange={handleAttackDamageSizeChange}
                  handleAttackDamageModChange={handleAttackDamageModChange}
                  attackFieldErrors={attackFieldErrors}
                  attackFormError={attackFormError}
                  attackDamageSizes={attackDamageSizes}
                  addAttackRow={addAttackRow}
                />
              ),
            },
            {
              label: 'Traits',
              content: (
                // racialTraits={racialTraits}
                // setRacialTraits={setRacialTraits}
                // classFeatures={classFeatures}
                // setClassFeatures={setClassFeatures}
                <CharacterTraitFields
                  proficiencies={character.proficiencies ?? []}
                  languages={character.languages ?? []}
                  updateCharacter={updateCharacter}
                />
              ),
            },
          ]}
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
