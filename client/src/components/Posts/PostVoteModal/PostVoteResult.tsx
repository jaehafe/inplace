import React from 'react';
import { DislikeTwoTone, FrownTwoTone, LikeTwoTone } from '@ant-design/icons';
import P from '../Posts.styles';
import dynamic from 'next/dynamic';

const PostVoteResultBarChart = dynamic(
  () => import('./PostVoteResultBarChart'),
  {
    ssr: false,
  }
);

interface IPostVoteResult {
  data: any;
}

function PostVoteResult({ data }: IPostVoteResult) {
  const {
    agree,
    agreeScore,
    disagree,
    disagreeScore,
    neutral,
    neutralScore,
    title,
    voteScore,
  } = data;

  return (
    <P.ResultContainer>
      <P.PostInfoWrapper>
        <h2>{title}</h2>
        <span>총 {voteScore} 명 투표</span>
        <P.VoteInfoWrapper>
          <P.AgreeWrapper>
            <LikeTwoTone twoToneColor="#429CD9" />
            <span>{agree}</span>
          </P.AgreeWrapper>
          <P.AgreeWrapper>
            <FrownTwoTone twoToneColor="#FBCD56" />
            <span>{neutral}</span>
          </P.AgreeWrapper>
          <P.AgreeWrapper>
            <DislikeTwoTone twoToneColor="#FB7B77" />
            <span>{disagree}</span>
          </P.AgreeWrapper>
        </P.VoteInfoWrapper>
        {/* 100 stack chart */}
        <P.VoteResultChartWrapper>
          {voteScore ? (
            <PostVoteResultBarChart
              agreeScore={agreeScore}
              disagreeScore={disagreeScore}
              neutralScore={neutralScore}
            />
          ) : (
            '아직 투표한 사람이 없네요'
          )}
        </P.VoteResultChartWrapper>
      </P.PostInfoWrapper>
    </P.ResultContainer>
  );
}

export default PostVoteResult;
