import { create } from 'zustand';

type PostVoteResultState = {
  isOpen: boolean;
  postId: string | null;
};

type PostVoteResultActions = {
  openModal: (postId: string) => void;
  closeModal: () => void;
};

type PostVoteResultModalStore = PostVoteResultState & PostVoteResultActions;

const usePostVoteResultModalStore = create<PostVoteResultModalStore>((set) => ({
  isOpen: false,
  postId: null,
  openModal: (postId) => set(() => ({ isOpen: true, postId })),
  closeModal: () => set(() => ({ isOpen: false, postId: null })),
}));
/** 게시물 결과 분석 모달 스토어 */
export const usePostVoteResultModalStoreActions =
  (): PostVoteResultModalStore => usePostVoteResultModalStore((state) => state);
