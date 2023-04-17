import { MoreOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Input, message, Popover } from 'antd';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useUserStore } from '../../../store/userStore';
import P from '../../Posts/Posts.styles';
import ProfileImage from '../ProfileImage';
import T from './Tab.styles';

function CommentTab() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState('');
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
          <ProfileImage width={40} height={40} />
          <div>
            <div>
              <span>(게시물 작성한 유저의 이름)</span>
            </div>
            <h4>posttile</h4>
          </div>
        </T.PostWrapper>
        <T.MyCommentWrapper>
          <ProfileImage width={40} height={40} />
          <T.MyCommentBodyWrapper>
            <T.MyCommentHeaderWrapper>
              <span>댓글 단 (내 댓글)입니다.</span>
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
              <pre style={{ whiteSpace: 'pre-wrap' }}>123</pre>
            )}
          </T.MyCommentBodyWrapper>
        </T.MyCommentWrapper>
        <Divider style={{ margin: '6px 0' }} />
      </>
    </T.CommentBodyWrapper>
  );
}

export default CommentTab;
