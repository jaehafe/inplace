import React, { useEffect } from 'react';
import { getDetailPostAPI } from '../../apis/post';
import { useEditPostModalStoreActions } from '../../store/editPostStore';
import PostEditModal from './PostEditModal';

function EditPost() {
  const { editPostId } = useEditPostModalStoreActions();
  console.log('editPostId>>>');

  const { data } = getDetailPostAPI(editPostId!);
  console.log('data>>', data);

  useEffect(() => {}, [editPostId]);

  return (
    <div>
      EditPost
      <PostEditModal />
    </div>
  );
}

export default EditPost;
