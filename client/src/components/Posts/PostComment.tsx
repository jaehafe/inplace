import { HeartOutlined, HeartTwoTone, MoreOutlined } from '@ant-design/icons';
import { Button, Divider, Input, message, Popover } from 'antd';
import Image from 'next/image';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { formattedDate } from '../../utils';
import P from './Posts.styles';

function PostComment({
  body,
  createdAt,
  updatedAt,
  userVote,
  voteScore,
  username,
  commentId,
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(body);
  const editTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editTitleRef.current) {
      editTitleRef.current.focus();
    }
  }, [isEditing]);

  const isDisabledEditComment = useMemo(
    () => Boolean(editedComment.trim().length < 5),
    [editedComment]
  );

  const handleEditComment = (commentId: string) => {
    console.log('수정');
    console.log('identifier', commentId);
  };
  const handleDeleteComment = (commentId: string) => {
    console.log('삭제');
    console.log('identifier', commentId);
  };

  const handleEditCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editedComment.trim() === '') {
      return message.error('최소 5글자 이상 입력해 주세요');
    }
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
              {username} | {formattedDate(createdAt)}
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
                value={editedComment[commentId] || ''}
                onChange={(e) => setEditedComment(e.target.value)}
                style={{ height: 100, resize: 'none' }}
              />
              <P.CommentEditButton
                type="dashed"
                htmlType="submit"
                disabled={isDisabledEditComment}
              >
                저장
              </P.CommentEditButton>
              <P.CommentCancelButton
                type="dashed"
                htmlType="submit"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                취소
              </P.CommentCancelButton>
            </form>
          ) : (
            <pre>{body}</pre>
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
