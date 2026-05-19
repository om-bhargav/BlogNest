export type Blog = {
  id: string;
  title: string;
  author?: {
    name: string;
  }
  category?:{
    name: string;
  }
  status?: "PUBLISHED" | "DRAFT" | "BLOCKED";
  featured?: boolean;
  views?: number;
  image?: string;
  excerpt?: string;
  likes?: number;
  createdAt?: string;
};

