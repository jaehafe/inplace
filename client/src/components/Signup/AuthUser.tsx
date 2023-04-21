import { ReactNode, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { authMeAPI } from '../../apis/user';
import { useSetUserInfo, useUserInfo } from '../../store/userStore';

interface AuthUserProps {
  children: ReactNode;
}

const AuthUser = ({ children }: AuthUserProps) => {
  const setUserInfo = useSetUserInfo();
  const [cookie] = useCookies(['inplace']);

  const { data: authMeData } = cookie?.inplace ? authMeAPI() : { data: null };
  // console.log('authMeData<<', authMeData);
  // const currentLoginUser = useUserInfo();
  // console.log('currentLoginUser>>>', currentLoginUser);

  useEffect(() => {
    if (cookie?.inplace && authMeData) {
      setUserInfo(authMeData);
    }
  }, [cookie.inplace, authMeData]);

  return <>{children}</>;
};

export default AuthUser;
