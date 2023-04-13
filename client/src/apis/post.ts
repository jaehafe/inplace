import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { message } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { axiosInstance, baseURL } from '../configs/axios';

export const createPostAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>
): any => {
  const router = useRouter();
  const queryKey = `${baseURL}/posts`;
  const queryFn = (data: any) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onSuccess = () => {
    message.success('게시물이 생성 완료');
    // router.push('/');
  };

  const onError = () => {
    message.error('게시물 생성 실패');
  };

  return useMutation([queryKey], queryFn, {
    onSuccess,
    onError,
    ...options,
  });
};

export const uploadPostImagesAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>
): any => {
  const router = useRouter();
  const queryKey = `${baseURL}/posts/images`;
  const queryFn = (data: any) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onError = () => {
    message.error(
      '이미지 업로드 실패 하였습니다. 로그인 후 다시 시도해주세요.'
    );
  };

  return useMutation([queryKey], queryFn, { ...options, onError });
};

export const getAllPostsAPI = (
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `${baseURL}/posts`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);
  return useQuery([queryKey], queryFn, { ...options });
};

export const getDetailPostAPI = (
  identifier: string,
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const router = useRouter();

  const queryKey = `${baseURL}/posts/${identifier}`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  const onError = () => {
    message.error('불러오기 실패');
  };
  return useQuery([queryKey], queryFn, { onError, ...options });
};
