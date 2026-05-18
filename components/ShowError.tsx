import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FullPageErrorProps {
  title?: string;
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export default function FullPageError({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again later.",
  showRetry = true,
  onRetry = () => window.location.reload(),
}: FullPageErrorProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          {showRetry && (
            <Button onClick={onRetry} className="mt-6 w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
