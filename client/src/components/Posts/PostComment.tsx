import { HeartOutlined, HeartTwoTone, MoreOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider, Input, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useMemo, useState } from 'react';
import { createCommentAPI, getCommentsAPI } from '../../apis/post';
import { axiosInstance, baseURL } from '../../configs/axios';
import P from './Posts.styles';
import { formattedDate } from '../../utils';
import { useQueryClient } from '@tanstack/react-query';

function PostComment({ identifier, userInfo, commentData }: any) {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const onSuccess = () => {
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
    setNewComment('');
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
                  <Button
                    type="text"
                    shape="circle"
                    // onClick={() => setOpen(true)}
                  >
                    <MoreOutlined
                      style={{ fontSize: '16px' }}
                      className="edit-button"
                    />
                  </Button>
                </P.CommentInfoHeader>
                <p>{body}</p>
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
