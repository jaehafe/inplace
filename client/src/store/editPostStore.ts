import { create } from 'zustand';

const useEditPostStore = create((set) => ({
  postInfo: null,
  setPostInfo: (postInfo: any) => set({ postInfo }),
  clearPostInfo: () => set({ postInfo: null }),
}));

export const usePostInfo = () =>
  useEditPostStore((state: any) => state.postInfo);
export const useSetPostInfo = () =>
  useEditPostStore((state: any) => state.setPostInfo);
export const useClearPostInfo = () =>
  useEditPostStore((state: any) => state.clearPostInfo);
