import { create } from 'zustand';

type UserState = {
  userInfo: any | null;
  setUserInfo: (userInfo: any) => void;
  clearUserInfo: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));
