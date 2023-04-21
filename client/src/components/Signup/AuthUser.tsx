import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { authMeAPI } from '../../apis/user';
import { useSetUserInfo } from '../../store/userStore';

const AuthUser: React.FC = () => {
  const setUserInfo = useSetUserInfo();
  const [cookie] = useCookies(['inplace']);
  const { data: authMeData } = cookie?.inplace ? authMeAPI() : { data: null };

  useEffect(() => {
    if (cookie?.inplace) {
      setUserInfo(authMeData);
    }
  }, [cookie?.inplace]);

  return null;
};

export default AuthUser;
