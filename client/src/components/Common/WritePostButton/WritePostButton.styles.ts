import { Button, Drawer } from 'antd';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;

  position: absolute;
  width: 50px;
  height: 50px;
  right: 10px;
  bottom: 10px;
  font-size: 20px;

  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.gray400};
`;

const AddPostDrawer = styled(Drawer)`
  position: sticky;
  left: 0;
  width: 390px !important;
  margin: auto;
  border-radius: 20px;

  & div.ant-drawer-content-wrapper {
    box-shadow: none !important;
  }

  & div.ant-drawer-body {
    display: flex;
    flex-direction: column;
  }
`;

const W = {
  AddPostDrawer,
  StyledButton,
};

export default W;
