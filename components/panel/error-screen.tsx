// components/global/error-screen.tsx

"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  description?: string;
  retry?: () => void;
};

export default function ErrorScreen({
  title = "Something went wrong",
  description = "We couldn't load the requested content.",
  retry,
}: Props) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[32px] border border-destructive/20 bg-card px-6 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-transparent to-destructive/5" />

      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-destructive/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-destructive/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 shadow-lg">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>

        <h2 className="mt-8 text-3xl font-bold tracking-tight">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {retry && (
          <Button
            onClick={retry}
            className="mt-8 rounded-2xl px-6"
          >
            <RefreshCw className="mr-2 h-4 w-4" />

            Retry
          </Button>
        )}
      </div>
    </div>
  );
}