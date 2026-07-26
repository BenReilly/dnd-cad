// import { Feature } from '../../../../types/Characters.Types';
import CharSheetListField from '../../../library/listField/CharSheetListField';
import { characterFieldStyles } from './characterFieldStyles';
import { CharacterEntryState } from '../charEntry.state';

export interface CharacterTraitFieldsProps {
  proficiencies: string[];
  languages: string[];
  updateCharacter: (patch: Partial<CharacterEntryState>) => void;
}

const CharacterTraitFields = ({
  proficiencies,
  languages,
  updateCharacter,
}: CharacterTraitFieldsProps) => {
  // const handleRacialTraitsChange = (newTraits: string[]) => {
  //   setRacialTraits(newTraits.map((name) => ({ name })));
  // };

  // const handleClassFeaturesChange = (newFeatures: string[]) => {
  //   setClassFeatures(newFeatures.map((name) => ({ name })));
  // };

  return (
    <>
      {/* <div style={characterFieldStyles.fieldBlock}>
        <CharSheetListField
          defaultItems={racialTraits.map((trait) => trait.name)}
          onItemsChange={handleRacialTraitsChange}
          label="Racial Traits"
          helperText="Type items separated by commas, or press Enter/Add."
          fieldSize="large"
        />
      </div>
      <div style={characterFieldStyles.fieldBlock}>
        <CharSheetListField
          defaultItems={classFeatures.map((feature) => feature.name)}
          onItemsChange={handleClassFeaturesChange}
          label="Class Features"
          helperText="Type items separated by commas, or press Enter/Add."
          fieldSize="large"
        />
      </div> */}
      <div style={characterFieldStyles.fieldBlock}>
        <CharSheetListField
          items={proficiencies}
          onItemsChange={(items) => updateCharacter({ proficiencies: items })}
          label="Proficiencies"
          helperText="Type items separated by commas, or press Enter/Add."
          fieldSize="large"
        />
      </div>
      <div style={characterFieldStyles.fieldBlock}>
        <CharSheetListField
          items={languages}
          onItemsChange={(items) => updateCharacter({ languages: items })}
          label="Languages"
          helperText="Type items separated by commas, or press Enter/Add."
          fieldSize="large"
        />
      </div>
    </>
  );
};

export default CharacterTraitFields;
