"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Search, Users } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import EmptyState from "@/components/EmptyState";
import { fetcher } from "@/lib/fetcher";
import { UserContext } from "@/context/UserContext";
import LoadingScreen from "@/components/panel/loading-screen";

export default function FollowersPage() {
  const [search, setSearch] = useState("");

  const { user, followers, setFollowers, toggleFollow } = UserContext();
  const userId = user?.id;

  // 🔥 API FETCH
  const { data, isLoading } = useSWR(
    userId ? `/api/user/${userId}/followers` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 🔄 sync API → Zustand
  useEffect(() => {
    if (data?.data) {
      setFollowers(data.data);
    }
  }, [data, setFollowers]);

  const filteredFollowers = useMemo(() => {
    return followers.filter((f) =>
      `${f.name || ""} ${f.headline || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [followers, search]);

  if (isLoading) {
    return (
      <LoadingScreen title={"Loading followers..."}/>
    );
  }

  return (
    <main className="space-y-6">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
              <Users className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold">Followers</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              People who follow you and support your content.
            </p>
          </div>

          <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
            <p className="text-xs text-muted-foreground text-center">
              Followers
            </p>
            <h2 className="text-2xl font-bold text-center">
              {followers.length}
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
            placeholder="Search followers..."
            className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
          />
        </div>
      </Card>

      {/* LIST */}
      {filteredFollowers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No followers yet"
          description="When people follow you, they will appear here."
        />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredFollowers.map((follower) => (
            <Card
              key={follower.id}
              className="rounded-3xl border bg-card p-6 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">

                <Link
                  href={`/profile/${follower.id}`}
                  className="flex flex-col items-center"
                >
                  <img
                    src={
                      follower.image ||
                      `https://ui-avatars.com/api/?name=${follower.name}`
                    }
                    alt={follower.name || "user"}
                    className="h-20 w-20 rounded-3xl object-cover"
                  />

                  <h2 className="mt-4 text-lg font-bold">
                    {follower.name}
                  </h2>
                </Link>

                <p className="mt-1 text-sm text-muted-foreground">
                  {follower.headline || "Follower"}
                </p>

                {/* ACTION */}
                <Button
                  className="mt-5 w-full rounded-2xl"
                  variant="outline"
                  onClick={() =>
                    toggleFollow({
                      id: follower.id,
                      name: follower.name,
                      image: follower.image,
                      headline: follower.headline,
                    })
                  }
                >
                  Remove / Toggle Follow
                </Button>

              </div>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}