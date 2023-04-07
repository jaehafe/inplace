import { Input } from 'antd';
import styled from 'styled-components';

interface InputProps {
  isfill?: string | number | object | null;
}
const InputWrapper = styled.div`
  > small {
    color: ${({ theme }) => theme.negative};
  }
`;
const StyledInput = styled(Input)<InputProps>`
  padding: 8px 10px;
  font-weight: 400;
  border: 1px solid
    ${({ theme, isfill }) => (isfill ? theme.gray500 : theme.gray200)};
  border-radius: 8px;

  /* &.ant-input-affix-wrapper-readonly {
    &:hover {
      border: 1px solid ${({ theme }) => theme.gray200};
    }
    & * {
      cursor: pointer;
    }
  } */
`;

const I = {
  InputWrapper,
  StyledInput,
};

export default I;
