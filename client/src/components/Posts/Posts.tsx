import React, { forwardRef, useCallback, useState } from 'react';
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
} from 'antd';
import { useRouter } from 'next/router';
import {
  commentBodyEllipsis,
  formattedDate,
  postDescEllipsis,
  postTitleEllipsis,
} from '../../utils';
import Link from 'next/link';
import { postVoteAPI } from '../../apis/vote';
import { useQueryClient } from '@tanstack/react-query';
import { useUserInfo } from '../../store/userStore';
import ProfileImage from '../Common/ProfileImage';
import PostDrawer from './PostDrawer';
import { usePostVoteResultModalStoreActions } from '../../store/postVoteResultStore';
import P from './Posts.styles';
import TagList from '../Common/Tags/TagList';

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
    categories,
  } = post;
  const { username, followers } = user;

  const router = useRouter();
  const queryClient = useQueryClient();
  const [openPostDrawer, setOpenPostDrawer] = useState(false);
  const currentLoginUser = useUserInfo();
  const { openModal } = usePostVoteResultModalStoreActions();

  const onSuccessVote = () => {
    message.success('투표 완료');
    queryClient.invalidateQueries([`/posts`]);
    queryClient.invalidateQueries([`/posts/result/${postId}`]);
    openModal(postId);
  };
  const { mutate: postVoteMutate } = postVoteAPI(postId, {
    onSuccess: onSuccessVote,
  });

  // useCallback은 이전에 생성된 함수를 기억하고, 의존성 배열에 따라 함수가 재생성되는 것을 제어
  const isVoted = useCallback(
    (loginUserId: any) => {
      const alreadyVote = votes.find(
        (vote: any) => vote.userId === loginUserId
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
    },
    [votes]
  );

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
        break;
    }
  };

  return (
    <>
      <P.Wrapper>
        <P.HeaderWrapper>
          <P.HeaderLeft>
            <Link href={`/profile/${username}`}>
              <ProfileImage
                src={user.image && `${user.image.src}`}
                width={46}
                height={46}
              />
            </Link>
            <P.PostInfo>
              <h4>{username}</h4>
              <span>
                {formattedDate(updatedAt)}
                {createdAt !== updatedAt ? '(수정됨)' : ''}
              </span>{' '}
              {/* <span>·</span> <span>조회 234</span> */}
            </P.PostInfo>
          </P.HeaderLeft>
          <P.HeaderRight>
            <Button
              type="text"
              shape="circle"
              onClick={() => setOpenPostDrawer(true)}
            >
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

          {/* 태그 리스트 */}
          {categories?.length > 0 && <TagList categories={categories} />}
          {/* 댓글, 투표 통계 버튼 */}
          <P.StaticsWrapper>
            <P.StaticsLeft>
              {/* 게시물 투표 통계 버튼 */}
              <P.StaticsButton
                type="primary"
                onClick={() => {
                  openModal(postId);
                }}
              >
                <PieChartOutlined />
                {voteScore}
              </P.StaticsButton>
              {/* 댓글 버튼 */}
              <P.StaticsButton
                type="primary"
                onClick={() => {
                  router.push(`/post/${postId}`);
                }}
              >
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
                defaultValue={isVoted(currentLoginUser?.id)}
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
          {images?.length > 0 ? (
            <P.PostImageWrapper>
              <AntdImage.PreviewGroup
              // preview={{
              //   onChange: (current, prev) =>
              //     console.log(
              //       `current index: ${current}, prev index: ${prev}`
              //     ),
              // }}
              >
                {images?.map((img: any) => {
                  return (
                    <AntdImage
                      key={img?.src}
                      src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/${img.src}`}
                      width={100}
                      height={100}
                      alt="alt"
                      style={{ objectFit: 'contain' }}
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
                <Link href={`/post/${postId}`} key={commentId}>
                  <P.Comment>
                    <ProfileImage
                      src={c.user?.image?.src}
                      width={20}
                      height={20}
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

      <PostDrawer
        postId={postId}
        followers={followers}
        postAuthorInfo={user}
        openPostDrawer={openPostDrawer}
        setOpenPostDrawer={setOpenPostDrawer}
        currentLoginUser={currentLoginUser}
      />
    </>
  );
}

export default forwardRef(Post);
