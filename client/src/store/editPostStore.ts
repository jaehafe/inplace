import { create } from 'zustand';

type EditPostModalState = {
  isOpenEditPostModal: boolean;
  editPostId: string | null;
};

type EditPostModalActions = {
  openEditPostModal: (postId: string) => void;
  closeEditPostModal: () => void;
};

type EditPostModalStore = EditPostModalState & EditPostModalActions;

const useEditPostModalStore = create<EditPostModalStore>((set) => ({
  isOpenEditPostModal: false,
  editPostId: null,
  openEditPostModal: (editPostId) =>
    set(() => ({ isOpenEditPostModal: true, editPostId })),
  closeEditPostModal: () =>
    set(() => ({ isOpenEditPostModal: false, editPostId: null })),
}));

export const useEditPostModalStoreActions = (): EditPostModalStore =>
  useEditPostModalStore((state) => state);
