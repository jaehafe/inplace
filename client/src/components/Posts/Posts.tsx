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

const voteOptions = [
  { label: <LikeTwoTone twoToneColor="#2515d5" />, value: 'VoteUp' },
  { label: <FrownTwoTone twoToneColor="#eb2f96" />, value: 'VoteNeutral' },
  { label: <DislikeTwoTone twoToneColor="#52c41a" />, value: 'VoteDown' },
];

function AllPosts() {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState('');
  const router = useRouter();

  const handleVoteChange = ({ target: { value } }: RadioChangeEvent) => {
    setVote(value);
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
            <h4>유저이름</h4>
            <span>2023.03.30 · </span>
            <span>조회 234</span>
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
        <h3>여행비 600억 푸는 정부, 내수 활성화 효과 클까요?</h3>
        <p>
          정부가 국내 내수 경기 활성화를 위해 여행비 할인과 휴가비 지원 등
          600억원 규모 재정을 풀기로 했대요. 크게는 다음 내용들이 있고요. 1
          100만 명에게 1인당 3만원 상당의 숙박 할인쿠폰 제공 2 중소·중견기업
          근로자 등 19만 명에 휴가비 10만 원씩을 지원 3 문화비 및 전통시장 지출
          소득공제율 10% 한시 상향
        </p>
        {/* O X */}
        <P.VoteResultWrapper>
          <P.VoteResult>
            <LikeTwoTone twoToneColor="#2515d5" />
            <span>내수 활성화 상당히 도움 될 거예요.</span>
          </P.VoteResult>
          <P.VoteResult>
            <FrownTwoTone twoToneColor="#eb2f96" />
            <span>흠 잘 모르겠어요.</span>
          </P.VoteResult>
          <P.VoteResult>
            <DislikeTwoTone twoToneColor="#52c41a" />
            <span>아뇨. 혜택 받을 사람이 많을까요?</span>
          </P.VoteResult>
        </P.VoteResultWrapper>
        {/* 댓글, 투표 통계 버튼 */}
        <P.StaticsWrapper>
          <P.StaticsLeft>
            <P.StaticsButton type="primary">
              <PieChartOutlined />
              338
            </P.StaticsButton>
            <P.StaticsButton type="primary">
              <CommentOutlined />
              23
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

        <P.CommentWrapper>
          <P.Comment>
            <Image
              src="https://www.gravatar.com/avatar?d=mp&f=y"
              width={20}
              height={20}
              style={{ borderRadius: '50px' }}
              alt="avatar"
            />
            <span>이게 나라냐?</span>
          </P.Comment>

          <P.Comment>
            <Image
              src="https://www.gravatar.com/avatar?d=mp&f=y"
              width={20}
              height={20}
              style={{ borderRadius: '50px' }}
              alt="avatar"
            />
            <span>돈 푸는 것만이 답은 아닙니다.</span>
          </P.Comment>
        </P.CommentWrapper>
      </P.BodyWrapper>
      <Divider />

      {/* 모달 */}
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
    </P.Wrapper>
  );
}

export default AllPosts;
