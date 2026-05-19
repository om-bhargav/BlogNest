export type Blog = {
  id: string;
  title: string;
  author?: string;
  category?:string;
  status?: "PUBLISHED" | "DRAFT" | "BLOCKED";
  featured?: boolean;
  views?: number;
  image?: string;
  excerpt?: string;
  likes?: number;
  createdAt?: string;
};

