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

export const createCommentAPI = (
  identifier: string,
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>
): any => {
  const queryKey = `/comments/${identifier}`;
  const queryFn = (data: any) =>
    axiosInstance.post(queryKey, data).then((res) => res.data);

  const onError = () => {
    message.error('댓글 생성 실패');
  };

  return useMutation([queryKey], queryFn, { onError, ...options });
};

export const getCommentsAPI = (
  identifier?: string,
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/comments`;

  const queryFn = () =>
    axiosInstance.get(`${queryKey}/${identifier}`).then((res) => res.data);

  const onError = () => {
    message.error('댓글 불러오기 실패');
  };
  return useQuery([queryKey], queryFn, { onError, ...options });
};

export const getOwnCommentsAPI = (
  identifier?: string,
  options?: UseQueryOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/comments/owned/${identifier}`;

  const queryFn = () =>
    axiosInstance.get(`${queryKey}/${identifier}`).then((res) => res.data);

  const onError = () => {
    message.error('댓글 불러오기 실패');
  };
  return useQuery([queryKey], queryFn, { onError, ...options });
};

export const updateCommentAPI = (
  commentId?: string,
  options?: UseMutationOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/comments/${commentId}`;
  const queryFn = (body: { body: string }) =>
    axiosInstance.patch(queryKey, body).then((res) => res.data);

  const onError = () => {
    message.error('댓글 수정 실패');
  };
  return useMutation([queryKey], queryFn, { onError, ...options });
};

export const deleteCommentAPI = (
  commentId?: string,
  options?: UseMutationOptions<AxiosResponse<any[]>, AxiosError, any, string[]>
) => {
  const queryKey = `/comments/${commentId}`;
  const queryFn = () => axiosInstance.delete(queryKey).then((res) => res.data);

  const onError = () => {
    message.error('댓글 삭제 실패');
  };
  return useMutation([queryKey], queryFn, { onError, ...options });
};
