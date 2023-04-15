import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import L from './LogoHeader.styles';
import { AppImages } from '../../../configs/AppImages';
import { Button, Divider } from 'antd';
import { useRouter } from 'next/router';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import B from '../../Common/BackButton';
import { logoutAPI } from '../../../apis/user';
import { useUserStore } from '../../../store/userStore';

interface IProps {
  headerIcons?: boolean;
}

function LogoHeader({ headerIcons }: IProps) {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);

  const userInfo = useUserStore((state) => state.userInfo);

  const { mutate: logoutMutate } = logoutAPI();
  const handleLogout = () => {
    logoutMutate();
  };

  const buttons = [
    { text: '작성 글', onClick: () => router.push('/profile/identifier') },
    { text: '작성 댓글', onClick: () => console.log('작성 댓글 버튼 클릭') },
    {
      text: '프로필 편집',
      onClick: () => console.log('프로필 편집 버튼 클릭'),
    },
  ];

  const loginButtons = [
    { text: '로그인', onClick: () => router.push('/login') },
    { text: '회원가입', onClick: () => router.push('/signup') },
  ];

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
            <Button type="text" shape="circle" onClick={() => router.push(`/`)}>
              <Image src={AppImages.UserIcon} alt="UserIcon" />
            </Button>
            <Button
              type="text"
              shape="circle"
              onClick={() => setOpenDrawer(true)}
            >
              <Image src={AppImages.ListIcon} alt="ListIcon" />
            </Button>
          </L.HeaderIcons>
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
            onClose={() => setOpenDrawer(false)}
            open={openDrawer}
          >
            <L.DrawerBodyWrapper>
              <L.ProfileWrapper>
                <Image
                  src="https://www.gravatar.com/avatar?d=mp&f=y"
                  width={100}
                  height={100}
                  style={{ borderRadius: '50px' }}
                  alt="avatar"
                />
                {userInfo && (
                  <>
                    <span>안녕하세요</span>
                    <h3>{userInfo?.username}님</h3>
                  </>
                )}
              </L.ProfileWrapper>
              <Divider />

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
              <L.LoginOutWrapper>
                {userInfo ? (
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
          </L.MyDrawer>
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
