import { Button } from 'antd';
import React from 'react';
import { IIdentifier } from '../../../types';
import ProfileImage from '../ProfileImage';
import T from './Tab.styles';

function ProfileFollowerTab({ identifier }: IIdentifier) {
  return (
    <T.Container>
      <T.Wrapper>
        <T.BodyLeft>
          <ProfileImage
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
          />
          <span>유저이름</span>
        </T.BodyLeft>

        <T.FollowButton type="dashed" size="small">
          팔로잉
        </T.FollowButton>
      </T.Wrapper>

      <T.Wrapper>
        <T.BodyLeft>
          <ProfileImage
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
          />
          <span>유저이름</span>
        </T.BodyLeft>

        <T.FollowButton type="dashed" size="small">
          팔로잉
        </T.FollowButton>
      </T.Wrapper>
    </T.Container>
  );
}

export default ProfileFollowerTab;
