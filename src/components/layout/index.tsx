"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Map,
  MessageCircle,
  Newspaper,
  PawPrint,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/routes";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <DesktopHeader />

      <main className="min-h-screen overflow-hidden pb-[var(--bottom-nav-height)] md:pb-0 md:pt-[var(--header-height)]">
        <div className="h-full">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
};

const DesktopHeader = () => {
  const pathname = usePathname();

  return (
    <header
      className="fixed inset-x-0 top-0 hidden border-b border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] md:block"
      style={{ zIndex: "var(--z-sticky)", height: "var(--header-height)" }}
    >
      <div className="mx-auto flex h-full max-w-[var(--max-content-width)] items-center justify-between px-6">
        <Link href="/map" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white transition-transform group-hover:scale-105">
            <PawPrint className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-[-0.01em] text-[var(--color-text-primary)]">
            산책메이트
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-primary-lighter)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--color-primary)]" />
          </button>

          <Link
            href="/mypage"
            className="overflow-hidden rounded-full ring-2 ring-[var(--color-border-light)] transition-all hover:ring-[var(--color-primary-light)]"
          >
            <Avatar
              size="sm"
              className="h-8 w-8 border-transparent"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

const MobileNav = () => {
  const pathname = usePathname();
  const iconMap: Record<string, React.ElementType> = {
    Map,
    Newspaper,
    MessageCircle,
    User,
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 border-t border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] md:hidden"
      style={{ zIndex: "var(--z-sticky)", height: "var(--bottom-nav-height)" }}
    >
      <div className="flex h-full items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] || Map;
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-tertiary)]",
              )}
            >
              <Icon
                className={cn("h-5 w-5 transition-transform", isActive && "scale-105")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const LocationHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] px-4 md:hidden">
      <button className="flex items-center gap-1 text-lg font-bold text-[var(--color-text-primary)]">
        역삼1동
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 text-[var(--color-text-tertiary)]"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <button className="rounded-xl p-2 text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-subtle)]">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  backButton?: boolean;
}

export const PageHeader = ({
  title,
  action,
  backButton,
}: PageHeaderProps) => {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] px-4 md:hidden">
      <div className="flex items-center gap-3">
        {backButton && (
          <button
            onClick={() => window.history.back()}
            className="-ml-1 rounded-lg p-1 text-[var(--color-text-primary)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
};
