export type IncludeFieldType<T, P> = {
  [K in keyof T as T[K] extends P ? K : never]: T[K];
};
