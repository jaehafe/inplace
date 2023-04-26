import {
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Collapse, Divider, Input, message, Upload, UploadProps } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload';
import { useRouter } from 'next/router';
import React, { FormEvent, useMemo, useState } from 'react';
import { createPostAPI, uploadPostImagesAPI } from '../../../apis/post';
import CommonButton from '../../Common/CommonButton.styles';
import PostHeader from '../../Header/PostHeader/PostHeader';
import P from '../Posts.styles';
import CreateTags from './CreateTags';

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
  const [agree, setAgree] = useState('');
  const [neutral, setNeutral] = useState('');
  const [disagree, setDisagree] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState<string[]>(['OX 질문', '인 플레이스']);

  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const router = useRouter();

  const onSuccess = (data: any) => {
    setImageName(data);
    // message.success('이미지 업로드 완료');
    // router.push('/');
  };
  const { mutate: uploadPostImageMutate } = uploadPostImagesAPI({ onSuccess });

  const { mutate: createPostMutate } = createPostAPI();

  const isDisabled = useMemo(
    () =>
      Boolean(
        !title.trim() || !agree.trim() || !neutral.trim() || !disagree.trim()
      ),
    [title, agree, neutral, disagree]
  );

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (isUploadable(newFileList)) {
      setLoading(true);
      setFileList(newFileList);

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

  const handleSubmitPost = async () => {
    // e: FormEvent
    // e.preventDefault();

    createPostMutate({
      title,
      agree,
      neutral,
      disagree,
      desc,
      imageName,
      tags,
    });
  };

  return (
    <div>
      <PostHeader title="OX 질문" />
      {/* method='POST' */}
      {/* encType="multipart/form-data" */}
      <div>
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
          onChange={(e) => setAgree(e.target.value)}
        />
        <br />
        <br />
        <Input
          size="large"
          placeholder=":"
          prefix={<FrownTwoTone twoToneColor="#eb2f96" />}
          maxLength={30}
          onChange={(e) => setNeutral(e.target.value)}
        />
        <br />
        <br />
        <Input
          size="large"
          placeholder=":"
          prefix={<DislikeTwoTone twoToneColor="#52c41a" />}
          maxLength={30}
          onChange={(e) => setDisagree(e.target.value)}
        />
        <br />
        <br />
        {/* 태그 */}
        <CreateTags tags={tags} setTags={setTags} />
        <span>태그를 추가해보세요.</span>
        <Divider />
        <P.CollapseWrapper>
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
        </P.CollapseWrapper>
        <br />
        <br />

        <div>
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
        </div>
        <span>최대 5장까지 업로드할 수 있습니다.</span>
        {/* htmlType="submit" */}
        <CommonButton
          type="primary"
          disabled={isDisabled}
          onClick={handleSubmitPost}
        >
          작성완료
        </CommonButton>
      </div>
    </div>
  );
}

export default CreatePost;
