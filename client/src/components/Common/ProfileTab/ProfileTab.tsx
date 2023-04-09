import Image from 'next/image';
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

function ProfileTab() {
  return (
    <>
      <T.BodyWrapper>
        <ProfileImage style={{ borderRadius: '10px', marginRight: '10px' }} />
        <T.Body>
          <h4>아파트단지 통행로의 외부인 사용 어떻게 보시나요?</h4>
          <span>by 유저네임 · 2023.03.30</span>
        </T.Body>
      </T.BodyWrapper>
      <T.Footer>
        <T.VoteWrapper>
          <LikeTwoTone twoToneColor="#2515d5" />
          <FrownTwoTone twoToneColor="#eb2f96" />
          <DislikeTwoTone twoToneColor="#52c41a" />
          <span>14</span>
        </T.VoteWrapper>
        <T.CommentWrapper>
          <CommentOutlined />
          <span>12</span>
        </T.CommentWrapper>
        <T.ViewWrapper>
          <EyeOutlined />
          <span>123</span>
        </T.ViewWrapper>
      </T.Footer>
      <Divider style={{ margin: '14px 0' }} />

      <T.BodyWrapper>
        <ProfileImage style={{ borderRadius: '10px', marginRight: '10px' }} />
        <T.Body>
          <h4>아파트단지 통행로의 외부인 사용 어떻게 보시나요?</h4>
          <span>by 유저네임 · 2023.03.30</span>
        </T.Body>
      </T.BodyWrapper>
      <T.Footer>
        <T.VoteWrapper>
          <LikeTwoTone twoToneColor="#2515d5" />
          <FrownTwoTone twoToneColor="#eb2f96" />
          <DislikeTwoTone twoToneColor="#52c41a" />
          <span>14</span>
        </T.VoteWrapper>
        <T.CommentWrapper>
          <CommentOutlined />
          <span>12</span>
        </T.CommentWrapper>
        <T.ViewWrapper>
          <EyeOutlined />
          <span>123</span>
        </T.ViewWrapper>
      </T.Footer>
      <Divider style={{ margin: '14px 0' }} />
    </>
  );
}

export default ProfileTab;
