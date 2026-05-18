"use client";

import { UserContext, type AuthUser } from "@/context/UserContext";

import { useSession } from "next-auth/react";

import React, { useEffect, useState } from "react";
import FullPageLoader from "./FullPageLoader";
import FullPageError from "./ShowError";

export default function SessionWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { login, logout, setFollowers, setFollowing } = UserContext();

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated") {
        try {
          setError("");
          setLoading(true);
          const request = await fetch("/api/user/me");

          const response = await request.json();
          const registerView = await fetch("/api/log-traffic",{method:"POST"});
          if (!response.success) {
            throw Error(response.message);
          } else {
            const { followers, following, ...user } = response.data;
            login(user as AuthUser);
            setFollowing(following);
            setFollowers(followers);
          }
        } catch (error: any) {
          setError(error.message);
          logout();
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      }

      if (status === "unauthenticated") {
        logout();
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchData();
  }, [status]);

  if (status === "loading" || loading) {
    return <FullPageLoader />;
  } else if (error) {
    return <FullPageError description={error} />;
  }

  return children;
}
