import { Space } from 'antd';
import styled from 'styled-components';

const MainPageWrapper = styled.section`
  & h1 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.gray900};
  }
  & h2 {
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
  }

  & p {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.gray600};
  }
`;

const StyledSpace = styled(Space)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const HeaderWrapper = styled.div`
  z-index: 1;
  position: fixed;
  width: 346px;
  background-color: #fff;
`;

const BodyWrapper = styled.div`
  position: relative;
  padding-top: 120px;
`;

const M = {
  MainPageWrapper,
  StyledSpace,
  HeaderWrapper,
  BodyWrapper,
};

export default M;
