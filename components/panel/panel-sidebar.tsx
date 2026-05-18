"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { panelLinks } from "@/config";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { LogOut } from "lucide-react";

type Props = {
  role: string;
  name: string;
  logout: () => void;
};

export default function PanelSidebar({ role, name, logout }: Props) {
  const pathname = usePathname();

  const links = panelLinks.filter((link) => link.roles.includes(role));

  return (
    <aside className="flex h-full w-64 flex-col overflow-y-auto border-r border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Header */}
      <div className="shrink-0 px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Dashboard
        </p>

        <h2 className="mt-2 truncate text-base font-semibold text-foreground">
          Welcome, {name}
        </h2>
      </div>

      <Separator />

      {/* Links */}
      <nav className="flex flex-1 flex-col justify-start px-3 py-4">
        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            const active =
              pathname === link.path || pathname.endsWith(`/${link.path}`);

            return (
              <Link key={link.path} href={link.path}>
                <div
                  className={cn(
                    "group flex h-11 items-center gap-3 mb-3 rounded-xl px-4 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />

                  <span className="truncate">{link.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <Separator />

      {/* Footer */}
      <div className="shrink-0 p-3">
        <Button
          variant="destructive"
          className="h-11 w-full justify-center gap-2 rounded-xl"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
