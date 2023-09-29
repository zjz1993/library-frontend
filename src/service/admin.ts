import { TApi } from '@/types/api.ts';
import { TApiCategoryProps } from '@/types/category.ts';

export async function apiGetAdminCategoryList(): TApi<TApiCategoryProps[]> {
  return {
    code: 200,
    message: 'success',
    data: [
      {
        title: '书籍管理',
        id: 1,
        parentId: null,
        path: '/admin/books/list'
      },
      {
        title: '标签管理',
        id: 2,
        parentId: null,
        path: '/admin/category/list'
      }
    ]
  };
}
