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
import { useSetUserInfo } from '../store/userStore';
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
  const onError = () => message.error('로그아웃 실패');

  return useMutation([queryKey], queryFn, { onSuccess, onError });
};

// export const authMeAPI = (
//   options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
// ) => {
//   const queryKey = `/auth/me`;
//   const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

//   const onError = () => message.error('유저 정보 가져오기 실패');

//   return useQuery([queryKey], queryFn, { onError, ...options });

export const authMeAPI = (
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/auth/me`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  const onError = () => message.error('유저 정보 가져오기 실패');
  // const onSuccess = (data: any) => useSetUserInfo()(data);
  // onSuccess,
  return useQuery([queryKey], queryFn, {
    staleTime: 1000 * 60 * 5, // 5분
    cacheTime: 1000 * 60 * 30, // 30분
    onError,
    ...options,
  });
};

export const getUserInfoAPI = (
  identifier?: string,
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/user/${identifier}`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  const onSuccess = (data: any) => {
    if (data.error) {
      return message.error(`${data.error} 다른 유저를 찾아보세요`);
    }
  };

  return useQuery([queryKey], queryFn, {
    staleTime: 600000,
    ...options,
    onSuccess,
  });
};

export const uploadImageAPI = <T>(data: FormData) => {
  return axiosInstance.post<T>(`/auth/images`, data);
};

export const editUserInfoAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>
) => {
  const queryKey = `/auth/edit`;
  const queryFn = (data: any) =>
    axiosInstance.patch(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};
