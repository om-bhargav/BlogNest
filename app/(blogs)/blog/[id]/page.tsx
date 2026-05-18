"use client";

import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Share2,
  Heart,
  ArrowLeft,
  Bookmark,
  MessageCircle,
} from "lucide-react";

import { fetcher } from "@/lib/fetcher";
import { notFound } from "next/navigation";
import LoadingScreen from "@/components/SimpleLoadingScreen";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserContext";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  // BLOG API
  const { data, isLoading } = useSWR(
    id ? `/api/blogs/${id}` : null,
    fetcher
  );

  // COMMENTS API (NEW)
  const {
    data: commentsRes,
    mutate,
    isLoading: commentsLoading,
  } = useSWR(id ? `/api/user/blogs/${id}/comments` : null, fetcher);

  const blog = data?.data;
  const comments = commentsRes?.data || [];

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: blog?.title,
        text: blog?.title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };
  const { user } = UserContext();
  const loggedIn = !!user;
  // POST COMMENT
  const handlePostComment = async () => {
    if (!comment.trim()) return;

    try {
      setPosting(true);

      const res = await fetch(`/api/user/blogs/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      const json = await res.json();

      if (!json.success) return;

      setComment("");

      // refresh comments instantly
      mutate();
    } catch (err) {
      console.log(err);
    } finally {
      setPosting(false);
    }
  };
  const handleLike = async () => {
    try {
      setLiked((prev) => !prev);

      const res = await fetch(`/api/user/blogs/${id}/like`, {
        method: "POST",
      });

      const json = await res.json();

      if (!json.success) {
        setLiked((prev) => !prev); // rollback
        return;
      }

      mutate(); // refresh blog data
    } catch (err) {
      console.log(err);
    }
  };
  const handleSave = async () => {
    try {
      setSaved((prev) => !prev);

      const res = await fetch(`/api/user/blogs/${id}/save`, {
        method: "POST",
      });

      const json = await res.json();

      if (!json.success) {
        setSaved((prev) => !prev); // rollback
        return;
      }

      mutate();
    } catch (err) {
      console.log(err);
    }
  };
  // sync with backend response
  useEffect(() => {
    if (!blog) return;

    setLiked(blog.liked ?? false);
    setSaved(blog.saved ?? false);
  }, [blog]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/blogs/${id}/log-traffic`)
      .then(() => {
        // console.log();
      })
      .catch((err) => console.log(err));
  }, [id]);
  // LOADING
  if (isLoading) {
    return <BlogDetailSkeleton />
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* TITLE + AUTHOR */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${blog.authorId}`}>
              <Avatar>
                <AvatarImage src={blog.authorImage} />
                <AvatarFallback>
                  {blog.author?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="text-sm">
              <p className="font-medium">{blog.author}</p>
              <p className="text-muted-foreground">
                {formatDateTime(blog.createdAt)}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            {loggedIn &&
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLike}
                  className={`rounded-full transition ${liked ? "text-red-500" : "text-muted-foreground"
                    }`}
                >
                  <Heart
                    className="h-4 w-4 transition"
                    fill={liked ? "currentColor" : "none"}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSave}
                  className={`rounded-full transition ${saved ? "text-blue-500" : "text-muted-foreground"
                    }`}
                >
                  <Bookmark
                    className="h-4 w-4 transition"
                    fill={saved ? "currentColor" : "none"}
                  />
                </Button>
              </>
            }
            <button
              onClick={handleShare}
              className="p-2 rounded-full border hover:bg-accent"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COVER */}
      <img
        src={blog.image}
        className="w-full h-[450px] object-fit rounded-2xl"
      />

      {/* CONTENT */}
      <article
        className="
        prose
        prose-neutral
        dark:prose-invert
        max-w-none
                  
        prose-headings:font-bold
        prose-h1:text-4xl
        prose-h2:text-2xl
                  
        prose-p:text-muted-foreground
        prose-li:text-muted-foreground
                  
        prose-blockquote:border-l-primary
        prose-blockquote:text-muted-foreground
                  
        prose-img:rounded-2xl
      "
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* COMMENTS */}
      <div className="space-y-4 border-t pt-6">

        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </h2>

        {/* INPUT */}
        <div className="flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full h-10 px-3 rounded-xl border"
          />

          <Button
            onClick={handlePostComment}
            disabled={posting}
          // className="px-4 py-2 bg-primary text-white rounded-xl"
          >
            {posting ? "Posting..." : "Post"}
          </Button>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {commentsLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading comments...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((c: any) => (
              <div
                key={c.id}
                className="border rounded-xl p-3 text-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={c.user?.image}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="font-medium">
                    {c.user?.name}
                  </span>
                </div>

                <p>{c.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


function BlogDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      {/* BACK BUTTON */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* TITLE + AUTHOR */}
      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-xl md:w-3/4" />
          <Skeleton className="h-10 w-2/3 rounded-xl" />
        </div>

        {/* Author + Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-lg" />
              <Skeleton className="h-3 w-40 rounded-lg" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* COVER IMAGE */}
      <Skeleton className="h-[450px] w-full rounded-3xl" />

      {/* CONTENT */}
      <Card className="space-y-6 rounded-3xl border p-6">
        <Skeleton className="h-8 w-2/3 rounded-xl" />

        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-11/12 rounded-lg" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-10/12 rounded-lg" />
        </div>

        <Skeleton className="h-[260px] w-full rounded-2xl" />

        <div className="space-y-3">
          <Skeleton className="h-6 w-1/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-9/12 rounded-lg" />
        </div>
      </Card>

      {/* COMMENTS */}
      <div className="space-y-5 border-t pt-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-40 rounded-lg" />
        </div>

        {/* Comment Input */}
        <div className="flex gap-2">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-24 rounded-xl" />
        </div>

        {/* Comments */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card
              key={item}
              className="rounded-2xl border p-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-lg" />
                  <Skeleton className="h-3 w-20 rounded-lg" />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-5/6 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}