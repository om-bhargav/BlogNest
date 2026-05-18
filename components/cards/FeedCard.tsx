"use client";

import { Heart, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt?: string;
    image?: string;

    author?: {
      id?: string;
      name?: string;
    };

    category?: {
      id?: string;
      name?: string;
    };

    _count?: {
      likes?: number;
      comments?: number;
    };
  };
}

export default function FeedCard({
  blog,
}: BlogCardProps) {
  return (
    <Card className="overflow-hidden py-0 rounded-3xl border bg-card shadow-sm">
      <div className="relative h-60 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <Badge className="rounded-xl">
            {blog.category?.name || "General"}
          </Badge>

          <p className="text-sm text-muted-foreground">
            {blog.author?.name || "Unknown"}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {blog.title}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />

              {blog._count?.likes || 0}
            </div>

            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />

              {blog._count?.comments || 0}
            </div>
          </div>

          <Link href={`/blog/${blog.id}`}>
          <Button className="rounded-2xl">
            Read Blog
          </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}