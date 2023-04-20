import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { axiosInstance } from '../configs/axios';
// userId?: number,
export const handleFollowAPI = (
  options?: UseMutationOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/follows`;

  const queryFn = (data: object) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};
