import { TApi } from '@/types/api.ts';
import { TApiCategoryProps } from '@/types/category.ts';
import { requestGet } from '@/utils/request.ts';

export async function apiGetCategoryList(): TApi<TApiCategoryProps[]> {
  return requestGet('/api/category/categorys');
}
