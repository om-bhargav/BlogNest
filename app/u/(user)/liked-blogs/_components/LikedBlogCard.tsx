// components/blog/saved-blog-card.tsx

"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LikedBlogProps {
  blog: {
    id: string;
    title: string;
    excerpt?: string | null;
    image?: string | null;

    category?: {
      id?: string;
      name?: string;
    };

    _count: {
      likes: number;
    };
  };
}

export default function LikedBlog({
  blog,
}: LikedBlogProps) {
  return (
    <Card className="overflow-hidden py-0 rounded-3xl border bg-card shadow-sm">
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

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <Badge className="rounded-xl">
            {blog.category?.name || "General"}
          </Badge>

          <Badge
            variant="secondary"
            className="rounded-xl"
          >
            {blog._count?.likes || 0} Likes
          </Badge>
        </div>

        <h2 className="text-xl font-bold line-clamp-2">
          {blog.title}
        </h2>

        {blog.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {blog.excerpt}
          </p>
        )}

        <Link href={`/blog/${blog.id}`}>
          <Button className="w-full rounded-2xl">
            Read Again
          </Button>
        </Link>
      </div>
    </Card>
  );
}