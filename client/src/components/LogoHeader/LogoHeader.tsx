import Link from 'next/link';
import React from 'react';
import L from './LogoHeader.styles';
import { AppImages } from '../../configs/AppImages';
import Image from 'next/image';

function LogoHeader() {
  return (
    <L.LogoHeaderWrapper>
      <Link href="/">
        <Image src={AppImages.InPlaceLogo} alt="inplace-logo" width={50} height={50} />
      </Link>
    </L.LogoHeaderWrapper>
  );
}

export default LogoHeader;
