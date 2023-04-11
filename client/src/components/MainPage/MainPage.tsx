import { Divider, Segmented, Space } from 'antd';
import React, { useState } from 'react';
import AllPosts from '../Posts/AllPosts';
import HotPosts from '../Posts/HotPosts';
import LogoHeader from '../Header/LogoHeader/LogoHeader';
import M from './MainPage.styles';
import Places from '../Posts/Places';
import WritePostButton from '../Common/WritePostButton/WritePostButton';

const displayBody = (value: string | number) => {
  switch (value) {
    case '전체':
      return <AllPosts />;
    case '인기글':
      return <HotPosts />;
    case '플레이스':
      return <Places />;

    default:
      return <AllPosts />;
  }
};

function MainPage() {
  const [value, setValue] = useState<string | number>('전체');

  return (
    <M.MainPageWrapper>
      <LogoHeader headerIcons={true} />
      <M.StyledSpace direction="horizontal">
        <Segmented
          options={[
            { label: '전체', value: '전체' },
            { label: '인기글', value: '인기글' },
            { label: '플레이스', value: '플레이스' },
          ]}
          value={value}
          onChange={setValue}
        />
      </M.StyledSpace>

      <>{displayBody(value)}</>
      <WritePostButton />
    </M.MainPageWrapper>
  );
}

export default MainPage;
