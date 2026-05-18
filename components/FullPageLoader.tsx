import React from "react";
import Loader from "./loader-15";

export default function FullPageLoader() {
  return (
    <div className="fixed h-screen inset-0 z-[9999] flex items-center justify-center bg-background">
      <Loader />
    </div>
  );
}
