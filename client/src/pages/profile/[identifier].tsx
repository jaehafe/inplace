import { Tabs, TabsProps } from 'antd';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React from 'react';
import ProfileImage from '../../components/Common/ProfileImage';
import ProfileCommentTab from '../../components/Common/ProfileTab/ProfileCommentTab';
import ProfilePostTab from '../../components/Common/ProfileTab/ProfilePostTab';
import LogoHeader from '../../components/LogoHeader/LogoHeader';
import { axiosInstance } from '../../configs/axios';
import P from './Profile.styles';

function Profile() {
  const items: TabsProps['items'] = [
    {
      key: '작성 글',
      label: `작성 글`,
      children: <ProfilePostTab />,
    },
    {
      key: '작성 댓글',
      label: `작성 댓글`,
      children: <ProfileCommentTab />,
    },
    {
      key: '응답한 글',
      label: `응답한 글`,
      children: <>123</>,
    },
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <P.Wrapper>
      <LogoHeader headerIcons={false} />
      <P.InfoWrapper>
        <P.InfoLeft>
          <h2>유저이름</h2>
          <P.FollowInfoWrapper>
            <h4>팔로워 0 ·</h4>
            <h4>팔로잉 1</h4>
          </P.FollowInfoWrapper>
          <P.EditButton>프로필 편집</P.EditButton>
        </P.InfoLeft>
        <P.InfoRight>
          <ProfileImage />
        </P.InfoRight>
      </P.InfoWrapper>

      <P.StyledTab defaultActiveKey="1" items={items} onChange={onChange} />
    </P.Wrapper>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('Missing auth token cookie');

    // 쿠키가 있으면 백엔드에서 인증 처리
    await axiosInstance.get('/auth/me', { headers: { cookie } });

    return { props: {} };
  } catch (error) {
    // 백엔드 요청에서 준 cookie를 사용해 인증 처리할 때 에러가 나면 /login 페이지로 이동
    res.writeHead(307, { Location: '/login' }).end();
    return { props: {} };
  }
};
