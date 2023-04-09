import { Drawer } from 'antd';
import styled from 'styled-components';

const LogoHeaderWrapper = styled.div`
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

const DrawerBodyWrapper = styled.div`
  border: 1px solid;
`;

const L = {
  LogoHeaderWrapper,
  HeaderIcons,
  MyDrawer,
  DrawerHeader,
  DrawerBodyWrapper,
};

export default L;
