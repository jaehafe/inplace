import React from 'react';
import { getAllPostAPI } from '../../apis/post';
import Posts from './Posts';

function AllPosts() {
  const { data: allPosts } = getAllPostAPI();
  console.log('post data>>>', allPosts);

  return (
    <div>
      <Posts posts={allPosts} />
    </div>
  );
}

export default AllPosts;
