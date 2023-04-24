import React from 'react';
import { useRouter } from 'next/router';
import { logoutAPI } from '../../../../apis/user';
import { useUserInfo } from '../../../../store/userStore';
import { AppImages } from '../../../../configs/AppImages';
import Image from 'next/image';
import ProfileImage from '../../../Common/ProfileImage';
import { Divider } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import L from '../../LogoHeader/LogoHeader.styles';

interface INavigateDrawer {
  openNavigateDrawer: boolean;
  setOpenNavigateDrawer: (value: boolean) => void;
}

function NavigateDrawer({
  openNavigateDrawer,
  setOpenNavigateDrawer,
}: INavigateDrawer) {
  const router = useRouter();
  const currentLoginUser = useUserInfo();

  const { mutate: logoutMutate } = logoutAPI();
  const handleLogout = () => {
    logoutMutate();
  };

  const buttons = [
    {
      text: '작성 글',
      onClick: () => router.push(`/profile/${currentLoginUser?.username}`),
    },
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
      closable={false}
      width={'auto'}
      onClose={() => setOpenNavigateDrawer(false)}
      open={openNavigateDrawer}
    >
      <L.DrawerBodyWrapper>
        <L.ProfileWrapper>
          <ProfileImage
            src={currentLoginUser?.image.src}
            width={100}
            height={100}
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
            <L.StyledButton type="text" shape="round" onClick={handleLogout}>
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
  );
}

export default NavigateDrawer;
