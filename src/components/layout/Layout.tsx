import { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
