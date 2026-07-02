import { CSSProperties } from 'react';
import AttributeField from './AttributeField';
import { Attributes } from '../../../../types/Characters.Types';

type AttributeValues = { [K in keyof Attributes]: number | null };

interface CharacterAttributeFieldsProps {
  attributes: AttributeValues;
  modifiers: AttributeValues;
  onAttributeChange: (attribute: keyof Attributes, value: number | null) => void;
  attributeErrors?: Record<string, boolean>;
  formError?: string;
}

const styles: { [key: string]: CSSProperties } = {
  fieldBlock: { display: 'flex', flexDirection: 'column', gap: 8 },
  errorText: { color: 'red', marginTop: 8, fontSize: '0.875rem' },
};

const CharacterAttributeFields = ({
  attributes,
  modifiers,
  onAttributeChange,
  attributeErrors = {},
  formError = '',
}: CharacterAttributeFieldsProps) => {
  return (
    <div style={styles.fieldBlock}>
      <AttributeField
        attribute="str"
        attrLabel="Strength"
        value={attributes.str}
        modifier={modifiers.str}
        setAttribute={onAttributeChange}
        error={!!attributeErrors['str']}
        helperText={
          attributeErrors['str'] ? 'Required when any attribute provided (1–20)' : undefined
        }
      />
      <AttributeField
        attribute="dex"
        attrLabel="Dexterity"
        value={attributes.dex}
        modifier={modifiers.dex}
        setAttribute={onAttributeChange}
        error={!!attributeErrors['dex']}
        helperText={
          attributeErrors['dex'] ? 'Required when any attribute provided (1–20)' : undefined
        }
      />
      <AttributeField
        attribute="con"
        attrLabel="Constitution"
        value={attributes.con}
        modifier={modifiers.con}
        setAttribute={onAttributeChange}
        error={!!attributeErrors['con']}
        helperText={
          attributeErrors['con'] ? 'Required when any attribute provided (1–20)' : undefined
        }
      />
      <AttributeField
        attribute="int"
        attrLabel="Intelligence"
        value={attributes.int}
        modifier={modifiers.int}
        setAttribute={onAttributeChange}
        error={!!attributeErrors['int']}
        helperText={
          attributeErrors['int'] ? 'Required when any attribute provided (1–20)' : undefined
        }
      />
      <AttributeField
        attribute="wis"
        attrLabel="Wisdom"
        value={attributes.wis}
        modifier={modifiers.wis}
        setAttribute={onAttributeChange}
        error={!!attributeErrors['wis']}
        helperText={
          attributeErrors['wis'] ? 'Required when any attribute provided (1–20)' : undefined
        }
      />
      <AttributeField
        attribute="cha"
        attrLabel="Charisma"
        value={attributes.cha}
        modifier={modifiers.cha}
        setAttribute={onAttributeChange}
        error={!!attributeErrors['cha']}
        helperText={
          attributeErrors['cha'] ? 'Required when any attribute provided (1–20)' : undefined
        }
      />
      {formError ? <div style={styles.errorText}>{formError}</div> : null}
    </div>
  );
};

export default CharacterAttributeFields;
