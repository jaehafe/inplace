import styled from 'styled-components';
import { Button } from 'antd';

export default styled(Button)`
  position: absolute;
  bottom: 32px;
  left: 0;
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  border: 0;
  background-color: ${({ theme }) => theme.primary};

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.gray600} !important;
  }
`;
