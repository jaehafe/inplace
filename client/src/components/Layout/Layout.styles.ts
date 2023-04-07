import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid;
  display: flex;
  justify-content: center;
  width: 390px;
  margin: auto auto 0;

  & > main {
    width: 390px;
    min-height: 100vh;
    padding: 0 20px;
  }
`;

const L = {
  Container,
};
export default L;
