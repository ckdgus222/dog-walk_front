"use client";

import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

// ============ Button ============
/* Village Mate: 둥글고 친근한 버튼 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  fullWidth,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#FF8A3D] text-white hover:bg-[#F2701D] shadow-sm", // Soft Orange
    secondary: "bg-[#E9ECEF] text-[#495057] hover:bg-[#DEE2E6]", // Light Gray
    ghost: "bg-transparent text-[#495057] hover:bg-[#F1F3F5]",
    outline:
      "bg-white border border-[#CED4DA] text-[#495057] hover:bg-[#F8F9FA]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ============ Card ============
/* Village Mate: Clean White Card */
interface CardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function Card({ className, children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-[#F1F3F5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden",
        onClick && "cursor-pointer active:bg-gray-50 transition-colors",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn("px-5 py-4 border-b border-[#F1F3F5]", className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

// ============ Chips / Badge ============
/* Village Mate: Soft Tags */
interface BadgeProps {
  variant?: "default" | "secondary" | "outline" | "orange";
  className?: string;
  children: ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  const variants = {
    default: "bg-[#F1F3F5] text-[#495057]",
    secondary: "bg-[#F8F9FA] text-[#868E96]",
    outline: "bg-white border border-[#DEE2E6] text-[#868E96]",
    orange: "bg-[#FFF4E6] text-[#FF8A3D]", // Very light orange background
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ============ Input ============
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Input({
  leftIcon,
  className,
  fullWidth = true,
  ...props
}: InputProps) {
  return (
    <div className={cn("relative", fullWidth && "w-full")}>
      {leftIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(
          "w-full rounded-xl bg-[#F8F9FA] px-4 py-3 text-sm text-[#495057] placeholder:text-[#ADB5BD]",
          "focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/20 transition-all",
          !!leftIcon && "pl-11",
          className,
        )}
        {...props}
      />
    </div>
  );
}

// ============ Avatar ============
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, alt = "", size = "md", className }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden bg-[#F1F3F5] flex items-center justify-center shrink-0 border border-[#DEE2E6]",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[#ADB5BD] font-bold text-sm">🐶</span>
      )}
    </div>
  );
}

// ============ Panel ============
export function Panel({ title, rightSlot, className, children }: any) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#F1F3F5] overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
        <h3 className="font-bold text-[#343A40] text-base">{title}</h3>
        {rightSlot}
      </div>
      <div className="p-0">{children}</div>
    </div>
  );
}

// ============ EmptyState ============
export function EmptyState({ icon, title, description, action }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-[#DEE2E6] mb-3 text-4xl">{icon}</div>
      <h3 className="text-base font-bold text-[#495057] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#ADB5BD] mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}

// ============ Skeleton ============
export function Skeleton({ className }: any) {
  return (
    <div className={cn("animate-pulse bg-[#F1F3F5] rounded-lg", className)} />
  );
}
