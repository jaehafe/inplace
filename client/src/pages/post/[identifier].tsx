import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import { getCommentsAPI, getDetailPostAPI } from '../../apis/post';
import PostHeader from '../../components/Header/PostHeader/PostHeader';
import PostDetail from '../../components/Posts/PostDetail';
import { axiosInstance, baseURL } from '../../configs/axios';
// { identifier: string }

function DetailPostPage({ identifier }: { identifier: string }) {
  // const router = useRouter();
  // const { identifier } = router.query;

  console.log('identifier>>', identifier);

  const { data: detailPost, isLoading } = getDetailPostAPI(identifier);
  const { data: commentData } = getCommentsAPI(identifier);
  console.log('commentData>>', commentData);

  if (isLoading) {
    <Spin size="large" />;
  }

  return (
    <div>
      <PostHeader />
      <PostDetail detailPost={detailPost} commentData={commentData} />
    </div>
  );
}

export default DetailPostPage;

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const res = await axios.get(`${baseURL}/posts/${params?.identifier}`);
//   const data = res.data;

//   return { props: { data: data } };
// };
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
