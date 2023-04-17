import styled from 'styled-components';

const Wrapper = styled.div`
  overflow-y: scroll;
`;

const BodyWrapper = styled.div`
  & h2 {
    font-size: 20px;
    font-weight: 500;
    color: ${({ theme }) => theme.positive};
    text-align: left;
  }
  & h3 {
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

  & span {
    font-size: 12px;
    font-weight: 400;
    text-align: left;
    color: ${({ theme }) => theme.gray500};
  }

  display: flex;
`;

const Body = styled.div``;

const Footer = styled.div`
  margin-top: 6px;
  display: flex;
  gap: 10px;
`;

const StaticWrapper = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
  color: ${({ theme }) => theme.gray500};
`;
const VoteWrapper = styled(StaticWrapper)``;
const CommentWrapper = styled(StaticWrapper)``;
const ViewWrapper = styled(StaticWrapper)``;

const CommentBodyWrapper = styled(BodyWrapper)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PostWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${({ theme }) => theme.positiveLight};
  padding: 6px 10px;
  border-radius: 14px;
`;

const MyCommentWrapper = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${({ theme }) => theme.negativeLight};
  padding: 19px 10px;
  border-radius: 14px;
`;
const MyCommentBodyWrapper = styled.div`
  width: 100%;
`;
const MyCommentHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const T = {
  Wrapper,
  BodyWrapper,
  Body,
  Footer,
  VoteWrapper,
  CommentWrapper,
  ViewWrapper,
  CommentBodyWrapper,
  PostWrapper,
  MyCommentWrapper,
  MyCommentHeaderWrapper,
  MyCommentBodyWrapper,
};

export default T;
