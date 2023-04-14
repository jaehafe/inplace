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

export const postVoteAPI = (
  identifier: string,
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>
): any => {
  const queryKey = `${baseURL}/postVotes/${identifier}`;
  const queryFn = (data: any) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onSuccess = () => {
    message.success('투표 완료');
  };

  const onError = () => {
    message.error('투표 실패');
  };

  return useMutation([queryKey], queryFn, { onSuccess, onError, ...options });
};
