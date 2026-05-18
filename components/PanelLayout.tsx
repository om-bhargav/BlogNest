"use client";
import { useState } from "react";
import {
  Home,
  Users,
  Settings,
  UserCircle,
  Menu,
  X,
  FileTextIcon,
  Folder,
  LogOut,
  Files,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { SITE_NAME } from "@/config";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
// import { UserContext } from "@/context/UserContext";
export default function PanelLayout({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const links = [
    { name: "Dashboard", path: "/u", icon: Home, roles: ["ADMIN","USER"] },
    { name: "Manage Users", path: "/u/users", icon: Users, roles: ["ADMIN"] },
    {
      name: "Manage Blogs",
      path: "/u/manage-blogs",
      icon: FileTextIcon,
      roles: ["ADMIN"],
    },
    {
      name: "Manage Categories",
      path: "/u/manage-categories",
      icon: Folder,
      roles: ["ADMIN"],
    },
    { name: "My Blogs", path: "/u/blogs", icon: Files, roles: ["USER"] },
    {
      name: "Settings",
      path: "/u/settings",
      icon: Settings,
      roles: ["ADMIN", "USER"],
    },
  ];

  const { user,logout: removeUser } = UserContext();
  const name = user?.name ?? "Not Specified";
  const role = user?.role ?? "ADMIN";
  const filteredLinks = links.filter((link) =>
    link.roles.includes(role)
  );

  const pathname = usePathname();
  const logout = async () => {
    await signOut({ redirect: true, redirectTo: "/" });
    removeUser();
  };
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Topbar */}
      <header className="h-14 border-b border-border bg-card sticky top-0 z-50 flex items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-semibold">
              {SITE_NAME}
            </h1>
            <span className="text-[10px] font-semibold">
              {role === "ADMIN" ? "Admin Panel" : "User Panel"}
            </span>
          </div>
        </div>


        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-accent">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {role === "ADMIN" ? "A" : "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {name.toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "w-64 bg-card border-r flex flex-col px-2 h-full border-border fixed! top-14 h-[calc(100vh-5rem)] z-50 transform transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0 md:static md:z-auto"
          )}
        >
          {/* Close button (mobile) */}
          <div className="flex justify-between items-center p-4 md:hidden">
            <span className="font-semibold">Menu</span>
            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 text-lg font-semibold hidden md:block">
            Welcome, {name}
          </div>

          <nav className="space-y-2 flex-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.endsWith(link.path);

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <Button variant={"destructive"} onClick={logout} className="w-full justify-self-end"><LogOut/> Logout</Button>

        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-64 overflow-y-auto p-2 md:pt-4 md:px-4">
          <div className="h-full w-full bg-card p-4 rounded-xl">
            {children}

          </div>
        </main>
      </div>
    </div>
  );
}