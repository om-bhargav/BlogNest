"use client";

import { useMemo, useState } from "react";

import {
  Search,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UserCard from "./_components/UserCard";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import LoadingScreen from "@/components/panel/loading-screen";
import EmptyState from "@/components/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = "ADMIN" | "USER";

type Status =
  | "ACTIVE"
  | "SUSPENDED";

type User = {
  id: number;
  name: string;
  email: string;
  image: string;
  role: Role;
  status: Status;
  blogs: number;
  followers: number;
};

export default function UsersGrid() {
  const { data, isLoading, mutate } = useSWR(
    "/api/admin/users",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const users: User[] = data?.data || [];

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");

  const [loadingId, setLoadingId] =
    useState<number | null>(null);

  // =========================
  // FILTERS
  // =========================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const deleteUser = async (id: number) => {
    try {
      setLoadingId(id);

      await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const toggleUserStatus = async (id: number) => {
    try {
      setLoadingId(id);

      const user = users.find((u) => u.id === id);
      if (!user) return;

      await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
        }),
      });

      mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const changeUserRole = async (id: number) => {
    try {
      setLoadingId(id);

      const user = users.find((u) => u.id === id);
      if (!user) return;

      await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: user.role === "ADMIN" ? "USER" : "ADMIN",
        }),
      });

      mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen title="Loading Users..." />
    );
  }
  return (
    <main className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Manage platform users, roles,
              permissions, and account access
              across your blogging platform.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">
                Total Users
              </p>

              <h2 className="text-2xl font-bold text-center">
                {users.length}
              </h2>
            </div>

            <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">
                Admins
              </p>

              <h2 className="text-2xl font-bold text-center">
                {
                  users.filter(
                    (u) => u.role === "ADMIN"
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">
                Suspended
              </p>

              <h2 className="text-2xl font-bold text-center">
                {
                  users.filter(
                    (u) =>
                      u.status ===
                      "SUSPENDED"
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <Card className="rounded-3xl border p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="h-12 rounded-2xl border-0 bg-muted/40 pl-11"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter as any}>
            <SelectTrigger className="h-12 rounded-2xl border bg-background px-4 text-sm">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter as any}>
            <SelectTrigger className="h-12 rounded-2xl border bg-background px-4 text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* USERS GRID */}
      {filteredUsers.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try changing your search or filters." />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => {
            const loading = loadingId === user.id;

            return (
              <UserCard key={user.id} loading={loading} onChangeRole={changeUserRole} onDelete={deleteUser} onToggleStatus={toggleUserStatus} user={user} />
            );
          })}
        </section>
      )}
    </main>
  );
}