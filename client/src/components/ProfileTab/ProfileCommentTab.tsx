import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationProps, Spin } from 'antd';
import { axiosInstance } from '../../configs/axios';
import CustomizedEmpty from '../Common/CustomizedEmpty';
import CommentTab from './CommentTab';
import P from '../Posts/Posts.styles';
import T from './Tab.styles';

interface IProfileCommentTab {
  identifier: string;
  userInfo: any;
  currentLoginUser: any;
}

function ProfileCommentTab({
  identifier,
  userInfo,
  currentLoginUser,
}: IProfileCommentTab) {
  const [page, setPage] = useState(1);

  const onChange: PaginationProps['onChange'] = (page) => {
    setPage(page);
  };

  const queryKey = `/comments/owned/${identifier}?page=${page - 1}`;

  const fetchOwnComments = async (page = 0) => {
    const { data } = await axiosInstance.get(`${queryKey}`);

    return data;
  };

  const {
    data: commentData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchOwnComments(page),
    keepPreviousData: true,
    staleTime: 10000,
  });

  const isSameUser = (desc: string) => {
    if (!currentLoginUser || !userInfo) {
      return null;
    }

    if (currentLoginUser?.id === userInfo?.id) {
      return (
        <CustomizedEmpty
          desc1={`작성한 ${desc}이 없습니다.`}
          buttonMessage={`${desc}을 작성해보세요`}
        />
      );
    } else if (currentLoginUser?.id !== userInfo?.id) {
      return <CustomizedEmpty desc1="작성한 게시글이 없습니다." />;
    }
  };

  return (
    <>
      {commentData?.data.length > 0 ? (
        <>
          {commentData?.data?.map((data: any) => {
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
            total={commentData?.total}
            // pageSize={commentData?.total.length}
          />
        </>
      ) : (
        <>{isSameUser('댓글')}</>
      )}
      <P.LoadingWrapper>
        {isLoading || isFetching ? <Spin size="large" /> : ''}
      </P.LoadingWrapper>
    </>
  );
}

export default ProfileCommentTab;
