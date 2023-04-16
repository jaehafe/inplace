import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { getAllPostsAPI } from '../../apis/post';
import { axiosInstance, baseURL } from '../../configs/axios';
import Posts from './Posts';

function AllPosts() {
  const { data: allPosts } = getAllPostsAPI();

  const queryKey = `${baseURL}/posts`;

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
    async ({ pageParam = 2 }) => {
      const res = await axiosInstance.get(`/posts?page=${pageParam}`);
      // const res = await axios.get(`localhost:4000/api/posts?page=2`);
      return res.data;
    }
    // {
    //   getNextPageParam: (lastPage, allPages) => {
    //     console.log('lastPage>>>', lastPage);

    //     if (!lastPage.isLast) {
    //       return lastPage.nextPage;
    //     } else {
    //       return undefined;
    //     }
    //   },
    // }
  );
  console.log('무한 스크롤 data>>>', infiniteData);

  return (
    <div>
      {allPosts?.map((post: any) => {
        return <Posts post={post} key={post.identifier} />;
      })}
    </div>
  );
}

export default AllPosts;
