"use client";

// 공통 UI 컴포넌트: 프로필/버튼/빈상태/스켈레톤을 재사용한다.
import { Avatar, Button, EmptyState, Skeleton } from "@/components/ui";
// 화면이 기대하는 MyPage 데이터 타입.
import type { MyPageData } from "@/lib/api/mypage";
// 날짜를 사람이 읽기 쉬운 문자열로 변환하는 유틸.
import { formatDate } from "@/lib/utils";
// 아이콘 세트.
import { ChevronDown, ChevronUp, RefreshCw, Smile } from "lucide-react";

// 메인 MyPage 화면 컴포넌트의 props.
interface MyPageViewProps {
  // API에서 받은 전체 데이터.
  data: MyPageData;
  // 산책 기록 테이블 펼침/접힘 상태.
  showWalkHistory: boolean;
  // 산책 기록 토글 버튼 클릭 핸들러.
  onToggleWalkHistory: () => void;
  // 프로필 수정 버튼 클릭 핸들러(현재 선택).
  onEditProfile?: () => void;
}

// 에러 상태 컴포넌트의 props.
interface MyPageErrorStateProps {
  // "다시 시도" 버튼 클릭 시 호출될 함수.
  onRetry: () => void;
}

// 매너온도 바 너비 계산 헬퍼.
// 0~100 사이로 강제해서 이상값이 와도 UI가 깨지지 않게 방어한다.
const getMannerProgress = (mannerScore: number) =>
  `${Math.min(Math.max(mannerScore, 0), 100)}%`;

// MyPage 실제 화면 렌더링 컴포넌트.
export const MyPageView = ({
  data,
  showWalkHistory,
  onToggleWalkHistory,
  onEditProfile,
}: MyPageViewProps) => {
  // 화면에서 자주 쓰는 필드를 구조분해해 가독성을 높인다.
  const {
    user,
    mannerTemperature,
    monthlyWalkActivity,
    mannerPraise,
    walkDistanceRecords,
  } = data;

  return (
    <>
      {/* 1) 프로필 + 매너온도 카드 */}
      <div className="px-4 py-6 bg-white border-b border-[#F1F3F5] mb-2">
        <div className="flex items-center gap-4 mb-4">
          {/* 사용자 프로필 이미지(현재는 기본 아바타) */}
          <Avatar size="xl" className="w-16 h-16 border border-[#E9ECEF]" />
          <div className="flex-1 min-w-0">
            {/* 사용자 이름 */}
            <h2 className="text-lg font-bold text-[#212529] mb-1">
              {user.name}
            </h2>
            {/* 강아지 정보 + 활동 동네 */}
            <div className="flex items-center text-xs text-[#868E96]">
              <span className="truncate">
                {user.dogName} ({user.dogBreed})
              </span>
              <span className="mx-1">·</span>
              <span className="truncate">{user.neighborhood}</span>
            </div>
          </div>
          {/* 프로필 수정 CTA (핸들러가 아직 없으면 클릭해도 동작 없음) */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onEditProfile}
            className="bg-[#F1F3F5] h-8 px-3 rounded-lg text-xs font-bold"
          >
            프로필 수정
          </Button>
        </div>

        {/* 매너온도 시각화 영역 */}
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
          {/* 온도 게이지 바 */}
          <div className="w-full bg-[#DEE2E6] rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-[#FF8A3D] h-full rounded-full"
              // 점수에 비례해 너비를 동적으로 계산.
              style={{ width: getMannerProgress(mannerTemperature.score) }}
            />
          </div>
          {/* 누적 평가 수 표시 */}
          <p className="text-[11px] text-[#ADB5BD] text-right">
            누적 평가 {mannerTemperature.totalEvaluations}개 기준
          </p>
        </div>
      </div>

      {/* 2) 이번 달 활동 요약 카드 */}
      <div className="px-4 py-6 bg-white border-y border-[#F1F3F5] mb-2">
        <h3 className="text-sm font-bold text-[#212529] mb-4">
          이번 달 산책 활동
        </h3>
        {/* 3개 지표(횟수/메이트/거리)를 동일한 레이아웃으로 표시 */}
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

      {/* 3) 받은 매너 칭찬 목록 */}
      <div className="bg-white border-y border-[#F1F3F5]">
        <div className="px-4 py-3 border-b border-[#F1F3F5] flex justify-between items-center bg-[#F8F9FA]/50">
          <h3 className="text-xs font-bold text-[#495057]">받은 매너 칭찬</h3>
        </div>
        {/* 칭찬 종류를 배열 순회로 렌더링 */}
        <div className="p-4 space-y-2">
          {mannerPraise.map((praise) => (
            // key는 type 고정값을 사용해 렌더 안정성 확보.
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

      {/* 4) 산책 기록 펼침 섹션 */}
      <div className="mt-2 bg-white border-y border-[#F1F3F5] divide-y divide-[#F1F3F5]">
        <button
          // 부모에서 내려준 토글 핸들러 호출.
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

        {/* showWalkHistory가 true일 때만 테이블 렌더 */}
        {showWalkHistory && (
          <div className="px-4 py-3">
            {walkDistanceRecords.length === 0 ? (
              // 기록이 없을 때 빈 문구
              <p className="text-sm text-[#868E96]">아직 산책 기록이 없습니다.</p>
            ) : (
              // 거리 기록 표
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#868E96] border-b border-[#F1F3F5]">
                    <th className="py-2 font-medium">날짜</th>
                    <th className="py-2 font-medium text-right">산책 거리</th>
                  </tr>
                </thead>
                <tbody>
                  {walkDistanceRecords.map((record) => (
                    // 각 기록을 날짜/거리 한 줄로 출력
                    <tr key={record.id} className="border-b border-[#F8F9FA]">
                      <td className="py-3 text-[#495057]">
                        {/* Date 객체를 한국 날짜 형식으로 포맷 */}
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

// 데이터 로딩 중에 보여주는 스켈레톤 UI.
export const MyPageLoadingState = () => {
  return (
    <div className="px-4 py-6 space-y-2">
      {/* 상단 프로필 카드 스켈레톤 */}
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

      {/* 월간 활동 카드 스켈레톤 */}
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

// API 실패 시 보여주는 에러 상태 UI.
export const MyPageErrorState = ({ onRetry }: MyPageErrorStateProps) => {
  return (
    <div className="px-4 py-10">
      <EmptyState
        // 새로고침 의미의 아이콘
        icon={<RefreshCw className="w-10 h-10" />}
        // 사용자 안내 문구
        title="마이페이지 정보를 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
        action={
          // 재시도 버튼: 부모에서 받은 핸들러 호출
          <Button variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        }
      />
    </div>
  );
};
