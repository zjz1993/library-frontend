import { TApi } from '@/types/api.ts';
import { TCategoryProps } from '@/types/category.ts';

export async function apiGetCategoryList(): TApi<TCategoryProps> {
  return {
    code: 200,
    message: 'success',
    data: {
      label: '历史',
      key: '1',
      children: [
        {
          label: '中国历史',
          key: '2',
          children: [
            {
              label: '明',
              key: '4'
            }
          ]
        },
        {
          label: '外国历史',
          key: '3',
          children: [
            {
              label: '欧洲历史',
              key: '5'
            }
          ]
        }
      ]
    }
  };
}
