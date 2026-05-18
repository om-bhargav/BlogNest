"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import { useForm } from "react-hook-form";

import {
  Camera,
  FileText,
  Heart,
  Loader2,
  Pencil,
  Save,
  Users,
  Bookmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import LoadingScreen from "@/components/panel/loading-screen";
import ErrorScreen from "@/components/panel/error-screen";
import { fetcher } from "@/lib/fetcher";
import Image from "next/image";

import { toast } from "sonner";

import { imageToBase64 } from "@/lib/base64";

import { useRef } from "react";
type ProfileFormValues = {
  name: string;
  email: string;
  headline: string;
  bio: string;
  image?: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  /*
  =====================================
  FETCH PROFILE
  =====================================
  */

  const { data, error, isLoading, mutate } = useSWR(
    "/api/user/profile",
    fetcher
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [previewImage, setPreviewImage] = useState("");
  /*
  =====================================
  PROFILE FORM
  =====================================
  */

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<ProfileFormValues>();

  /*
  =====================================
  PASSWORD FORM
  =====================================
  */

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { isSubmitting: passwordLoading },
    reset: resetPassword,
  } = useForm<PasswordFormValues>();

  /*
  =====================================
  SET DEFAULT VALUES
  =====================================
  */

  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data?.name || "",
        email: data.data?.email || "",
        headline: data.data?.headline || "",
        bio: data.data?.bio || "",
        image: data.data?.image || "",
      });

      setPreviewImage(data.data?.image || "");
    }
  }, [data, reset]);

  /*
  =====================================
  UPDATE PROFILE
  =====================================
  */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      setUploadingImage(true);

      const base64 = await imageToBase64(file);

      setValue("image", base64);

      setPreviewImage(base64);

      toast.success("Image uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };
  const updateProfile = async (values: ProfileFormValues) => {
    try {
      const req = await fetch("/api/user/profile", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      });

      const res = await req.json();

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      toast.success("Profile updated");

      await mutate();

      setEditing(false);
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  /*
  =====================================
  UPDATE PASSWORD
  =====================================
  */

  const updatePassword = async (values: PasswordFormValues) => {
    try {
      const req = await fetch("/api/user/profile/password", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      });

      const res = await req.json();

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      toast.success("Password updated");

      resetPassword();
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  /*
  =====================================
  DELETE ACCOUNT
  =====================================
  */

  const deleteAccount = async () => {
    try {
      const confirmed = confirm(
        "Are you sure you want to delete your account?"
      );

      if (!confirmed) return;

      const req = await fetch("/api/user/profile/delete", {
        method: "DELETE",
      });

      const res = await req.json();

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      toast.success("Account deleted");

      window.location.href = "/";
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  /*
  =====================================
  LOADING
  =====================================
  */

  if (isLoading) {
    return <LoadingScreen title="Loading profile..." />;
  }

  /*
  =====================================
  ERROR
  =====================================
  */

  if (error || !data?.success) {
    return (
      <ErrorScreen
        title="Failed to load profile"
        description={error?.message || data?.message || "Something went wrong"}
      />
    );
  }

  const user = data?.data ?? {};
  const stats = data?.data?.stats ?? {};

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* HERO */}
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        {/* COVER */}
        <div className="relative isolate h-52 overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/15 via-background to-background">
          {/* Soft mesh background */}
          <div className="absolute inset-0">
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-primary/15 blur-2xl" />

            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-violet-500/10 blur-2xl" />

            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-sky-500/10 blur-2xl" />
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.15)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Dark fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        </div>

        {/* PROFILE */}
        <div className="relative px-6 pb-6">
          <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* LEFT */}
            <div className="flex items-end gap-5">
              {/* AVATAR */}
              <div className="group relative">
                <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-background bg-muted text-4xl font-bold shadow-xl">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt={user?.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <button
                  type="button"
                  disabled={uploadingImage || !editing}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* USER */}
              <div className="pb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {user.name}
                </h1>

                <p className="mt-1 text-muted-foreground">{user.headline}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="rounded-xl border bg-background px-4 py-2 text-sm font-medium">
                    {user.role}
                  </div>

                  <div className="rounded-xl border bg-background px-4 py-2 text-sm font-medium text-green-600">
                    {user.status}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditing((prev) => !prev)}
              >
                <Pencil className="mr-2 h-4 w-4" />

                {editing ? "Cancel Editing" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-8">
          {/* PERSONAL INFO */}
          <Card className="rounded-3xl border p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Personal Information</h2>

                <p className="text-sm text-muted-foreground">
                  Update your personal details and profile.
                </p>
              </div>

              {editing && (
                <div className="rounded-xl bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Editing Enabled
                </div>
              )}
            </div>

            <Separator className="mb-6" />

            <form onSubmit={handleSubmit(updateProfile)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>

                  <Input
                    {...register("name")}
                    disabled={!editing}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>

                  <Input
                    {...register("email")}
                    disabled={!editing}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Headline</Label>

                  <Input
                    {...register("headline")}
                    disabled={!editing}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Bio</Label>

                  <Textarea
                    {...register("bio")}
                    disabled={!editing}
                    className="min-h-[160px] rounded-2xl"
                  />
                </div>
              </div>

              {editing && (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* SECURITY */}
          <Card className="rounded-3xl border p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Security</h2>

              <p className="text-sm text-muted-foreground">
                Update your password securely.
              </p>
            </div>

            <Separator className="mb-6" />

            <form
              onSubmit={handlePasswordSubmit(updatePassword)}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label>Current Password</Label>

                <Input
                  type="password"
                  {...passwordRegister("currentPassword")}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>

                <Input
                  type="password"
                  {...passwordRegister("newPassword")}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>

                <Input
                  type="password"
                  {...passwordRegister("confirmPassword")}
                  className="h-12 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={passwordLoading}
                className="rounded-xl"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 lg:col-span-4">
          {/* STATS */}
          <Card className="rounded-3xl border p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Profile Stats</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: FileText,
                  label: "Blogs",
                  value: stats.blogs,
                  color: "bg-primary/10 text-primary",
                },
                {
                  icon: Heart,
                  label: "Likes",
                  value: stats.likes,
                  color: "bg-red-500/10 text-red-500",
                },
                {
                  icon: Bookmark,
                  label: "Saved",
                  value: stats.saved,
                  color: "bg-blue-500/10 text-blue-500",
                },
                {
                  icon: Users,
                  label: "Followers",
                  value: stats.followers,
                  color: "bg-green-500/10 text-green-500",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border bg-muted/30 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-3 ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>

                        <h3 className="font-semibold">{item.value}</h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* DANGER */}
          <Card className="rounded-3xl border border-red-500/20 p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-red-500">
                Danger Zone
              </h2>

              <p className="text-sm text-muted-foreground">
                Permanent actions for your account.
              </p>
            </div>

            <Button
              variant="destructive"
              className="w-full rounded-xl"
              onClick={deleteAccount}
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </section>
    </main>
  );
}
