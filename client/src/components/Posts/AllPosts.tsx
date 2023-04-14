import React from 'react';
import { getAllPostsAPI } from '../../apis/post';
import Posts from './Posts';

function AllPosts() {
  const { data: allPosts } = getAllPostsAPI();
  console.log('post data>>>', allPosts);

  return (
    <div>
      {/* {allPosts.map((post) => {})} */}
      <Posts posts={allPosts} />
    </div>
  );
}

export default AllPosts;
