import { AppShell } from "@/components/layout";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppShell>{children}</AppShell>;
};

export default AppLayout;
