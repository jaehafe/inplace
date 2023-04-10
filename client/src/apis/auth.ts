import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { axiosInstance, baseURL } from '../configs/axios';
import { ISignup } from '../types';

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
