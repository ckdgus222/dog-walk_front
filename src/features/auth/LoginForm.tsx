"use client";

import Link from "next/link";
import { Dog } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { ROUTES } from "@/routes";

export const LoginForm = () => {
  return (
    <div className="flex flex-col">
      {/* Brand Header */}
      <div className="pt-10 pb-6 px-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#FF8A3D] to-[#FF6B6B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
          <Dog className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#2D3748] tracking-tight">
          Village<span className="text-[#FF8A3D]">Mate</span>
        </h1>
        <p className="text-sm text-[#868E96] mt-1">
          우리 동네 강아지 산책 메이트
        </p>
      </div>

      {/* Login Form */}
      <div className="px-8 pb-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
            이메일
          </label>
          <Input type="email" placeholder="example@email.com" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
            비밀번호
          </label>
          <Input type="password" placeholder="비밀번호를 입력해주세요" />
        </div>

        <Button fullWidth size="lg">
          로그인
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-[#E9ECEF]" />
          <span className="text-xs text-[#ADB5BD]">또는</span>
          <div className="flex-1 h-px bg-[#E9ECEF]" />
        </div>

        {/* Signup Link */}
        <div className="text-center">
          <p className="text-sm text-[#868E96]">
            아직 계정이 없으신가요?{" "}
            <Link
              href={ROUTES.SIGNUP}
              className="font-bold text-[#FF8A3D] hover:text-[#F2701D] transition-colors"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
