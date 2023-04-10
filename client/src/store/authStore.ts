import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '../types';
import { axiosInstance } from '../configs/axios';

interface AuthState {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  stopLoading: () => void;
  loadUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    authenticated: false,
    user: undefined,
    loading: true,

    login: (user: User) =>
      set(() => ({
        authenticated: true,
        user,
        loading: false,
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
        set((state) => ({ ...state, loading: false }));
        // get().stopLoading();
      }
    },
  }))
);

export default useAuthStore;
