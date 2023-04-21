import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import ProfileImage from '../../../Common/ProfileImage';
import L from '../../LogoHeader/LogoHeader.styles';

interface ISearchUserList {
  isShowRecentHistory: boolean;
}

function SearchUserList({ isShowRecentHistory }: ISearchUserList) {
  return (
    <>
      <L.SearchHeader $isSearching={isShowRecentHistory}>
        <h3>최근 검색 항목</h3> <Button type="dashed">모두 지우기</Button>
      </L.SearchHeader>
      <L.SearchBody>
        <L.SearchWrapper>
          <L.SearchLeft>
            <ProfileImage
              width={50}
              height={50}
              style={{ borderRadius: '50%' }}
            />
            <L.UserNameWrapper>
              <h4>React</h4>
              <span>hooks</span>
            </L.UserNameWrapper>
          </L.SearchLeft>
          <L.SearchRight $isSearching={true}>
            <CloseOutlined />
          </L.SearchRight>
        </L.SearchWrapper>
      </L.SearchBody>
    </>
  );
}

export default SearchUserList;
