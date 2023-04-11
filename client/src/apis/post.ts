import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { axiosInstance, baseURL } from '../configs/axios';

export const createPostAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>
) => {
  const router = useRouter();
  const queryKey = `${baseURL}/posts`;
  const queryFn = (data: any) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onSuccess = () => {
    message.success('게시물이 생성 완료');
    router.push('/');
  };

  const onError = () => {
    message.error('게시물 생성 실패');
  };

  return useMutation([queryKey], queryFn, { onSuccess, onError, ...options });
};
