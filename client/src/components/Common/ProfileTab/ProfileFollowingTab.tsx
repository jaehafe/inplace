import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { handleFollowAPI } from '../../../apis/follow';
import { getUserInfoAPI } from '../../../apis/user';
import { axiosInstance } from '../../../configs/axios';
import { useUserStore } from '../../../store/userStore';
import { IIdentifier } from '../../../types';
import P from '../../Posts/Posts.styles';
import ProfileImage from '../ProfileImage';
import T from './Tab.styles';

interface IProfileFollowList {
  identifier: string;
  setOpenFollowList: Dispatch<SetStateAction<boolean>>;
}

function ProfileFollowingTab({
  identifier,
  setOpenFollowList,
}: IProfileFollowList) {
  const router = useRouter();
  const currentLoginUser = useUserStore((state) => state.userInfo);
  const { data: userInfo } = getUserInfoAPI(identifier);

  const queryClient = useQueryClient();
  const { ref: observeRef, inView } = useInView();

  const queryKey = `/follows/${identifier}/followings`;

  const {
    status,
    data: infiniteData,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    [queryKey],
    async ({ pageParam = 0 }) => {
      const { data } = await axiosInstance.get(`${queryKey}?page=${pageParam}`);
      const isLast = data.length === 0;

      return {
        result: data,
        nextPage: pageParam + 1,
        isLast,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.isLast) {
          return lastPage.nextPage;
        } else {
          return undefined;
        }
      },
      cacheTime: 600000, // 6분 동안 캐시된 데이터 유효
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, observeRef]);

  const onSuccessFollow = (data: any) => {
    message.success(data.message);
    queryClient.invalidateQueries([queryKey]);
    queryClient.invalidateQueries([`/user/${identifier}`]);
  };
  const onErrorFollow = (data: any) => {
    message.error(data.response.data.error);
  };
  const { mutate: followMutate } = handleFollowAPI({
    onSuccess: onSuccessFollow,
    onError: onErrorFollow,
  });

  const handleFollowing = (id: number) => {
    console.log('following id>>', id);

    followMutate({ id });
  };

  const handleLogin = () => {
    message.success('로그인 페이지로 이동합니다.');
    router.push('/login');
  };

  const handleProfileRoute = (username: string) => {
    router.push(`/profile/${username}`);
    setOpenFollowList(false);
  };

  return (
    <T.Container>
      {infiniteData?.pages?.map((page) =>
        page?.result?.map((data: any) => {
          const {
            following: { createdAt, username, image },
            isFollowing,
            followingId,
          } = data;

          return (
            <T.Wrapper ref={observeRef} key={createdAt}>
              <T.BodyLeft onClick={() => handleProfileRoute(username)}>
                <ProfileImage
                  src={image.src}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
                />
                <span>{username}</span>
              </T.BodyLeft>

              {currentLoginUser?.id !== followingId ? (
                <T.BodyRight>
                  {currentLoginUser ? (
                    <T.FollowButton
                      type="dashed"
                      size="small"
                      onClick={() => handleFollowing(followingId)}
                      $isFollowing={isFollowing}
                    >
                      {isFollowing ? '팔로우' : '팔로잉 취소'}
                    </T.FollowButton>
                  ) : (
                    ''
                  )}
                </T.BodyRight>
              ) : (
                ''
              )}
            </T.Wrapper>
          );
        })
      )}
      <P.LoadingWrapper>
        {isFetchingNextPage || isFetching ? <Spin size="large" /> : ''}
      </P.LoadingWrapper>
    </T.Container>
  );
}

export default ProfileFollowingTab;
