import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { message, TabsProps } from 'antd';
import { GetServerSideProps } from 'next';

import React, { useState } from 'react';
import { getUserInfoAPI } from '../../apis/user';
import ProfileImage from '../../components/Common/ProfileImage';
import ProfileCommentTab from '../../components/Common/ProfileTab/ProfileCommentTab';
import ProfilePostTab from '../../components/Common/ProfileTab/ProfilePostTab';
import ProfileFollowerTab from '../../components/Common/ProfileTab/ProfileFollowerTab';
import LogoHeader from '../../components/Header/LogoHeader/LogoHeader';
import { axiosInstance } from '../../configs/axios';
import { useUserStore } from '../../store/userStore';
import { handleFollowAPI } from '../../apis/follow';
import P from './Profile.styles';
import T from '../../components/Common/ProfileTab/Tab.styles';

function Profile({ identifier }: { identifier: string }) {
  const items: TabsProps['items'] = [
    {
      key: '작성 글',
      label: `작성 글`,
      children: <ProfilePostTab identifier={identifier} />,
    },
    {
      key: '작성 댓글',
      label: `작성 댓글`,
      children: <ProfileCommentTab identifier={identifier} />,
    },
    {
      key: '응답한 글',
      label: `응답한 글`,
      children: <>123</>,
    },
  ];

  const followItems: TabsProps['items'] = [
    {
      key: '팔로워',
      label: `팔로워 목록`,
      children: (
        <T.Wrapper>
          <ProfileFollowerTab identifier={identifier} />
        </T.Wrapper>
      ),
    },
    {
      key: '팔로잉',
      label: `팔로잉 목록`,
      children: <ProfileCommentTab identifier={identifier} />,
    },
  ];

  const [open, setOpen] = useState(false);
  const currentLoginUser = useUserStore((state) => state.userInfo);
  const { data: userInfo } = getUserInfoAPI(identifier);
  const queryClient = useQueryClient();
  console.log(userInfo);

  // onSuccessFollow
  const onSuccessFollow = (data: any) => {
    message.success(data.message);
    queryClient.invalidateQueries([`/user/${identifier}`]);
  };
  const onErrorFollow = (data: any) => {
    message.error(data.response.data.error);
  };
  const { mutate: followMutate } = handleFollowAPI(userInfo?.username, {
    onSuccess: onSuccessFollow,
    onError: onErrorFollow,
  });

  const onChange = (key: string) => {
    console.log(key);
  };

  const handleFollowTabChange = (key: string) => {
    console.log('>>>>>', key);
  };

  const handleFollowing = () => {
    followMutate({ username: userInfo?.username });
  };

  return (
    <P.Wrapper>
      <LogoHeader headerIcons={false} />
      <P.InfoWrapper>
        <P.InfoLeft>
          <h2>{userInfo?.username}</h2>
          <P.FollowInfoWrapper onClick={() => setOpen(true)}>
            <h4>팔로워 {userInfo?.followersCount}</h4>
            <h4>팔로잉 {userInfo?.followingCount}</h4>
          </P.FollowInfoWrapper>
          {currentLoginUser?.username === userInfo?.username ? (
            <P.EditButton>프로필 편집</P.EditButton>
          ) : (
            <P.EditButton onClick={handleFollowing}>팔로우</P.EditButton>
          )}
        </P.InfoLeft>
        <P.InfoRight>
          <ProfileImage src={userInfo?.image?.src} />
        </P.InfoRight>
      </P.InfoWrapper>
      <P.StyledTab defaultActiveKey="1" items={items} onChange={onChange} />

      {/* 팔로잉 팔로우 탭 */}
      <P.FollowInfoDrawer
        placement="bottom"
        // title="팔로잉 / 팔로우"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key="bottom"
        height={'auto'}
        style={{ overflowY: 'scroll' }}
      >
        <P.StyledFollowTab
          items={followItems}
          onChange={handleFollowTabChange}
        />
      </P.FollowInfoDrawer>
    </P.Wrapper>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();
  const queryKey = `/profile/${params?.identifier}`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  await queryClient.prefetchQuery([queryKey], queryFn);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      identifier: params?.identifier,
    },
  };
};

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   try {
//     const cookie = req.headers.cookie;
//     if (!cookie) throw new Error('Missing auth token cookie');

//     // 쿠키가 있으면 백엔드에서 인증 처리
//     await axiosInstance.get('/auth/me', { headers: { cookie } });

//     return { props: {} };
//   } catch (error) {
//     // 백엔드 요청에서 준 cookie를 사용해 인증 처리할 때 에러가 나면 /login 페이지로 이동
//     res.writeHead(307, { Location: '/login' }).end();
//     return { props: {} };
//   }
// };
