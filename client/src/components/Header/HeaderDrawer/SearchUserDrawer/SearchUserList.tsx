import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';
import ProfileImage from '../../../Common/ProfileImage';
import L from '../../LogoHeader/LogoHeader.styles';

interface ISearchUserList {
  isShowRecentHistory?: boolean;
  data: any;
}

function SearchUserList({ data, isShowRecentHistory }: ISearchUserList) {
  const {
    username,
    image: { src },
  } = data;

  return (
    <>
      {/* <L.SearchHeader $isSearching={isShowRecentHistory}>
        <h3>최근 검색 항목</h3> <Button type="dashed">모두 지우기</Button>
      </L.SearchHeader> */}
      <L.SearchBody>
        <L.SearchWrapper>
          <Link href={`/profile/${username}`}>
            <L.SearchLeft>
              <ProfileImage src={src} width={50} height={50} />
              <L.UserNameWrapper>
                <h4>{username}</h4>
                {/* <span>hooks</span> */}
              </L.UserNameWrapper>
            </L.SearchLeft>
          </Link>
          <L.SearchRight $isSearching={true}>
            <CloseOutlined />
          </L.SearchRight>
        </L.SearchWrapper>
      </L.SearchBody>
    </>
  );
}

export default SearchUserList;
