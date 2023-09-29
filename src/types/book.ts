export type TBook = {
  id: number;
  name: string;
  description: string;
  cover?: string;
  createTime: string;
};
export type TBookDetail = TBook & {
  author: string; // 作者
  category: { id: number; name: string }[];
};
