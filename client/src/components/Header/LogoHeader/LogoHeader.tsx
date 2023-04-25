import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppImages } from '../../../configs/AppImages';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { LeftOutlined } from '@ant-design/icons';
import NavigateDrawer from '../HeaderDrawer/NavigateDrawer/NavigateDrawer';
import L from './LogoHeader.styles';
import B from '../../Common/BackButton.styles';
import SearchUserDrawer from '../HeaderDrawer/SearchUserDrawer/SearchUserDrawer';

interface IProps {
  headerIcons?: boolean;
}

function LogoHeader({ headerIcons }: IProps) {
  const router = useRouter();
  const [openNavigateDrawer, setOpenNavigateDrawer] = useState(false);
  const [openSearchUserDrawer, setOpenSearchUserDrawer] = useState(false);

  const handleOpenUserSearchDrawer = () => {};

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
      {headerIcons ? (
        <>
          <L.HeaderIcons>
            <Button
              type="text"
              shape="circle"
              onClick={() => router.push(`/tags`)}
            >
              <Image src={AppImages.ArchiveIcon} alt="ArchiveIcon" />
            </Button>
            <Button
              type="text"
              shape="circle"
              onClick={() => setOpenSearchUserDrawer(true)}
            >
              <Image src={AppImages.UserIcon} alt="UserIcon" />
            </Button>
            <Button
              type="text"
              shape="circle"
              onClick={() => setOpenNavigateDrawer(true)}
            >
              <Image src={AppImages.ListIcon} alt="ListIcon" />
            </Button>
          </L.HeaderIcons>
          <NavigateDrawer
            openNavigateDrawer={openNavigateDrawer}
            setOpenNavigateDrawer={setOpenNavigateDrawer}
          />
          <SearchUserDrawer
            openSearchUserDrawer={openSearchUserDrawer}
            setOpenSearchUserDrawer={setOpenSearchUserDrawer}
          />
        </>
      ) : (
        <B.BackButton
          type="dashed"
          shape="round"
          size="large"
          onClick={() => router.back()}
        >
          <LeftOutlined />
        </B.BackButton>
      )}
    </L.LogoHeaderWrapper>
  );
}

export default LogoHeader;
