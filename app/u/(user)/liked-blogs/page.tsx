"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import useSWR from "swr";

import { Heart, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { fetcher } from "@/lib/fetcher";
import LoadingScreen from "@/components/panel/loading-screen";
import { UserContext } from "@/context/UserContext";
import LikedBlog from "./_components/LikedBlogCard";
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

export default function LikedBlogsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSWR(
    "/api/user/liked-blogs",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const likedBlogs: Blog[] = data?.data || [];

  const filteredBlogs = useMemo(() => {
    return likedBlogs.filter((blog) =>
      `${blog.title} ${blog.category?.name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [likedBlogs, search]);

  if (isLoading) {
    return <LoadingScreen title="Fetching liked blogs..." />;
  }

  return (
    <main className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/5" />

        <div className="relative flex items-center justify-between gap-5">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <Heart className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold">Liked Blogs</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Blogs you appreciated and saved through likes.
            </p>
          </div>

          <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
            <p className="text-xs text-muted-foreground">
              Total Likes
            </p>

            <h2 className="text-2xl font-bold text-center">
              {likedBlogs.length}
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
            placeholder="Search liked blogs..."
            className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
          />
        </div>
      </Card>

      {/* EMPTY */}
      {filteredBlogs.length === 0 ? (
        <EmptyState icon={Heart} title="No liked blogs found" description="Like blogs to see them here." />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBlogs.map((blog, idx) => (
            <LikedBlog blog={blog} key={idx} />
          ))}
        </section>
      )}
    </main>
  );
}