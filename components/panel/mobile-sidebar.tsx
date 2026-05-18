"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

import PanelSidebar from "./panel-sidebar";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  role: string;
  name: string;
  logout: () => void;
};

export default function MobileSidebar({
  open,
  setOpen,
  role,
  name,
  logout,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="p-0 w-64">
        <SheetTitle/>
        <PanelSidebar
          role={role}
          name={name}
          logout={logout}
        />
      </SheetContent>
    </Sheet>
  );
}