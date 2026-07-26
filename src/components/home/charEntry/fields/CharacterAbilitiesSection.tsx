import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import AbilityField from './AbilityField';
import CharSheetCheckboxes from '../../../library/checkboxes/CharSheetCheckboxes';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import { Abilities, SavingThrows, Skill } from '../../../../types/Characters.Types';
import { CharacterEntryState } from '../charEntry.state';
import {
  ABILITY_LABELS,
  ABILITY_ORDER,
  AbilityValues,
  applySkillSelectionRules,
  getSaveCheckboxKey,
  getSaveModifier,
  getSkillExpertiseKey,
  getSkillModifier,
  getSkillProficientKey,
  groupSkillsByAbility,
} from './abilitiesTab.utils';
import { borderlessModifierSx } from './characterFieldStyles';

interface CharacterAbilitiesSectionProps {
  abilities: AbilityValues;
  savingThrows: SavingThrows;
  characterSkills: Skill[];
  abilityModifiers: AbilityValues;
  onAbilityChange: (ability: keyof Abilities, value: number | null) => void;
  skills: Skill[];
  proficiencyBonus: number;
  abilityErrors?: Record<string, boolean>;
  formError?: string;
  updateCharacter: (patch: Partial<CharacterEntryState>) => void;
}

const styles: Record<string, CSSProperties> = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '15px',
  },
  abilityBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  columns: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: 50,
    rowGap: 20,
  },
  leftColumn: {
    flex: '0 0 auto',
    width: 'fit-content',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flex: '1 1 280px',
    minWidth: '280px',
  },
  skillRow: {
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  saveRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  emptySkillsText: {
    color: '#aaa',
    fontSize: '0.9rem',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: '0.875rem',
  },
};

const hiddenLabelSx = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  p: 0,
  m: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const disabledModifierSlotProps = {
  input: {
    style: {
      color: '#ccc',
      WebkitTextFillColor: '#ccc',
      opacity: 1,
      textAlign: 'center' as const,
    },
  },
  inputLabel: {
    style: {
      color: '#ccc',
      whiteSpace: 'pre-line' as const,
      textAlign: 'left' as const,
      lineHeight: 1.1,
    },
  },
};

const CharacterAbilitiesSection = ({
  abilities,
  savingThrows,
  characterSkills,
  abilityModifiers,
  onAbilityChange,
  skills,
  proficiencyBonus,
  abilityErrors = {},
  formError = '',
  updateCharacter,
}: CharacterAbilitiesSectionProps) => {
  const groupedSkills = useMemo(() => groupSkillsByAbility(skills), [skills]);
  const skillLabelMinWidth = '12ch';

  const derivedSaveValues = useMemo(() => {
    const out: Record<string, boolean> = {};
    ABILITY_ORDER.forEach((ability) => {
      out[getSaveCheckboxKey(ability)] = !!savingThrows?.[ability];
    });
    return out;
  }, [savingThrows]);

  const derivedSkillValues = useMemo(() => {
    const out: Record<string, boolean> = {};
    skills.forEach((skill) => {
      const stored = characterSkills.find((entry) => entry.key === skill.key);
      out[getSkillProficientKey(skill.key)] = !!stored?.proficient;
      out[getSkillExpertiseKey(skill.key)] = !!stored?.expertise;
    });
    return out;
  }, [characterSkills, skills]);

  const [localSaveValues, setLocalSaveValues] = useState<Record<string, boolean> | null>(null);
  const [localSkillValues, setLocalSkillValues] = useState<Record<string, boolean> | null>(null);
  const saveValues = localSaveValues ?? derivedSaveValues;
  const skillValues = localSkillValues ?? derivedSkillValues;
  const previousSkillValuesRef = useRef<Record<string, boolean>>(skillValues);

  useEffect(() => {
    setLocalSaveValues(null);
  }, [derivedSaveValues]);

  useEffect(() => {
    setLocalSkillValues(null);
    previousSkillValuesRef.current = derivedSkillValues;
  }, [derivedSkillValues]);

  const handleSaveChange = (newValues: Record<string, boolean>) => {
    const saveStates = {} as SavingThrows;
    ABILITY_ORDER.forEach((ability) => {
      saveStates[ability] = newValues[getSaveCheckboxKey(ability)] ?? false;
    });
    setLocalSaveValues(newValues);
    updateCharacter({ savingThrows: saveStates });
  };

  const handleSkillChange = (newValues: Record<string, boolean>) => {
    const constrainedValues = applySkillSelectionRules(
      previousSkillValuesRef.current,
      newValues,
      skills,
    );

    previousSkillValuesRef.current = constrainedValues;
    setLocalSkillValues(constrainedValues);
    const updatedSkills: Skill[] = skills.map((skill) => ({
      key: skill.key,
      display: skill.display,
      ability: skill.ability,
      proficient: constrainedValues[getSkillProficientKey(skill.key)] ?? false,
      expertise: constrainedValues[getSkillExpertiseKey(skill.key)] ?? false,
    }));
    updateCharacter({ skills: updatedSkills });
  };

  return (
    <div style={styles.section}>
      <h3>Abilities</h3>

      {ABILITY_ORDER.map((ability) => {
        const abilityLabel = ABILITY_LABELS[ability];
        const proficientSave = saveValues[getSaveCheckboxKey(ability)] ?? !!savingThrows?.[ability];
        const displayedSaveModifier = getSaveModifier(
          abilityModifiers[ability],
          proficientSave,
          proficiencyBonus,
        );
        const skillsForAbility = groupedSkills[ability];

        return (
          <section key={ability} style={styles.abilityBlock}>
            <h4>{abilityLabel}</h4>

            <div style={styles.columns}>
              <div style={styles.leftColumn}>
                <AbilityField
                  ability={ability}
                  attrLabel={abilityLabel}
                  value={abilities[ability]}
                  modifier={abilityModifiers[ability]}
                  setAbility={onAbilityChange}
                  error={!!abilityErrors[ability]}
                  helperText={
                    abilityErrors[ability]
                      ? 'Required when any ability provided (1-20)'
                      : undefined
                  }
                  layout="vertical"
                  showAttrLabel={false}
                />
              </div>

              <div style={styles.rightColumn}>
                <div style={styles.saveRow}>
                  <CharSheetCheckboxes
                    id={ability}
                    label={`${abilityLabel} Saving Throw`}
                    labelSx={hiddenLabelSx}
                    boxes={[{
                      label: 'proficient',
                      checked: proficientSave,
                      ariaLabel: `${abilityLabel} saving throw proficiency`,
                      visualLabel: (
                        <span style={{ display: 'inline-block', lineHeight: 1.1 }}>
                          Save
                          <br />
                          Proficient
                        </span>
                      ),
                    }]}
                    values={saveValues}
                    onChange={handleSaveChange}
                    labelPlacement="end"
                    direction="row"
                    suffixComponent={(
                      <CharSheetNumberField
                        fieldSize="tiny"
                        value={displayedSaveModifier}
                        onValueChange={() => {}}
                        hideStepper
                        showPositiveSign
                        label={'Save\nModifier'}
                        sx={borderlessModifierSx}
                        slotProps={{
                          ...disabledModifierSlotProps,
                          htmlInput: {
                            readOnly: true,
                            'aria-label': `${abilityLabel} saving throw modifier`,
                          },
                        }}
                      />
                    )}
                  />
                </div>

                <div>
                  {skillsForAbility.length === 0 ? (
                    <div style={styles.emptySkillsText}>No skills for this ability.</div>
                  ) : (
                    skillsForAbility.map((skill) => {
                      const proficient =
                        skillValues[getSkillProficientKey(skill.key)] ?? false;
                      const expertise =
                        skillValues[getSkillExpertiseKey(skill.key)] ?? false;
                      const displayedSkillModifier = getSkillModifier(
                        abilityModifiers[ability],
                        proficient,
                        expertise,
                        proficiencyBonus,
                      );

                      return (
                        <div key={skill.key} style={styles.skillRow}>
                          <CharSheetCheckboxes
                            id={skill.key}
                            label={skill.display}
                            labelWidth={skillLabelMinWidth}
                            boxes={[
                              {
                                label: 'proficient',
                                checked: proficient,
                                ariaLabel: `${skill.display} proficiency`,
                              },
                              {
                                label: 'expertise',
                                checked: expertise,
                                ariaLabel: `${skill.display} expertise`,
                              },
                            ]}
                            values={skillValues}
                            onChange={handleSkillChange}
                            labelPlacement="end"
                            direction="row"
                            suffixComponent={(
                              <CharSheetNumberField
                                fieldSize="tiny"
                                value={displayedSkillModifier}
                                onValueChange={() => {}}
                                hideStepper
                                showPositiveSign
                                label={'Skill\nModifier'}
                                sx={borderlessModifierSx}
                                slotProps={{
                                  ...disabledModifierSlotProps,
                                  htmlInput: {
                                    readOnly: true,
                                    'aria-label': `${skill.display} modifier`,
                                  },
                                }}
                              />
                            )}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {formError ? (
        <div style={styles.errorText} role="alert" aria-live="assertive">
          {formError}
        </div>
      ) : null}
    </div>
  );
};

export default CharacterAbilitiesSection;
