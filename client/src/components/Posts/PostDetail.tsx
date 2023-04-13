import {
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  MoreOutlined,
} from '@ant-design/icons';
import { Button, RadioChangeEvent } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  formattedDate,
  postDescEllipsis,
  postTitleEllipsis,
} from '../../utils';
import PostComment from './PostComment';
import P from './Posts.styles';

const voteOptions = [
  { label: <LikeTwoTone twoToneColor="#2515d5" />, value: 'VoteUp' },
  { label: <FrownTwoTone twoToneColor="#eb2f96" />, value: 'VoteNeutral' },
  { label: <DislikeTwoTone twoToneColor="#52c41a" />, value: 'VoteDown' },
];

function PostDetail({ detailPost }: any) {
  const {
    identifier,
    username,
    createdAt,
    updatedAt,
    title,
    upVote,
    neutralVote,
    downVote,
    desc,
    images,
    commentCount,
    voteScore,
    comments,
  } = detailPost;

  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState('');

  const handleVoteChange = (e: RadioChangeEvent) => {
    setVote(e.target.value);
    console.log(`radio checked:${e.target.value}`);
  };
  console.log('detailPost', detailPost);

  return (
    <div>
      <P.Wrapper>
        <P.HeaderWrapper>
          <P.HeaderLeft>
            <Image
              src="https://www.gravatar.com/avatar?d=mp&f=y"
              width={46}
              height={46}
              style={{ borderRadius: '50px' }}
              alt="avatar"
            />
            <P.PostInfo>
              <h4>{username}</h4>
              <span>{formattedDate(createdAt)}</span> · <span>조회 234</span>
            </P.PostInfo>
          </P.HeaderLeft>
          <P.HeaderRight>
            <Button type="text" shape="circle" onClick={() => setOpen(true)}>
              <MoreOutlined style={{ fontSize: '20px' }} />
            </Button>
          </P.HeaderRight>
        </P.HeaderWrapper>
        <P.BodyWrapper>
          {/* 제목, 내용 */}
          <pre>{title}</pre>
          <pre>{desc}</pre>
          {/* O X */}
          <P.VoteResultWrapper>
            <P.VoteResult>
              <LikeTwoTone twoToneColor="#2515d5" />
              <span>{upVote}</span>
            </P.VoteResult>
            <P.VoteResult>
              <FrownTwoTone twoToneColor="#eb2f96" />
              <span>{neutralVote}</span>
            </P.VoteResult>
            <P.VoteResult>
              <DislikeTwoTone twoToneColor="#52c41a" />
              <span>{downVote}</span>
            </P.VoteResult>
          </P.VoteResultWrapper>

          <P.VoteSelectWrapper>
            <P.VoteSelect
              size="large"
              optionType="button"
              buttonStyle="solid"
              onChange={handleVoteChange}
            >
              <P.VoteButton value="a">
                <LikeTwoTone twoToneColor="#2515d5" />
              </P.VoteButton>
              <P.VoteButton value="b">
                <FrownTwoTone twoToneColor="#eb2f96" />
              </P.VoteButton>
              <P.VoteButton value="c">
                <DislikeTwoTone twoToneColor="#52c41a" />
              </P.VoteButton>
            </P.VoteSelect>
          </P.VoteSelectWrapper>

          {/* 게시물 댓글 컴포넌트 */}
          <PostComment comments={comments} />
        </P.BodyWrapper>
      </P.Wrapper>
    </div>
  );
}

export default PostDetail;

{
  /* <P.VoteSelect
              size="large"
              optionType="button"
              buttonStyle="solid"
              onChange={handleVoteChange}
            >
              <Radio.Button value="a">
                <LikeTwoTone twoToneColor="#2515d5" />
              </Radio.Button>
              <Radio.Button value="b">
                <FrownTwoTone twoToneColor="#eb2f96" />
              </Radio.Button>
              <Radio.Button value="c">
                <DislikeTwoTone twoToneColor="#52c41a" />
              </Radio.Button>
            </P.VoteSelect> */
}

{
  /* <P.VoteSelect
              size="large"
              options={voteOptions}
              onChange={handleVoteChange}
              value={vote}
              optionType="button"
              buttonStyle="solid"
            /> */
}
