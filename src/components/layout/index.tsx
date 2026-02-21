"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Newspaper, MessageCircle, User, Bell, Search, Dog } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/routes";
import { InteractiveBackground } from "./InteractiveBackground";
import { Avatar } from "@/components/ui";

// ============ AppShell (Glass Modal Layout) ============
interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <>
      <InteractiveBackground />

      {/* 
         Overlay Wrapper 
         - Desktop: Center Modal 
         - Mobile: Full Screen 
      */}
      <div className="fixed inset-0 z-0 flex items-center justify-center p-0 lg:p-8 overflow-hidden">
        {/* Glass Container */}
        <div
          className="
            relative w-full h-full lg:max-w-[1600px] lg:h-[90vh] 
            bg-white/80 backdrop-blur-2xl 
            lg:rounded-[32px] lg:border lg:border-white/40 
            shadow-2xl overflow-hidden flex flex-col
            transition-all duration-500 ease-out
        "
        >
          {/* Top Navigation (Inside Glass) */}
          <GlassTopNav />

          {/* Main Content Area */}
          <main className="flex-1 w-full relative overflow-hidden flex flex-col">
            {/* Scrollable Content Wrapper */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-[calc(70px+env(safe-area-inset-bottom))] lg:pb-0 scroll-smooth">{children}</div>
          </main>

          {/* Mobile Bottom Navigation (Visible only on mobile) */}
          <div className="lg:hidden absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-white/20 pb-[env(safe-area-inset-bottom)] z-50">
            <MobileNav />
          </div>
        </div>
      </div>
    </>
  );
};

// ============ GlassTopNav ============
const GlassTopNav = () => {
  const pathname = usePathname();

  return (
    <header className="hidden lg:flex shrink-0 h-20 items-center justify-between px-8 border-b border-white/20 bg-white/40 backdrop-blur-sm z-50">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FF8A3D] to-[#FF6B6B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
          <Dog className="w-6 h-6" />
        </div>
        <span className="font-extrabold text-2xl text-[#2D3748] tracking-tight">
          Village<span className="text-[#FF8A3D]">Mate</span>
        </span>
      </div>

      {/* Center Menu */}
      <nav className="flex items-center gap-2 bg-white/50 px-2 py-1.5 rounded-full border border-white/40 shadow-sm backdrop-blur-md">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                isActive ? "bg-[#2D3748] text-white shadow-md transform scale-105" : "text-[#718096] hover:bg-white/60 hover:text-[#2D3748]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Options */}
      <div className="flex items-center gap-4">
        <div className="relative group hidden xl:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0] group-hover:text-[#FF8A3D] transition-colors" />
          <input
            type="text"
            placeholder="Search neighborhood..."
            className="pl-11 pr-4 py-2.5 bg-white/50 border border-white/40 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/20 focus:bg-white transition-all shadow-sm"
          />
        </div>
        <button className="p-2.5 text-[#4A5568] hover:bg-white/60 rounded-full transition-all relative group">
          <Bell className="w-5 h-5 group-hover:animate-swing" />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-[#FF4757] rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-gray-200 mx-1"></div>
        <button className="flex items-center gap-3 pl-1 pr-2 py-1 hover:bg-white/50 rounded-full transition-all">
          <Avatar size="sm" className="w-9 h-9 border-2 border-white shadow-sm" />
          <div className="text-left hidden xl:block">
            <p className="text-xs font-bold text-[#2D3748]">Golden Retriever</p>
            <p className="text-[10px] text-[#718096]">Premium Member</p>
          </div>
        </button>
      </div>
    </header>
  );
};

// ============ MobileNav ============
const MobileNav = () => {
  const pathname = usePathname();
  // Safe Icon Mapping
  const iconMap: Record<string, React.ElementType> = {
    Map,
    Newspaper,
    MessageCircle,
    User,
  };

  return (
    <div className="flex items-center justify-around h-16 px-4">
      {NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon] || Map;
        const isActive = pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center flex-1 h-full gap-1 active:scale-95 transition-transform",
              isActive ? "text-[#FF8A3D]" : "text-[#A0AEC0]",
            )}
          >
            {isActive && <span className="absolute -top-0.5 w-8 h-1 bg-[#FF8A3D] rounded-full shadow-[0_2px_8px_rgba(255,138,61,0.4)]" />}
            <Icon className={cn("w-6 h-6 transition-all", isActive && "transform -translate-y-0.5")} strokeWidth={isActive ? 2.5 : 2} />
            <span className={cn("text-[10px] transition-all", isActive ? "font-bold opacity-100" : "font-medium opacity-80")}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

// ============ Header Utils (Mobile Only) ============

export const LocationHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-[#F1F3F5] lg:hidden">
      <button className="flex items-center gap-1 font-bold text-lg text-[#2D3748]">
        역삼 1동
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
          className="mt-0.5 text-[#CBD5E0]"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <button className="p-2 text-[#2D3748]">
          <Bell className="w-6 h-6" />
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

export const PageHeader = ({ title, action, backButton }: PageHeaderProps) => {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#F1F3F5] h-14 flex items-center justify-between px-4 lg:hidden">
      <div className="flex items-center gap-3">
        {backButton && (
          <button onClick={() => window.history.back()} className="text-[#2D3748] p-1 -ml-1">
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
        <h1 className="font-bold text-lg text-[#2D3748]">{title}</h1>
      </div>
      {action}
    </div>
  );
};
