"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, PawPrint } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/routes";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
          <PawPrint className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
          산책메이트
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
          우리 동네 강아지 산책 친구 찾기
        </p>
      </div>

      <form className="mt-10 space-y-3">
        <Input
          type="email"
          placeholder="이메일"
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            leftIcon={<Lock className="h-4 w-4" />}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <Button fullWidth size="lg" className="mt-2">
          로그인
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-text-tertiary)]">또는</span>
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <div className="space-y-2.5">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[#FEE500] py-3 text-sm font-semibold text-[#191919] transition-all hover:brightness-95">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.09 3.63 5.18l-.93 3.41c-.08.29.25.52.49.34l4.07-2.68c.24.02.49.04.74.04 4.42 0 8-2.79 8-6.21S13.42 1 9 1z"
              fill="#191919"
            />
          </svg>
          카카오로 시작하기
        </button>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-bg-subtle)]">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Google로 시작하기
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--color-text-tertiary)]">
        아직 계정이 없으신가요?{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="font-semibold text-[var(--color-primary)] hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
};
