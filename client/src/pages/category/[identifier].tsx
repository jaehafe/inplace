import React from 'react';
import LogoHeader from '../../components/Header/LogoHeader/LogoHeader';
import P from '../../components/ProfileTab/Profile.styles';
import Category from '../../components/Category/Category';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../configs/axios';

function CategoryPage({ identifier }: { identifier: string }) {
  return (
    <P.Wrapper>
      <LogoHeader headerIcons={true} />
      <Category categoryId={identifier} />
    </P.Wrapper>
  );
}

export default CategoryPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();
  const queryKey = `/categories/${params?.identifier}`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  await queryClient.prefetchQuery([queryKey], queryFn);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      identifier: params?.identifier,
    },
  };
};
