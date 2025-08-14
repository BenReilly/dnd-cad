import { Dispatch, SetStateAction } from 'react';

export type UserData = {
  uname: string;
  email: string;
  uavatar?: string;
  create_date: Date;
  uid: string;
};

export type UserContextType = {
  currentUser: UserData | null;
  setCurrentUser: Dispatch<SetStateAction<UserData | null>>;
};
