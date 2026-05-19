"use client";

import { useMemo, useState } from "react";

import useSWR from "swr";

import Link from "next/link";

import { toast } from "sonner";

import { FilePenLine, Loader2, Newspaper, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import MyBlogCard from "./_components/BlogCard";

import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/panel/loading-screen";
import ErrorScreen from "@/components/panel/error-screen";
import EmptyState from "@/components/EmptyState";
import { Blog } from "@/data/blogs.data";
export default function MyBlogsGrid() {
  const [search, setSearch] = useState("");

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();
  /*
  =====================================
  FETCH BLOGS
  =====================================
  */

  const { data, isLoading, mutate, error } = useSWR(
    "/api/user/blogs",

    fetcher
  );

  const blogs: Blog[] = data?.data || [];

  /*
  =====================================
  FILTER BLOGS
  =====================================
  */

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search]);

  /*
  =====================================
  DELETE BLOG
  =====================================
  */

  const deleteBlog = async (id: string) => {
    try {
      setLoadingId(id);

      const request = await fetch(
        `/api/user/blogs/${id}`,

        {
          method: "DELETE",
        }
      );

      const response = await request.json();

      if (!response.success) {
        toast.error(response.message);

        return;
      }
      
      await mutate();

      toast.success("Blog deleted successfully");

    } catch (error) {
      console.log(error);

      toast.error("Failed to delete blog");
    } finally {
      setLoadingId(null);
    }
  };

  /*
  =====================================
  LOADING
  =====================================
  */

  if (isLoading) {
    return (
      <LoadingScreen title="Loading Blogs..." />
    );
  }
  if (error || (data && !(data?.success))) {
    return <ErrorScreen retry={mutate} description={error || data?.message || "Something Went Wrong"} />
  }
  return (
    <main className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FilePenLine className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">My Blogs</h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Create, manage and edit your blog content with a modern writing
              workflow.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="rounded-2xl text-center border bg-background px-5 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Total Blogs</p>

              <h2 className="text-2xl font-bold">{blogs.length}</h2>
            </div>

            <Link href="/u/blogs/new">
              <Button className="h-12 rounded-2xl px-6">
                <Plus className="mr-2 h-4 w-4" />
                New Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <Card className="rounded-3xl border p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search your blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
          />
        </div>
      </Card>

      {
        filteredBlogs.length===0 ? <EmptyState icon={Newspaper} title="No Blogs Found!" description="Start by adding new blogs!"/>:
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <MyBlogCard
            key={blog.id}
            loading={loadingId === blog.id}
            blog={blog}
            onDelete={() => deleteBlog(blog.id)}
            onEdit={() => router.push(`/u/blogs/${blog.id}`)}
            onView={() => { }}
            />
          ))}
        </section>
        }
    </main>
  );
}
