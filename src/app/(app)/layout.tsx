import type { ReactNode } from "react";
import { AppShell } from "@/components/layout";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <AppShell>{children}</AppShell>;
};

export default AppLayout;
