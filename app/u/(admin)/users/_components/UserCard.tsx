"use client";

import { User } from "@/data/user.data";
import { useState } from "react";

import { Crown, Shield, ShieldCheck, Trash2, User2, UserX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
type Props = {
  user: User;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onChangeRole: (id: number) => void;
  loading: boolean;
};

export default function UserCard({
  user,
  onDelete,
  onToggleStatus,
  onChangeRole,
  loading,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      key={user.id}
      className="group overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-2xl ring-2 ring-border">
            <AvatarImage src={user.image} alt={user.name} />

            <AvatarFallback className="rounded-2xl text-lg font-semibold bg-muted">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-lg font-bold tracking-tight">{user.name}</h2>

            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Role Badge */}
        <Badge
          variant={user.role === "ADMIN" ? "default" : "secondary"}
          className="rounded-xl"
        >
          {user.role === "ADMIN" ? (
            <Crown className="mr-1 h-3 w-3" />
          ) : (
            <User2 className="mr-1 h-3 w-3" />
          )}

          {user.role}
        </Badge>
      </div>

      {/* STATUS */}
      <div className="mt-5 flex items-center justify-between rounded-2xl border bg-muted/30 px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Account Status</p>

          <div className="mt-1 flex items-center gap-2">
            {user.status === "ACTIVE" ? (
              <ShieldCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Shield className="h-4 w-4 text-red-500" />
            )}

            <span className="font-medium">{user.status}</span>
          </div>
        </div>

        <Badge
          variant={user.status === "ACTIVE" ? "default" : "destructive"}
          className="rounded-xl"
        >
          {user.status}
        </Badge>
      </div>

      {/* STATS */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">Blogs</p>

          <h3 className="mt-1 text-xl font-bold">{user.blogs}</h3>
        </div>

        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">Followers</p>

          <h3 className="mt-1 text-xl font-bold">{user.followers}</h3>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex flex-col gap-3">
        {/* Role Change */}
        <Button
          variant="outline"
          className="rounded-2xl"
          disabled={loading}
          onClick={() => onChangeRole(user.id)}
        >
          <Crown className="mr-2 h-4 w-4" />
          Make {user.role === "ADMIN" ? "User" : "Admin"}
        </Button>

        <div className="flex gap-3">
          {/* Status */}
          <Button
            variant="outline"
            className="flex-1 rounded-2xl"
            disabled={loading}
            onClick={() => onToggleStatus(user.id)}
          >
            {user.status === "ACTIVE" ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Suspend
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>

          {/* Delete */}
          <Button
            variant="destructive"
            className="rounded-2xl"
            disabled={loading}
            onClick={() => onDelete(user.id)}
          >
            {<Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
