import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, message } from 'antd';
import React from 'react';
import { handleFollowAPI } from '../../apis/follow';
import P from './Posts.styles';

interface IPostDrawer {
  followers: any;
  userInfo?: any;
  postAuthorInfo: any;
  currentLoginUser?: any;
  openPostDrawer: boolean;
  setOpenPostDrawer: (value: boolean) => void;
}

function PostDrawer({
  followers,
  openPostDrawer,
  setOpenPostDrawer,
  postAuthorInfo,
  currentLoginUser,
}: IPostDrawer) {
  const { id, username } = postAuthorInfo;

  const queryClient = useQueryClient();

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

  return (
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
          <Button type="text" shape="round">
            게시물 수정
          </Button>
          <Divider style={{ margin: '10px 0' }} />
          <Button type="text" shape="round">
            게시물 삭제
          </Button>
        </>
      ) : (
        <>
          <Divider style={{ margin: '10px 0' }} />
          <Button type="text" shape="round" onClick={() => handleFollowing(id)}>
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
  );
}

export default PostDrawer;
