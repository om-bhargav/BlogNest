"use client";
import {
  Calendar,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Blog } from "@/data/blogs.data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmDialog from "@/components/ConfirmDialog";
import { formatDateTime } from "@/lib/utils";
type Props = {
  blog: Blog;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onView: (blog: Blog) => void;
  loading: boolean;
};

export default function MyBlogCard({ blog, onDelete, onEdit, onView, loading }: Props) {
  return (
    <Card
      key={blog.id}
      className="group py-0 overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Status */}
        <div className="absolute left-4 top-4">
          <Badge
            variant={blog.status === "PUBLISHED" ? "default" : "secondary"}
            className="rounded-xl"
          >
            {blog.status}
          </Badge>
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
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="outline" className="rounded-xl">
              {blog.category}
            </Badge>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />

              {formatDateTime(blog.createdAt || "")}
            </div>
          </div>

          <h2 className="line-clamp-2 text-xl font-bold tracking-tight">
            {blog.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          {/* Edit */}
          <Button
            variant="outline"
            className="flex-1 rounded-2xl"
            onClick={onEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          {/* Delete */}
          <ConfirmDialog onConfirm={() => onDelete(blog.id)} loading={loading}>
            <Button
              variant="destructive"
              className="rounded-2xl"
              disabled={loading}
            >

              <Trash2 className="h-4 w-4" />
            </Button>
          </ConfirmDialog>
        </div>
      </div>
    </Card>
  );
}
