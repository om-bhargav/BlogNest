"use client";

import { useMemo, useState } from "react";

import {
  FileText,
  Search,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BlogCard from "./_components/BlogCard";
import { Blog } from "@/data/blogs.data";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import EmptyState from "@/components/EmptyState";


export default function BlogsGrid() {
  const { data, mutate } = useSWR(
    "/api/admin/blogs",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const blogs: Blog[] = data?.data || [];

  const [search, setSearch] = useState("");

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search]);
  // =========================
  // MOCK API CALLS
  // =========================

  const deleteBlog = async (id: string) => {
    try {
      setLoadingId(id);

      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!json.success) return;

      mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const toggleFeature = async (id: string) => {
    try {
      setLoadingId(id);

      const blog = blogs.find((b) => b.id === id);
      if (!blog) return;

      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featured: !blog.featured,
        }),
      });

      const json = await res.json();
      if (!json.success) return;

      mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      setLoadingId(id);

      const blog = blogs.find((b) => b.id === id);
      if (!blog) return;

      const newStatus =
        blog.status === "BLOCKED" ? "PUBLISHED" : "BLOCKED";

      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const json = await res.json();
      if (!json.success) return;

      mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Manage Blogs
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Moderate blog content, manage featured
              articles, and control publication
              visibility across your platform.
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">
                Total Blogs
              </p>

              <h2 className="text-2xl font-bold text-center">
                {blogs.length}
              </h2>
            </div>

            <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">
                Featured
              </p>

              <h2 className="text-2xl font-bold text-center">
                {
                  blogs.filter(
                    (b) => b.featured
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <Card className="rounded-3xl border p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search blogs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
          />
        </div>
      </Card>

      {/* BLOG GRID */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((blog) => {
          const loading = loadingId === blog.id;
          return (
            <BlogCard blog={blog} loading={loading} onDelete={deleteBlog} onToggleFeature={toggleFeature} onToggleStatus={toggleStatus} />
          );
        })}
      </section>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <EmptyState icon={FileText} title="No blogs found" description="Try searching with another keyword." />
      )}
    </main>
  );
}