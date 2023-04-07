import create from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { User } from '../types';
import { axiosInstance } from '../configs/axios';
import { ReactNode, useEffect } from 'react';

interface AuthState {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  stopLoading: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(
  (set, get) => ({
    authenticated: false,
    user: undefined,
    loading: true,

    login: (user: User) =>
      set(() => ({
        authenticated: true,
        user,
      })),
    logout: () => set(() => ({ authenticated: false, user: undefined })),
    stopLoading: () => set(() => ({ loading: false })),
    loadUser: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        get().login(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        get().stopLoading();
      }
    },
  })
  // {
  //   name: 'auth-storage',
  // }
);
