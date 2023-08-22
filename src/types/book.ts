export type TBook = {
  id: number;
  name: string;
  desc: string;
  cover?: string;
};
export type TBookDetail = TBook & {
  author: string; // 作者
  category: { id: number; name: string }[];
};
