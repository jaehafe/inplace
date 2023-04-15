import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import { useCookies } from 'react-cookie';
import { getDetailPostAPI } from '../../apis/post';
import { authMeAPI } from '../../apis/user';
import PostHeader from '../../components/Header/PostHeader/PostHeader';
import PostDetail from '../../components/Posts/PostDetail';
import { axiosInstance, baseURL } from '../../configs/axios';

function DetailPostPage({ identifier }: { identifier: string }) {
  console.log('identifier>>', identifier);

  const { data: detailPost, isLoading } = getDetailPostAPI(identifier);
  // const [cookie] = useCookies(['inplace']);

  // const { data: userInfo } = authMeAPI({ enabled: Boolean(cookie?.inplace) });

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <PostHeader />
      <PostDetail detailPost={detailPost} />
    </div>
  );
}

export default DetailPostPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();
  const queryKey = `${baseURL}/posts/${params?.identifier}`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  await queryClient.prefetchQuery([queryKey], queryFn);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      identifier: params?.identifier,
    },
  };
};
