"use client";

import useSWR from "swr";

import {
  Users,
  FileText,
  Folder,
  Eye,
  TrendingUp,
  ShieldAlert,
  Heart,
  Bookmark,
  MessageSquare,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetcher } from "@/lib/fetcher";
import LoadingScreen from "@/components/panel/loading-screen";
import ErrorScreen from "@/components/panel/error-screen";

const COLORS = [
  "var(--primary)",
  "var(--primary) / 0.8",
  "var(--primary) / 0.6",
  "var(--primary) / 0.4",
];

export default function AdminDashboard() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/user/analytics",
    fetcher
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !data?.success || data?.data?.role !== "ADMIN") {
    return <ErrorScreen retry={mutate} />;
  }

  const analytics = data.data;

  const overview = [
    {
      title: "Total Users",
      value: analytics.overview.totalUsers,
      icon: Users,
    },
    {
      title: "Published Blogs",
      value: analytics.blogs.publishedBlogs,
      icon: FileText,
    },
    {
      title: "Categories",
      value: analytics.overview.totalCategories,
      icon: Folder,
    },
    {
      title: "Total Views",
      value: analytics.overview.totalViews,
      icon: Eye,
    },
  ];

  const categoryDistribution = [
    {
      name: "Published",
      value: analytics.blogs.publishedBlogs,
    },
    {
      name: "Draft",
      value: analytics.blogs.draftBlogs,
    },
    {
      name: "Blocked",
      value: analytics.blogs.blockedBlogs,
    },
    {
      name: "Featured",
      value: analytics.blogs.featuredBlogs,
    },
  ];

  const blogPerformance = analytics.charts.traffic.map(
    (
      item: {
        date: string;
        views: number;
      },
      index: number
    ) => ({
      name: new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      blogs: item.views,
      index,
    })
  );

  return (
    <main className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="rounded-xl px-4 py-1">ADMIN PANEL</Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Platform Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Monitor users, engagement, traffic, moderation and overall
              platform growth.
            </p>
          </div>

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <TrendingUp className="h-10 w-10" />
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {overview.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="rounded-3xl border p-5 shadow-sm">
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

      {/* EXTRA STATS */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Likes",
            value: analytics.overview.totalLikes,
            icon: Heart,
          },
          {
            title: "Saved Blogs",
            value: analytics.overview.totalSavedBlogs,
            icon: Bookmark,
          },
          {
            title: "Comments",
            value: analytics.overview.totalComments,
            icon: MessageSquare,
          },
          {
            title: "Suspended Users",
            value: analytics.users.suspendedUsers,
            icon: ShieldAlert,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="rounded-3xl border p-5 shadow-sm">
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

      {/* CHARTS */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* TRAFFIC */}
        <Card className="rounded-3xl border p-5 xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Traffic Growth</h2>

            <p className="text-sm text-muted-foreground">
              Platform traffic analytics
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.charts.traffic}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* BLOG STATUS */}
        <Card className="rounded-3xl border p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Blog Distribution</h2>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  outerRadius={110}
                >
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* BOTTOM */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* TRAFFIC BAR */}
        <Card className="rounded-3xl border p-5 xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Weekly Traffic</h2>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blogPerformance}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="blogs"
                  fill="var(--primary)"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* MODERATION */}
        <Card className="rounded-3xl border p-5">
          <div className="mb-5 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-orange-500" />

            <h2 className="text-lg font-semibold">Moderation Queue</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
              {analytics.blogs.blockedBlogs} blocked blogs
            </div>

            <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
              {analytics.users.suspendedUsers} suspended users
            </div>

            <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
              {analytics.overview.totalComments} total comments
            </div>

            <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
              {analytics.blogs.draftBlogs} draft blogs pending
            </div>
          </div>
        </Card>
      </section>

      {/* RECENT */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* RECENT USERS */}
        <Card className="rounded-3xl border p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Recent Users</h2>
          </div>

          <div className="space-y-4">
            {analytics.recent.recentUsers.map(
              (user: { id: string; name: string; email: string }) => (
                <div
                  key={user.id}
                  className="rounded-2xl border bg-muted/30 p-4"
                >
                  <h3 className="font-medium">{user.name}</h3>

                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              )
            )}
          </div>
        </Card>

        {/* RECENT BLOGS */}
        <Card className="rounded-3xl border p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Recent Blogs</h2>
          </div>

          <div className="space-y-4">
            {analytics.recent.recentBlogs.map(
              (blog: {
                id: string;
                title: string;
                author: {
                  name: string;
                };
              }) => (
                <div
                  key={blog.id}
                  className="rounded-2xl border bg-muted/30 p-4"
                >
                  <h3 className="font-medium">{blog.title}</h3>

                  <p className="text-sm text-muted-foreground">
                    by {blog.author.name}
                  </p>
                </div>
              )
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
