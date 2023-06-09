import { ExclamationCircleFilled } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, message, Modal } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { handleFollowAPI } from '../../apis/follow';
import { deletePostAPI } from '../../apis/post';
import { useEditPostModalStoreActions } from '../../store/editPostStore';
import PostEditModal from './PostEditModal';
import P from './Posts.styles';

interface IPostDrawer {
  postId: string;
  followers?: any;
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
  const { openEditPostModal } = useEditPostModalStoreActions();

  const { id, username } = postAuthorInfo;

  const onSuccessFollow = (data: any) => {
    message.success(data.message);

    queryClient.invalidateQueries([`/posts`]);
    // queryClient.invalidateQueries([`/user/${identifier}`]);
  };
  const onErrorFollow = (data: any) => {
    // message.error(data.response.data.error);
    if (data.response.data.error === 'Unauthenticated') {
      message.error('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    }
  };

  const { mutate: followMutate } = handleFollowAPI({
    onSuccess: onSuccessFollow,
    onError: onErrorFollow,
  });

  const handleFollowing = (id: number) => {
    followMutate({ id });
  };

  const checkFollow = () => {
    const isFollow = followers?.find(
      (follower: any) => follower?.followerId === currentLoginUser?.id
    );
    if (isFollow) return true;
  };

  const handleEditPost = () => {
    openEditPostModal(postId);
    setOpenPostDrawer(false);
  };

  const { mutate: deletePostMutate } = deletePostAPI(postId);

  const handleDeletePost = () => {
    showPromiseConfirm();
  };

  const showPromiseConfirm = () => {
    Modal.confirm({
      title: '게시물을 삭제하시겠어요?',
      icon: <ExclamationCircleFilled />,
      content: '삭제 후에는 복구가 불가능합니다.',
      onOk: () => {
        deletePostMutate(postId);
      },
      onCancel: () => {},
    });
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
