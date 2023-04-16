import React, { useState } from 'react';
import {
  AntDesignOutlined,
  CommentOutlined,
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  MoreOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  message,
  RadioChangeEvent,
  Avatar,
  Tooltip,
  Image as AntdImage,
} from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import P from './Posts.styles';
import {
  commentBodyEllipsis,
  defaultImg,
  formattedDate,
  postDescEllipsis,
  postTitleEllipsis,
} from '../../utils';
import Link from 'next/link';
import { postVoteAPI } from '../../apis/vote';
import { baseURL } from '../../configs/axios';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../store/userStore';

function Post({ post }: any) {
  const {
    identifier,
    username,
    createdAt,
    updatedAt,
    title,
    agree,
    neutral,
    disagree,
    desc,
    images,
    commentCount,
    voteScore,
    comments,
    userVote,
    votes,
    user,
  } = post;

  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const currentLoginUser = useUserStore((state) => state.userInfo);

  const onSuccessVote = () => {
    message.success('투표 완료');
    queryClient.invalidateQueries([`${baseURL}/posts`]);
  };
  const { mutate: postVoteMutate } = postVoteAPI(identifier, {
    onSuccess: onSuccessVote,
  });

  const checkWhetherVoted = (loginUsername: string) => {
    const alreadyVote = votes.find(
      (vote: any) => vote.username === loginUsername
    );
    if (alreadyVote) {
      if (alreadyVote.agree) {
        return 'agree';
      } else if (alreadyVote.neutral) {
        return 'neutral';
      } else if (alreadyVote.disagree) {
        return 'disagree';
      }
    }
    return false;
  };

  const handleVoteChange = (e: RadioChangeEvent, identifier: string) => {
    if (!currentLoginUser) {
      message.error('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
      return;
    }

    const { value } = e.target;

    switch (value) {
      case 'agree':
        postVoteMutate({ value });
        break;
      case 'neutral':
        postVoteMutate({ value });
        break;
      case 'disagree':
        postVoteMutate({ value });
        break;

      default:
        console.log('123');
        break;
    }
  };

  return (
    <>
      <P.Wrapper>
        <P.HeaderWrapper>
          <P.HeaderLeft>
            <Image
              src={
                user.image
                  ? `http://localhost:4000/${user.image.src}`
                  : defaultImg
              }
              width={46}
              height={46}
              style={{ borderRadius: '50px' }}
              alt="avatar"
            />
            <P.PostInfo>
              <h4>{username}</h4>
              <span>{formattedDate(updatedAt)}</span> · <span>조회 234</span>
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
          <Link href={`/post/${identifier}`}>
            <h3>{postTitleEllipsis(title)}</h3>
            <p>{postDescEllipsis(desc)}</p>
          </Link>
          {/* O X 질문 */}
          <P.VoteResultWrapper>
            <P.VoteResult>
              <LikeTwoTone twoToneColor="#2515d5" />
              <span>{agree}</span>
            </P.VoteResult>
            <P.VoteResult>
              <FrownTwoTone twoToneColor="#eb2f96" />
              <span>{neutral}</span>
            </P.VoteResult>
            <P.VoteResult>
              <DislikeTwoTone twoToneColor="#52c41a" />
              <span>{disagree}</span>
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
            {/* O X 투표 기능 */}
            {currentLoginUser && (
              <P.StaticsRight>
                <P.VoteSelect
                  size="middle"
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(e) => handleVoteChange(e, identifier)}
                  defaultValue={checkWhetherVoted(currentLoginUser?.username)}
                >
                  <P.VoteButtonSmall value="agree">
                    <LikeTwoTone twoToneColor="#2515d5" />
                  </P.VoteButtonSmall>
                  <P.VoteButtonSmall value="neutral">
                    <FrownTwoTone twoToneColor="#eb2f96" />
                  </P.VoteButtonSmall>
                  <P.VoteButtonSmall value="disagree">
                    <DislikeTwoTone twoToneColor="#52c41a" />
                  </P.VoteButtonSmall>
                </P.VoteSelect>
              </P.StaticsRight>
            )}
          </P.StaticsWrapper>

          {/* 게시물 사진 */}
          {/* <P.PostImageWrapper>
            <Avatar.Group
              maxCount={1}
              maxPopoverTrigger="click"
              size="large"
              maxStyle={{
                color: '#f56a00',
                backgroundColor: '#fde3cf',
                cursor: 'pointer',
              }}
            >
              {images.map((img: any) => {
                return (
                  <Image
                    key={img.src}
                    src={`http://localhost:4000/${img.src}`}
                    width={80}
                    height={80}
                    alt="alt"
                  />
                );
              })}

              <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>

              <Tooltip title="Ant User" placement="top">
                <Avatar
                  style={{ backgroundColor: '#87d068' }}
                  icon={<UserOutlined />}
                />
              </Tooltip>
            </Avatar.Group>
          </P.PostImageWrapper> */}

          {/* 게시물 사진 */}
          {images.length > 0 ? (
            <P.PostImageWrapper>
              <AntdImage.PreviewGroup
                preview={{
                  onChange: (current, prev) =>
                    console.log(
                      `current index: ${current}, prev index: ${prev}`
                    ),
                }}
              >
                {images?.map((img: any) => {
                  return (
                    <AntdImage
                      key={img.src}
                      src={`http://localhost:4000/${img.src}`}
                      width={80}
                      height={80}
                      alt="alt"
                    />
                  );
                })}
              </AntdImage.PreviewGroup>
            </P.PostImageWrapper>
          ) : (
            ''
          )}

          {/* comment 작업 */}
          <P.CommentWrapper>
            {comments?.map((c: any) => {
              const { identifier: commentId, body } = c;
              return (
                <Link href={`/post/${identifier}`} key={commentId}>
                  <P.Comment>
                    <Image
                      src={
                        c.user
                          ? `http://localhost:4000/${c.user.image.src}`
                          : defaultImg
                      }
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
        <Divider style={{ margin: '10px 0' }} />
        <Button type="text" shape="round">
          스크랩
        </Button>
        <Divider style={{ margin: '10px 0' }} />
        <Button type="text" shape="round">
          팔로우
        </Button>
        <Divider style={{ margin: '10px 0' }} />
        <Button type="text" shape="round">
          수정
        </Button>
        <Divider style={{ margin: '10px 0' }} />
        <Button type="text" shape="round">
          삭제
        </Button>
      </P.PostDrawer>
    </>
  );
}

export default Post;
