import { TApi } from '@/types/api.ts';
import { TCategoryProps } from '@/types/category.ts';

export async function apiGetAdminCategoryList(): TApi<TCategoryProps[]> {
  return {
    code: 200,
    message: 'success',
    data: [
      {
        label: '书籍管理',
        key: '1',
        path: '/admin/books/list'
      },
      {
        label: '标签管理',
        key: '2',
        path: '/admin/category/list'
      }
    ]
  };
}
