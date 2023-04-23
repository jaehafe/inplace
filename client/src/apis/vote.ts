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

export const postVoteAPI = (
  identifier: string,
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>
): any => {
  const queryKey = `/postVotes/${identifier}`;
  const queryFn = (data: any) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onError = () => {
    message.error('투표 실패');
  };

  return useMutation([queryKey], queryFn, { onError, ...options });
};

export const voteCommentAPI = (
  commentId?: string,
  options?: UseMutationOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/commentVotes/${commentId}`;
  const queryFn = (data: any) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onError = () => {
    message.error('댓글 좋아요 실패');
  };

  return useMutation([queryKey], queryFn, { onError, ...options });
};
