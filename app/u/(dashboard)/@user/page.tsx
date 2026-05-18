"use client";

import useSWR from "swr";

import {
  Bookmark,
  Eye,
  FileText,
  Heart,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import LoadingScreen from "@/components/panel/loading-screen";
import ErrorScreen from "@/components/panel/error-screen";
import { fetcher } from "@/lib/fetcher";
export default function UserDashboard() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/user/analytics",
    fetcher
  );

  if (isLoading) {
    return (
      <LoadingScreen
        title="Loading Dashboard"
        description="Fetching your latest analytics and engagement data."
      />
    );
  }

  if (error || !data?.success) {
    console.log(error,data?.success);
    return (
      <ErrorScreen
        title="Analytics Failed"
        description={error?.message || "Unable to load dashboard analytics."}
        retry={() => mutate()}
      />
    );
  }

  const analytics = data.data;

  const stats = [
    {
      title: "My Blogs",
      value: analytics.overview.myBlogs,
      icon: FileText,
    },

    {
      title: "Total Likes",
      value: analytics.overview.totalLikes,
      icon: Heart,
    },

    {
      title: "Followers",
      value: analytics.overview.totalFollowers,
      icon: Users,
    },

    {
      title: "Saved Blogs",
      value: analytics.overview.totalSaved,
      icon: Bookmark,
    },
  ];

  const engagement = analytics.topBlogs.map(
    (
      blog: {
        title: string;
        views: number;
      },
      index: number
    ) => ({
      month: `#${index + 1}`,
      views: blog.views,
    })
  );

  return (
    <main className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative flex items-center justify-between">
          <div>
            <Badge className="rounded-xl px-4 py-1">USER DASHBOARD</Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Creator Overview
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Track your blog performance, audience and engagement analytics.
            </p>
          </div>

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <TrendingUp className="h-10 w-10" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="rounded-3xl border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>

                  <h2 className="mt-3 text-3xl font-bold">{item.value}</h2>
                </div>

                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      {/* CHART + PERFORMANCE */}
      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-3xl border p-5 xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Blog Engagement</h2>

            <p className="text-sm text-muted-foreground">
              Views growth on your content
            </p>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagement}>
                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-3xl border p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Performance</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Total Views",
                value: analytics.overview.totalViews,
              },

              {
                label: "Comments Received",
                value: analytics.overview.totalComments,
              },

              {
                label: "Published Blogs",
                value: analytics.overview.publishedBlogs,
              },

              {
                label: "Draft Blogs",
                value: analytics.overview.draftBlogs,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border bg-muted/30 p-4"
              >
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>

                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* BLOGS + ACTIVITY */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* TOP BLOGS */}
        <Card className="rounded-3xl border p-5">
          <div className="mb-5 flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />

            <h2 className="text-lg font-semibold">Top Performing Blogs</h2>
          </div>

          <div className="space-y-4">
            {analytics.topBlogs.map((blog: any) => (
              <div key={blog.id} className="rounded-2xl border bg-muted/30 p-4">
                <h3 className="font-medium">{blog.title}</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {blog.views} views
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* RECENT BLOGS */}
        <Card className="rounded-3xl border p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Recent Blogs</h2>
          </div>

          <div className="space-y-4">
            {analytics.recentBlogs.map((blog: any) => (
              <div key={blog.id} className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium">{blog.title}</h3>

                  <Badge variant="outline">{blog.status}</Badge>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
