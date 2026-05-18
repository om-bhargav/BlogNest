"use client";

import { useState } from "react";
import useSWR from "swr";

import BlogCard from "../../(landing)/_components/blog-card";

import { fetcher } from "@/lib/fetcher";

import { Skeleton } from "@/components/ui/skeleton";

type Category = {
  id: string;
  name: string;
};

export default function ExplorePage() {
  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [sort, setSort] = useState("latest");

  // ✅ BLOG QUERY
  const query = new URLSearchParams({
    search,
    category: activeCategory,
    sort,
  }).toString();

  // ✅ BLOGS API
  const { data, isLoading } = useSWR(
    `/api/blogs?${query}`,
    fetcher
  );

  // ✅ CATEGORIES API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useSWR("/api/categories", fetcher);

  const blogs = data?.data || [];

  // ✅ ADD "All" CATEGORY
  const categories: string[] = [
    "All",
    ...(categoriesData?.data?.map(
      (cat: Category) => cat.name
    ) || []),
  ];

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 px-4 py-10">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">
          Explore Blogs
        </h1>

        <p className="text-sm text-muted-foreground">
          Discover ideas, stories, and insights
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* SEARCH */}
        <input
          placeholder="Search blogs..."
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm md:max-w-sm"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* SORT */}
        <select
          className="rounded-lg border bg-background px-3 py-2 text-sm"
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="latest">
            Latest
          </option>

          <option value="popular">
            Most Popular
          </option>
        </select>
      </div>

      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-2">
        {categoriesLoading ? (
          Array.from({ length: 6 }).map(
            (_, i) => (
              <Skeleton
                key={i}
                className="h-9 w-24 rounded-full"
              />
            )
          )
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(cat)
              }
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No categories found
          </p>
        )}
      </div>

      {/* BLOG GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map(
            (_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border bg-card"
              >
                {/* IMAGE */}
                <div className="h-52 animate-pulse bg-muted" />

                {/* CONTENT */}
                <div className="space-y-4 p-5">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 animate-pulse rounded-lg bg-muted" />

                    <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />

                    <div className="h-4 w-5/6 animate-pulse rounded-lg bg-muted" />
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />

                      <div className="space-y-2">
                        <div className="h-3 w-24 animate-pulse rounded-lg bg-muted" />

                        <div className="h-3 w-16 animate-pulse rounded-lg bg-muted" />
                      </div>
                    </div>

                    <div className="h-9 w-24 animate-pulse rounded-xl bg-muted" />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog: any) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              excerpt={blog.excerpt}
              image={blog.image}
              category={blog.category}
              author={blog.author}
              slug={blog.id}
              date={new Date(
                blog.date
              ).toLocaleDateString()}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          No blogs found 😢
        </div>
      )}
    </div>
  );
}