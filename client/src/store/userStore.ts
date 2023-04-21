import { create } from 'zustand';

type UserState = {
  userInfo: any | null;
  setUserInfo: (userInfo: any) => void;
  clearUserInfo: () => void;
};

const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useSetUserInfo = () => useUserStore((state) => state.setUserInfo);
export const useClearUserInfo = () =>
  useUserStore((state) => state.clearUserInfo);
