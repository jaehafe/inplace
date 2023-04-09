import { Button } from 'antd';
import styled from 'styled-components';

const BackButton = styled(Button)`
  & > span {
    font-size: 16px;
    color: ${({ theme }) => theme.gray700};
  }
`;

const B = {
  BackButton,
};

export default B;
