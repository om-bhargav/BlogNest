"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoadingScreen({
  title = "Loading...",
  subtitle = "Please wait while we prepare everything",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [dots, setDots] = useState("");

  // animated dots (., .., ...)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 animate-pulse" />

      {/* floating blobs */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />

      {/* loader content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* spinner */}
        <div className="relative">
          <Loader2 className="h-14 w-14 animate-spin text-primary" />

          {/* inner pulse ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
        </div>

        {/* title */}
        <h1 className="text-xl font-semibold text-foreground">
          {title}
          <span className="text-primary">{dots}</span>
        </h1>

        {/* subtitle */}
        <p className="text-sm text-muted-foreground max-w-sm">
          {subtitle}
        </p>

        {/* progress bar */}
        <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden mt-4">
          <div className="h-full w-1/2 bg-primary animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}