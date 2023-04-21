import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppImages } from '../../../configs/AppImages';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { LeftOutlined } from '@ant-design/icons';
import NavigateDrawer from '../HeaderDrawer/NavigateDrawer/NavigateDrawer';
import L from './LogoHeader.styles';
import B from '../../Common/BackButton';
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
            <Button type="text" shape="circle" onClick={() => router.push(`/`)}>
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

{
  /* <L.MyDrawer
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
            onClose={() => setOpenDrawer(false)}
            open={openDrawer}
          >
            <L.DrawerBodyWrapper>
              <L.ProfileWrapper>
                <ProfileImage
                  src={currentLoginUser?.image.src}
                  width={100}
                  height={100}
                  style={{ borderRadius: '50px' }}
                />
                {currentLoginUser && (
                  <>
                    <span>안녕하세요</span>
                    <h3>{currentLoginUser?.username}님</h3>
                  </>
                )}
              </L.ProfileWrapper>
              <Divider />

              {currentLoginUser ? (
                <>
                  {buttons.map((button) => (
                    <L.StyledButton
                      type="text"
                      shape="round"
                      key={button.text}
                      onClick={button.onClick}
                    >
                      {button.text}
                      <RightOutlined />
                    </L.StyledButton>
                  ))}
                  <Divider />
                </>
              ) : (
                ''
              )}

              <L.LoginOutWrapper>
                {currentLoginUser ? (
                  <L.StyledButton
                    type="text"
                    shape="round"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </L.StyledButton>
                ) : (
                  <>
                    {loginButtons.map((button) => (
                      <L.StyledButton
                        type="text"
                        shape="round"
                        key={button.text}
                        onClick={button.onClick}
                      >
                        {button.text}
                      </L.StyledButton>
                    ))}
                  </>
                )}
              </L.LoginOutWrapper>
              <Divider />
            </L.DrawerBodyWrapper>
          </L.MyDrawer> */
}
