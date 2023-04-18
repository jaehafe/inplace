import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { message } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { axiosInstance } from '../configs/axios';
import { ILogin, ISignup } from '../types';

export const signupAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, ISignup>
) => {
  const router = useRouter();
  const queryKey = `/auth/signup`;
  const queryFn = (data: ISignup) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onSuccess = () => router.push('/login');

  return useMutation([queryKey], queryFn, { onSuccess, ...options });
};

export const loginAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, ILogin>
) => {
  const queryKey = `/auth/login`;
  const queryFn = (data: ILogin) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};

export const logoutAPI = () => {
  const router = useRouter();
  const queryKey = `/auth/logout`;
  const queryFn = () => axiosInstance.post(queryKey).then((res) => res.data);

  const onSuccess = () => {
    // message.success('로그아웃 성공').then(() => router.reload());
    router.reload();
  };
  const onError = () => {
    message.error('로그아웃 실패');
  };

  return useMutation([queryKey], queryFn, { onSuccess, onError });
};

export const authMeAPI = (
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/auth/me`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery([queryKey], queryFn, { ...options });
};

export const getUserInfoAPI = (
  identifier?: string,
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/user/${identifier}`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  const onError = () => {
    message.error('유저 정보를 가져오는데 실패했습니다.');
  };

  return useQuery([queryKey], queryFn, { onError, ...options });
};

export const uploadImageAPI = <T>(data: FormData) => {
  return axiosInstance.post<T>(`/auth/images`, data);
};
