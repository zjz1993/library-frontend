export type TCategoryProps = {
  label: string;
  key: string;
  [key: string]: unknown;
  children?: TCategoryProps[];
};
