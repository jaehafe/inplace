import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AppImages } from '../../../../configs/AppImages';
import Image from 'next/image';
import SearchUserList from './SearchUserList';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../../configs/axios';
import useDebounce from '../../../../hooks/useDebounce';
import { UserOutlined } from '@ant-design/icons';
import { Button, Divider, Spin } from 'antd';
import L from '../../LogoHeader/LogoHeader.styles';

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

  const debouncedSearchValue = useDebounce(searchUserValue, 500);

  // useEffect(() => {
  //   if (debouncedSearchValue.trim().length === 0) {
  //     setIsShowRecentHistory(true);
  //   } else {
  //     setIsShowRecentHistory(false);
  //   }
  // }, [debouncedSearchValue]);

  const { ref: observeRef, inView } = useInView();
  const queryKey = `/users/search`;

  const searchUser = async (pageParam: number) => {
    const { data } = await axiosInstance.get(
      `${queryKey}/${debouncedSearchValue}?page=${pageParam}`
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
      enabled: debouncedSearchValue.length > 0,
    }
  );

  useEffect(() => {
    if (debouncedSearchValue.trim().length > 0) {
      fetchNextPage({ pageParam: 0 });
      setIsShowRecentHistory(true);
    } else {
      setIsShowRecentHistory(false);
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, observeRef]);

  const handleSearchUser = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchUserValue(e.currentTarget.value);
  };

  return (
    <L.MyDrawer
      title={
        <L.DrawerHeader>
          <Image
            src={AppImages.InPlaceLogo}
            alt="profileImage"
            width={30}
            height={30}
          />
          유저 검색
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
        {/* <L.SearchHeader $isSearching={isShowRecentHistory}>
          <h3>최근 검색 항목</h3>
          <Button type="dashed">모두 지우기</Button>
        </L.SearchHeader> */}
        {userData?.pages.map((page) =>
          page?.result?.users?.map((data: any) => {
            return (
              <SearchUserList
                data={data}
                key={data.id}
                isShowRecentHistory={isShowRecentHistory}
              />
            );
          })
        )}
        {isFetchingNextPage || isFetching ? <Spin size="large" /> : ''}
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
