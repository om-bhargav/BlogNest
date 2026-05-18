"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SavedBlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    image?: string | null;

    author?: {
      name?: string | null;
      image?: string | null;
    } | null;

    category?: {
      name?: string | null;
    } | null;

    _count: {
      likes: number;
      comments: number;
    };
  };
}

export default function SavedBlogCard({
  blog,
}: SavedBlogCardProps) {
  return (
    <Card className="overflow-hidden py-0 rounded-3xl border bg-card shadow-sm">
      
      {/* IMAGE */}
      <div className="h-52 overflow-hidden">
        <img
          src={
            blog.image ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
          }
          alt={blog.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="space-y-4 p-5">

        {/* TOP */}
        <div className="flex items-center justify-between">
          <Badge className="rounded-xl">
            {blog.category?.name}
          </Badge>

          <Badge
            variant="secondary"
            className="rounded-xl"
          >
            {blog._count.likes} Likes
          </Badge>
        </div>

        {/* TITLE */}
        <div>
          <h2 className="line-clamp-2 text-xl font-bold">
            {blog.title}
          </h2>

          {blog.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {blog.excerpt}
            </p>
          )}
        </div>

        {/* AUTHOR */}
        <div className="flex items-center gap-3">
          <img
            src={
              blog.author?.image ||
              `https://ui-avatars.com/api/?name=${blog.author?.name}`
            }
            alt={blog.author?.name || "Author"}
            className="h-10 w-10 rounded-xl object-cover"
          />

          <div>
            <p className="text-sm font-medium">
              {blog.author?.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {blog._count.comments} comments
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <Link href={`/blogs/${blog.slug}`}>
          <Button className="w-full rounded-2xl">
            Continue Reading
          </Button>
        </Link>
      </div>
    </Card>
  );
}