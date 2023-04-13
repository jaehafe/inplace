import { HeartOutlined, HeartTwoTone, MoreOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import Image from 'next/image';
import React from 'react';
import P from './Posts.styles';

function PostComment() {
  return (
    <P.DetailCommentWrapper>
      <P.CommentHeader>
        <h3>댓글</h3>
        <span>13</span>
      </P.CommentHeader>
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
