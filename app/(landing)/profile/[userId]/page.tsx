"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { fetcher } from "@/lib/fetcher";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import { notFound } from "next/navigation";

import LoadingScreen from "@/components/SimpleLoadingScreen";

import { UserContext } from "@/context/UserContext";
import { Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FeedCard from "@/components/cards/FeedCard";

export default function AuthorProfilePage() {
  const { userId } = useParams();

  const { following, toggleFollow } = UserContext();

  const [followLoading, setFollowLoading] = useState(false);

  const { data, isLoading } = useSWR(
    userId ? `/api/profile/${userId}` : null,
    fetcher
  );

  const user = data?.data;

  const isFollowing = useMemo(() => {
    return following.some((u) => u.id === userId);
  }, [following, userId]);

  const handleFollow = async () => {
    if (!user) return;

    try {
      setFollowLoading(true);

      await toggleFollow({
        id: user.id,
        name: user.name,
        image: user.image,
        headline: user.headline,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AuthorProfileSkeleton/>
    );
  }

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* HEADER */}
      <Card className="p-6 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image} />

            <AvatarFallback>
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              {user.name}
            </h1>

            <p className="text-sm text-muted-foreground">
              {user.headline}
            </p>

            <p className="text-xs text-muted-foreground">
              {user.bio}
            </p>
          </div>
        </div>

        {/* FOLLOW BUTTON */}
        <Button
          onClick={handleFollow}
          disabled={followLoading}
          variant={isFollowing ? "secondary" : "default"}
          className="rounded-2xl min-w-[120px]"
        >
          {followLoading
            ? "Please wait..."
            : isFollowing
              ? "Following"
              : "Follow"}
        </Button>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 rounded-2xl text-center">
          <p className="text-sm text-muted-foreground">
            Blogs
          </p>

          <h2 className="text-xl font-bold">
            {user.stats.blogs}
          </h2>
        </Card>

        <Card className="p-5 rounded-2xl text-center">
          <p className="text-sm text-muted-foreground">
            Followers
          </p>

          <h2 className="text-xl font-bold">
            {user.stats.followers}
          </h2>
        </Card>

        <Card className="p-5 rounded-2xl text-center">
          <p className="text-sm text-muted-foreground">
            Following
          </p>

          <h2 className="text-xl font-bold">
            {user.stats.following}
          </h2>
        </Card>
      </div>

      {/* RECENT BLOGS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Recent Blogs
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {user.recentBlogs.map((blog: any, idx: number) => (
            <FeedCard blog={blog} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}



function AuthorProfileSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">

      {/* HEADER */}
      <Card className="flex flex-col gap-5 rounded-3xl p-6 md:flex-row md:items-center md:justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" />

          <div className="space-y-3">
            <Skeleton className="h-7 w-52 rounded-xl" />

            <Skeleton className="h-4 w-72 rounded-lg" />

            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>
        </div>

        {/* BUTTON */}
        <Skeleton className="h-11 w-[120px] rounded-2xl" />
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="rounded-2xl p-5 text-center"
          >
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-4 w-20 rounded-lg" />

              <Skeleton className="h-8 w-12 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>

      {/* RECENT BLOGS */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-40 rounded-xl" />

        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <Card
              key={item}
              className="overflow-hidden rounded-3xl p-0"
            >
              {/* IMAGE */}
              <Skeleton className="h-52 w-full" />

              {/* CONTENT */}
              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4 rounded-lg" />

                  <Skeleton className="h-4 w-full rounded-lg" />

                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />

                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24 rounded-lg" />

                      <Skeleton className="h-3 w-16 rounded-lg" />
                    </div>
                  </div>

                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}