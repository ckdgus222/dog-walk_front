"use client";

import { PageHeader } from "@/components/layout";
import { Card, Avatar, Badge, Button } from "@/components/ui";
import { CURRENT_USER, WALK_HISTORY } from "@/lib/mock/user";
import { formatDate } from "@/lib/utils";
import { Settings, ChevronRight, Award, Smile } from "lucide-react";

export default function MyPage() {
  const user = CURRENT_USER;

  return (
    <div className="bg-[#F8F9FA] min-h-full pb-20">
      <PageHeader
        title="나의 산책"
        action={
          <button className="p-2 text-[#212529]">
            <Settings className="w-5 h-5" />
          </button>
        }
      />

      {/* 1. Profile Section (Business Card Style) */}
      <div className="px-4 py-6 bg-white border-b border-[#F1F3F5] mb-2">
        <div className="flex items-center gap-4 mb-4">
          <Avatar size="xl" className="w-16 h-16 border border-[#E9ECEF]" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[#212529] mb-1">
              {user.name}
            </h2>
            <div className="flex items-center text-xs text-[#868E96]">
              <span className="truncate">
                {user.dogName} ({user.dogBreed})
              </span>
              <span className="mx-1">·</span>
              <span className="truncate">역삼 1동</span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#F1F3F5] h-8 px-3 rounded-lg text-xs font-bold"
          >
            프로필 수정
          </Button>
        </div>

        {/* Manner Temp Bar */}
        <div className="bg-[#F8F9FA] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#495057] flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-[#FF8A3D]" />
              매너온도
            </span>
            <span className="text-sm font-bold text-[#FF8A3D]">
              {user.mannerScore}°C
            </span>
          </div>
          <div className="w-full bg-[#DEE2E6] rounded-full h-2 overflow-hidden mb-2">
            <div className="bg-[#FF8A3D] h-full rounded-full w-[36.5%]" />
          </div>
          <p className="text-[11px] text-[#ADB5BD] text-right">
            첫 온도 36.5°C에서 시작해요
          </p>
        </div>
      </div>

      {/* 2. Walk Stats (Simple Grid) */}
      <div className="px-4 py-6 bg-white border-y border-[#F1F3F5] mb-2">
        <h3 className="text-sm font-bold text-[#212529] mb-4">
          이번 달 산책 활동
        </h3>
        <div className="flex divide-x divide-[#F1F3F5]">
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#212529]">
              {user.totalWalks}
            </p>
            <p className="text-[11px] text-[#868E96] mt-1">산책 횟수</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#212529]">
              {user.totalMates}
            </p>
            <p className="text-[11px] text-[#868E96] mt-1">만난 메이트</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#212529]">12.5km</p>
            <p className="text-[11px] text-[#868E96] mt-1">산책 거리</p>
          </div>
        </div>
      </div>

      {/* 3. Recent History Menu Style */}
      <div className="bg-white border-y border-[#F1F3F5]">
        <div className="px-4 py-3 border-b border-[#F1F3F5] flex justify-between items-center bg-[#F8F9FA]/50">
          <h3 className="text-xs font-bold text-[#495057]">받은 매너 칭찬</h3>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base">⏰</span>
            <span className="text-sm text-[#495057]">
              시간 약속을 잘 지켜요
            </span>
            <span className="ml-auto text-xs font-bold text-[#FF8A3D] bg-[#FFF4E6] px-2 py-0.5 rounded-full">
              12
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🐕</span>
            <span className="text-sm text-[#495057]">강아지가 매너 있어요</span>
            <span className="ml-auto text-xs font-bold text-[#FF8A3D] bg-[#FFF4E6] px-2 py-0.5 rounded-full">
              8
            </span>
          </div>
        </div>
      </div>

      {/* 4. Menu Links */}
      <div className="mt-2 bg-white border-y border-[#F1F3F5] divide-y divide-[#F1F3F5]">
        <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-[#F8F9FA]">
          <span className="text-sm font-medium text-[#212529]">
            산책 기록 전체보기
          </span>
          <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
        </button>
        <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-[#F8F9FA]">
          <span className="text-sm font-medium text-[#212529]">관심 목록</span>
          <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
        </button>
        <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-[#F8F9FA]">
          <span className="text-sm font-medium text-[#212529]">
            동네 생활 설정
          </span>
          <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
        </button>
      </div>
    </div>
  );
}
