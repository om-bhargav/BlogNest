"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/config";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center bg-[url('/hero.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center text-white px-6 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to {SITE_NAME}
        </h1>

        <p className="text-lg text-white/80 mb-8">
          Discover stories worth sharing
        </p>

        {/* 🔍 Search */}
        <div className="flex items-center gap-2 rounded-xl bg-white/90 p-2 mb-4">
          <Input
            placeholder="Search for topics, stories, or authors"
            className="border-0 shadow-none ring-0 focus-visible:ring-0 focus:shadow-none text-black"
          />
        </div>

        {/* 🚀 Explore Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/explore-blogs")}
            className="group bg-primary text-primary-foreground scale-130 px-6 py-2 rounded-sm text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            Explore Blogs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}