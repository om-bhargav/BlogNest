"use client";

import { LoaderCircle } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
};

export default function LoadingScreen({
  title = "Loading...",
  description = "Please wait while we prepare your content.",
}: Props) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[32px] border bg-card p-3">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border bg-background shadow-xl">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold tracking-tight">{title}</h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>

        {/* Animated Dots */}
        <div className="mt-6 flex items-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />

          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />

          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
