import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { axiosInstance } from '../../../configs/axios';
import { IIdentifier } from '../../../types';
import ProfileImage from '../ProfileImage';
import T from './Tab.styles';

function ProfileFollowerTab({ identifier }: IIdentifier) {
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
      cacheTime: 60000, // 60초간 캐시된 데이터 유효
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, observeRef]);

  return (
    <T.Container ref={observeRef}>
      <T.Wrapper>
        <T.BodyLeft>
          <ProfileImage
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
          />
          <span>유저이름</span>
        </T.BodyLeft>

        <T.FollowButton type="dashed" size="small">
          팔로잉
        </T.FollowButton>
      </T.Wrapper>

      <T.Wrapper>
        <T.BodyLeft>
          <ProfileImage
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
          />
          <span>유저이름</span>
        </T.BodyLeft>

        <T.FollowButton type="dashed" size="small">
          팔로잉
        </T.FollowButton>
      </T.Wrapper>
    </T.Container>
  );
}

export default ProfileFollowerTab;
