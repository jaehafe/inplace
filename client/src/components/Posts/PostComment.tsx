import { HeartOutlined, HeartTwoTone, MoreOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Input, message, Popover } from 'antd';
import Image from 'next/image';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { deleteCommentAPI, updateCommentAPI } from '../../apis/comment';
import { baseURL } from '../../configs/axios';
import { formattedDate } from '../../utils';
import P from './Posts.styles';

function PostComment({ data }: any) {
  const {
    body,
    createdAt,
    updatedAt,
    userVote,
    voteScore,
    username,
    identifier: commentId,
  } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(body);
  const editCommentRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEditing && editCommentRef.current) {
      editCommentRef.current.focus();
    }
  }, [isEditing]);

  const isDisabledEditComment = useMemo(
    () => Boolean(editedComment.trim().length < 5),
    [editedComment]
  );

  // 댓글 수정
  const onSuccessEditComment = () => {
    // setEditedComment('');
    setIsEditing(false);

    // queryClient.invalidateQueries([`${baseURL}/comments/${postId}`]);
    queryClient.invalidateQueries([`${baseURL}/comments`]);
    message.success('댓글 수정 완료');
  };
  const { mutate: updateCommentMutate } = updateCommentAPI(commentId, {
    onSuccess: onSuccessEditComment,
  });

  // 댓글 삭제
  const onSuccessDeleteComment = (data: any) => {
    console.log('data>>>>', data);
    setIsEditing(false);
    queryClient.invalidateQueries([`${baseURL}/comments`]);
    message.success('댓글 삭제 완료');
  };
  const { mutate: deleteCommentMutate } = deleteCommentAPI(commentId, {
    onSuccess: onSuccessDeleteComment,
  });

  const handleEditComment = (commentId: string) => {
    console.log('수정');
    console.log('identifier', commentId);
    setIsEditing(true);
    setEditedComment(editedComment);
    console.log('editedComment>>', editedComment);
  };
  const handleDeleteComment = (commentId: string) => {
    console.log('삭제');
    console.log('identifier', commentId);

    deleteCommentMutate(commentId);
  };

  const handleEditCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('editedComment>>!!!!!!!', editedComment);
    if (editedComment.trim() === '') {
      return message.error('최소 5글자 이상 입력해 주세요');
    }

    updateCommentMutate({ body: editedComment });
  };

  return (
    <P.PostComment key={commentId}>
      <P.CommentBodyWrapper>
        <Image
          src="https://www.gravatar.com/avatar?d=mp&f=y"
          width={36}
          height={36}
          style={{ borderRadius: '50px' }}
          alt="avatar"
        />
        <P.CommentInfo>
          <P.CommentInfoHeader>
            <span>
              {username} | {formattedDate(updatedAt)}
              {createdAt !== updatedAt ? '(수정됨)' : ''}
            </span>

            <Popover
              placement="rightTop"
              trigger={['click']}
              content={
                <div>
                  <Button
                    type="text"
                    onClick={() => handleEditComment(commentId)}
                  >
                    수정
                  </Button>
                  <Button
                    type="text"
                    onClick={() => handleDeleteComment(commentId)}
                  >
                    삭제
                  </Button>
                </div>
              }
            >
              <Button type="text" shape="circle">
                <MoreOutlined
                  style={{ fontSize: '16px' }}
                  className="edit-button"
                />
              </Button>
            </Popover>
          </P.CommentInfoHeader>
          {isEditing ? (
            <form onSubmit={handleEditCommentSubmit}>
              <Input.TextArea
                placeholder="내용을 수정하세요"
                bordered={false}
                showCount
                maxLength={300}
                value={editedComment}
                ref={editCommentRef}
                onChange={(e) => setEditedComment(e.target.value)}
                style={{ height: 100, resize: 'none' }}
              />
              <P.CommentEditButton
                type="primary"
                htmlType="submit"
                disabled={isDisabledEditComment}
              >
                저장
              </P.CommentEditButton>
              <P.CommentCancelButton
                type="dashed"
                htmlType="submit"
                onClick={() => setIsEditing(false)}
              >
                취소
              </P.CommentCancelButton>
            </form>
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{body}</pre>
          )}
        </P.CommentInfo>
      </P.CommentBodyWrapper>
      <P.LikeWrapper>
        <span>좋아요 {voteScore}</span>
        <button>
          <HeartOutlined className="heart-icon" />
          <HeartTwoTone twoToneColor="#4e062d" />
        </button>
      </P.LikeWrapper>
      <Divider style={{ margin: '14px 0' }} />
    </P.PostComment>
  );
}

export default PostComment;
