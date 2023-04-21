import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logoutAPI } from '../../../../apis/user';
import { useUserInfo } from '../../../../store/userStore';
import { AppImages } from '../../../../configs/AppImages';
import Image from 'next/image';
import ProfileImage from '../../../Common/ProfileImage';
import { Button, Divider, Input } from 'antd';
import { CloseOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import L from '../../LogoHeader/LogoHeader.styles';
import Link from 'next/link';
import SearchUserList from './SearchUserList';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../../configs/axios';

interface INavigateDrawer {
  openSearchUserDrawer: boolean;
  setOpenSearchUserDrawer: (value: boolean) => void;
}

function NavigateDrawer({
  openSearchUserDrawer,
  setOpenSearchUserDrawer,
}: INavigateDrawer) {
  const router = useRouter();
  const [searchUserValue, setSearchUserValue] = useState('');
  const [isShowRecentHistory, setIsShowRecentHistory] = useState(true);

  const { ref: observeRef, inView } = useInView();
  const queryKey = `/users`;

  const searchUser = async (pageParam: number) => {
    const { data } = await axiosInstance.get(
      `${queryKey}/${searchUserValue}?page=${pageParam}`
    );
    const isLast = data.length === 0;

    return {
      result: data,
      nextPage: pageParam + 1,
      isLast,
    };
  };

  const {
    status,
    data: userData,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    [queryKey],
    async ({ pageParam = 0 }) => {
      return await searchUser(pageParam);
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.isLast) {
          return lastPage.nextPage;
        } else {
          return undefined;
        }
      },
      // staleTime: 600000,
      // cacheTime: 300000,
      enabled: searchUserValue.length > 0,
    }
  );

  console.log('userData::::', userData);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, observeRef]);

  const handleSearchUser = (e: any) => {
    setIsShowRecentHistory(false);
    setSearchUserValue(e.target.value);
  };

  useEffect(() => {
    if (searchUserValue.length === 0) {
      setIsShowRecentHistory(true);
    }
  }, [searchUserValue]);

  return (
    <L.MyDrawer
      title={
        <L.DrawerHeader>
          <Image
            src={AppImages.InPlaceLogo}
            alt="profileImage"
            width="30"
            height="30"
          />
          검색
        </L.DrawerHeader>
      }
      placement="right"
      closable={false}
      width={'auto'}
      onClose={() => setOpenSearchUserDrawer(false)}
      open={openSearchUserDrawer}
    >
      <L.DrawerBodyWrapper>
        <L.SearchUserInput
          placeholder="검색"
          enterButton="검색"
          size="large"
          prefix={<UserOutlined />}
          // loading
          value={searchUserValue}
          onChange={handleSearchUser}
        />
        <Divider />
        <SearchUserList isShowRecentHistory={isShowRecentHistory} />
        <div ref={observeRef}></div>
      </L.DrawerBodyWrapper>
    </L.MyDrawer>
  );
}

export default NavigateDrawer;

{
  /* <L.SearchBody>
  <SearchUserList />

  <SearchUserList />
</L.SearchBody>; */
}
