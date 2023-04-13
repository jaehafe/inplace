import { Spin } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { getDetailPostAPI } from '../../apis/post';
import PostHeader from '../../components/Header/PostHeader/PostHeader';
import PostDetail from '../../components/Posts/PostDetail';

function DetailPostPage() {
  const router = useRouter();
  const { identifier } = router.query;
  const { data: detailPost, isLoading } = getDetailPostAPI(
    identifier as string
  );

  if (isLoading) {
    return <Spin size="large" />;
  }
  console.log('detailPost', detailPost);

  return (
    <div>
      <PostHeader />
      <PostDetail />
    </div>
  );
}

export default DetailPostPage;
