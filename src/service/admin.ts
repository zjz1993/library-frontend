import { TApi } from '@/types/api.ts';
import { TCategoryProps } from '@/types/category.ts';

export async function apiGetAdminCategoryList(): TApi<TCategoryProps> {
  return {
    code: 200,
    message: 'success',
    data: {
      label: '书籍管理',
      key: '1',
      children: [
        {
          label: '新增书籍',
          key: '2'
        },
        {
          label: '编辑书籍',
          key: '3'
        },
        {
          label: '下架书籍',
          key: '4'
        }
      ]
    }
  };
}
