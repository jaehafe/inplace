import React from 'react';
import { getAllPostsAPI } from '../../apis/post';
import Posts from './Posts';

function AllPosts() {
  const { data: allPosts } = getAllPostsAPI();
  console.log('post data>>>', allPosts);

  return (
    <div>
      {allPosts?.map((post: any) => {
        return <Posts post={post} key={post.identifier} />;
      })}
    </div>
  );
}

export default AllPosts;
