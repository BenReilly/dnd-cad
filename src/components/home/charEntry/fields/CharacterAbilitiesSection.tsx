import { CSSProperties, forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import AbilityField from './AbilityField';
import CharSheetCheckboxes from '../../../library/checkboxes/CharSheetCheckboxes';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import { Abilities, Skill } from '../../../../types/Characters.Types';
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
  abilityModifiers: AbilityValues;
  onAbilityChange: (ability: keyof Abilities, value: number | null) => void;
  skills: Skill[];
  proficiencyBonus: number;
  abilityErrors?: Record<string, boolean>;
  formError?: string;
  savingThrows?: Partial<Record<keyof Abilities, boolean>>;
}

export interface CharacterAbilitiesSectionHandle {
  getSaveStates: () => Record<keyof Abilities, boolean>;
  getSkillStates: () => Record<string, { proficient: boolean; expertise: boolean }>;
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

const CharacterAbilitiesSection = forwardRef<
  CharacterAbilitiesSectionHandle,
  CharacterAbilitiesSectionProps
>(({
  abilities,
  abilityModifiers,
  onAbilityChange,
  skills,
  proficiencyBonus,
  abilityErrors = {},
  formError = '',
  savingThrows,
}, ref) => {
  const groupedSkills = useMemo(() => groupSkillsByAbility(skills), [skills]);
  const skillLabelMinWidth = '12ch';

  const [saveValues, setSaveValues] = useState<Record<string, boolean>>(() => {
    const out: Record<string, boolean> = {};
    ABILITY_ORDER.forEach((ability) => {
      out[getSaveCheckboxKey(ability)] = !!savingThrows?.[ability];
    });
    return out;
  });

  const [skillValues, setSkillValues] = useState<Record<string, boolean>>(() => {
    const out: Record<string, boolean> = {};
    skills.forEach((skill) => {
      out[getSkillProficientKey(skill.key)] = !!skill.proficient;
      out[getSkillExpertiseKey(skill.key)] = !!skill.expertise;
    });
    return out;
  });
  const previousSkillValuesRef = useRef<Record<string, boolean>>(skillValues);

  useImperativeHandle(ref, () => ({
    getSaveStates: () => {
      const saveStates = {} as Record<keyof Abilities, boolean>;
      ABILITY_ORDER.forEach((ability) => {
        saveStates[ability] = saveValues[getSaveCheckboxKey(ability)] ?? !!savingThrows?.[ability];
      });
      return saveStates;
    },
    getSkillStates: () => {
      const skillStates: Record<string, { proficient: boolean; expertise: boolean }> = {};
      skills.forEach((skill) => {
        skillStates[skill.key] = {
          proficient: skillValues[getSkillProficientKey(skill.key)] ?? !!skill.proficient,
          expertise: skillValues[getSkillExpertiseKey(skill.key)] ?? !!skill.expertise,
        };
      });
      return skillStates;
    },
  }), [saveValues, savingThrows, skillValues, skills]);

  const handleSaveChange = (newValues: Record<string, boolean>) => {
    setSaveValues(newValues);
  };

  const handleSkillChange = (newValues: Record<string, boolean>) => {
    const constrainedValues = applySkillSelectionRules(
      previousSkillValuesRef.current,
      newValues,
      skills,
    );

    previousSkillValuesRef.current = constrainedValues;
    setSkillValues(constrainedValues);
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
                        skillValues[getSkillProficientKey(skill.key)] ?? !!skill.proficient;
                      const expertise =
                        skillValues[getSkillExpertiseKey(skill.key)] ?? !!skill.expertise;
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
});

CharacterAbilitiesSection.displayName = 'CharacterAbilitiesSection';

export default CharacterAbilitiesSection;
