"use client";

import { Menu } from "lucide-react";

import { SITE_NAME } from "@/config";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

type Props = {
  role: string;
  name: string;
  setOpen: (v: boolean) => void;
};

export default function PanelTopbar({ role, name, setOpen }: Props) {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-xl md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href={"/"}>
            <div className="flex items-center gap-2">
              {/* Logo */}
              <div className="flex relative h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <Image alt={"Logo"} fill src={"/logo.png"} />
              </div>

              <Separator
                orientation="vertical"
                className="hidden h-6 sm:block"
              />

              {/* Title */}
              <div className="space-y-0.5">
                <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                  {SITE_NAME}
                </h1>

                <p className="text-xs font-medium text-muted-foreground">
                  {role === "ADMIN" ? "Admin Dashboard" : "User Dashboard"}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center">
          <div className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card/50 px-2 py-2 shadow-sm transition-all hover:bg-accent/40">
            {/* Avatar */}
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
              {name?.charAt(0).toUpperCase()}

              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            </div>

            {/* User Info */}
            <div className="hidden pr-1 sm:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-foreground">
                {name}
              </p>

              <p className="text-xs capitalize text-muted-foreground">
                {role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
