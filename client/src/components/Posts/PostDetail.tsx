import {
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  MoreOutlined,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, message, RadioChangeEvent, Image as AntdImage } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { postVoteAPI } from '../../apis/vote';
import { useUserInfo } from '../../store/userStore';
import { formattedDate } from '../../utils';
import ProfileImage from '../Common/ProfileImage';
import EditPost from './EditPost';
import PostComments from './PostComments';
import PostDrawer from './PostDrawer';
import P from './Posts.styles';

const PostVoteResultBarChart = dynamic(
  () => import('./PostVoteModal/PostVoteResultBarChart'),
  {
    ssr: false,
  }
);

function PostDetail({ detailPost }: any) {
  const {
    identifier,
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
    votes,
    user,
    agreeScore,
    disagreeScore,
    neutralScore,
  } = detailPost;
  const { username, followers } = user;

  const queryClient = useQueryClient();
  const router = useRouter();
  const currentLoginUser = useUserInfo();
  const [openPostDrawer, setOpenPostDrawer] = useState(false);

  const onSuccessVote = () => {
    message.success('투표 완료');
    queryClient.invalidateQueries([`/posts/${identifier}`]);
    queryClient.invalidateQueries([`/posts/result/${identifier}`]);
  };
  const { mutate: postVoteMutate } = postVoteAPI(identifier, {
    onSuccess: onSuccessVote,
  });

  const checkWhetherVoted = (loginUserId: any) => {
    const alreadyVote = votes?.find((vote: any) => vote.userId === loginUserId);

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

  return (
    <P.Wrapper>
      <P.HeaderWrapper>
        <Link href={`/profile/${username}`}>
          <P.HeaderLeft>
            <ProfileImage
              src={user?.image.src}
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
        </Link>
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
        <pre>{title}</pre>
        <pre>{desc}</pre>
        {/* O X  문장*/}
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

        {/* OX 투표기능 */}
        <P.VoteSelectWrapper>
          <P.VoteSelect
            size="large"
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => handleVoteChange(e)}
            defaultValue={checkWhetherVoted(currentLoginUser?.id)}
            // defaultValue="disagree"
          >
            <P.VoteButton value="agree">
              <LikeTwoTone twoToneColor="#2515d5" />
            </P.VoteButton>
            <P.VoteButton value="neutral">
              <FrownTwoTone twoToneColor="#eb2f96" />
            </P.VoteButton>
            <P.VoteButton value="disagree">
              <DislikeTwoTone twoToneColor="#52c41a" />
            </P.VoteButton>
          </P.VoteSelect>
        </P.VoteSelectWrapper>

        <div>
          {' '}
          <PostVoteResultBarChart
            agreeScore={agreeScore}
            disagreeScore={disagreeScore}
            neutralScore={neutralScore}
          />
        </div>

        {/* 게시물 사진 */}
        {images?.length > 0 ? (
          <P.PostImageWrapper>
            <AntdImage.PreviewGroup
              preview={{
                onChange: (current, prev) =>
                  console.log(`current index: ${current}, prev index: ${prev}`),
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

        {/* 게시물 댓글 컴포넌트 */}
        <PostComments
          identifier={identifier}
          currentLoginUser={currentLoginUser}
        />
      </P.BodyWrapper>
      <PostDrawer
        postId={identifier}
        followers={followers}
        postAuthorInfo={user}
        openPostDrawer={openPostDrawer}
        setOpenPostDrawer={setOpenPostDrawer}
        currentLoginUser={currentLoginUser}
      />
      <EditPost />
    </P.Wrapper>
  );
}

export default PostDetail;
