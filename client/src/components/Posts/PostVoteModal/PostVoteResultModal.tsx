import Image from 'next/image';
import React from 'react';
import P from '../../../pages/profile/Profile.styles';
import { usePostVoteResultModalStoreActions } from '../../../store/postVoteResultStore';
import L from '../../Header/LogoHeader/LogoHeader.styles';
import { AppImages } from '../../../configs/AppImages';
import { getPostVoteResultAPI } from '../../../apis/post';
import PostVoteResult from './PostVoteResult';

function PostVoteResultModal() {
  const { isOpen, postId, closeModal } = usePostVoteResultModalStoreActions();

  const { data: detailPost, isLoading } = getPostVoteResultAPI(postId!);
  console.log('detailPost>>>', detailPost);

  const openModalFn = () => {
    if (isOpen && postId) {
      return true;
    } else {
      false;
    }
  };

  return (
    <>
      {!isLoading && detailPost && (
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
          {!isLoading && detailPost && <PostVoteResult data={detailPost} />}
        </P.PostVoteResultDrawer>
      )}
    </>
  );
}

export default PostVoteResultModal;
