import Image from 'next/image';
import React from 'react';
import P from '../../../pages/profile/Profile.styles';
import { usePostVoteResultModalStoreActions } from '../../../store/postVoteResultStore';
import L from '../../Header/LogoHeader/LogoHeader.styles';
import { AppImages } from '../../../configs/AppImages';
import { getPostVoteResultAPI } from '../../../apis/post';
import PostVoteResult from './PostVoteResult';
import { Spin } from 'antd';

function PostVoteResultModal() {
  const { isOpen, postId, closeModal } = usePostVoteResultModalStoreActions();
  const { data, isLoading, isFetching } = getPostVoteResultAPI(postId!);

  const openModalFn = () => {
    if (isOpen && postId) {
      return true;
    } else {
      false;
    }
  };

  return (
    <>
      <P.PostVoteResultDrawer
        placement="bottom"
        title={
          <L.DrawerHeader>
            <Image
              src={AppImages.InPlaceLogo}
              alt="profileImage"
              width="30"
              height="30"
            />
            투표 결과 분석
          </L.DrawerHeader>
        }
        closable={false}
        onClose={closeModal}
        open={openModalFn()}
        key="bottom"
        height={'auto'}
      >
        {data ? <PostVoteResult data={data} /> : <Spin />}
      </P.PostVoteResultDrawer>
    </>
  );
}

export default PostVoteResultModal;
