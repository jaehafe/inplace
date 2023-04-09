import { ReactNode, useEffect } from 'react';
import useAuthStore from './authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { loadUser }: any = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  return children;
};