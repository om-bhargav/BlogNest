import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import { imageToBase64 } from "@/lib/base64";
import {
  blogSchema,
  BlogFormValues,
  defaultValues,
} from "@/schemas/blog.schema";

export const useBlogEditor = (id: string) => {
  const router = useRouter();
  const isEditing = id !== "new";
  const [uploading, setUploading] = useState(false);

  const [blogData, setBlogData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);

  const initialized = useRef(false);

  // FORM
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    mode: "onChange",
    defaultValues,
  });

  const { reset, watch, setValue } = form;

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // fetch categories
        const categoryReq = await fetch("/api/categories");
        const categoryRes = await categoryReq.json();

        if (categoryRes.success) {
          setCategories(categoryRes.data || []);
        }

        // fetch blog only if editing
        if (isEditing) {
          const blogReq = await fetch(`/api/user/blogs/${id}`);
          const blogRes = await blogReq.json();

          if (blogRes.success) {
            const data = blogRes.data;

            setBlogData(data);

            // reset only once
            if (!initialized.current) {
              reset({
                title: data.title || "",
                slug: data.slug || "",
                excerpt: data.excerpt || "",
                content: data.content || "",
                image: data.image || "",
                categoryId: String(data.categoryId || ""),
                status: data.status || "DRAFT",
              });

              initialized.current = true;
            }
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing, reset]);

  // AUTO SLUG
  const title = watch("title");

  useEffect(() => {
    if (!title) return;

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    setValue("slug", slug, {
      shouldValidate: true,
    });
  }, [title, setValue]);

  // Handlers
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const image = await imageToBase64(file);
      setValue("image", image, { shouldValidate: true });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: BlogFormValues) => {
    try {
      const request = await fetch(
        isEditing ? `/api/user/blogs/${id}` : "/api/user/blogs",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const response = await request.json();
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(isEditing ? "Blog updated" : "Blog created");
      router.push("/u/blogs");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return {
    form,
    state: { isEditing, isLoading, uploading, categories },
    handlers: { uploadImage, onSubmit },
  };
};
