// 현재는 백엔드 연동 전 단계이므로 mock 데이터를 가져온다.
// 이후 실 API로 바꿀 때는 import를 지우고 apiFetch 기반 호출로 교체하면 된다.
import { CURRENT_USER, WALK_HISTORY } from "@/lib/mock/user";

// MyPage 상단 프로필 카드에서 직접 사용하는 사용자 정보 타입.
export type MyPageUser = {
  // 사용자 고유 ID (나중에 수정/조회 API에서 키로 사용)
  id: string;
  // 화면에 표시할 닉네임
  name: string;
  // 강아지 이름
  dogName: string;
  // 강아지 품종
  dogBreed: string;
  // 활동 동네(텍스트)
  neighborhood: string;
};

// 매너온도 섹션 타입.
export type MannerTemperature = {
  // 현재 매너온도 점수
  score: number;
  // 총 평가 수(신뢰도 용도)
  totalEvaluations: number;
};

// "이번 달 산책 활동" 카드 타입.
export type MonthlyWalkActivity = {
  // 이번 달 산책 횟수
  walkCount: number;
  // 이번 달 만난 고유 메이트 수
  mateCount: number;
  // 이번 달 누적 거리(km)
  totalDistanceKm: number;
};

// 받은 칭찬의 종류를 고정값으로 관리해 오타/불일치를 막는다.
export type MannerPraiseType =
  | "on-time"
  | "kind-communication"
  | "dog-manner"
  | "walk-pace"
  | "reliable";

// 받은 매너 칭찬 한 항목의 타입.
export type MannerPraise = {
  // 칭찬 종류(서버/프론트 공통 키)
  type: MannerPraiseType;
  // UI 표시용 아이콘 문자
  icon: string;
  // UI 표시용 라벨
  label: string;
  // 해당 칭찬 누적 횟수
  count: number;
};

// "산책 기록 전체보기" 테이블 한 줄 타입.
export type WalkDistanceRecord = {
  // 기록 고유 ID
  id: string;
  // 산책 날짜/시간
  walkedAt: Date;
  // 산책 거리(km)
  distanceKm: number;
};

// MyPage 화면이 한 번에 받는 전체 데이터 타입.
export type MyPageData = {
  // 프로필 영역 데이터
  user: MyPageUser;
  // 매너온도 영역 데이터
  mannerTemperature: MannerTemperature;
  // 월간 활동 요약 데이터
  monthlyWalkActivity: MonthlyWalkActivity;
  // 받은 매너 칭찬 목록
  mannerPraise: MannerPraise[];
  // 산책 거리 기록 목록
  walkDistanceRecords: WalkDistanceRecord[];
};

// 현재는 임시 고정 데이터.
// 서버 연동 시에는 백엔드 응답으로 교체하면 된다.
const DEFAULT_MANNER_PRAISE: MannerPraise[] = [
  { type: "on-time", icon: "⏰", label: "시간 약속을 잘 지켜요", count: 12 },
  {
    type: "kind-communication",
    icon: "💬",
    label: "대화가 친절하고 편해요",
    count: 9,
  },
  { type: "dog-manner", icon: "🐕", label: "강아지가 매너 있어요", count: 8 },
  { type: "walk-pace", icon: "🚶", label: "산책 페이스가 잘 맞아요", count: 7 },
  { type: "reliable", icon: "🤝", label: "약속 이행이 확실해요", count: 6 },
];

// 같은 월인지 비교하는 헬퍼.
// 월간 통계 계산에서 "이번 달 기록만" 걸러낼 때 사용한다.
const isSameMonth = (date: Date, current: Date) =>
  date.getFullYear() === current.getFullYear() &&
  date.getMonth() === current.getMonth();

// 거리 표기를 소수점 1자리로 통일하기 위한 헬퍼.
const toRoundedDistance = (distance: number) =>
  Math.round(distance * 10) / 10;

// MyPage가 필요로 하는 데이터를 mock에서 조합해 생성하는 함수.
// 나중에 실 API 연동 시 이 함수 대신 네트워크 응답 매핑으로 바꾸면 된다.
const buildMyPageData = (): MyPageData => {
  // 기준 시각(현재 시점)
  const now = new Date();
  // 전체 산책 기록 중 "이번 달" 데이터만 남긴다.
  const monthlyWalkRecords = WALK_HISTORY.filter((walk) =>
    isSameMonth(walk.date, now),
  );

  // 이번 달 총 산책 거리 합계.
  const monthlyDistanceKm = monthlyWalkRecords.reduce(
    (sum, walk) => sum + walk.distance,
    0,
  );
  // 같은 사람과 여러 번 걸어도 1명으로 계산하기 위해 Set 사용.
  const monthlyMateCount = new Set(monthlyWalkRecords.map((walk) => walk.mateName))
    .size;

  // 화면에서 바로 쓸 수 있는 최종 구조로 반환.
  return {
    // 사용자 프로필 정보 매핑.
    user: {
      id: CURRENT_USER.id,
      name: CURRENT_USER.name,
      dogName: CURRENT_USER.dogName,
      dogBreed: CURRENT_USER.dogBreed,
      // 동네 정보는 mock 데이터에 없어서 현재는 고정값 사용.
      neighborhood: "역삼 1동",
    },
    // 매너온도 영역 데이터 매핑.
    mannerTemperature: {
      score: CURRENT_USER.mannerScore,
      // 임시로 칭찬 총합을 평가 수처럼 사용.
      // 실 API 연동 시 백엔드의 실제 평가 수 필드로 교체 권장.
      totalEvaluations: DEFAULT_MANNER_PRAISE.reduce(
        (sum, praise) => sum + praise.count,
        0,
      ),
    },
    // 월간 활동 요약 매핑.
    monthlyWalkActivity: {
      walkCount: monthlyWalkRecords.length,
      mateCount: monthlyMateCount,
      totalDistanceKm: toRoundedDistance(monthlyDistanceKm),
    },
    // 칭찬 목록 그대로 전달.
    mannerPraise: DEFAULT_MANNER_PRAISE,
    // 전체 산책 기록을 거리 기록 테이블용 형태로 변환.
    walkDistanceRecords: WALK_HISTORY.map((walk) => ({
      id: walk.id,
      walkedAt: walk.date,
      distanceKm: toRoundedDistance(walk.distance),
    })),
  };
};

// MyPage 도메인 API 모듈.
// 지금은 mock 조합 반환, 실서비스에서는 백엔드 호출로 교체 예정.
export const myPageApi = {
  // 화면에서 호출하는 단일 진입점.
  // Promise 형태를 유지해두면 나중에 fetch로 바꿔도 호출부 변경이 거의 없다.
  getMyPage: async (): Promise<MyPageData> => buildMyPageData(),
};
