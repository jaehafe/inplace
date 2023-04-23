import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getAllPostsAPI } from '../../apis/post';
import { axiosInstance, baseURL } from '../../configs/axios';
import { useInView } from 'react-intersection-observer';
import Posts from './Posts';
import { Spin } from 'antd';
import P from './Posts.styles';
import PostEditModal from './PostEditModal';
import EditPost from './EditPost';

function HotPosts() {
  const { ref: observeRef, inView } = useInView();
  // const [queryKey, setQueryKey] = useState(`/posts?page=0`);

  const queryKey = `/posts/hot`;

  const {
    status,
    data: infiniteHotPostData,
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
