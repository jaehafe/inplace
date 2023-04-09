import { Drawer } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid;
  width: 100%;

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
    color: ${({ theme }) => theme.gray800};
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
`;

const Span = styled.span`
  & span {
    font-size: 10px;
    font-weight: 400;
    color: ${({ theme }) => theme.gray500};
    text-align: left;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;
const HeaderLeft = styled.div`
  display: flex;
`;
const HeaderRight = styled.div``;

const PostInfo = styled.div`
  margin-left: 10px;
  & span {
    font-size: 10px;
    font-weight: 400;
    color: ${({ theme }) => theme.gray500};
    text-align: left;
  }
`;

const BodyWrapper = styled.div`
  border: 1px solid;
`;

const PostDrawer = styled(Drawer)`
  position: sticky;
  /* bottom: 0; */
  left: 0;
  width: 320px !important;
  margin: auto;

  /* height: auto; */
  border-radius: 20px;

  & div.ant-drawer-content-wrapper {
    box-shadow: none;
  }

  & div.ant-drawer-body {
    display: flex;
    flex-direction: column;
  }
`;

const P = {
  Wrapper,
  HeaderWrapper,
  HeaderLeft,
  HeaderRight,
  PostInfo,
  BodyWrapper,
  PostDrawer,
};

export default P;
