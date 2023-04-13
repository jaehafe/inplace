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

function PostComment({ identifier, userInfo, commentData }: any) {
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

  const handleEditCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') {
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
        const {
          body,
          createdAt,
          updatedAt,
          userVote,
          voteScore,
          username,
          identifier: commentId,
        } = data;

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
                          onClick={() => handleEditComment(commentId, body)}
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
                {isEditing[commentId] ? (
                  <form onSubmit={handleEditCommentSubmit}>
                    <Input.TextArea
                      placeholder="내용을 수정하세요"
                      bordered={false}
                      showCount
                      maxLength={300}
                      value={editedComment[commentId] || ''}
                      onChange={(e) =>
                        setEditedComment((prev) => ({
                          ...prev,
                          [commentId]: e.target.value,
                        }))
                      }
                      style={{ height: 100, resize: 'none' }}
                    />
                    <P.CommentEditButton
                      type="dashed"
                      htmlType="submit"
                      // disabled={isDisabledEditComment}
                    >
                      저장
                    </P.CommentEditButton>
                    <P.CommentCancelButton
                      type="dashed"
                      htmlType="submit"
                      onClick={() => {
                        setIsEditing((prev) => ({
                          ...prev,
                          [commentId]: false,
                        }));
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
      })}
    </P.DetailCommentWrapper>
  );
}

export default PostComment;
