import React from 'react';
import { useRouter } from 'next/router';
import { logoutAPI } from '../../apis/user';
import { useUserInfo } from '../../store/userStore';
import { AppImages } from '../../configs/AppImages';
import Image from 'next/image';
import ProfileImage from '../Common/ProfileImage';
import { Divider } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import L from '../Header/LogoHeader/LogoHeader.styles';

interface INavigateDrawer {
  openSearchUserDrawer: boolean;
  setOpenSearchUserDrawer: (value: boolean) => void;
}

function NavigateDrawer({
  openSearchUserDrawer,
  setOpenSearchUserDrawer,
}: INavigateDrawer) {
  const router = useRouter();

  return (
    <L.MyDrawer
      title={
        <L.DrawerHeader>
          <Image
            src={AppImages.InPlaceLogo}
            alt="profileImage"
            width="30"
            height="30"
          />
          설정
        </L.DrawerHeader>
      }
      placement="right"
      closable={true}
      width={'auto'}
      onClose={() => setOpenSearchUserDrawer(false)}
      open={openSearchUserDrawer}
    >
      <L.DrawerBodyWrapper>123</L.DrawerBodyWrapper>
    </L.MyDrawer>
  );
}

export default NavigateDrawer;
