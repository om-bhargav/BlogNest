import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").optional(),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["PUBLISHED", "DRAFT", "BLOCKED"]),
});

export type BlogFormValues = z.infer<typeof blogSchema>;

export const defaultValues: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  categoryId: "",
  status: "DRAFT",
};