import { useQuery } from '@tanstack/react-query';
import { PaginationProps, Spin } from 'antd';
import React, { useState } from 'react';
import { getOwnPostsAPI } from '../../../apis/post';
import { axiosInstance } from '../../../configs/axios';
import P from '../../Posts/Posts.styles';
import ProfileTab from './ProfileTab';
import T from './Tab.styles';

function ProfilePostTab({ identifier }: { identifier: string }) {
  const [page, setPage] = useState(1);
  const onChange: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setPage(page);
  };

  const queryKey = `/posts/owned/${identifier}?page=${page - 1}`;

  const fetchOwnPosts = async (page = 0) => {
    const { data } = await axiosInstance.get(`${queryKey}`);

    return data;
  };

  const {
    status,
    data: postData,
    error,
    isLoading,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchOwnPosts(page),
    keepPreviousData: true,
    staleTime: 100000,
  });

  const pageSize = postData?.data?.length;
  const isLastPage = pageSize === 0 || pageSize < postData?.total;

  console.log('postData>> 페이지네이션>', postData);

  return (
    <T.Wrapper>
      <P.LoadingWrapper>
        {isLoading || isFetching ? <Spin size="large" /> : ''}
      </P.LoadingWrapper>
      {postData?.data.length > 0 ? (
        <>
          {postData?.data?.map((data: any) => {
            return (
              <ProfileTab
                post={data}
                key={data.identifier}
                queryKey={queryKey}
              />
            );
          })}
          <T.AntdPagination
            current={page}
            onChange={onChange}
            total={postData?.total}
            pageSize={pageSize}
          />
        </>
      ) : (
        <span>작성한 게시글이 없습니다.</span>
      )}
    </T.Wrapper>
  );
}
export default ProfilePostTab;
