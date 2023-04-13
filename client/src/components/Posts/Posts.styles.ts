import { Button, Drawer, Radio } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;

  & h3 {
    margin: 24px 0 12px;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.gray800};
    text-align: left;
  }

  & h4 {
    margin-top: 8px;
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
    margin-top: 12px;
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
  & h3 {
    margin-bottom: 20px;
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

const VoteButton = styled(Radio.Button)`
  padding: 20px 50px;
`;

// 댓글
const CommentWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
const Comment = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.gray650};
  font-size: 13px;
`;

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

// CreatePost

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
  VoteButton,
  CommentWrapper,
  Comment,
};

export default P;
