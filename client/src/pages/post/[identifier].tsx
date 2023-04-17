import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import { getDetailPostAPI } from '../../apis/post';
import PostHeader from '../../components/Header/PostHeader/PostHeader';
import PostDetail from '../../components/Posts/PostDetail';
import { axiosInstance } from '../../configs/axios';

function DetailPostPage({ identifier }: { identifier: string }) {
  const { data: detailPost, isLoading } = getDetailPostAPI(identifier);

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <PostHeader />
      {detailPost ? (
        <PostDetail detailPost={detailPost} />
      ) : (
        <h1>해당 게시물이 존재하지 않습니다.</h1>
      )}
    </div>
  );
}

export default DetailPostPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();
  const queryKey = `/posts/${params?.identifier}`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  await queryClient.prefetchQuery([queryKey], queryFn);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      identifier: params?.identifier,
    },
  };
};
