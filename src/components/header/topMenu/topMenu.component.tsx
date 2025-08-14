import { PropsWithChildren } from 'react';
import { TopMenuContainer } from './topMenu.style';

const DndcadTopMenu = (props: PropsWithChildren) => {
  return <TopMenuContainer>{props.children}</TopMenuContainer>;
};

export default DndcadTopMenu;
