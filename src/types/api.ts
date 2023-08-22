type BasicApi<T> = {
  code: number;
  data: T;
  message?: string;
};
export type TApi<T> = Promise<BasicApi<T>>;
