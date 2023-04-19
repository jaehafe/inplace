// components/Common/ProfileInfo.tsx

import { message } from 'antd';
import P from '../../../pages/profile/Profile.styles';

interface IProfileInfoProps {
  userInfo: any;
  currentLoginUser: any;
  handleFollowing: () => void;
  setOpenFollowList: (value: boolean) => void;
  setOpenProfileEditModal: (value: boolean) => void;
}

function ProfileInfo({
  userInfo,
  currentLoginUser,
  handleFollowing,
  setOpenFollowList,
  setOpenProfileEditModal,
}: IProfileInfoProps) {
  const handleLogin = () => {
    setOpenProfileEditModal(true);
    // message.success('프로필 편집 페이지로 이동합니다.(아직 미 구현)');
  };

  const renderFollowInfo = () => {
    if (currentLoginUser) {
      if (currentLoginUser?.username === userInfo?.username) {
        return <P.EditButton onClick={handleLogin}>프로필 편집</P.EditButton>;
      } else {
        return (
          <P.FollowButton
            onClick={handleFollowing}
            $isFollowing={userInfo?.isFollowing}
          >
            {userInfo?.isFollowing ? '팔로잉 취소' : '팔로우'}
          </P.FollowButton>
        );
      }
    } else {
      return '';
    }
  };

  return (
    <>
      <h2>{userInfo?.username}</h2>
      <P.FollowInfoWrapper onClick={() => setOpenFollowList(true)}>
        <h4>팔로워 {userInfo?.followersCount}</h4>
        <h4>팔로잉 {userInfo?.followingCount}</h4>
      </P.FollowInfoWrapper>
      {renderFollowInfo()}
    </>
  );
}

export default ProfileInfo;
