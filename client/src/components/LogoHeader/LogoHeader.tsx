import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import L from './LogoHeader.styles';
import { AppImages } from '../../configs/AppImages';
import { Button } from 'antd';
import { useRouter } from 'next/router';

function LogoHeader() {
  const router = useRouter();
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
        <Button type="text" shape="circle">
          {/* onClick={onToggle} */}
          <Image src={AppImages.ListIcon} alt="ListIcon" />
        </Button>
      </L.HeaderIcons>
    </L.LogoHeaderWrapper>
  );
}

export default LogoHeader;
