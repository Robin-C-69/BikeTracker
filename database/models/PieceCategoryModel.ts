export type Category = {
  id: number;
  type_id: number;
  name: string;
  description: string;
};

export type CreateCategory = {
  type_id: number;
  name: string;
  description: string;
};
