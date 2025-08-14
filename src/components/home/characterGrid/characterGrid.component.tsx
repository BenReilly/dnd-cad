import { useContext, useEffect, useState, useMemo } from 'react';
import { CharactersContext } from '../../../contexts/characters.context';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { UserContext } from '../../../contexts/user.context';
// import { getCharacterDetail } from '../../../utils/firebase.utils';
import {
  Alignment,
  CharacterContextType,
} from '../../../types/Characters.Types';

const CharacterGrid = () => {
  // (temporary)
  // const charID = '77zg0SMUQcgD1AggYI1V';

  type CharDataType = {
    key: number;
    alignment?: Alignment;
    background?: string;
    charClass: string;
    subclass?: string;
    race: string;
    name: string;
  };

  const [characterData, setCharacterData] = useState<CharDataType[]>([]);
  const { CharacterSummaries } = useContext(
    CharactersContext,
  ) as CharacterContextType;
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    const charData: CharDataType[] = CharacterSummaries.map((character, i) => {
      const cclass = character.class.map((thisClass) => {
        return thisClass.level &&
          Number.isInteger(thisClass.level) &&
          thisClass.level > 0
          ? `${thisClass.name} ${thisClass.level}`
          : thisClass.name;
      });
      return {
        key: i,
        alignment: character.alignment,
        background: character.background,
        charClass: cclass.toString(),
        subclass: character.subclass,
        race: character.subrace
          ? `${character.subrace} ${character.race}`
          : character.race,
        name: character.name,
      };
    });
    setCharacterData(charData);
  }, [CharacterSummaries]);

  // useEffect(() => {
  //   const getDetails = async () => {
  //     await getCharacterDetail(charID).then((data) => {
  //       console.log(data);
  //       setCharDetails(data);
  //     });
  //   };
  //   getDetails();
  // }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'race',
        header: 'Race',
      },
      {
        accessorKey: 'charClass',
        header: 'Class',
      },
      {
        accessorKey: 'subclass',
        header: 'Subclass',
      },
      {
        accessorKey: 'background',
        header: 'Background',
      },
      {
        accessorKey: 'alignment',
        header: 'Alignment',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    columnFilterDisplayMode: 'popover',
    data: characterData,
    defaultColumn: {
      size: 100,
      maxSize: 180,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
      sorting: [{ id: 'name', desc: false }],
    },
  });

  return (
    <>
      {currentUser && <h2>Character List for {currentUser.uname} </h2>}
      <MaterialReactTable table={table} />
    </>
  );
};

export default CharacterGrid;
