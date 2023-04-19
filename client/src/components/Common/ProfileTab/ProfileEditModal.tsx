import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { UploadFileStatus } from 'antd/es/upload/interface';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { uploadImageAPI } from '../../../apis/user';
import P from '../../../pages/profile/Profile.styles';
import InputGroup from '../../InputGroup/InputGroup';
import S from '../../Signup/Signup.styles';
import CommonButton from '../CommonButton';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/svg';
  if (!isJpgOrPng) {
    message.error('JPG/PNG/SVG 형식의 파일만 업로드 가능합니다.');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('2MB이하의 파일사이즈만 업로드 가능합니다.');
  }
  return isJpgOrPng && isLt2M;
};

interface IProfileEditModal {
  userInfo?: any;
  currentLoginUser?: any;
  handleFollowing?: () => void;
  openProfileEditModal: boolean;
  setOpenProfileEditModal: (value: boolean) => void;
}

function ProfileEditModal({
  userInfo,
  openProfileEditModal,
  setOpenProfileEditModal,
}: IProfileEditModal) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const [profileUploadLoading, setProfileUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [imagePath, setImagePath] = useState<string>('');
  const [imageName, setImageName] = useState('');

  console.log('userInfo>>>', userInfo);

  const loadImage = () => {
    if (userInfo && userInfo.image.src) {
      setImageUrl(userInfo.image.src);
    }
  };

  const getFileListFromUserImage = (userImage: any) => {
    if (userImage) {
      return [
        {
          uid: userImage.id,
          name: userImage.src,
          status: 'done' as UploadFileStatus,
          url: userImage.src,
        },
      ];
    }
    return [];
  };

  const [fileList, setFileList] = useState(
    getFileListFromUserImage(userInfo?.image)
  );

  useEffect(() => {
    setEmail(userInfo?.email);
    setUsername(userInfo?.username);
    setFileList(getFileListFromUserImage(userInfo?.image));
  }, [userInfo]);
  console.log('fileList>>>', fileList);

  // useEffect(() => {
  //   loadImage();
  // }, [userInfo]);

  const handleProfileChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setProfileUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const imageData = info.file.originFileObj;
      console.log('info>>>', info);

      console.log('imageData>>', imageData);

      const imageFormData = new FormData();

      imageFormData.append('image', imageData as any);

      // uploadImageAPI<any>(imageFormData).then((res) => {
      //   console.log('imageData>>>>>>', res.data);

      //   return setImageName(res.data);
      // });
      setImageInfo(info.file.originFileObj);
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setProfileUploadLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {profileUploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const isDisabled = useMemo(
    () => Boolean(!email || !username),
    [email, username]
  );

  const onClickSignup = async (e: FormEvent) => {
    e.preventDefault();
    console.log('imageInfo', imageInfo);

    // mutate({ email, password, username, imageName } as ISignup);
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
      <S.SignupWrapper onSubmit={onClickSignup} encType="multipart/form-data">
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
          fileList={fileList}
        >
          {/* {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )} */}
          {fileList.length > 0 ? (
            <img
              src={`http://localhost:4000/${fileList[0].url}`}
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