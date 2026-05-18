"use client";
import React, { Suspense } from "react";
import PanelLayout from "@/components/panel/panel-layout";
export default function layout({ children }: React.PropsWithChildren) {
  return <PanelLayout>{children}</PanelLayout>;
}
