import { useContext } from 'react';
import { CharactersContext } from '../../../contexts/characters.context';

import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: number;
  alignment: string;
  background: string;
  charClass: string;
  subclass: string;
  name: string;
  race: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [],
    filterSearch: true,
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Race',
    dataIndex: 'race',
    filterSearch: true,
    key: 'race',
  },
  {
    title: 'Class',
    dataIndex: 'charClass',
    filterSearch: true,
    key: 'charClass',
  },
  {
    title: 'Subclass',
    dataIndex: 'subclass',
    filterSearch: true,
    key: 'subclass',
  },
  {
    title: 'Background',
    dataIndex: 'background',
    filterSearch: true,
    key: 'background',
  },
  {
    title: 'Alignment',
    dataIndex: 'alignment',
    filterSearch: true,
    key: 'alignment',
  },
];

const CharacterGrid = () => {
  const { characters } = useContext(CharactersContext);
  const characterData = characters.map((character, i) => {
    const cclass = character.class.map((thisClass) => {
      return Number.isInteger(thisClass.level) && thisClass.level > 0
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
  return <Table<DataType> columns={columns} dataSource={characterData} />;
};

export default CharacterGrid;
