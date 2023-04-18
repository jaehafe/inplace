import React from 'react';
import T from './Tab.styles';
import ProfileImage from '../ProfileImage';
import {
  CommentOutlined,
  DislikeTwoTone,
  EyeOutlined,
  FrownTwoTone,
  LikeTwoTone,
} from '@ant-design/icons';
import { Divider } from 'antd';

import Link from 'next/link';
import { formattedDate } from '../../../utils';

function PostTab({ post }: any) {
  const {
    identifier,
    commentCount,
    voteScore,
    updatedAt,
    title,
    username,
    images,
  } = post;

  return (
    <Link href={`/post/${identifier}`}>
      <T.BodyWrapper>
        <ProfileImage src={images[0]?.src} style={{ marginRight: '14px' }} />
        <T.Body>
          <h4>{title}</h4>
          <span>
            by {username} · {formattedDate(updatedAt)}
          </span>
        </T.Body>
      </T.BodyWrapper>
      <T.Footer>
        <T.VoteWrapper>
          <LikeTwoTone twoToneColor="#2515d5" />
          <FrownTwoTone twoToneColor="#eb2f96" />
          <DislikeTwoTone twoToneColor="#52c41a" />
          <span>{voteScore}</span>
        </T.VoteWrapper>
        <T.CommentWrapper>
          <CommentOutlined />
          <span>{commentCount}</span>
        </T.CommentWrapper>
        <T.ViewWrapper>
          <EyeOutlined />
          <span>123</span>
        </T.ViewWrapper>
      </T.Footer>
      <Divider style={{ margin: '14px 0' }} />
    </Link>
  );
}

export default PostTab;
