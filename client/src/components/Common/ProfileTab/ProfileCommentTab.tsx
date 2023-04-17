import React from 'react';
import CommentTab from './CommentTab';
import ProfileTab from './ProfileTab';
import T from './Tab.styles';

function ProfileCommentTab({ identifier }: { identifier: string }) {
  console.log('identifier>>>', identifier);

  return (
    <T.Wrapper>
      <CommentTab />
    </T.Wrapper>
  );
}

export default ProfileCommentTab;
