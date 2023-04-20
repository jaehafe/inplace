import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { axiosInstance } from '../configs/axios';

export const handleFollowAPI = (
  userId?: number,
  options?: UseMutationOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  // console.log('user id>>>', userId);

  const queryKey = `/follows/${userId}`;

  const queryFn = (data: object) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};
