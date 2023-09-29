import { TApi } from '@/types/api.ts';
import { TBook, TBookDetail } from '@/types/book.ts';
import { requestGet, requestPut } from '@/utils/request.ts';

export async function apiGetBooksList(categoryId?: number): TApi<{
  records: TBook[];
  total: number;
}> {
  return requestGet('/api/book/books', { categoryId });
}

export async function apiGetBookById(id: number): TApi<TBookDetail> {
  return requestGet(`/api/book/${id}`);
}

export async function apiAdminGetBooksList(): TApi<{
  records: TBook[];
  total: number;
}> {
  return requestGet('/api/book/books');
}

// 管理侧 添加书籍
export async function apiAdminAddBook(): TApi<null> {
  return {
    code: 200,
    message: 'success',
    data: null
  };
}

// 管理侧 编辑书籍
export async function apiAdminEditBook(id: number, bookData: any): TApi<null> {
  return requestPut(`/api/book/${id}`, { bookData });
}

// 管理侧 删除书籍
export async function apiAdminDeleteBook(): TApi<null> {
  return {
    code: 200,
    message: 'success',
    data: null
  };
}
