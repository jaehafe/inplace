import React from 'react';
import { getDetailPostAPI } from '../../apis/post';
import PostHeader from '../../components/Header/PostHeader/PostHeader';
import PostDetail from '../../components/Posts/PostDetail';

function DetailPostPage() {
  const { data: detailPost } = getDetailPostAPI();
  console.log('detailPost', detailPost);

  return (
    <div>
      <PostHeader />
      <PostDetail />
    </div>
  );
}

export default DetailPostPage;
