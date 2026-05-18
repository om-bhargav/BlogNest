"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowRightCircle,
  Gauge,
  LayoutDashboard,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SITE_NAME } from "@/config";
import { UserContext } from "@/context/UserContext";
import Image from "next/image";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Trending Blogs",
    href: "#trending",
  },
  {
    name: "Achievements",
    href: "#achievements",
  },
  {
    name: "Why Blognest",
    href: "#whyus",
  },
];

export function Navbar() {
  const pathname = usePathname();

  const { user } = UserContext();

  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* LEFT */}
          {/* LOGO */}
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 relative items-center justify-center rounded-2xl bg-white/10 text-lg font-bold text-white transition-all duration-300 group-hover:scale-103 group-hover:bg-white/15">
              <Image alt={"Logo"} src={"/logo.png"} fill/>
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                {SITE_NAME}
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Modern Blogging
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          {pathname === "/" && (
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

        {/* RIGHT */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <Link href="/u">
              <Button className="h-11 rounded-2xl px-5 shadow-lg shadow-primary/20">
                <Gauge className="mr-2 h-4 w-4" />
                Go To Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-11 rounded-2xl border-white/15 bg-white/5 px-5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="h-11 rounded-2xl px-5 shadow-lg shadow-primary/20">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl text-white hover:bg-white/10 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent className="border-white/10 bg-black text-white">
              <div className="mt-6 flex flex-col">
                <SheetTitle className="mb-8 text-left text-xl font-bold text-white">
                  {SITE_NAME}
                </SheetTitle>

                {/* MOBILE NAV */}
                {pathname === "/" && (
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                )}

                <div className="my-6 border-t border-white/10" />

                {/* MOBILE ACTIONS */}
                <div className="flex flex-col gap-3">
                  {isLoggedIn ? (
                    <Link href="/u">
                      <Button className="h-11 w-full rounded-2xl">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Go To Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="h-11 w-full rounded-2xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                          Login
                        </Button>
                      </Link>

                      <Link href="/signup">
                        <Button className="h-11 w-full rounded-2xl">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}