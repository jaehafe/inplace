import {
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  LoadingOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Collapse, Input, message, Upload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FormEvent, useMemo, useState } from 'react';
import { createPostAPI, uploadPostImagesAPI } from '../../apis/post';
import { axiosInstance } from '../../configs/axios';
import CommonButton from '../Common/CommonButton';
import PostHeader from '../Header/PostHeader/PostHeader';
import P from './Posts.styles';

// const getBase64 = (img: RcFile, callback: (url: string) => void) => {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result as string));
//   reader.readAsDataURL(img);
// };

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// const beforeUpload = (file: RcFile) => {
//   const isJpgOrPng =
//     file.type === 'image/jpeg' ||
//     file.type === 'image/png' ||
//     file.type === 'image/svg';
//   if (!isJpgOrPng) {
//     message.error('JPG/PNG/SVG 형식의 파일만 업로드 가능합니다.');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 20;
//   if (!isLt2M) {
//     message.error('총 20MB이하의 파일사이즈만 업로드 가능합니다.');
//   }
//   return isJpgOrPng && isLt2M;
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
    const isLt2M = file.size! / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error('총 20MB이하의 파일사이즈만 업로드 가능합니다.');
      return false;
    }
    return true;
  });
};

function CreatePost() {
  const [title, setTitle] = useState('');
  const [upVote, setUpVote] = useState('');
  const [neutralVote, setNeutralVote] = useState('');
  const [downVote, setDownVote] = useState('');
  const [desc, setDesc] = useState('');

  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const router = useRouter();

  const onSuccess = (data: any) => {
    setImagePath(data);
    // message.success('이미지 업로드 완료');
    // router.push('/');
  };
  const { mutate: uploadPostImageMutate } = uploadPostImagesAPI({ onSuccess });
  const { mutate: createPostMutate } = createPostAPI();

  console.log('imagePath>>', imagePath);

  const isDisabled = useMemo(
    () =>
      Boolean(
        !title.trim() ||
          !upVote.trim() ||
          !neutralVote.trim() ||
          !downVote.trim()
      ),
    [title, upVote, neutralVote, downVote]
  );

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (isUploadable(newFileList)) {
      setLoading(true);
      setFileList(newFileList);
      // if (newFileList.some((file) => file.status !== 'done')) {
      //   // setLoading(true);

      //   return;
      // }

      // // fileList 안에 있는 애들 마다 업로드가 성공하면 아래 코드가 실행
      // // fileList 안에 있는 애들 전부 업로드가 성공하면 아래 코드 실행
      // if (!newFileList.some((file) => file.status !== 'done')) {
      //   const imageFormData = new FormData();
      //   setLoading(false);
      //   // getBase64(newFileList.originFileObj as RcFile, (url) => {
      //   //   setLoading(false);
      //   // });

      //   for (let i = 0; i < newFileList.length; i++) {
      //     imageFormData.append(
      //       'postImages',
      //       newFileList[i].originFileObj as any
      //     );
      //   }

      //   uploadPostImageMutate(imageFormData);
      //   console.log('!!!!!!!!!!!!!!!!!!!!!');
      // }

      if (newFileList.every((file) => file.status === 'done')) {
        const imageFormData = new FormData();
        setLoading(false);

        for (let i = 0; i < newFileList.length; i++) {
          imageFormData.append(
            'postImages',
            newFileList[i].originFileObj as any
          );
        }

        uploadPostImageMutate(imageFormData);
        console.log('!!!!!!!!!!!!!!!!!!!!!');
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      {/* <PlusOutlined /> */}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSubmitPost = async (e: FormEvent) => {
    e.preventDefault();
    createPostMutate({ title, upVote, neutralVote, downVote, desc });
  };

  return (
    <div>
      <PostHeader />
      <div onSubmit={handleSubmitPost}>
        {/* 제목 */}
        <Input.TextArea
          showCount
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          style={{ height: 120, resize: 'none' }}
          placeholder="질문과 간단한 설명을 입력해 주세요"
        />
        <br />
        <br />
        <br />
        <Input
          size="large"
          placeholder=":"
          prefix={<LikeTwoTone twoToneColor="#2515d5" />}
          maxLength={30}
          onChange={(e) => setUpVote(e.target.value)}
        />
        <br />
        <br />
        <Input
          size="large"
          placeholder=":"
          prefix={<FrownTwoTone twoToneColor="#eb2f96" />}
          maxLength={30}
          onChange={(e) => setNeutralVote(e.target.value)}
        />
        <br />
        <br />
        <Input
          size="large"
          placeholder=":"
          prefix={<DislikeTwoTone twoToneColor="#52c41a" />}
          maxLength={30}
          onChange={(e) => setDownVote(e.target.value)}
        />
        <br />
        <br />
        <Collapse>
          <Collapse.Panel header="링크 및 내용 추가" key="1">
            <Input.TextArea
              placeholder="추가 내용을 작성해 보세요"
              bordered={false}
              showCount
              maxLength={300}
              onChange={(e) => setDesc(e.target.value)}
              style={{ height: 200, resize: 'none' }}
            />
          </Collapse.Panel>
        </Collapse>
        <br />
        <br />
        {/* <Upload
          name="postImages"
          multiple={true}
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={true}
          beforeUpload={beforeUpload}
          onChange={handleImageChange}
          maxCount={5}
          // disabled={Boolean(imagePath.length === 5)}
        >
          {uploadButton}
        </Upload> */}
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          // beforeUpload={beforeUpload}
          multiple={true}
          maxCount={5}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <span>최대 5장까지 업로드할 수 있습니다.</span>

        <CommonButton type="primary" htmlType="submit" disabled={isDisabled}>
          작성완료
        </CommonButton>
      </div>
    </div>
  );
}

export default CreatePost;
