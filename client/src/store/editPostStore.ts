import { create } from 'zustand';

type EditPostModalState = {
  openEditPostModal: Record<string, boolean>;
  editPostId: string | null;
};

type EditPostModalActions = {
  setOpenEditPostModal: (postId: string, open: boolean) => void;
  setEditPostId: (postId: string | null) => void;
};

type EditPostModalStore = EditPostModalState & EditPostModalActions;

const useEditPostModalStore = create<EditPostModalStore>((set) => ({
  openEditPostModal: {},
  editPostId: null,
  setOpenEditPostModal: (postId, open) =>
    set((state) => ({
      ...state,
      openEditPostModal: { ...state.openEditPostModal, [postId]: open },
    })),
  setEditPostId: (postId) => set((state) => ({ ...state, editPostId: postId })),
}));

export const useEditPostModalStoreActions = (): EditPostModalStore =>
  useEditPostModalStore((state) => state);
