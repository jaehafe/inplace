import { MoreOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Input, message, Popover } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useUserStore } from '../../../store/userStore';
import {
  commentBodyEllipsis,
  formattedDate,
  postTitleEllipsis,
} from '../../../utils';
import P from '../../Posts/Posts.styles';
import ProfileImage from '../ProfileImage';
import T from './Tab.styles';

function CommentTab({ data }: any) {
  console.log('comment Data>>>', data);
  const { body: commentBody, updatedAt, createdAt, post, user } = data;
  const { identifier: postId, title: postTitle } = post;
  const { image: postAuthorProfile, username: postAuthor } = post.user;
  const {
    image: { src: commentAuthorProfile },
    username: commentAuthor,
  } = user;

  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(commentBody);
  // body
  const editCommentRef = useRef<HTMLInputElement>(null);

  const currentLoginUser = useUserStore((state) => state.userInfo);

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
  const handleEditComment = () => {
    // commentId: string
    setIsEditing(true);
    setEditedComment(editedComment);
  };
  // 댓글 삭제
  const handleDeleteComment = (commentId: string) => {
    // deleteCommentMutate(commentId);
  };

  const handleEditCommentSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (editedComment.trim() === '') {
      message.error('최소 5글자 이상 입력해 주세요');
      return;
    }

    // updateCommentMutate({ body: editedComment });
  };

  return (
    <T.CommentBodyWrapper>
      <>
        <T.PostWrapper>
          <ProfileImage src={postAuthorProfile.src} width={40} height={40} />
          <Link href={`/post/${postId}`}>
            <div>
              <div>
                <span>{postAuthor}</span>
              </div>
              <pre>{postTitleEllipsis(postTitle)}</pre>
            </div>
          </Link>
        </T.PostWrapper>
        <T.MyCommentWrapper>
          <ProfileImage src={commentAuthorProfile} width={40} height={40} />
          <T.MyCommentBodyWrapper>
            <T.MyCommentHeaderWrapper>
              <span>
                {commentAuthor} | {formattedDate(updatedAt)}
                {createdAt !== updatedAt ? '수정됨' : ''}
              </span>
              <Popover
                placement="rightTop"
                trigger={['click']}
                content={
                  <>
                    <Button type="text" onClick={() => handleEditComment()}>
                      수정
                    </Button>
                    <Button type="text">삭제</Button>
                  </>
                }
              >
                <Button type="text" shape="circle">
                  <MoreOutlined
                    style={{ fontSize: '16px', color: 'black' }}
                    className="edit-button"
                  />
                </Button>
              </Popover>
            </T.MyCommentHeaderWrapper>
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
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {commentBodyEllipsis(commentBody)}
              </pre>
            )}
          </T.MyCommentBodyWrapper>
        </T.MyCommentWrapper>
        <Divider style={{ margin: '6px 0' }} />
      </>
    </T.CommentBodyWrapper>
  );
}

export default CommentTab;
