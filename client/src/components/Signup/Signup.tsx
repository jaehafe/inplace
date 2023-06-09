import React, { FormEvent, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import CommonButton from '../Common/CommonButton.styles';
import InputGroup from '../InputGroup/InputGroup';
import S from './Signup.styles';
import Link from 'next/link';
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'antd/es/upload';
import { message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { signupAPI, uploadImageAPI } from '../../apis/user';
import { ISignup } from '../../types';
import { AxiosError } from 'axios';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

// const beforeUpload = (file: RcFile) => {
//   const isJpgOrPng =
//     file.type === 'image/jpeg' ||
//     file.type === 'image/png' ||
//     file.type === 'image/svg';
//   if (!isJpgOrPng) {
//     message.error('JPG/PNG/SVG 형식의 파일만 업로드 가능합니다.');
//     return false;
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('2MB이하의 파일사이즈만 업로드 가능합니다.');
//     return false;
//   }
//   return true
// };

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

function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const onError = (error: AxiosError) => {
    setErrors(error.response?.data || {});
  };
  const { mutate } = signupAPI({ onError });

  // 프로필 업로드
  const [profileUploadLoading, setProfileUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageName, setImageName] = useState('');
  const [fileList, setFileList] = useState();

  // const handleProfileChange: UploadProps['onChange'] = (
  //   info: UploadChangeParam<UploadFile>
  // ) => {
  //   console.log('info');

  //   if (info.file.status === 'uploading') {
  //     setProfileUploadLoading(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     const imageData = info.file.originFileObj;

  //     const imageFormData = new FormData();
  //     imageFormData.append('image', imageData as any);

  //     uploadImageAPI<any>(imageFormData).then((res) => {
  //       console.log('res.data>>>>>', res.data);

  //       setImageName(res.data);
  //       setFileList(res?.data);
  //       return;
  //     });
  //     setImageInfo(info.file.originFileObj);
  //     getBase64(info.file.originFileObj as RcFile, (url) => {
  //       setProfileUploadLoading(false);
  //       // setImageUrl(url);
  //     });
  //   }
  // };

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

  const isDisabled = useMemo(
    () => Boolean(!email || !username || !password),
    [email, username, password]
  );

  const handleSubmitSignup = async (e: FormEvent) => {
    e.preventDefault();

    mutate({ email, password, username, imageName } as ISignup);
  };

  const beforeUpload = () => {
    return false;
  };

  return (
    <S.SignupWrapper
      onSubmit={handleSubmitSignup}
      encType="multipart/form-data"
    >
      <h2>
        인플레이스 활동에 필요한
        <br />
      </h2>
      <h2>
        정보를 입력해주세요.
        <br />
      </h2>
      {/* 이메일 */}
      <h3>이메일 주소</h3>
      <InputGroup
        type="email"
        placeholder="이메일 주소 입력"
        value={email}
        isfill={email}
        setValue={setEmail}
        error={errors.email}
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
      <h4>플레이스 활동 시 필요한 닉네임을 입력해 주세요.</h4>
      {/* 비밀번호 */}
      <h3>비밀번호</h3>
      <InputGroup
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        isfill={password}
        setValue={setPassword}
        error={errors.password}
      />
      <h4>6자리 이상 20자리 이하</h4>
      {/* 프로필 이미지 업로드 */}
      <h3>프로필 이미지</h3>
      <Upload
        name="image"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleProfileChange}
      >
        {/* {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )} */}
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
      {/*  */}
      <h4>이미 회원이신가요?</h4>
      <Link href="/login">
        <h5>로그인 하러 가기</h5>
      </Link>
      <CommonButton type="primary" disabled={isDisabled} htmlType="submit">
        회원가입
      </CommonButton>
    </S.SignupWrapper>
  );
}

export default Signup;
