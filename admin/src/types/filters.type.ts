type FilterOperator<T> = T | { LIKE: string };

export type Filter<T> = {
  [P in keyof T]?: FilterOperator<T[P]>;
};
