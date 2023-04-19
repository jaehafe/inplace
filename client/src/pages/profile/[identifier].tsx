import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Button, message, TabsProps } from 'antd';
import { GetServerSideProps } from 'next';

import React, { useEffect, useState } from 'react';
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import ProfileFollowingTab from '../../components/Common/ProfileTab/ProfileFollowingTab';
import ProfileInfo from '../../components/Common/ProfileTab/ProfileInfo';

function Profile({ identifier }: { identifier: string }) {
  const router = useRouter();
  const [openFollowList, setOpenFollowList] = useState(false);
  const currentLoginUser = useUserStore((state) => state.userInfo);
  const queryClient = useQueryClient();
  // console.log(userInfo);

  const { data: userInfo } = getUserInfoAPI(identifier);

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

  const handleFollowing = () => {
    followMutate({ username: userInfo?.username });
  };

  const handleLogin = () => {
    message.success('프로필 편집 페이지로 이동합니다.(아직 미 구현)');
  };

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
          <ProfileFollowerTab
            identifier={identifier}
            setOpenFollowList={setOpenFollowList}
          />
        </T.Wrapper>
      ),
    },
    {
      key: '팔로잉',
      label: `팔로잉 목록`,
      children: (
        <ProfileFollowingTab
          identifier={identifier}
          setOpenFollowList={setOpenFollowList}
        />
      ),
    },
  ];

  const renderProfileInfo = () => {
    if (userInfo?.error) {
      return <span>존재하지 않는 유저 입니다. 다른 유저를 찾아보세요</span>;
    }

    return (
      <ProfileInfo
        userInfo={userInfo}
        currentLoginUser={currentLoginUser || null}
        handleFollowing={handleFollowing}
        setOpenFollowList={setOpenFollowList}
      />
    );
  };

  return (
    <P.Wrapper>
      <LogoHeader headerIcons={false} />
      <P.InfoWrapper>
        <P.InfoLeft>{renderProfileInfo()}</P.InfoLeft>
        <P.InfoRight>
          <ProfileImage src={userInfo?.image?.src} />
        </P.InfoRight>
      </P.InfoWrapper>
      {/* 탭 부분 */}
      <P.StyledTab defaultActiveKey="1" items={items} />

      {/* 팔로잉 팔로우 탭 */}
      <P.FollowInfoDrawer
        placement="bottom"
        // title="팔로잉 / 팔로우"
        closable={false}
        onClose={() => setOpenFollowList(false)}
        open={openFollowList}
        key="bottom"
        height={'auto'}
        style={{ overflowY: 'scroll' }}
      >
        <P.StyledFollowTab items={followItems} />
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
