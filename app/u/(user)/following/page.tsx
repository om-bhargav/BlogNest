"use client";

import { useMemo, useState } from "react";

import useSWR from "swr";

import { Search, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { fetcher } from "@/lib/fetcher";

import LoadingScreen from "@/components/panel/loading-screen";

interface Creator {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  headline?: string;
  isFollowing: boolean;

  counts?: {
    followers: number;
    following: number;
    blogs: number;
  };
}
import { UserContext } from "@/context/UserContext";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
export default function FollowedCreatorsPage() {
  const [search, setSearch] = useState("");
  const {user} = UserContext();
  const userId = user?.id;
  const { data, isLoading, mutate } = useSWR(
    `/api/user/${userId}/followed`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const creators: Creator[] = data?.data || [];

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) =>
      `${creator.name} ${creator.headline || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [creators, search]);

  const toggleFollow = async () => {
    try {
      const request = await fetch(`/api/user/${userId}/followed`, {
        method: "POST",
      });

      const response = await request.json();

      if (!response.success) {
        return;
      }

      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <LoadingScreen title="Fetching followed creators..." />;
  }

  return (
    <main className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5" />

        <div className="relative flex items-center justify-between gap-5">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
              <Users className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold">
              Followed Creators
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Creators you follow and engage with.
            </p>
          </div>

          <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
            <p className="text-xs text-muted-foreground">
              Following
            </p>

            <h2 className="text-2xl font-bold text-center">
              {creators.length}
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
            placeholder="Search creators..."
            className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
          />
        </div>
      </Card>

      {/* LIST */}
      {filteredCreators.length === 0 ? (
        <EmptyState icon={Users} title="No creators found" description="Try searching with a different keyword."/>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCreators.map((creator) => (
            <Card
              key={creator.id}
              className="rounded-3xl border bg-card p-6 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <Link href={`/profile/${creator.id}`} className="flex flex-col items-center">
                <img
                  src={
                    creator.image ||
                    "https://ui-avatars.com/api/?name=" +
                      creator.name
                  }
                  alt={creator.name}
                  className="h-24 w-24 rounded-3xl object-cover"
                />
                <h2 className="mt-4 text-xl font-bold">
                  {creator.name}
                </h2>
                </Link>

                <p className="mt-1 text-sm text-muted-foreground">
                  {creator.headline || creator.bio || "Creator"}
                </p>

                <div className="mt-4 grid w-full grid-cols-3 gap-3">
                  <div className="rounded-2xl border bg-muted/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Followers
                    </p>

                    <h3 className="text-lg font-bold">
                      {creator.counts?.followers}
                    </h3>
                  </div>

                  <div className="rounded-2xl border bg-muted/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Following
                    </p>

                    <h3 className="text-lg font-bold">
                      {creator.counts?.following}
                    </h3>
                  </div>

                  <div className="rounded-2xl border bg-muted/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Blogs
                    </p>

                    <h3 className="text-lg font-bold">
                      {creator.counts?.blogs}
                    </h3>
                  </div>
                </div>

                <Button
                  variant={
                    creator.isFollowing
                      ? "outline"
                      : "default"
                  }
                  className="mt-5 w-full rounded-2xl"
                  onClick={() => toggleFollow()}
                >
                  <UserPlus className="mr-2 h-4 w-4" />

                  {creator.isFollowing
                    ? "Following"
                    : "Follow"}
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}