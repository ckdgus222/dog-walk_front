"use client";

import { Avatar, Button, EmptyState, Skeleton } from "@/components/ui";
import type { MyPageData } from "@/lib/api/mypage";
import { formatDate } from "@/lib/utils";
import { ChevronDown, ChevronUp, RefreshCw, Smile } from "lucide-react";

interface MyPageViewProps {
  data: MyPageData;
  showWalkHistory: boolean;
  onToggleWalkHistory: () => void;
  onEditProfile?: () => void;
}

interface MyPageErrorStateProps {
  onRetry: () => void;
}

const getMannerProgress = (mannerScore: number) =>
  `${Math.min(Math.max(mannerScore, 0), 100)}%`;

export const MyPageView = ({
  data,
  showWalkHistory,
  onToggleWalkHistory,
  onEditProfile,
}: MyPageViewProps) => {
  const {
    user,
    mannerTemperature,
    monthlyWalkActivity,
    mannerPraise,
    walkDistanceRecords,
  } = data;

  return (
    <>
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
              <span className="truncate">{user.neighborhood}</span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onEditProfile}
            className="bg-[#F1F3F5] h-8 px-3 rounded-lg text-xs font-bold"
          >
            프로필 수정
          </Button>
        </div>

        <div className="bg-[#F8F9FA] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#495057] flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-[#FF8A3D]" />
              매너온도
            </span>
            <span className="text-sm font-bold text-[#FF8A3D]">
              {mannerTemperature.score}°C
            </span>
          </div>
          <div className="w-full bg-[#DEE2E6] rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-[#FF8A3D] h-full rounded-full"
              style={{ width: getMannerProgress(mannerTemperature.score) }}
            />
          </div>
          <p className="text-[11px] text-[#ADB5BD] text-right">
            누적 평가 {mannerTemperature.totalEvaluations}개 기준
          </p>
        </div>
      </div>

      <div className="px-4 py-6 bg-white border-y border-[#F1F3F5] mb-2">
        <h3 className="text-sm font-bold text-[#212529] mb-4">
          이번 달 산책 활동
        </h3>
        <div className="flex divide-x divide-[#F1F3F5]">
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#212529]">
              {monthlyWalkActivity.walkCount}
            </p>
            <p className="text-[11px] text-[#868E96] mt-1">산책 횟수</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#212529]">
              {monthlyWalkActivity.mateCount}
            </p>
            <p className="text-[11px] text-[#868E96] mt-1">만난 메이트</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#212529]">
              {monthlyWalkActivity.totalDistanceKm}km
            </p>
            <p className="text-[11px] text-[#868E96] mt-1">산책 거리</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-y border-[#F1F3F5]">
        <div className="px-4 py-3 border-b border-[#F1F3F5] flex justify-between items-center bg-[#F8F9FA]/50">
          <h3 className="text-xs font-bold text-[#495057]">받은 매너 칭찬</h3>
        </div>
        <div className="p-4 space-y-2">
          {mannerPraise.map((praise) => (
            <div key={praise.type} className="flex items-center gap-2">
              <span className="text-base">{praise.icon}</span>
              <span className="text-sm text-[#495057]">{praise.label}</span>
              <span className="ml-auto text-xs font-bold text-[#FF8A3D] bg-[#FFF4E6] px-2 py-0.5 rounded-full">
                {praise.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 bg-white border-y border-[#F1F3F5] divide-y divide-[#F1F3F5]">
        <button
          onClick={onToggleWalkHistory}
          className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-[#F8F9FA]"
        >
          <span className="text-sm font-medium text-[#212529]">
            산책 기록 전체보기
          </span>
          {showWalkHistory ? (
            <ChevronUp className="w-4 h-4 text-[#ADB5BD]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#ADB5BD]" />
          )}
        </button>

        {showWalkHistory && (
          <div className="px-4 py-3">
            {walkDistanceRecords.length === 0 ? (
              <p className="text-sm text-[#868E96]">아직 산책 기록이 없습니다.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#868E96] border-b border-[#F1F3F5]">
                    <th className="py-2 font-medium">날짜</th>
                    <th className="py-2 font-medium text-right">산책 거리</th>
                  </tr>
                </thead>
                <tbody>
                  {walkDistanceRecords.map((record) => (
                    <tr key={record.id} className="border-b border-[#F8F9FA]">
                      <td className="py-3 text-[#495057]">
                        {formatDate(record.walkedAt)}
                      </td>
                      <td className="py-3 text-right font-semibold text-[#212529]">
                        {record.distanceKm}km
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export const MyPageLoadingState = () => {
  return (
    <div className="px-4 py-6 space-y-2">
      <div className="bg-white border border-[#F1F3F5] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>

      <div className="bg-white border border-[#F1F3F5] rounded-2xl p-5">
        <Skeleton className="h-3 w-28 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
};

export const MyPageErrorState = ({ onRetry }: MyPageErrorStateProps) => {
  return (
    <div className="px-4 py-10">
      <EmptyState
        icon={<RefreshCw className="w-10 h-10" />}
        title="마이페이지 정보를 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
        action={
          <Button variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        }
      />
    </div>
  );
};
