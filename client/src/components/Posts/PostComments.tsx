import { Collapse, Divider, Input, message, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { createCommentAPI, getCommentsAPI } from '../../apis/comment';
import P from './Posts.styles';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import PostComment from './PostComment';
import { axiosInstance } from '../../configs/axios';
import { useInView } from 'react-intersection-observer';

function PostComments({ identifier, currentLoginUser }: any) {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') {
      return message.error('최소 5글자 이상 입력해 주세요');
    }

    createCommentMutate({ body: newComment });
  };

  const isDisabled = useMemo(
    () => Boolean(newComment.trim().length < 5),
    [newComment]
  );

  const onSuccess = () => {
    setNewComment('');
    queryClient.invalidateQueries([`/comments`]);
    message.success('댓글이 추가되었습니다');
  };
  const { mutate: createCommentMutate } = createCommentAPI(identifier, {
    onSuccess,
  });

  //////////////////

  const { ref: observeRef, inView } = useInView();

  const queryKey = `/comments/${identifier}`;

  const {
    status,
    data: comments,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    [queryKey],
    async ({ pageParam = 0 }) => {
      const { data } = await axiosInstance.get(`${queryKey}?page=${pageParam}`);
      const isLast = data.length === 0;

      return {
        result: data,
        nextPage: pageParam + 1,
        isLast,
      };
    },
    {
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined,

      staleTime: 600000,
      cacheTime: 300000,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, observeRef]);

  return (
    <P.DetailCommentWrapper>
      <P.CommentHeader>
        <h3>댓글</h3>
        {/* 댓글 총 개수 */}
        {/* <span>{commentData?.length}</span> */}
      </P.CommentHeader>

      {currentLoginUser ? (
        <Collapse>
          <Collapse.Panel header="댓글을 추가해 주세요!" key="1">
            <form onSubmit={handleSubmit}>
              <Input.TextArea
                placeholder="비속어 사용은 블라인드 처리됩니다."
                bordered={false}
                showCount
                maxLength={300}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ height: 200, resize: 'none' }}
              />
              <P.CommentSubmitButton
                type="primary"
                htmlType="submit"
                disabled={isDisabled}
              >
                추가
              </P.CommentSubmitButton>
            </form>
          </Collapse.Panel>
        </Collapse>
      ) : (
        <P.LoginRouterButton
          type="dashed"
          block
          onClick={() => router.push('/login')}
        >
          로그인 후 댓글을 추가해 보세요
        </P.LoginRouterButton>
      )}

      <Divider style={{ margin: '14px 0' }} />
      {/* 게시물 댓글 컴포넌트 */}
      {comments?.pages?.map((page) =>
        page?.result?.map((data: any) => {
          return <PostComment data={data} key={data.identifier} />;
        })
      )}
      <P.LoadingWrapper>
        {isFetchingNextPage || isFetching ? <Spin size="large" /> : ''}
      </P.LoadingWrapper>
      <div ref={observeRef}></div>
    </P.DetailCommentWrapper>
  );
}

export default PostComments;
