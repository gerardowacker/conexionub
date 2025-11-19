export type Resource = {
  _id: string;
  dc: {
    title?: { language: string; title: string }[] | string;
    creator?: string;
    type?: string;
    contributor?: { author?: string[]; advisor?: string[] };
    date?: { available?: string | Date; issued?: string | Date };
    description?: { language: string; abstract: string }[] | string;
    format?: string;
    subject?: string[];
    publisher?: string;
    rights?: string;
  };
  access?: {
    collection?: string;
    restriction?: number;
    hash?: string;
    name?: string;
  };
};

