import { create } from 'zustand';

type PostDrawerState = {
  isOpenPostDrawer: boolean;
  postId: string | null;
};

type PostDrawerActions = {
  openPostDrawer: (postId: string) => void;
  closePostDrawer: () => void;
};

type PostDrawerStore = PostDrawerState & PostDrawerActions;

const usePostDrawerStore = create<PostDrawerStore>((set) => ({
  isOpenPostDrawer: false,
  postId: null,
  openPostDrawer: (editPostId) =>
    set(() => ({ isOpenPostDrawer: true, editPostId })),
  closePostDrawer: () =>
    set(() => ({ isOpenPostDrawer: false, editPostId: null })),
}));

export const usePostDrawerStoreActions = (): PostDrawerStore =>
  usePostDrawerStore((state) => state);
