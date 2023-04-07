import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import L from './LogoHeader.styles';
import { AppImages } from '../../configs/AppImages';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import ProfileImage from '../Common/ProfileImage/ProfileImage';

function LogoHeader() {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <L.LogoHeaderWrapper>
      <Link href="/">
        <Image
          src={AppImages.InPlaceLogo}
          alt="inplace-logo"
          width="50"
          height="50"
        />
      </Link>
      <L.HeaderIcons>
        <Button type="text" shape="circle" onClick={() => router.push(`/`)}>
          <Image src={AppImages.ArchiveIcon} alt="ArchiveIcon" />
        </Button>
        <Button type="text" shape="circle" onClick={() => router.push(`/`)}>
          <Image src={AppImages.UserIcon} alt="UserIcon" />
        </Button>
        <Button type="text" shape="circle" onClick={() => setOpenDrawer(true)}>
          <Image src={AppImages.ListIcon} alt="ListIcon" />
        </Button>
      </L.HeaderIcons>
      <L.MyDrawer
        title={
          <L.DrawerHeader>
            <Image
              src={AppImages.InPlaceLogo}
              alt="logo"
              width="30"
              height="30"
            />
            설정
          </L.DrawerHeader>
        }
        placement="bottom"
        closable={true}
        height="90%"
        maskStyle={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <L.DrawerBodyWrapper>
          <ProfileImage />
        </L.DrawerBodyWrapper>
      </L.MyDrawer>
    </L.LogoHeaderWrapper>
  );
}

export default LogoHeader;
