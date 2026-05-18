"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";

import {
  Heart,
  MessageCircle,
  Search,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { fetcher } from "@/lib/fetcher";
import FeedCard from "@/components/cards/FeedCard";
import EmptyState from "@/components/EmptyState";
import LoadingScreen from "@/components/panel/loading-screen";

export default function MyFeedPage() {
  const [search, setSearch] = useState("");

  // ✅ API CALL
  const { data, isLoading } = useSWR("/api/user/feed", fetcher, {
    revalidateOnFocus: false,
  });

  const blogs = data?.data || [];

  // ✅ FILTER (search)
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: any) =>
      blog.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search]);
  if(isLoading){
    return <LoadingScreen title="Loading Feed..."/>
  }
  return (
    <main className="space-y-6">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <TrendingUp className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold">My Feed</h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Discover trending blogs from creators you follow.
            </p>
          </div>

          <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
            <p className="text-xs text-muted-foreground">Feed Posts</p>

            <h2 className="text-2xl font-bold text-center">
              {filteredBlogs.length}
            </h2>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <Card className="rounded-3xl border p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search feed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
          />
        </div>
      </Card>


      {/* FEED */}
      {filteredBlogs.length === 0 ?
        <EmptyState icon={TrendingUp} title="No feed posts yet" description="Follow creators to see their latest blogs and updates here." />
        :
        <section className="grid gap-5 lg:grid-cols-2">
          {filteredBlogs.map((blog: any, idx: number) => (
            <FeedCard blog={blog} key={idx} />
          ))}
        </section>
      }
    </main>
  );
}