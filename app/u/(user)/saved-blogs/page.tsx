"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import useSWR from "swr";

import { Bookmark, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { fetcher } from "@/lib/fetcher";

import LoadingScreen from "@/components/panel/loading-screen";
import SavedBlogCard from "./_components/SavedBlogCard";
import EmptyState from "@/components/EmptyState";

interface Blog {
  id: string;
  title: string;
  slug: string;
  image?: string;
  excerpt?: string;

  category: {
    id: string;
    name: string;
  };

  author: {
    id: string;
    name: string;
    image?: string;
  };

  _count: {
    likes: number;
    comments: number;
    savedBy: number;
  };

  isLiked: boolean;
  isSaved: boolean;
}

export default function SavedBlogsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useSWR(
    "/api/user/saved-blogs",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const savedBlogs: Blog[] = data?.data || [];

  const filteredBlogs = useMemo(() => {
    return savedBlogs.filter((blog) =>
      `${blog.title} ${blog.category?.name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [savedBlogs, search]);

  if (isLoading) {
    return (
      <LoadingScreen title="Fetching saved blogs..." />
    );
  }

  return (
    <main className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5" />

        <div className="relative flex items-center justify-between gap-5">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Bookmark className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold">
              Saved Blogs
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Your reading collection for later.
            </p>
          </div>

          <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
            <p className="text-xs text-muted-foreground">
              Saved Blogs
            </p>

            <h2 className="text-2xl font-bold text-center">
              {savedBlogs.length}
            </h2>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <Card className="rounded-3xl border p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved blogs..."
            className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
          />
        </div>
      </Card>

      {/* EMPTY */}
      {filteredBlogs.length === 0 ? (
        <EmptyState icon={Bookmark} title="No saved blogs found" description="Save blogs to read them later." />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBlogs.map((blog, idx: number) => (
            <SavedBlogCard blog={blog} key={idx} />
          ))}
        </section>
      )}
    </main>
  );
}