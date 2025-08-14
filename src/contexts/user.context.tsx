import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { UserContextType, UserData } from '../types/User.Types.js';
import {
  createUserDoc,
  getUser,
  onAuthStateChangedListener,
} from '../utils/firebase.utils.js';

export const UserContext = createContext<UserContextType>({
  setCurrentUser: () => null,
  currentUser: null,
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const value: UserContextType = { currentUser, setCurrentUser };
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      if (!user) {
        return;
      }

      let userProfile = await getUser(user.uid);
      if (!userProfile) {
        try {
          await createUserDoc(user);
          userProfile = await getUser(user.uid);
        } catch (err) {
          console.error(
            'User has Auth, but has not been put in users collection',
            err,
          );
        }
      }
      setCurrentUser(userProfile);
    });
    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
