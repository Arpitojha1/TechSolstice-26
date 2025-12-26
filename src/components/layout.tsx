import { TechSolsticeNavbar } from "./navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <TechSolsticeNavbar />
      <main>{children}</main>
    </div>
  );
}
