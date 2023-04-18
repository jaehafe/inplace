import { Button, Drawer, Tabs } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.div`
  & h2 {
    font-size: 20px;
    font-weight: 500;
    color: ${({ theme }) => theme.positive};
    text-align: left;
  }
  & h3 {
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.gray800};
    text-align: left;
  }

  & h4 {
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
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.gray600};
    text-align: left;
  }

  & span {
    font-size: 12px;
    font-weight: 400;
    text-align: left;
  }
`;

const InfoWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
`;

const InfoLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRight = styled.div`
  display: flex;
  align-items: center;
`;

const FollowInfoWrapper = styled.button`
  display: flex;
  gap: 10px;
`;

const EditButton = styled(Button)`
  color: ${({ theme }) => theme.gray700};
`;

const StyledTab = styled(Tabs)`
  margin-top: 20px;
  & div.ant-tabs-nav-wrap {
    display: flex;
    justify-content: center;
  }
  & .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${({ theme }) => theme.gray700};
  }

  & div.ant-tabs-ink-bar {
    background-color: ${({ theme }) => theme.gray700};
  }
`;

const StyledFollowTab = styled(Tabs)`
  margin-top: 20px;
  & div.ant-tabs-nav-wrap {
    display: flex;
    justify-content: center;
  }
  & .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${({ theme }) => theme.gray700};
  }

  & div.ant-tabs-ink-bar {
    background-color: ${({ theme }) => theme.gray700};
  }
`;

const FollowInfoDrawer = styled(Drawer)`
  position: sticky;
  left: 0;
  width: 390px !important;
  height: 90vh !important;
  margin: auto;
  border-radius: 20px;
  overflow-y: scroll;

  .ant-tabs.ant-tabs-top {
    margin-top: 10px;
  }

  & div.ant-drawer-content-wrapper {
    box-shadow: none !important;
  }

  & div.ant-drawer-body {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    height: 100%;
  }
`;

const P = {
  Wrapper,
  InfoWrapper,
  InfoLeft,
  InfoRight,
  FollowInfoWrapper,
  EditButton,
  StyledTab,
  FollowInfoDrawer,
  StyledFollowTab,
};

export default P;
