import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
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

export const uploadImageAPI = <T>(data: FormData) => {
  return axiosInstance.post<T>(`${baseURL}/auth/images`, data);
};
