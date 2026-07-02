import { useContext, useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import CharSheetCheckboxes from '../../../library/checkboxes/CharSheetCheckboxes';
import CharSheetNumberField from '../../../library/numberField/CharSheetNumberField';
import { SkillsContext } from '../../../../contexts/characterOptions.context.tsx';
import { Attributes, Skill } from '../../../../types/Characters.Types';

interface CharacterSkillFieldsProps {
  skills?: Skill[];
  attributeModifiers: { [K in keyof Attributes]: number | null };
  proficiencyBonus: number;
}

export interface CharacterSkillFieldsHandle {
  getSkillStates: () => Record<string, { proficient: boolean; specialized: boolean }>;
}

const CharacterSkillFields = forwardRef<CharacterSkillFieldsHandle, CharacterSkillFieldsProps>(
  ({ skills: skillsProp, attributeModifiers, proficiencyBonus }, ref) => {
  const skillsContext = useContext(SkillsContext);
  const skills = useMemo(
    () => skillsProp ?? skillsContext.Skills ?? [],
    [skillsProp, skillsContext.Skills],
  );
  const sortedSkills = [...skills].sort((a, b) => a.display.localeCompare(b.display));
  const longestLabelChars = sortedSkills.reduce(
    (max, skill) => Math.max(max, skill.display.length),
    0,
  );
  const labelMinWidth = `${Math.max(longestLabelChars, 12) * 0.75 + 4}ch`;

  // Checkbox values keyed by `${skill.key}.proficient` and `${skill.key}.specialized`
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    const out: Record<string, boolean> = {};
    skills.forEach((s) => {
      out[`${s.key}.proficient`] = !!s.proficient;
      out[`${s.key}.specialized`] = !!s.specialized;
    });
    return out;
  });

  const prevValuesRef = useRef<Record<string, boolean> | null>(null);

  useImperativeHandle(ref, () => ({
    getSkillStates: () => {
      const skillStates: Record<string, { proficient: boolean; specialized: boolean }> = {};
      skills.forEach((skill) => {
        skillStates[skill.key] = {
          proficient: values[`${skill.key}.proficient`] ?? !!skill.proficient,
          specialized: values[`${skill.key}.specialized`] ?? !!skill.specialized,
        };
      });
      return skillStates;
    },
  }), [values, skills]);

  const handleChange = (newValues: Record<string, boolean>) => {
    // Track state changes to apply constraints based on what was actually clicked:
    // - If specialized just became checked, proficient should also be checked
    // - If proficient just became unchecked, specialized should also be unchecked
    // - If specialized just became unchecked, no other changes
    const constrainedValues = { ...newValues };
    const prevValues = prevValuesRef.current || values;

    sortedSkills.forEach((skill) => {
      const proficientKey = `${skill.key}.proficient`;
      const specializedKey = `${skill.key}.specialized`;

      const wasProficient = prevValues[proficientKey];
      const wasSpecialized = prevValues[specializedKey];
      const isProficient = newValues[proficientKey];
      const isSpecialized = newValues[specializedKey];

      // If specialized just became checked, proficient should also be checked
      if (!wasSpecialized && isSpecialized) {
        constrainedValues[proficientKey] = true;
      }
      // If proficient just became unchecked, specialized should also be unchecked
      else if (wasProficient && !isProficient) {
        constrainedValues[specializedKey] = false;
      }
    });

    prevValuesRef.current = constrainedValues;
    setValues(constrainedValues);
  };


  return (
    <div>
      <h4>Skills</h4>
      {sortedSkills.map((skill) => {
        const proficient = values[`${skill.key}.proficient`] ?? !!skill.proficient;
        const specialized = values[`${skill.key}.specialized`] ?? !!skill.specialized;
        const baseModifier = attributeModifiers[skill.attribute] ?? 0;
        const proficiencyContribution = specialized
          ? proficiencyBonus * 2
          : proficient
            ? proficiencyBonus
            : 0;
        const displayedModifier = baseModifier + proficiencyContribution;

        return (
          <div
            key={skill.key}
            style={{
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <CharSheetCheckboxes
              id={skill.key}
              label={skill.display}
              labelWidth={labelMinWidth}
              boxes={[
                { label: 'proficient', checked: proficient },
                { label: 'specialized', checked: specialized },
              ]}
              values={values}
              onChange={handleChange}
              labelPlacement="end"
              direction="row"
              suffixComponent={(
                <CharSheetNumberField
                  fieldSize="tiny"
                  value={displayedModifier}
                  onValueChange={() => {}}
                  disabled
                  hideStepper
                  showPositiveSign
                  label="Modifier"
                  slotProps={{
                    input: {
                      style: {
                        color: '#ccc',
                        WebkitTextFillColor: '#ccc',
                        opacity: 1,
                      },
                    },
                    inputLabel: { style: { color: '#ccc' } },
                  }}
                />
              )}
            />
          </div>
        );
      })}
    </div>
  );
  },
);

CharacterSkillFields.displayName = 'CharacterSkillFields';

export default CharacterSkillFields;
