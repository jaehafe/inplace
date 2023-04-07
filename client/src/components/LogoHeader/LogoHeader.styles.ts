import styled from 'styled-components';

const LogoHeaderWrapper = styled.div`
  border: 1px solid;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 104px;

  & button {
    width: 24px;
    height: 24px;
    padding: 0;

    & img {
      margin: auto;
    }
  }
`;

const L = {
  LogoHeaderWrapper,
  HeaderIcons,
};

export default L;
