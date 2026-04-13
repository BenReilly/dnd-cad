import { useState } from 'react';
import CharSheetTextField from '../../library/textField/CharSheetTextField';

const CharEntry = () => {
  const [name, setName] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div>
      <CharSheetTextField
        value={name}
        onChange={handleNameChange}
        label="Name"
        variant="outlined"
        fieldSize="large"
      />
    </div>
  );
};

export default CharEntry;