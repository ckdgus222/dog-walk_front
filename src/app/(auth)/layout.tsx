"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const animationClass =
    pathname === "/signup" ? "auth-route-enter-left" : "auth-route-enter-right";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-10 sm:px-6">
      <div key={pathname} className={`w-full max-w-md ${animationClass}`}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
