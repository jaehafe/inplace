import { Collapse, Divider, Input, message } from 'antd';
import { useRouter } from 'next/router';
import React, { FormEvent, useMemo, useState } from 'react';
import { createCommentAPI } from '../../apis/comment';
import { baseURL } from '../../configs/axios';
import P from './Posts.styles';

import { useQueryClient } from '@tanstack/react-query';
import PostComment from './PostComment';

function PostComments({ identifier, userInfo, commentData }: any) {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const onSuccess = () => {
    setNewComment('');
    queryClient.invalidateQueries([`${baseURL}/comments`]);
    message.success('댓글이 추가되었습니다');
  };
  const { mutate: createCommentMutate } = createCommentAPI(identifier, {
    onSuccess,
  });

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

  return (
    <P.DetailCommentWrapper>
      <P.CommentHeader>
        <h3>댓글</h3>
        <span>{commentData?.length}</span>
      </P.CommentHeader>

      {userInfo ? (
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
      {commentData?.map((data: any) => {
        return <PostComment data={data} key={data.identifier} />;
      })}
    </P.DetailCommentWrapper>
  );
}

export default PostComments;
