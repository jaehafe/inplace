import { DislikeTwoTone, FrownTwoTone, LikeTwoTone } from '@ant-design/icons';
import React from 'react';
import P from './Posts.styles';

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
        <P.VoteInfoWrapper>
          <P.AgreeWrapper>
            <LikeTwoTone twoToneColor="#2515d5" />
            <span>{agree}</span>
          </P.AgreeWrapper>
          <P.AgreeWrapper>
            <FrownTwoTone twoToneColor="#eb2f96" />
            <span>{neutral}</span>
          </P.AgreeWrapper>
          <P.AgreeWrapper>
            <DislikeTwoTone twoToneColor="#52c41a" />
            <span>{disagree}</span>
          </P.AgreeWrapper>
        </P.VoteInfoWrapper>
        <P.VoteResultChartWrapper>123</P.VoteResultChartWrapper>
      </P.PostInfoWrapper>
    </P.ResultContainer>
  );
}

export default PostVoteResult;
