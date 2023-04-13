import React, { useState } from 'react';
import {
  CommentOutlined,
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  MoreOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Divider, RadioChangeEvent } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import P from './Posts.styles';
import {
  commentBodyEllipsis,
  formattedDate,
  postDescEllipsis,
  postTitleEllipsis,
} from '../../utils';
import Link from 'next/link';

const voteOptions = [
  { label: <LikeTwoTone twoToneColor="#2515d5" />, value: 'VoteUp' },
  { label: <FrownTwoTone twoToneColor="#eb2f96" />, value: 'VoteNeutral' },
  { label: <DislikeTwoTone twoToneColor="#52c41a" />, value: 'VoteDown' },
];

function AllPosts({ posts }: any) {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState('');
  const router = useRouter();

  const handleVoteChange = ({ target: { value } }: RadioChangeEvent) => {
    setVote(value);
  };

  return (
    <>
      {posts?.map((post: any) => {
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
        } = post;
        return (
          <P.Wrapper key={identifier}>
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
                  <span>{formattedDate(createdAt)}</span> ·{' '}
                  <span>조회 234</span>
                </P.PostInfo>
              </P.HeaderLeft>
              <P.HeaderRight>
                <Button
                  type="text"
                  shape="circle"
                  onClick={() => setOpen(true)}
                >
                  <MoreOutlined style={{ fontSize: '20px' }} />
                </Button>
              </P.HeaderRight>
            </P.HeaderWrapper>
            <P.BodyWrapper>
              {/* 제목, 내용 */}
              <Link href={`/post/${identifier}`}>
                <h3>{postTitleEllipsis(title)}</h3>
                <p>{postDescEllipsis(desc)}</p>
              </Link>
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
              {/* 댓글, 투표 통계 버튼 */}
              <P.StaticsWrapper>
                <P.StaticsLeft>
                  <P.StaticsButton type="primary">
                    <PieChartOutlined />
                    {voteScore}
                  </P.StaticsButton>
                  <P.StaticsButton type="primary">
                    <CommentOutlined />
                    {commentCount}
                  </P.StaticsButton>
                </P.StaticsLeft>
                <P.StaticsRight>
                  <P.VoteSelect
                    options={voteOptions}
                    onChange={handleVoteChange}
                    value={vote}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </P.StaticsRight>
              </P.StaticsWrapper>

              {/* comment 작업 */}
              <P.CommentWrapper>
                {comments?.map((c: any) => {
                  const { createdAt, identifier, username, body } = c;
                  return (
                    <Link href={`/post/${identifier}`} key={identifier}>
                      <P.Comment>
                        <Image
                          src="https://www.gravatar.com/avatar?d=mp&f=y"
                          width={20}
                          height={20}
                          style={{ borderRadius: '50px' }}
                          alt="avatar"
                        />
                        <span>{commentBodyEllipsis(body)}</span>
                      </P.Comment>
                    </Link>
                  );
                })}
              </P.CommentWrapper>
            </P.BodyWrapper>
            <Divider />
          </P.Wrapper>
        );
      })}
      <P.PostDrawer
        placement="bottom"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key="bottom"
        height={'auto'}
      >
        <Button type="text" shape="round">
          공유
        </Button>
        <Divider />
        <Button type="text" shape="round">
          스크랩
        </Button>
        <Divider />
        <Button type="text" shape="round">
          팔로우
        </Button>
        <Divider />
        <Button type="text" shape="round">
          수정
        </Button>
        <Divider />
        <Button type="text" shape="round">
          삭제
        </Button>
      </P.PostDrawer>
    </>
  );
}

export default AllPosts;
