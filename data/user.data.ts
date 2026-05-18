export type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "SUSPENDED";
  followers: number;
  blogs: number;
  image: string;
};