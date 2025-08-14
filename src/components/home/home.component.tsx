import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import DndcadWelcomePage from './welcomePage/welcomePage.component';
import CharacterGrid from './characterGrid/characterGrid.component';

const DndcadHome = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <>
      {!currentUser && <DndcadWelcomePage />}
      {currentUser && (
        <>
          <CharacterGrid />
        </>
      )}
    </>
  );
};

export default DndcadHome;
