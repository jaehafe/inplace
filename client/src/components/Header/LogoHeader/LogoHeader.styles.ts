import { Button, Drawer } from 'antd';
import styled from 'styled-components';

const LogoHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

  & p {
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.gra600};
  }

  & h4 {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.gray600};
    text-align: left;
  }

  & span {
    font-size: 10px;
    font-weight: 400;
    color: ${({ theme }) => theme.gray500};
    text-align: left;
  }
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

const MyDrawer = styled(Drawer)`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 390px !important;
  margin: auto;
`;

const DrawerHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DrawerBodyWrapper = styled.div``;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const LoginOutWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const L = {
  LogoHeaderWrapper,
  HeaderIcons,
  MyDrawer,
  DrawerHeader,
  DrawerBodyWrapper,
  ProfileWrapper,
  LoginOutWrapper,
  StyledButton,
};

export default L;
