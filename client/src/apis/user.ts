import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { message } from 'antd';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { axiosInstance, baseURL } from '../configs/axios';
import { ILogin, ISignup } from '../types';

export const signupAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, ISignup>
) => {
  const router = useRouter();
  const queryKey = `${baseURL}/auth/signup`;
  const queryFn = (data: ISignup) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onSuccess = () => router.push('/login');

  return useMutation([queryKey], queryFn, { onSuccess, ...options });
};

export const loginAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, ILogin>
) => {
  const queryKey = `${baseURL}/auth/login`;
  const queryFn = (data: ILogin) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};

export const logoutAPI = () => {
  const router = useRouter();
  const queryKey = `${baseURL}/auth/logout`;
  const queryFn = () => axiosInstance.post(queryKey).then((res) => res.data);

  const onSuccess = () => {
    message.success('로그아웃 성공').then(() => router.reload());
  };
  const onError = () => {
    message.error('로그아웃 실패');
  };

  return useMutation([queryKey], queryFn, { onSuccess, onError });
};

export const authMeAPI = (
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `${baseURL}/auth/me`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);
  return useQuery([queryKey], queryFn, { ...options });
};

export const uploadImageAPI = <T>(data: FormData) => {
  return axiosInstance.post<T>(`${baseURL}/auth/images`, data);
};
