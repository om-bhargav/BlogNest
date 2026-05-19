"use client";

import { ReactNode, useState } from "react";
import { signOut } from "next-auth/react";
import { UserContext } from "@/context/UserContext";
import PanelTopbar from "./panel-topbar";
import PanelSidebar from "./panel-sidebar";
import MobileSidebar from "./mobile-sidebar";
import { useRouter } from "next/navigation";
type Props = {
  children: ReactNode;
};

export default function PanelLayout({ children }: Props) {
  const [open, setOpen] = useState(false);

  const { user, logout: removeUser } = UserContext();

  const role = user?.role ?? "USER";
  const name = user?.name ?? "User";
  const router = useRouter();
  const logout = async () => {
    await signOut({
      redirect: false,
    });
    removeUser();
    router.push("/");
  };

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Sticky Topbar */}
      <div className="sticky top-0 z-50">
        <PanelTopbar role={role} name={name} setOpen={setOpen} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:grid">
          <div className="sticky top-14 h-[calc(100vh-56px)]">
            <PanelSidebar role={role} name={name} logout={logout} />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <MobileSidebar
          open={open}
          setOpen={setOpen}
          role={role}
          name={name}
          logout={logout}
        />

        <main className="flex flex-1 h-full md:p-3 p-2">
          <div className="flex-1 min-h-full overflow-y-auto rounded-4xl md:border md:bg-background/20 md:p-4 md:shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
