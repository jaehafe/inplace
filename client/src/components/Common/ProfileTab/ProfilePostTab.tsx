import React from 'react';
import { getOwnPostsAPI } from '../../../apis/post';
import ProfileTab from './ProfileTab';
import T from './Tab.styles';

function ProfilePostTab({ identifier }: { identifier: string }) {
  const { data: ownPosts } = getOwnPostsAPI(identifier);

  return (
    <T.Wrapper>
      {ownPosts
        ? ownPosts?.map((post: any) => (
            <ProfileTab post={post} key={post.identifier} />
          ))
        : '작성한 게시글이 없습니다.'}
    </T.Wrapper>
  );
}

export default ProfilePostTab;
