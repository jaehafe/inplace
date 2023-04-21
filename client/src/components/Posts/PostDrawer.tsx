import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, message } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { handleFollowAPI } from '../../apis/follow';
import { deletePostAPI } from '../../apis/post';
import { useEditPostModalStoreActions } from '../../store/editPostStore';
import PostEditModal from './PostEditModal';
import P from './Posts.styles';

interface IPostDrawer {
  postId: string;
  followers: any;
  userInfo?: any;
  postAuthorInfo: any;
  currentLoginUser?: any;
  openPostDrawer: boolean;
  setOpenPostDrawer: (value: boolean) => void;
}

function PostDrawer({
  postId,
  followers,
  openPostDrawer,
  setOpenPostDrawer,
  postAuthorInfo,
  currentLoginUser,
}: IPostDrawer) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setEditPostId, setOpenEditPostModal } =
    useEditPostModalStoreActions();

  const { id, username } = postAuthorInfo;

  const onSuccessFollow = (data: any) => {
    console.log('data>>>', data);
    message.success(data.message);
    queryClient.invalidateQueries([`/posts`]);
    // queryClient.invalidateQueries([`/user/${identifier}`]);
  };
  const onErrorFollow = (data: any) => {
    message.error(data.response.data.error);
  };

  const { mutate: followMutate } = handleFollowAPI({
    onSuccess: onSuccessFollow,
    onError: onErrorFollow,
  });

  const handleFollowing = (id: number) => {
    console.log('followerId>>', id);

    followMutate({ id });
  };

  const checkFollow = () => {
    const isFollow = followers?.find(
      (follower: any) => follower?.followerId === currentLoginUser?.id
    );
    if (isFollow) return true;
  };

  const handleEditPost = () => {
    setOpenEditPostModal(postId, true);
    setEditPostId(postId);
    setOpenPostDrawer(false);
  };

  const onSuccessDeletePost = () => {
    queryClient.invalidateQueries([`/posts`]);
    message.success('게시글 삭제 완료');
  };

  const { mutate: deletePostMutate } = deletePostAPI(postId, {
    onSuccess: onSuccessDeletePost,
  });

  const handleDeletePost = () => {
    console.log('게시글 삭제>>', postId);
    deletePostMutate(postId);
  };

  return (
    <>
      <P.PostDrawer
        placement="bottom"
        closable={false}
        onClose={() => setOpenPostDrawer(false)}
        open={openPostDrawer}
        key="bottom"
        height={'auto'}
      >
        <Button type="text" shape="round" disabled={true}>
          공유
        </Button>
        <Divider style={{ margin: '10px 0' }} />
        <Button type="text" shape="round" disabled={true}>
          스크랩
        </Button>

        {currentLoginUser?.username === username ? (
          <>
            <Divider style={{ margin: '10px 0' }} />
            <Button type="text" shape="round" onClick={handleEditPost}>
              게시물 수정
            </Button>
            <Divider style={{ margin: '10px 0' }} />
            <Button type="text" shape="round" onClick={handleDeletePost}>
              게시물 삭제
            </Button>
          </>
        ) : (
          <>
            <Divider style={{ margin: '10px 0' }} />
            <Button
              type="text"
              shape="round"
              onClick={() => handleFollowing(id)}
            >
              {checkFollow() ? `${username} 팔로우 취소` : `${username} 팔로우`}
            </Button>
            <Divider style={{ margin: '10px 0' }} />
            <Button
              type="text"
              shape="round"
              style={{ color: 'red' }}
              disabled={true}
            >
              내용 신고
            </Button>
          </>
        )}
      </P.PostDrawer>
    </>
  );
}

export default PostDrawer;
