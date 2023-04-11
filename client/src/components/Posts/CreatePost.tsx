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

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

function CreatePost() {
  const [title, setTitle] = useState('');
  const [upVote, setUpVote] = useState('');
  const [neutralVote, setNeutralVote] = useState('');
  const [downVote, setDownVote] = useState('');
  const [desc, setDesc] = useState('');

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [imagePath, setImagePath] = useState<string>('');

  const router = useRouter();
  // const { post: postTitle } = router.query;
  // console.log('postTitle', postTitle);

  const handleProfileChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const imageData = info.file.originFileObj;
      const imageFormData = new FormData();

      const { fileList } = info;

      for (let i = 0; i < fileList.length; i++) {
        imageFormData.append('postImages', fileList[i].originFileObj as any);
      }
      uploadPostImagesAPI<any>(imageFormData).then((res) => {
        console.log('post imageData>>>>', res.data);
        return setImagePath(res.data);
      });
      // setImageInfo(info.file.originFileObj);
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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

  const { mutate: createPostMutate } = createPostAPI();

  const handleSubmitPost = async (e: FormEvent) => {
    e.preventDefault();

    createPostMutate({ title, upVote, neutralVote, downVote, desc });

    // try {
    //   const res = await axiosInstance.post('/posts', {
    //     title,
    //     upVote,
    //     neutralVote,
    //     downVote,
    //     desc,
    //   });
    //   console.log('post res>>', res);

    //   // router.push(`/post/${post.identifier}/${post.slug}`);
    // } catch (error) {
    //   console.error(error);
    // }
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
        <Upload
          name="postImages"
          multiple
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={true}
          beforeUpload={beforeUpload}
          onChange={handleProfileChange}
          maxCount={5}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
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
