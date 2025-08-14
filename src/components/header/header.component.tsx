import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import {
  signInWithGooglePopup,
  signOutUser,
} from '../../utils/firebase.utils.js';
import { DndcadHeaderDiv, DndcadHeaderID } from './header.style';
import { Button } from '@mui/material';

const DndcadHeader = () => {
  const { currentUser } = useContext(UserContext);
  const handleBtnClick = async () => {
    if (currentUser) {
      await signOutUser();
    } else {
      await signInWithGooglePopup();
    }
  };

  return (
    <DndcadHeaderDiv>
      <DndcadHeaderID>
        <p>Welcome{currentUser ? ` ${currentUser.displayName}` : ''}</p>
        <p>
          <Button onClick={handleBtnClick}>
            Sign {currentUser ? 'Out' : 'In'}
          </Button>
        </p>
      </DndcadHeaderID>
    </DndcadHeaderDiv>
  );
};

export default DndcadHeader;
