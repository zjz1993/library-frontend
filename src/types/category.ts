export type TCategoryProps = {
  label: string;
  key: number;
  [key: string]: unknown;
  children?: TCategoryProps[];
};
export type TApiCategoryProps = {
  id: number;
  parentId: number | null;
  title: string;
  [key: string]: unknown;
  children?: any[];
};
