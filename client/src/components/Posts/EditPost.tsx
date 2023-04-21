import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { getDetailPostAPI } from '../../apis/post';
import { useEditPostModalStoreActions } from '../../store/editPostStore';
import PostEditModal from './PostEditModal';

function EditPost() {
  const { editPostId } = useEditPostModalStoreActions();

  const { data, isLoading } = getDetailPostAPI(editPostId!);

  return <div>{!isLoading && data && <PostEditModal data={data} />}</div>;
}

export default EditPost;
