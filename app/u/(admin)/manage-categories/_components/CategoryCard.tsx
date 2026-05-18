"use client";

import { Category } from "@/data/categories.data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Folder,
  Loader2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  category: Category;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  loading: boolean;
  onEdit?: (category: Category) => void;
};

export default function CategoryCard({
  category,
  onDelete,
  onToggleStatus,
  loading,
  onEdit,
}: Props) {
  const isActive = category.status === "ACTIVE";

  return (
    <Card className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      {/* subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-primary/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-105">
              <Folder className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {category.name}
              </h2>

              <p className="text-xs text-muted-foreground">
                {category._count.blogs} posts
              </p>
            </div>
          </div>

          <Badge
            className={`rounded-xl px-3 py-1 text-xs font-medium transition
              ${
                isActive
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-muted text-muted-foreground"
              }`}
          >
            {category.status}
          </Badge>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {category.description}
        </p>

        {/* FOOTER STATS */}
        <div className="mt-5 rounded-2xl border bg-muted/30 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Total Articles
          </p>
          <h3 className="text-xl font-bold">
            {category._count.blogs}
          </h3>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex gap-2">

          {/* TOGGLE */}
          <Button
            variant="outline"
            className="flex-1 rounded-2xl"
            disabled={loading}
            onClick={() => onToggleStatus(category.id)}
          >
            {isActive ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show
              </>
            )}
          </Button>

          {/* EDIT */}
          <Button
            variant="secondary"
            className="rounded-2xl px-4"
            disabled={loading}
            onClick={() => onEdit?.(category)}
          >
            Edit
          </Button>

          {/* DELETE */}
          <Button
            variant="destructive"
            className="rounded-2xl px-4"
            disabled={loading}
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}