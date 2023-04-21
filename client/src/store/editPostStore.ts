import { create } from 'zustand';

type ModalState = {
  openEditPost: boolean;
  setOpenEditPost: (isOpen: boolean) => void;
};

const useEditPostModalStore = create<ModalState>((set) => ({
  openEditPost: false,
  setOpenEditPost: (isOpen) => set({ openEditPost: false }),
}));

export const useEditPostModalStoreValue = () =>
  useEditPostModalStore((state) => state);
