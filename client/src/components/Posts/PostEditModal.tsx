import {
  DislikeTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Collapse, Input, message, Upload, UploadProps } from 'antd';
import { UploadFile } from 'antd/es/upload';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { updatePostAPI, uploadPostImagesAPI } from '../../apis/post';
import { useEditPostModalStoreActions } from '../../store/editPostStore';
import { UploadFileStatus } from 'antd/es/upload/interface';
import useDebounce from '../../hooks/useDebounce';
import { useQueryClient } from '@tanstack/react-query';
import P from '../../pages/profile/Profile.styles';

const beforeUpload = (fileList: UploadFile[]) => {
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

function PostEditModal({ data }: any) {
  const {
    agree: agreeBody,
    disagree: disagreeBody,
    neutral: neutralBody,
    title: titleBody,
    desc: descBody,
    id: postId,
    images,
    identifier,
  } = data;
  console.log('identifier>>>', identifier);

  const queryClient = useQueryClient();
  const { isOpenEditPostModal, editPostId, closeEditPostModal } =
    useEditPostModalStoreActions();

  const openEditModalFn = () => {
    if (isOpenEditPostModal && postId) {
      return true;
    } else {
      false;
    }
  };

  const [title, setTitle] = useState('');
  const [agree, setAgree] = useState('');
  const [neutral, setNeutral] = useState('');
  const [disagree, setDisagree] = useState('');
  const [desc, setDesc] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [previousImage, setPreviousImage] = useState<UploadFile[]>([]);

  const [newImageName, setNewImageName] = useState<string[]>([]);

  const [imageName, setImageName] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  /** 이미지가 변경되었는지 체크 서버에 넘겨줄 값 */
  const isImageArrayDifferent = async (newImages: any, oldImages: any) => {
    if (newImages.length !== oldImages?.length) {
      return true;
    }

    const sortedNewImages = newImages.map((image: any) => image.name).sort();
    const sortedOldImages = oldImages.map((image: any) => image.src).sort();

    for (let i = 0; i < sortedNewImages.length; i++) {
      if (sortedNewImages[i] !== sortedOldImages[i]) {
        return true;
      }
    }

    return false;
  };

  const getFileListFromPostImage = images.map((image: any) => {
    return {
      // type: `png`,
      uid: `${image.id}`,
      name: image.src,
      status: 'done' as UploadFileStatus,
      url: `http://localhost:4000/${image.src}`,
    };
  });

  useEffect(() => {
    setTitle(titleBody);
    setAgree(agreeBody);
    setNeutral(neutralBody);
    setDisagree(disagreeBody);
    setDesc(descBody);
    setFileList(getFileListFromPostImage);
    // setPreviousImage(getFileListFromPostImage);
  }, [data]);

  const onSuccess = (data: any) => {
    setNewImageName(data);
    // message.success('이미지 업로드 완료');
    // router.push('/');
  };
  const { mutate: uploadPostImageMutate } = uploadPostImagesAPI({ onSuccess });

  const onSuccessUpdatePost = () => {
    queryClient.invalidateQueries([`/posts`]);
    queryClient.invalidateQueries([`/posts/${identifier}`]);

    message.success('게시물이 성공적으로 업데이트 되었습니다.');
    closeEditPostModal();
  };
  const { mutate: updatePostMutate } = updatePostAPI(postId, {
    onSuccess: onSuccessUpdatePost,
  });

  const debouncedTitle = useDebounce(title, 2000);
  const debouncedAgree = useDebounce(agree, 2000);
  const debouncedNeutral = useDebounce(neutral, 2000);
  const debouncedDisagree = useDebounce(disagree, 2000);
  const debouncedDesc = useDebounce(desc, 2000);

  /** 비어있거나 이전과 같으면 Disabled */
  useEffect(() => {
    const checkIsDisabled = async () => {
      const isEmpty =
        !debouncedTitle.trim() ||
        !debouncedAgree.trim() ||
        !debouncedNeutral.trim() ||
        !debouncedDisagree.trim() ||
        !debouncedDesc.trim();

      const isSame =
        title === titleBody &&
        agree === agreeBody &&
        neutral === neutralBody &&
        disagree === disagreeBody &&
        desc === descBody;

      const isChanged = await isImageArrayDifferent(images, fileList);
      // console.log('isChanged?>>', isChanged);
      // console.log('isEmpty?>>>', isEmpty);

      setIsDisabled(isEmpty && !isSame && !isChanged);
    };
    // console.log('disabled>>>', isDisabled);

    checkIsDisabled();
  }, [
    debouncedTitle,
    debouncedAgree,
    debouncedNeutral,
    debouncedDisagree,
    debouncedDesc,
    titleBody,
    agreeBody,
    neutralBody,
    disagreeBody,
    descBody,
    images,
    isDisabled,
  ]);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setLoading(true);
    setFileList(newFileList);

    if (newFileList.every((file) => file.status === 'done')) {
      const imageFormData = new FormData();
      setLoading(false);

      for (let i = 0; i < newFileList.length; i++) {
        imageFormData.append('postImages', newFileList[i].originFileObj as any);
      }

      uploadPostImageMutate(imageFormData);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSubmitPost = async (e: FormEvent) => {
    e.preventDefault();
    const isImageChanged = await isImageArrayDifferent(images, newImageName);

    updatePostMutate({
      title,
      agree,
      neutral,
      disagree,
      desc,
      imageName: setNewImageName,
      isImageChanged,
    });
  };

  return (
    <P.ProfileEditDrawer
      placement="bottom"
      title="게시물 수정"
      closable={false}
      onClose={closeEditPostModal}
      open={openEditModalFn()}
      key="bottom"
      height={'auto'}
      style={{ overflowY: 'scroll' }}
    >
      {/* <PostHeader title="OX 질문" /> */}
      <form onSubmit={handleSubmitPost}>
        {/* 제목 */}
        <Input.TextArea
          showCount
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          style={{ height: 120, resize: 'none' }}
          placeholder="질문과 간단한 설명을 입력해 주세요"
          value={title}
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
          value={agree}
        />
        <br />
        <br />
        <Input
          size="large"
          placeholder=":"
          prefix={<FrownTwoTone twoToneColor="#eb2f96" />}
          maxLength={30}
          onChange={(e) => setNeutral(e.target.value)}
          value={neutral}
        />
        <br />
        <br />
        <Input
          size="large"
          placeholder=":"
          prefix={<DislikeTwoTone twoToneColor="#52c41a" />}
          maxLength={30}
          onChange={(e) => setDisagree(e.target.value)}
          value={disagree}
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
              value={desc}
            />
          </Collapse.Panel>
        </Collapse>
        <br />
        <br />

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

        <P.SubmitButton
          block
          type="primary"
          htmlType="submit"
          disabled={isDisabled}
          style={{ margin: '30px 0 20px' }}
        >
          작성완료
        </P.SubmitButton>
      </form>
    </P.ProfileEditDrawer>
  );
}

export default PostEditModal;
