import { Button, Drawer, Input } from 'antd';
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
  border-top-left-radius: 20px !important;
  border-bottom-left-radius: 20px !important;
`;

const DrawerHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DrawerBodyWrapper = styled.div`
  overflow-y: scroll;
`;

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

const SearchUserInput = styled(Input.Search)`
  & .ant-input-affix-wrapper {
    background-color: ${({ theme }) => theme.gray200};
  }
  & .ant-input {
    background-color: ${({ theme }) => theme.gray200};
  }
  & .ant-btn {
    background-color: ${({ theme }) => theme.primary};

    &:hover,
    &:active {
      background-color: ${({ theme }) => theme.negative};
    }
  }
`;

interface SearchHeaderProps {
  $isSearching: boolean;
}
const SearchHeader = styled.div<SearchHeaderProps>`
  display: ${({ $isSearching }) => ($isSearching ? 'none' : 'flex')};
  align-items: center;
  justify-content: space-between;
`;

const SearchBody = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const SearchWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
`;
const SearchLeft = styled.div`
  display: flex;
  align-items: center;
`;
const UserNameWrapper = styled.div`
  margin-left: 10px;
`;
const SearchRight = styled.div<SearchHeaderProps>`
  display: ${({ $isSearching }) => ($isSearching ? 'none' : 'flex')};
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
  SearchUserInput,
  SearchHeader,
  SearchBody,
  SearchWrapper,
  SearchLeft,
  SearchRight,
  UserNameWrapper,
};

export default L;
