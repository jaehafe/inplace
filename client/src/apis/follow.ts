import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { axiosInstance } from '../configs/axios';

export const handleFollowAPI = (
  username?: string,
  options?: UseMutationOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/follows/${username}`;

  const queryFn = (data: object) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};
