import { HeartOutlined, HeartTwoTone, MoreOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Input, message, Popover } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  FormEvent,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { deleteCommentAPI, updateCommentAPI } from '../../apis/comment';
import { voteCommentAPI } from '../../apis/vote';
import { useUserInfo } from '../../store/userStore';
import { formattedDate } from '../../utils';
import ProfileImage from '../Common/ProfileImage';
import P from './Posts.styles';

function PostComment({ data }: any) {
  const {
    body,
    createdAt,
    updatedAt,
    userVote,
    voteScore,
    identifier: commentId,
    commentVotes,
    user,
  } = data;
  const { username } = user;

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(body);
  const editCommentRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const currentLoginUser = useUserInfo();

  useEffect(() => {
    if (isEditing && editCommentRef.current) {
      editCommentRef.current.focus();
    }
  }, [isEditing]);

  const isDisabledEditComment = useMemo(
    () => Boolean(editedComment.trim().length < 5),
    [editedComment]
  );

  const onSuccessVoteComment = () => {
    message.success('댓글 좋아요 완료');
    queryClient.invalidateQueries([`/comments`]);
  };

  const { mutate: voteCommentMutate } = voteCommentAPI(commentId, {
    onSuccess: onSuccessVoteComment,
  });

  // 댓글 수정 api mutation
  const onSuccessEditComment = () => {
    setIsEditing(false);

    queryClient.invalidateQueries([`/comments`]);
    message.success('댓글 수정 완료');
  };
  const { mutate: updateCommentMutate } = updateCommentAPI(commentId, {
    onSuccess: onSuccessEditComment,
  });

  // 댓글 삭제 api mutation
  const onSuccessDeleteComment = () => {
    setIsEditing(false);
    queryClient.invalidateQueries([`/comments`]);
    message.success('댓글 삭제 완료');
  };
  const { mutate: deleteCommentMutate } = deleteCommentAPI(commentId, {
    onSuccess: onSuccessDeleteComment,
  });

  // 댓글 수정
  const handleEditComment = (commentId: string) => {
    setIsEditing(true);
    setEditedComment(editedComment);
  };
  // 댓글 삭제
  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutate(commentId);
  };

  // 수정한 댓글 submit
  const handleEditCommentSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (editedComment.trim() === '') {
      message.error('최소 5글자 이상 입력해 주세요');
      return;
    }

    updateCommentMutate({ body: editedComment });
  };

  const checkUser = () => {
    if (username !== currentLoginUser?.username) {
      return (
        <Button type="text" onClick={() => handleEditComment(commentId)}>
          신고
        </Button>
      );
    } else if (username === currentLoginUser.username) {
      return (
        <>
          <Button type="text" onClick={() => handleEditComment(commentId)}>
            수정
          </Button>
          <Button type="text" onClick={() => handleDeleteComment(commentId)}>
            삭제
          </Button>
        </>
      );
    }
  };

  const checkWhetherVoted = (currentLoginUser: any) => {
    const alreadyVote = commentVotes?.find(
      (vote: any) => vote.userId === currentLoginUser?.id
    );

    if (alreadyVote) {
      return <HeartTwoTone twoToneColor="#4e062d" />;
    } else {
      return <HeartOutlined className="heart-icon" />;
    }
  };

  const handleCommentVote = (value: number, commentId: string) => {
    if (!currentLoginUser) {
      message.error('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
      return;
    }

    voteCommentMutate({ value });
  };

  return (
    <P.PostComment key={commentId}>
      <P.CommentBodyWrapper>
        <Link href={`/profile/${user.username}`}>
          <ProfileImage src={user?.image?.src} width={36} height={36} />
        </Link>
        <P.CommentInfo>
          <P.CommentInfoHeader>
            <span>
              {username} | {formattedDate(updatedAt)}
              {createdAt !== updatedAt ? '(수정됨)' : ''}
            </span>

            <Popover
              placement="rightTop"
              trigger={['click']}
              content={checkUser()}
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
        <button onClick={() => handleCommentVote(1, commentId)}>
          {checkWhetherVoted(currentLoginUser)}
        </button>
      </P.LikeWrapper>
      <Divider style={{ margin: '14px 0' }} />
    </P.PostComment>
  );
}

export default PostComment;
