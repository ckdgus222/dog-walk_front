"use client";

import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  fullWidth,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-dark)]",
    secondary:
      "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)]",
    ghost:
      "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]",
    outline:
      "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-light)] hover:text-[var(--color-text-primary)]",
  };

  const sizes = {
    sm: "min-h-9 px-3.5 text-xs",
    md: "min-h-11 px-4 text-sm",
    lg: "min-h-12 px-5 text-[15px]",
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
};

interface CardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export const Card = ({ className, children, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "overflow-hidden rounded-[20px] border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]",
        onClick &&
          "cursor-pointer transition-all duration-200 active:scale-[0.99] hover:border-[var(--color-border)] hover:shadow-[var(--shadow-md)]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }: CardProps) => {
  return (
    <div
      className={cn(
        "border-b border-[var(--color-border-light)] px-5 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children }: CardProps) => {
  return <div className={cn("p-5", className)}>{children}</div>;
};

interface BadgeProps {
  variant?: "default" | "secondary" | "outline" | "orange";
  className?: string;
  children: ReactNode;
}

export const Badge = ({
  variant = "default",
  className,
  children,
}: BadgeProps) => {
  const variants = {
    default: "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]",
    secondary:
      "bg-[var(--color-bg-subtle)] text-[var(--color-text-tertiary)]",
    outline:
      "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-tertiary)]",
    orange:
      "bg-[var(--color-primary-lighter)] text-[var(--color-primary-dark)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = ({
  leftIcon,
  className,
  fullWidth = true,
  ...props
}: InputProps) => {
  return (
    <div className={cn("relative", fullWidth && "w-full")}>
      {leftIcon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(
          "w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all",
          "focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[rgba(232,118,10,0.12)]",
          !!leftIcon && "pl-10",
          className,
        )}
        {...props}
      />
    </div>
  );
};

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar = ({
  src,
  alt = "",
  size = "md",
  className,
}: AvatarProps) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-subtle)]",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        </>
      ) : (
        <span className="text-sm font-bold text-[var(--color-text-tertiary)]">
          🐶
        </span>
      )}
    </div>
  );
};

interface PanelProps {
  title: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const Panel = ({
  title,
  rightSlot,
  className,
  children,
}: PanelProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border-light)] px-5 py-3.5">
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">
          {title}
        </h3>
        {rightSlot}
      </div>
      <div>{children}</div>
    </div>
  );
};

interface EmptyStateProps {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-3 text-4xl text-[var(--color-border)]">{icon}</div>
      <h3 className="mb-1 text-base font-bold text-[var(--color-text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="mb-5 text-sm text-[var(--color-text-tertiary)]">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[var(--color-bg-subtle)]",
        className,
      )}
    />
  );
};
