import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { message, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { handleFollowAPI } from '../../apis/follow';
import { axiosInstance } from '../../configs/axios';
import { useUserInfo } from '../../store/userStore';
import P from '../Posts/Posts.styles';
import ProfileImage from '../Common/ProfileImage';
import T from './Tab.styles';
import CustomizedEmpty from '../Common/CustomizedEmpty';

interface IProfileFollowList {
  identifier: string;
  setOpenFollowList: Dispatch<SetStateAction<boolean>>;
}

function ProfileFollowerTab({
  identifier,
  setOpenFollowList,
}: IProfileFollowList) {
  const router = useRouter();
  const currentLoginUser = useUserInfo();
  const queryClient = useQueryClient();
  const { ref: observeRef, inView } = useInView();

  const queryKey = `/follows/${identifier}/followers`;

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
      cacheTime: 700000, // 6분 동안 캐시된 데이터 유효
      staleTime: 600000,
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
      <>
        {infiniteData?.pages[0].result.length === 0 && (
          <CustomizedEmpty desc1="팔로워가 없습니다." />
        )}
      </>
      <>
        {infiniteData?.pages?.map((page) => {
          return page?.result?.map((data: any) => {
            const {
              follower: { createdAt, username, image },
              isFollowing,
              followerId,
            } = data;

            return (
              <T.Wrapper ref={observeRef} key={createdAt}>
                <T.BodyLeft onClick={() => handleProfileRoute(username)}>
                  <ProfileImage src={image.src} width={40} height={40} />
                  <span>{username}</span>
                </T.BodyLeft>

                {currentLoginUser?.id !== followerId ? (
                  <T.BodyRight>
                    {currentLoginUser ? (
                      <T.FollowButton
                        type="dashed"
                        size="small"
                        onClick={() => handleFollowing(followerId)}
                        $isFollowing={isFollowing}
                      >
                        {isFollowing ? '팔로잉 취소' : '팔로우'}
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
          });
        })}
      </>
      <P.LoadingWrapper>
        {isFetchingNextPage || isFetching ? <Spin size="large" /> : ''}
      </P.LoadingWrapper>
    </T.Container>
  );
}

export default ProfileFollowerTab;
