import { useQuery } from '@tanstack/react-query';
import { Pagination, PaginationProps } from 'antd';
import React, { useState } from 'react';
import { axiosInstance } from '../../../configs/axios';
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
  // fetchOwnComments();

  const {
    status,
    data: commentData,
    error,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchOwnComments(page),
    keepPreviousData: true,
    staleTime: 5000,
  });
  console.log('commentData>>>', commentData);

  return (
    <T.Wrapper>
      {commentData ? (
        <>
          {commentData.map((data: any) => {
            return <CommentTab data={data} key={data.identifier} />;
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
