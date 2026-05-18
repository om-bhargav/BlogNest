"use client";
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
      </div>

      {/* Floating Shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[20%] h-12 w-12 rounded-2xl border border-border bg-card/40 backdrop-blur-md animate-bounce" />
        <div className="absolute right-[18%] top-[30%] h-16 w-16 rounded-full border border-border bg-card/40 backdrop-blur-md animate-pulse" />
        <div className="absolute bottom-[18%] left-[20%] h-10 w-10 rotate-12 rounded-xl border border-border bg-card/40 backdrop-blur-md animate-spin [animation-duration:12s]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* 404 */}
        <div className="relative inline-flex items-center justify-center">
          <h1 className="select-none text-[7rem] font-black leading-none tracking-tight text-transparent bg-gradient-to-b from-foreground to-foreground/20 bg-clip-text sm:text-[10rem] md:text-[13rem]">
            404
          </h1>

          {/* Orbiting Dot */}
          <div className="absolute h-full w-full animate-spin [animation-duration:10s]">
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary/50" />
          </div>
        </div>

        {/* Content Card */}
        <div className="mt-6 rounded-3xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sorry, nothing’s here.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            The page you are looking for may have been moved, deleted,
            or never existed in the first place.
          </p>

          {/* Interactive Illustration */}
          <div className="group relative mx-auto mt-8 flex h-44 w-44 items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-spin [animation-duration:18s]" />

            {/* Middle Ring */}
            <div className="absolute inset-5 rounded-full border border-primary/20 group-hover:scale-110 transition-transform duration-500" />

            {/* Core */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-5xl shadow-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              🚀
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] hover:shadow-primary/30"
            >
              Go Home
            </a>

            <button
              onClick={() => window.history.back()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background/80 px-6 text-sm font-medium text-foreground transition-all hover:bg-accent"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
