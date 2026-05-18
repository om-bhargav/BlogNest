import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const isLoggedIn = !!request.auth;

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith("/u");

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.rewrite(
      new URL("/not-found", request.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/u/:path*"],
};