import { HeartOutlined, HeartTwoTone, MoreOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider, Input } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import { axiosInstance } from '../../configs/axios';
import P from './Posts.styles';

function PostComment({ comments, identifier, userInfo }: any) {
  console.log('comments:>>>', comments);
  const router = useRouter();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    console.log('댓글 추가');
    try {
      await axiosInstance.post(`/post/${identifier}/comments`, {
        body: newComment,
      });
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <P.DetailCommentWrapper>
      <P.CommentHeader>
        <h3>댓글</h3>
        <span>13</span>
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
                onChange={(e) => setNewComment(e.target.value)}
                style={{ height: 200, resize: 'none' }}
              />
              <P.CommentSubmitButton type="text" htmlType="submit">
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
      <P.PostComment>
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
              <span>테스트 유저</span>
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
            <p>
              이게 나라냐이게 나라냐이게 나라냐이게 나라냐이게 나라냐이게
              나라냐이게 나라냐이게 나라냐이게 나라냐이게 나라냐이게 나라냐이게
              나라냐이게 나라냐이게 나라냐이게 나라냐이게 나라냐이게 나라냐이게
              나라냐
            </p>
          </P.CommentInfo>
        </P.CommentBodyWrapper>
        <P.LikeWrapper>
          <span>좋아요 1</span>
          <button>
            <HeartOutlined className="heart-icon" />
            <HeartTwoTone twoToneColor="#4e062d" />
          </button>
        </P.LikeWrapper>
        <Divider style={{ margin: '14px 0' }} />
      </P.PostComment>
    </P.DetailCommentWrapper>
  );
}

export default PostComment;
