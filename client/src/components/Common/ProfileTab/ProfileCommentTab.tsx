import { useQuery } from '@tanstack/react-query';
import { Pagination, PaginationProps, Spin } from 'antd';
import React, { useState } from 'react';
import { axiosInstance } from '../../../configs/axios';
import P from '../../Posts/Posts.styles';
import CommentTab from './CommentTab';
import ProfileTab from './ProfileTab';
import T from './Tab.styles';

function ProfileCommentTab({ identifier }: { identifier: string }) {
  console.log('identifier>>>', identifier);
  const [page, setPage] = useState(1);

  const onChange: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setPage(page);
  };

  const queryKey = `/comments/owned/${identifier}?page=${page}`;

  const fetchOwnComments = async (page = 0) => {
    const { data } = await axiosInstance.get(`${queryKey}`);
    console.log('댓글>>>', data);

    return data;
  };

  const {
    status,
    data: commentData,
    error,
    isLoading,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchOwnComments(page),
    keepPreviousData: true,
    staleTime: 10000,
  });

  return (
    <T.Wrapper>
      <P.LoadingWrapper>
        {isLoading || isFetching ? <Spin size="large" /> : ''}
      </P.LoadingWrapper>
      {commentData ? (
        <>
          {commentData.map((data: any) => {
            return (
              <CommentTab
                data={data}
                key={data.identifier}
                queryKey={queryKey}
              />
            );
          })}
          <T.AntdPagination
            current={page}
            onChange={onChange}
            total={5}
            pageSize={commentData.length}
          />
        </>
      ) : (
        <span>작성한 댓글이 없습니다.</span>
      )}
    </T.Wrapper>
  );
}

export default ProfileCommentTab;
