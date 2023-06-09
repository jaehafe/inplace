import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { message, Upload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { UploadFileStatus } from 'antd/es/upload/interface';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { editUserInfoAPI, uploadImageAPI } from '../../apis/user';
import P from './Profile.styles';
import InputGroup from '../InputGroup/InputGroup';
import S from '../Signup/Signup.styles';
import CommonButton from '../Common/CommonButton.styles';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const isUploadable = (fileList: UploadFile[]) => {
  return fileList.every((file) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/svg';
    if (!isJpgOrPng) {
      message.error('JPG/PNG/SVG 형식의 파일만 업로드 가능합니다.');
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('총 20MB이하의 파일사이즈만 업로드 가능합니다.');
      return false;
    }
    return true;
  });
};

interface IProfileEditModal {
  userInfo?: any;
  currentLoginUser?: any;
  openProfileEditModal: boolean;
  setOpenProfileEditModal: (value: boolean) => void;
}

function ProfileEditModal({
  userInfo,
  openProfileEditModal,
  setOpenProfileEditModal,
}: IProfileEditModal) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<any>({});

  const [profileUploadLoading, setProfileUploadLoading] = useState(false);
  const [imageInfo, setImageInfo] = useState<any>(null);

  const [imageName, setImageName] = useState('');
  const [fileList, setFileList] = useState();

  useEffect(() => {
    setEmail(userInfo?.email);
    setUsername(userInfo?.username);
    // setFileList(getFileListFromUserImage(userInfo?.image));
    setFileList(userInfo?.image?.src);
  }, [userInfo]);

  const handleProfileChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (isUploadable(info.fileList)) {
      setProfileUploadLoading(true);
      const imageData = info.fileList.at(-1)!.originFileObj;
      const imageFormData = new FormData();
      imageFormData.append('image', imageData as any);

      uploadImageAPI<any>(imageFormData).then((res) => {
        setImageName(res.data);
        setFileList(res?.data);
        return;
      });
      setProfileUploadLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {profileUploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const isSameImage = () => userInfo?.image.src === fileList;
  const isSameUsername = () => userInfo?.username === username;

  const isDisabled = useMemo(
    () => Boolean(!email || !username || (isSameImage() && isSameUsername())),
    [email, username, userInfo, fileList]
  );

  const onSuccess = () => {
    message.success(`${username} 수정 완료`);
    setOpenProfileEditModal(false);
    router.push(`/profile/${username}`);
    queryClient.invalidateQueries([`/user/${username}`]);
  };

  const onError = (error: AxiosError) => {
    setErrors(error.response?.data || {});
  };
  const { mutate } = editUserInfoAPI({ onError, onSuccess });

  const submitEditForm = async (e: FormEvent) => {
    e.preventDefault();

    mutate({ username, imageName });
  };

  const beforeUpload = () => {
    return false;
  };

  return (
    <P.ProfileEditDrawer
      placement="bottom"
      title="프로필 편집"
      closable={false}
      onClose={() => setOpenProfileEditModal(false)}
      open={openProfileEditModal}
      key="bottom"
      height={'auto'}
      style={{ overflowY: 'scroll' }}
    >
      <S.SignupWrapper onSubmit={submitEditForm} encType="multipart/form-data">
        {/* 이메일 */}
        <h3>이메일 주소</h3>
        <InputGroup
          type="email"
          placeholder="이메일 주소 입력"
          value={email}
          isfill={email}
          setValue={setEmail}
          error={errors.email}
          disabled={true}
        />
        {/* 닉네임 */}
        <h3>닉네임</h3>
        <InputGroup
          type="text"
          placeholder="인플레이스에서 어떻게 불러드릴까요?"
          value={username}
          isfill={username}
          setValue={setUsername}
          error={errors.username}
        />
        <h4>수정할 닉네임 입력해 주세요.</h4>

        {/* 프로필 이미지 업로드 */}
        <h3>프로필 이미지</h3>
        <Upload
          name="image"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleProfileChange}
          // fileList={fileList}
        >
          {fileList ? (
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/${fileList}`}
              alt="avatar"
              style={{ width: '100%' }}
            />
          ) : (
            uploadButton
          )}
        </Upload>

        <h4>
          png, jpeg, svg 파일만 가능하며, 2MB 이하의 파일만 업로드 가능합니다.
        </h4>
        <CommonButton type="primary" disabled={isDisabled} htmlType="submit">
          프로필 수정
        </CommonButton>
      </S.SignupWrapper>
    </P.ProfileEditDrawer>
  );
}

export default ProfileEditModal;
