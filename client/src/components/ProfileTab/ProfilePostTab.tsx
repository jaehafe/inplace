import { useQuery } from '@tanstack/react-query';
import { PaginationProps, Spin } from 'antd';
import React, { useState } from 'react';
import { getOwnPostsAPI } from '../../apis/post';
import { axiosInstance } from '../../configs/axios';
import CustomizedEmpty from '../Common/CustomizedEmpty';
import P from '../Posts/Posts.styles';
import PostTab from './PostTab';
import T from './Tab.styles';

interface IProfilePostTab {
  identifier: string;
  userInfo: any;
  currentLoginUser: any;
}

function ProfilePostTab({
  identifier,
  userInfo,
  currentLoginUser,
}: IProfilePostTab) {
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
      {postData?.data.length > 0 ? (
        <>
          {postData?.data?.map((data: any) => {
            return (
              <PostTab post={data} key={data.identifier} queryKey={queryKey} />
            );
          })}
          <T.AntdPagination
            current={page}
            onChange={onChange}
            total={postData?.total}
          />
        </>
      ) : (
        <>{isSameUser('게시글')}</>
      )}
      <P.LoadingWrapper>
        {isLoading || isFetching ? <Spin size="large" /> : null}
      </P.LoadingWrapper>
    </>
  );
}
export default ProfilePostTab;
