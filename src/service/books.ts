import { TApi } from '@/types/api.ts';
import { TBook, TBookDetail } from '@/types/book.ts';

export async function apiGetBooksList(): TApi<{
  records: TBook[];
  total: number;
}> {
  return {
    code: 200,
    message: 'success',
    data: {
      records: [
        {
          id: 0,
          name: '书籍标题',
          desc: '一些简介积分卡积分肯定是',
          cover:
            'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/c0af99607f62-40b4-b136-2b82816a5868.png'
        },
        {
          id: 1,
          name: '书籍标题1',
          desc: '一些简介积分卡积分肯定是fasf',
          cover:
            'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/c0af99607f62-40b4-b136-2b82816a5868.png'
        },
        {
          id: 2,
          name: '书籍标题2',
          desc: '一些简介积分卡积分肯定是fasf'
        },
        {
          id: 3,
          name: '书籍标题3',
          desc: '一些简介积分卡积分肯定是fasf'
        },
        {
          id: 4,
          name: '书籍标题4',
          desc: '一些简介积分卡积分肯定是fasf'
        }
      ],
      total: 1
    }
  };
}

export async function apiGetBookById(id: number): TApi<TBookDetail> {
  console.log('id是');
  console.log(id);
  return {
    code: 200,
    message: 'success',
    data: {
      id: 0,
      name: '详细的书',
      desc: '描述',
      author: '作者',
      category: [
        { id: 0, name: '历史类' },
        { id: 1, name: '中国历史' }
      ]
    }
  };
}
