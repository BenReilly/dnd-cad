// import { Feature } from '../../../../types/Characters.Types';
import CharSheetListField from '../../../library/listField/CharSheetListField';
import { characterFieldStyles } from './characterFieldStyles';

export interface CharacterTraitFieldsProps {
  // racialTraits: Feature[];
  // setRacialTraits: (traits: Feature[]) => void;
  // classFeatures: Feature[];
  // setClassFeatures: (features: Feature[]) => void;
  proficiencies: string[];
  setProficiencies: (proficiencies: string[]) => void;
  languages: string[];
  setLanguages: (languages: string[]) => void;
}

const CharacterTraitFields = ({
  // racialTraits,
  // setRacialTraits,
  // classFeatures,
  // setClassFeatures,
  proficiencies,
  setProficiencies,
  languages,
  setLanguages,
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
          defaultItems={proficiencies}
          onItemsChange={setProficiencies}
          label="Proficiencies"
          helperText="Type items separated by commas, or press Enter/Add."
          fieldSize="large"
        />
      </div>
      <div style={characterFieldStyles.fieldBlock}>
        <CharSheetListField
          defaultItems={languages}
          onItemsChange={setLanguages}
          label="Languages"
          helperText="Type items separated by commas, or press Enter/Add."
          fieldSize="large"
        />
      </div>
    </>
  );
};

export default CharacterTraitFields;
