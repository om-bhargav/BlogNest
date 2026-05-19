"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Blog } from "@/data/blogs.data";
import {
  BadgeCheck,
  Eye,
  ShieldBan,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
type Props = {
  blog: Blog;
  onDelete: (id: string) => void;
  onToggleFeature: (id: string) => void;
  onToggleStatus: (id: string) => void;
  loading: boolean;
};

export default function BlogCard({
  blog,
  onDelete,
  onToggleFeature,
  onToggleStatus,
  loading,
}: Props) {
  return (
    <Card
      key={blog.id}
      className="group overflow-hidden py-0 rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge
            variant={
              blog.status === "PUBLISHED"
                ? "default"
                : blog.status === "DRAFT"
                  ? "secondary"
                  : "destructive"
            }
            className="rounded-xl"
          >
            {blog.status}
          </Badge>

          {blog.featured && (
            <Badge className="rounded-xl bg-yellow-500 text-black hover:bg-yellow-500">
              <Star className="mr-1 h-3 w-3 fill-current" />
              Featured
            </Badge>
          )}
        </div>

        {/* Views */}
        <div className="absolute bottom-4 right-4 rounded-xl bg-black/60 px-3 py-1 text-sm text-white backdrop-blur">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {blog.views}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-1 h-full justify-between flex-col">
        <div className="mb-4">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline" className="rounded-xl">
              {blog.category}
            </Badge>

            <Badge variant="secondary" className="rounded-xl">
              {blog.author}
            </Badge>
          </div>

          <h2 className="line-clamp-2 text-xl font-bold tracking-tight">
            {blog.title}
          </h2>

          {/* <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {blog.excerpt}
                  </p> */}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <Button
            variant={blog.featured ? "default" : "outline"}
            className="rounded-2xl"
            disabled={loading}
            onClick={() => onToggleFeature(blog.id)}
          >
            <Sparkles className="mr-2 h-4 w-4" />

            {blog.featured ? "Remove Featured" : "Make Featured"}
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-2xl"
              disabled={loading}
              onClick={() => onToggleStatus(blog.id)}
            >
              {blog.status === "BLOCKED" ? (
                <>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Publish
                </>
              ) : (
                <>
                  <ShieldBan className="mr-2 h-4 w-4" />
                  Block
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              className="rounded-2xl"
              disabled={loading}
              onClick={() => onDelete(blog.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
