import { create } from 'zustand';

export interface IBookState {
  updateCategoryId: (categoryId: number) => void;
  categoryId?: number;
}

const useBookStore = create<IBookState>((set) => ({
  categoryId: undefined,
  updateCategoryId: (categoryId: number) => set(() => ({ categoryId }))
}));
export default useBookStore;
