import { create } from 'zustand';

// type UserState = {
//   userInfo: any | null;
//   setUserInfo: (userInfo: any) => void;
//   clearUserInfo: () => void;
// };

export const useEditPostStore = create((set) => ({
  userInfo: null,
  setUserInfo: (userInfo: any) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));
