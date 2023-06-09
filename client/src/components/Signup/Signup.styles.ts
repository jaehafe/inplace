import { Input } from 'antd';
import styled from 'styled-components';

interface InputProps {
  isfill?: string | number | object | null;
}

const SignupWrapper = styled.form`
  text-align: left;

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
    color: ${({ theme }) => theme.gray600};
    text-align: left;
  }

  & > p {
    margin: 72px 0 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.gray600};
    text-align: center;
  }

  & > h4 {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.gray600};
    text-align: left;
  }

  > h2:first-of-type {
    margin-top: 10px;
  }

  > h4:last-of-type {
    border-top: 0.1px solid ${({ theme }) => theme.gray600};
    padding-top: 10px;
    margin-top: 80px;
  }
`;

// const SignupInput = styled(Input)<InputProps>`
//   padding: 8px 10px;
//   font-weight: 400;
//   border: 1px solid
//     ${({ theme, isfill }) => (isfill ? theme.gray500 : theme.gray200)};
//   border-radius: 8px;

//   /* & + & {
//     margin-top: 12px;
//   }

//   &.ant-input-affix-wrapper-readonly {
//     &:hover {
//       border: 1px solid ${({ theme }) => theme.gray200};
//     }
//     & * {
//       cursor: pointer;
//     }
//   } */
// `;

const S = {
  SignupWrapper,
  // SignupInput,
};
export default S;
