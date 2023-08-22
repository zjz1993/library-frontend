import { create } from 'zustand';
import { TUserInfo } from '@/types/userInfo.ts';

export interface IGlobalState {
  updateUserInfo: (userInfo?: TUserInfo) => void;
  userInfo?: TUserInfo;
}

const useGlobalStore = create<IGlobalState>((set) => ({
  userInfo: undefined,
  updateUserInfo: (userInfo?: TUserInfo) => set(() => ({ userInfo }))
}));
export default useGlobalStore;
