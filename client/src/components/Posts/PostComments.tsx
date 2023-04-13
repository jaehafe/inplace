import { HeartOutlined, HeartTwoTone, MoreOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider, Input, message, Popover } from 'antd';
import Image from 'next/image';

import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createCommentAPI, getCommentsAPI } from '../../apis/post';
import { axiosInstance, baseURL } from '../../configs/axios';
import P from './Posts.styles';
import { formattedDate } from '../../utils';
import { useQueryClient } from '@tanstack/react-query';
import PostComment from './PostComment';

function PostComments({ identifier, userInfo, commentData }: any) {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');

  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [editedComment, setEditedComment] = useState<Record<string, string>>(
    {}
  );
  console.log('editedComment>>', editedComment);

  const queryClient = useQueryClient();

  const onSuccess = () => {
    setNewComment('');
    queryClient.invalidateQueries([`${baseURL}/posts/${identifier}/comments`]);
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
  const isDisabledEditComment = useMemo(
    () => Boolean(newComment.trim().length < 5),
    [newComment]
  );

  const handleEditComment = (commentId: string, currentComment: string) => {
    console.log('수정');
    console.log('identifier', commentId);
    setIsEditing((prev) => ({ ...prev, [commentId]: true }));
    setEditedComment((prev) => ({ ...prev, [commentId]: currentComment }));
  };
  const handleDeleteComment = (commentId: string) => {
    console.log('삭제');
    console.log('identifier', commentId);
  };

  const handleEditCommentSubmit = (e: FormEvent, commentId: string) => {
    e.preventDefault();
    const currentEditedComment = editedComment[commentId];

    if (currentEditedComment && currentEditedComment.trim().length < 5) {
      return message.error('최소 5글자 이상 입력해 주세요');
    }
  };

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
