import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid;
  display: flex;
  justify-content: center;
  width: 390px;
  margin: auto auto 0;
  background-color: ${({ theme }) => theme.white};

  & > main {
    width: 390px;
    min-height: 100vh;
    padding: 0 20px;
    background-color: ${({ theme }) => theme.white};
  }

  @media screen and (min-width: 768px) {
    width: 100%;
    background-color: ${({ theme }) => theme.background};
  }
`;

const L = {
  Container,
};
export default L;
