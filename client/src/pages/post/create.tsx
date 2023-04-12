import React from 'react';
import L from '../../components/Layout/Layout.styles';
import CreatePost from '../../components/Posts/CreatePost';

function PostCreate() {
  return (
    <L.LayoutWrapper>
      <CreatePost />
    </L.LayoutWrapper>
  );
}

export default PostCreate;
