import { Button, Drawer, Radio } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;

  & h3 {
    /* margin: 24px 0 12px; */
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.gray800};
    text-align: left;
  }

  & h4 {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.gray800};
    text-align: left;
  }

  & p {
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.gra600};
  }

  & > h4 {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.gray600};
    text-align: left;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 16px;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderRight = styled.div``;

const PostInfo = styled.div`
  margin-left: 10px;
  & span {
    font-size: 10px;
    font-weight: 400;
    color: ${({ theme }) => theme.gray500};
    text-align: left;
  }
`;

const BodyWrapper = styled.div`
  & > h3 {
    margin-bottom: 10px;
  }

  & > p {
    font-size: 16px;
    color: ${({ theme }) => theme.gray700};
  }

  & > pre:first-of-type {
    margin-bottom: 10px;
  }

  & > pre:nth-of-type(2) {
    font-size: 16px;
    color: ${({ theme }) => theme.gray600};
  }
`;

const VoteResultWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const VoteResult = styled.div`
  display: flex;
  gap: 6px;
`;
const StaticsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;
const StaticsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const StaticsRight = styled.div``;
const StaticsButton = styled(Button)`
  background-color: ${({ theme }) => theme.gray100};
  color: ${({ theme }) => theme.gray700};
  border-radius: 10px;

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.primary} !important;
  }
`;

const VoteSelect = styled(Radio.Group)`
  & .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled),
  & .ant-radio-button-wrapper:hover:not(.ant-radio-button-wrapper-disabled) {
    color: ${({ theme }) => theme.white} !important;
    background-color: ${({ theme }) => theme.gray400} !important;
  }
  display: flex;

  & label.ant-radio-button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const VoteSelectWrapper = styled.div`
  margin: 30px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const VoteButtonSmall = styled(Radio.Button)``;
const VoteButton = styled(Radio.Button)`
  padding: 23px 50px;
`;

// 이미지 게시물
const PostImageWrapper = styled.div`
  /* border: 1px solid; */
  margin: 20px 0 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

// 댓글
const CommentWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
const Comment = styled.div`
  display: flex;
  gap: 10px;
  /* color: ${({ theme }) => theme.gray750}; */
  font-size: 14px;

  & span {
    color: ${({ theme }) => theme.gray600};
  }
`;

// 게시물 상세 댓글
const PostComment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  & span {
    color: ${({ theme }) => theme.gray600};
  }
`;
const DetailCommentWrapper = styled.div`
  margin-top: 60px;
  font-size: 13px;
`;
const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;
const CommentSubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.gray600} !important;
  }
`;
const CommentBodyWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;
const CommentInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > span {
    display: block;
  }

  .edit-button {
    color: ${({ theme }) => theme.gray800};
  }
`;
const CommentEditButton = styled(Button)`
  margin-right: 10px;
  background-color: ${({ theme }) => theme.primary};
  & > span {
    color: ${({ theme }) => theme.white} !important;
  }

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.gray600} !important;
  }
`;
const CommentCancelButton = styled(Button)``;
const CommentInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  & > span {
    color: ${({ theme }) => theme.gray600};
  }
  & > p {
    font-size: 14px;
    color: ${({ theme }) => theme.gray800};
  }
`;
const LikeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;

  .heart-icon {
    color: red;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

// const LoadingWrapper = styled.div.withConfig({
//   shouldForwardProp: (prop) => prop !== 'innerRef',
// })`
//   border: 1px solid;
// `;

const PostDrawer = styled(Drawer)`
  position: sticky;
  left: 0;
  width: 390px !important;

  margin: auto;
  border-radius: 20px;

  & div.ant-drawer-content-wrapper {
    box-shadow: none !important;
  }

  & div.ant-drawer-body {
    display: flex;
    flex-direction: column;
  }
`;

const LoginRouterButton = styled(Button)`
  & > span {
    color: ${({ theme }) => theme.gray600};
  }
`;

const LoginRouterButtonForVote = styled(Button)`
  margin-top: 20px;
  & > span {
    color: ${({ theme }) => theme.gray600};
  }
`;

// 투표 결과 분석
const ResultContainer = styled.div`
  margin-top: 20px;
  border: 1px solid;
`;

const PostInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const VoteInfoWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;
const AgreeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & span {
    font-size: 16px;
  }
`;
const VoteResultChartWrapper = styled.div`
  margin-top: 20px;

  border: 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
`;

const P = {
  Wrapper,
  HeaderWrapper,
  HeaderLeft,
  HeaderRight,
  PostInfo,
  BodyWrapper,
  PostDrawer,
  VoteResultWrapper,
  VoteResult,
  StaticsButton,
  StaticsWrapper,
  StaticsLeft,
  StaticsRight,
  VoteSelectWrapper,
  VoteSelect,
  VoteButtonSmall,
  VoteButton,
  CommentWrapper,
  Comment,
  DetailCommentWrapper,
  CommentHeader,
  CommentSubmitButton,
  PostComment,
  CommentEditButton,
  CommentCancelButton,
  CommentInfo,
  CommentBodyWrapper,
  CommentInfoHeader,
  LikeWrapper,
  LoginRouterButton,
  LoginRouterButtonForVote,
  PostImageWrapper,
  LoadingWrapper,
  ResultContainer,
  PostInfoWrapper,
  VoteInfoWrapper,
  AgreeWrapper,
  VoteResultChartWrapper,
};

export default P;
