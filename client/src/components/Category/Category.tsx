import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { Divider, PaginationProps, Space, Spin, Tag } from 'antd';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { getCategoryAPI } from '../../apis/category';
import { axiosInstance } from '../../configs/axios';
import CustomizedEmpty from '../Common/CustomizedEmpty';
import P from '../Posts/Posts.styles';
import PostTab from '../ProfileTab/PostTab';
import T from '../ProfileTab/Tab.styles';
import C from './Category.styles';
import CategoryList from './CategoryList';

//
function Category({ categoryId }: { categoryId: string }) {
  // const { data, isLoading } = getCategoryAPI(categoryId);

  const [page, setPage] = useState(1);
  const onChange: PaginationProps['onChange'] = (page) => {
    setPage(page);
  };

  const queryKey = `/categories/${categoryId}?page=${page - 1}`;

  const fetchSameCategoryPosts = async (page = 0) => {
    const { data } = await axiosInstance.get(`${queryKey}`);

    return data;
  };

  const {
    status,
    data: responseData,
    error,
    isLoading,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchSameCategoryPosts(page),
    keepPreviousData: true,
    staleTime: 100000,
  });

  return (
    <C.Container>
      <h2>카테고리 관련 게시물</h2>
      <C.CategoryListWrapper>
        {responseData?.data?.length > 0 ? (
          <>
            {responseData?.data?.map((data: any) => {
              return <PostTab post={data} key={data.identifier} queryKey={queryKey} />;
            })}
            <T.AntdPagination current={page} onChange={onChange} total={responseData?.total} />
          </>
        ) : (
          // <>{isSameUser('개시글')}</>
          <CustomizedEmpty
            desc1={`관련 카테고리의 게시글이 없습니다.`}
            // buttonMessage={`${desc} `}
          />
        )}
        <P.LoadingWrapper>
          {isLoading || isFetching ? <Spin size="large" /> : null}
        </P.LoadingWrapper>

        {/* <CategoryList /> */}
      </C.CategoryListWrapper>
    </C.Container>
  );
}

export default Category;

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const queryClient = new QueryClient();
//   const queryKey = `/categories/${params?.identifier}`;
//   const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

//   await queryClient.prefetchQuery([queryKey], queryFn);

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//       identifier: params?.identifier,
//     },
//   };
// };
