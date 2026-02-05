"use client";

import { InteractiveBackground } from "@/components/layout/InteractiveBackground";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <InteractiveBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;