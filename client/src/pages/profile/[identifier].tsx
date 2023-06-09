import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { message, TabsProps } from 'antd';
import { GetServerSideProps } from 'next';

import React, { memo, useState } from 'react';
import { getUserInfoAPI } from '../../apis/user';
import ProfileImage from '../../components/Common/ProfileImage';
import ProfileCommentTab from '../../components/ProfileTab/ProfileCommentTab';
import ProfilePostTab from '../../components/ProfileTab/ProfilePostTab';
import ProfileFollowerTab from '../../components/ProfileTab/ProfileFollowerTab';
import LogoHeader from '../../components/Header/LogoHeader/LogoHeader';
import { axiosInstance } from '../../configs/axios';
import { useUserInfo } from '../../store/userStore';
import { handleFollowAPI } from '../../apis/follow';
import P from '../../components/ProfileTab/Profile.styles';
import T from '../../components/ProfileTab/Tab.styles';
import ProfileFollowingTab from '../../components/ProfileTab/ProfileFollowingTab';
import ProfileInfo from '../../components/ProfileTab/ProfileInfo';
import ProfileEditModal from '../../components/ProfileTab/ProfileEditModal';
import ProfileResponseTab from '../../components/ProfileTab/ProfileResponseTab';

function Profile({ identifier }: { identifier: string }) {
  const currentLoginUser = useUserInfo();
  const queryClient = useQueryClient();
  const [openFollowList, setOpenFollowList] = useState(false);
  const [openProfileEditModal, setOpenProfileEditModal] = useState(false);

  const { data: userInfo } = getUserInfoAPI(identifier);

  const onSuccessFollow = (data: any) => {
    message.success(data.message);
    queryClient.invalidateQueries([`/users/${identifier}`]);
    queryClient.invalidateQueries([`/follows/${identifier}/followers`]);
    queryClient.invalidateQueries([`/follows/${identifier}/followings`]);
  };
  const onErrorFollow = (data: any) => {
    message.error(data.response.data.error);
  };
  const { mutate: followMutate } = handleFollowAPI({
    onSuccess: onSuccessFollow,
    onError: onErrorFollow,
  });

  const handleFollowing = () => {
    followMutate({ id: userInfo?.id });
  };

  const MemoizedProfilePostTab = memo(ProfilePostTab);
  const MemoizedProfileCommentTab = memo(ProfileCommentTab);
  const MemoizedProfileResponseTab = memo(ProfileResponseTab);

  const items: TabsProps['items'] = [
    {
      key: '작성 글',
      label: `작성 글`,
      children: (
        <MemoizedProfilePostTab
          identifier={identifier}
          userInfo={userInfo}
          currentLoginUser={currentLoginUser}
        />
      ),
    },
    {
      key: '작성 댓글',
      label: `작성 댓글`,
      children: (
        <MemoizedProfileCommentTab
          identifier={identifier}
          userInfo={userInfo}
          currentLoginUser={currentLoginUser}
        />
      ),
    },
    {
      key: '응답한 글',
      label: `응답한 글`,
      children: (
        <MemoizedProfileResponseTab
          identifier={identifier}
          userInfo={userInfo}
          currentLoginUser={currentLoginUser}
        />
      ),
    },
  ];

  const MemoizedProfileFollowerTab = memo(ProfileFollowerTab);
  const MemoizedProfileFollowingTab = memo(ProfileFollowingTab);

  const followItems: TabsProps['items'] = [
    {
      key: '팔로워',
      label: `팔로워 목록`,
      children: (
        <T.Wrapper>
          <MemoizedProfileFollowerTab
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
        <MemoizedProfileFollowingTab
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
        setOpenProfileEditModal={setOpenProfileEditModal}
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

      {/* 프로필 편집 모달 */}
      <ProfileEditModal
        userInfo={userInfo}
        setOpenProfileEditModal={setOpenProfileEditModal}
        openProfileEditModal={openProfileEditModal}
      />
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
