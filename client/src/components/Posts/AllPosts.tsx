import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import { getAllPostsAPI } from '../../apis/post';
import { axiosInstance, baseURL } from '../../configs/axios';
import { useInView } from 'react-intersection-observer';
import Posts from './Posts';
import { Spin } from 'antd';
import P from './Posts.styles';

function AllPosts() {
  const { ref: observeRef, inView } = useInView();
  // const { data: allPosts } = getAllPostsAPI();

  const queryKey = `/posts`;

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
      // console.log(`>>>${pageParam}<<< 의 새로운 데이터>>`, data);
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
    }
  );
  // console.log('무한 스크롤 data>>>', infiniteData);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, observeRef]);

  return (
    <div>
      {/* {allPosts?.map((post: any) => {
        return <Posts post={post} key={post.identifier} />;
      })} */}
      {infiniteData?.pages.map((page, pageIndex) => {
        return page.result.map((post: any, postIndex: number) => {
          // const isLastPost = page.result.length === postIndex + 1;
          // const shouldObserve =
          //   infiniteData.pages.length === pageIndex + 1 && isLastPost;

          // ref={shouldObserve ? ref : null}
          return (
            <div key={post.identifier}>
              <Posts
                post={post}
                // isFetchingNextPage={isFetchingNextPage}
                ref={observeRef}
              />
            </div>
          );
        });
      })}

      <P.LoadingWrapper>
        {isFetchingNextPage ? <Spin size="large" /> : ''}
      </P.LoadingWrapper>
    </div>
  );
}

export default AllPosts;
