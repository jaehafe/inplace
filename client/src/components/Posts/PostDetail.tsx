import {
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  MoreOutlined,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, message, RadioChangeEvent } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { authMeAPI } from '../../apis/user';
import { postVoteAPI } from '../../apis/vote';
import { baseURL } from '../../configs/axios';
import useAuthStore from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { formattedDate } from '../../utils';
import PostComments from './PostComments';
import P from './Posts.styles';

function PostDetail({ detailPost }: any) {
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
    votes,
    user,
  } = detailPost;
  const queryClient = useQueryClient();
  const router = useRouter();
  console.log('detailPost>>>', detailPost);
  console.log('votes>>>', votes);
  const [open, setOpen] = useState(false);
  const [cookie] = useCookies(['inplace']);
  // const { data: userInfo } = authMeAPI({ enabled: Boolean(cookie?.inplace) });

  const userInfo = useUserStore((state) => state.userInfo);
  console.log('userInfo>>>', userInfo);

  const onSuccessVote = () => {
    message.success('투표 완료');
    queryClient.invalidateQueries([`${baseURL}/posts/${identifier}`]);
  };
  const { mutate: postVoteMutate } = postVoteAPI(identifier, {
    onSuccess: onSuccessVote,
  });

  const checkWhetherVoted = (loginUsername: string) => {
    console.log('loginUsername>>>', loginUsername);

    const alreadyVote = votes.find(
      (vote: any) => vote.username === loginUsername
    );
    console.log('alreadyVote>>>', alreadyVote);

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
    if (!userInfo) {
      message.error('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
      return;
    }

    const { value } = e.target;
    console.log(`radio checked:${value}`);

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
        {userInfo ? (
          <P.VoteSelectWrapper>
            <P.VoteSelect
              size="large"
              optionType="button"
              buttonStyle="solid"
              onChange={(e) => handleVoteChange(e)}
              defaultValue={checkWhetherVoted(userInfo?.username)}
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
        ) : (
          <P.LoginRouterButtonForVote
            type="dashed"
            block
            onClick={() => router.push('/login')}
          >
            로그인 후 투표를 해보세요
          </P.LoginRouterButtonForVote>
          // <P.VoteSelectWrapper>
          //   <P.VoteSelect
          //     size="large"
          //     optionType="button"
          //     buttonStyle="solid"
          //     // onChange={(e) => handleVoteChange(e)}
          //     // disabled={true}
          //   >
          //     <P.VoteButton value="agree">
          //       <LikeTwoTone twoToneColor="#2515d5" />
          //     </P.VoteButton>
          //     <P.VoteButton value="neutral">
          //       <FrownTwoTone twoToneColor="#eb2f96" />
          //     </P.VoteButton>
          //     <P.VoteButton value="disagree">
          //       <DislikeTwoTone twoToneColor="#52c41a" />
          //     </P.VoteButton>
          //   </P.VoteSelect>
          // </P.VoteSelectWrapper>
        )}

        {/* 게시물 댓글 컴포넌트 */}
        <PostComments identifier={identifier} userInfo={userInfo} />
      </P.BodyWrapper>
    </P.Wrapper>
  );
}

export default PostDetail;
