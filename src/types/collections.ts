export type Collection = {
  _id: string;
  name: string;
  description?: string;
  licence?: string;
  children?: Collection[];
  parent?: string | { _id?: string; name?: string } | null;
};

