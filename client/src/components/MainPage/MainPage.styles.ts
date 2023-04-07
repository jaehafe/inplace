import styled from 'styled-components';

const MainPageWrapper = styled.section`
  border: 1px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  & h1 {
    display: inline;
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
    color: ${({ theme }) => theme.gray900};
  }
  & h2 {
    display: inline;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: ${({ theme }) => theme.primary};
  }
  & h3 {
    display: inline;
  }
  & p {
    display: inline;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.gray600};
  }
`;

const M = {
  MainPageWrapper,
};

export default M;
