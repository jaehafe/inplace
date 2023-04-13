import { Spin } from 'antd';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { getDetailPostAPI } from '../../apis/post';
import PostHeader from '../../components/Header/PostHeader/PostHeader';
import PostDetail from '../../components/Posts/PostDetail';
import { baseURL } from '../../configs/axios';

function DetailPostPage() {
  const router = useRouter();
  const { identifier } = router.query;
  const { data: detailPost, isLoading } = getDetailPostAPI(identifier);

  return (
    <div>
      <PostHeader />
      <PostDetail detailPost={detailPost} />
    </div>
  );
}

export default DetailPostPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const res = await axios.get(`${baseURL}/posts/${params?.identifier}`);
  const data = res.data;

  return { props: { data: data } };
};
