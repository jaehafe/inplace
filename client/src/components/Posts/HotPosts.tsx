import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../configs/axios';
import { useInView } from 'react-intersection-observer';
import Posts from './Posts';
import { Spin } from 'antd';
import P from './Posts.styles';

function HotPosts() {
  const { ref: observeRef, inView } = useInView();

  const queryKey = `/posts/hot`;

  const {
    data: infiniteHotPostData,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
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
      staleTime: 600000,
      cacheTime: 300000,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, observeRef]);

  return (
    <div>
      {infiniteHotPostData?.pages?.map((page, pageIndex) => {
        return page?.result?.map((post: any, postIndex: number) => {
          return <Posts post={post} ref={observeRef} key={post.identifier} />;
        });
      })}

      <P.LoadingWrapper>
        {isFetchingNextPage || isFetching ? <Spin size="large" /> : ''}
      </P.LoadingWrapper>
    </div>
  );
}

export default HotPosts;
