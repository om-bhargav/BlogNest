"use client";

import { useMemo, useState, useTransition } from "react";
import useSWR from "swr";

import {
  Folder,
  Plus,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import CategoryCard from "./_components/CategoryCard";
import EmptyState from "@/components/EmptyState";
import { fetcher } from "@/lib/fetcher";
import { Category, CategoryStatus } from "@/data/categories.data";
import LoadingScreen from "@/components/panel/loading-screen";

export default function CategoriesGrid() {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  // =========================
  // FETCH CATEGORIES
  // =========================
  const { data, isLoading, mutate } = useSWR(
    "/api/categories",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const categories: Category[] = data?.data || [];
  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description,
    });
    setOpen(true);
  };
  // =========================
  // FILTER
  // =========================
  const filtered = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  // =========================
  // TOGGLE STATUS (PUT)
  // =========================
  const toggleCategoryStatus = async (
    id: string,
    current: CategoryStatus
  ) => {
    try {
      setLoadingId(id);

      const category = categories.find((c) => c.id === id);
      if (!category) return;

      await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          status: current === "ACTIVE" ? "HIDDEN" : "ACTIVE",
        }),
      });

      startTransition(() => {
        mutate();
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId(null);
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  const deleteCategory = async (id: string) => {
    try {
      setLoadingId(id);

      await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      startTransition(() => {
        mutate();
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        // UPDATE
        await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            status: editingCategory.status,
          }),
        });
      } else {
        // CREATE
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      startTransition(() => {
        mutate();
        setOpen(false);
      });
    } catch (err) {
      console.log(err);
    }
  };
  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <LoadingScreen title="Loading Categories..."/>
    );
  }

  return (
    <>
      <main className="space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Folder className="h-7 w-7" />
              </div>

              <h1 className="text-3xl font-bold">Categories</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage blog categories and visibility.
              </p>
            </div>

            <Button onClick={openCreateModal} className="rounded-xl h-11">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>
        </section>

        {/* SEARCH */}
        <Card className="rounded-3xl border p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
            />
          </div>
        </Card>

        {/* GRID */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Folder}
            title="No categories found"
            description="Try a different search term."
          />
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                loading={loadingId === category.id}
                onDelete={deleteCategory}
                onEdit={openEditModal}
                onToggleStatus={() =>
                  toggleCategoryStatus(category.id, category.status)
                }
              />
            ))}
          </section>
        )}
      </main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Update Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="Category name"
              value={form.name}
              disabled={pending}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
            />

            <Input
              placeholder="Description"
              value={form.description}
              disabled={pending}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}