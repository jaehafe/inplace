import React, { forwardRef, useState } from 'react';
import {
  CommentOutlined,
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  MoreOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  message,
  RadioChangeEvent,
  Avatar,
  Tooltip,
  Image as AntdImage,
  Spin,
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
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../store/userStore';
import ProfileImage from '../Common/ProfileImage';

function Post(
  { post, isFetchingNextPage }: any,
  ref: React.LegacyRef<HTMLDivElement> | undefined
) {
  const {
    identifier: postId,
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
  const { username } = user;
  // console.log('user>>>', user);
  console.log('comments>>>', comments);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const currentLoginUser = useUserStore((state) => state.userInfo);

  const onSuccessVote = () => {
    message.success('투표 완료');
    queryClient.invalidateQueries([`/posts`]);
  };
  const { mutate: postVoteMutate } = postVoteAPI(postId, {
    onSuccess: onSuccessVote,
  });

  const checkWhetherVoted = (loginUserId: any) => {
    const alreadyVote = votes.find((vote: any) => vote.userId === loginUserId);
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

  const handleVoteChange = (e: RadioChangeEvent) => {
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

  const handleFollow = (username: string) => {
    console.log('username>>', username);
  };

  return (
    <>
      <P.Wrapper>
        <P.HeaderWrapper>
          <P.HeaderLeft>
            <Link href={`/profile/${user.username}`}>
              <ProfileImage
                src={user.image && `${user.image.src}`}
                width={46}
                height={46}
                style={{ borderRadius: '50px' }}
                alt="avatar"
              />
            </Link>
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
          <Link href={`/post/${postId}`}>
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
            <P.StaticsRight>
              <P.VoteSelect
                size="middle"
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => handleVoteChange(e)}
                defaultValue={checkWhetherVoted(currentLoginUser?.id)}
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
          </P.StaticsWrapper>

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
              console.log('ccccc>>>>', c);

              const { identifier: commentId, body } = c;
              return (
                <Link href={`/post/${postId}`} key={commentId}>
                  <P.Comment>
                    <ProfileImage
                      src={c.user?.image.src}
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

        {/* 무한스크롤 관찰 요소 */}
        <div ref={ref}></div>
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
        <Button
          type="text"
          shape="round"
          onClick={() => handleFollow(username)}
        >
          팔로우
        </Button>
        <Divider style={{ margin: '10px 0' }} />
        <Button type="text" shape="round" style={{ color: 'red' }}>
          내용 신고
        </Button>
        {currentLoginUser?.username === user.username ? (
          <>
            <Divider style={{ margin: '10px 0' }} />
            <Button type="text" shape="round">
              수정
            </Button>
            <Divider style={{ margin: '10px 0' }} />
            <Button type="text" shape="round">
              삭제
            </Button>
          </>
        ) : (
          ''
        )}
      </P.PostDrawer>
    </>
  );
}

export default forwardRef(Post);
