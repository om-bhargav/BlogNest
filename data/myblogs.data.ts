export type MyBlog = {
  id: number;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
};

export const myBlogs: MyBlog[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    status: "PUBLISHED",
    createdAt: "2 days ago",
  },
  {
    id: 2,
    title: "Understanding React Hooks",
    status: "DRAFT",
    createdAt: "5 days ago",
  },
];