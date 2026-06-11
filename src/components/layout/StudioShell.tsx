import { ReactNode } from "react";
import { LeftNav } from "./LeftNav";
import { TopCommandBar } from "./TopCommandBar";
import { Breadcrumbs } from "./Breadcrumbs";

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div className="premium-theme min-h-screen bg-[#03110f] text-[#f8f0df]">
      <LeftNav />
      <div className="min-h-screen lg:pl-80">
        <TopCommandBar />
        <Breadcrumbs />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
