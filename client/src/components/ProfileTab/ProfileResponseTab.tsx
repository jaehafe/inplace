import { useQuery } from '@tanstack/react-query';
import { PaginationProps, Spin } from 'antd';
import React, { useState } from 'react';
import { axiosInstance } from '../../configs/axios';
import CustomizedEmpty from '../Common/CustomizedEmpty';
import P from '../Posts/Posts.styles';
import PostTab from './PostTab';
import T from './Tab.styles';

interface IProfileResponseTab {
  identifier: string;
  userInfo: any;
  currentLoginUser: any;
}

function ProfileResponseTab({
  identifier,
  userInfo,
  currentLoginUser,
}: IProfileResponseTab) {
  const [page, setPage] = useState(1);
  const onChange: PaginationProps['onChange'] = (page) => {
    setPage(page);
  };

  const queryKey = `/posts/responsed/${identifier}?page=${page - 1}`;

  const fetchOwnPosts = async (page = 0) => {
    const { data } = await axiosInstance.get(`${queryKey}`);

    return data;
  };

  const {
    status,
    data: responseData,
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

  const pageSize = responseData?.data?.length;
  const isLastPage = pageSize === 0 || pageSize < responseData?.total;

  const isSameUser = (desc: string) => {
    if (!currentLoginUser || !userInfo) {
      return null;
    }

    if (currentLoginUser?.id === userInfo?.id) {
      return (
        <CustomizedEmpty
          desc1={`응답한 ${desc}이 없습니다.`}
          // buttonMessage={`${desc} `}
        />
      );
    } else if (currentLoginUser?.id !== userInfo?.id) {
      return <CustomizedEmpty desc1="응답한 게시글이 없습니다." />;
    }
  };

  return (
    <>
      {responseData?.data?.length > 0 ? (
        <>
          {responseData?.data?.map((data: any) => {
            return (
              <PostTab post={data} key={data.identifier} queryKey={queryKey} />
            );
          })}
          <T.AntdPagination
            current={page}
            onChange={onChange}
            total={responseData?.total}
          />
        </>
      ) : (
        <>{isSameUser('개시글')}</>
      )}
      <P.LoadingWrapper>
        {isLoading || isFetching ? <Spin size="large" /> : null}
      </P.LoadingWrapper>
    </>
  );
}
export default ProfileResponseTab;
