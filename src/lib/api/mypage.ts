import { CURRENT_USER, WALK_HISTORY } from "@/lib/mock/user";

export type MyPageUser = {
  id: string;
  name: string;
  dogName: string;
  dogBreed: string;
  neighborhood: string;
};

export type MannerTemperature = {
  score: number;
  totalEvaluations: number;
};

export type MonthlyWalkActivity = {
  walkCount: number;
  mateCount: number;
  totalDistanceKm: number;
};

export type MannerPraiseType =
  | "on-time"
  | "kind-communication"
  | "dog-manner"
  | "walk-pace"
  | "reliable";

export type MannerPraise = {
  type: MannerPraiseType;
  icon: string;
  label: string;
  count: number;
};

export type WalkDistanceRecord = {
  id: string;
  walkedAt: Date;
  distanceKm: number;
};

export type MyPageData = {
  user: MyPageUser;
  mannerTemperature: MannerTemperature;
  monthlyWalkActivity: MonthlyWalkActivity;
  mannerPraise: MannerPraise[];
  walkDistanceRecords: WalkDistanceRecord[];
};

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

const isSameMonth = (date: Date, current: Date) =>
  date.getFullYear() === current.getFullYear() &&
  date.getMonth() === current.getMonth();

const toRoundedDistance = (distance: number) =>
  Math.round(distance * 10) / 10;


const buildMyPageData = (): MyPageData => {
  const now = new Date();
  const monthlyWalkRecords = WALK_HISTORY.filter((walk) =>
    isSameMonth(walk.date, now),
  );

  const monthlyDistanceKm = monthlyWalkRecords.reduce(
    (sum, walk) => sum + walk.distance,
    0,
  );
  const monthlyMateCount = new Set(monthlyWalkRecords.map((walk) => walk.mateName))
    .size;

  return {
    user: {
      id: CURRENT_USER.id,
      name: CURRENT_USER.name,
      dogName: CURRENT_USER.dogName,
      dogBreed: CURRENT_USER.dogBreed,
      neighborhood: "역삼 1동",
    },
    mannerTemperature: {
      score: CURRENT_USER.mannerScore,
      totalEvaluations: DEFAULT_MANNER_PRAISE.reduce(
        (sum, praise) => sum + praise.count,
        0,
      ),
    },
    monthlyWalkActivity: {
      walkCount: monthlyWalkRecords.length,
      mateCount: monthlyMateCount,
      totalDistanceKm: toRoundedDistance(monthlyDistanceKm),
    },
    mannerPraise: DEFAULT_MANNER_PRAISE,
    walkDistanceRecords: WALK_HISTORY.map((walk) => ({
      id: walk.id,
      walkedAt: walk.date,
      distanceKm: toRoundedDistance(walk.distance),
    })),
  };
};

export const myPageApi = {
  getMyPage: async (): Promise<MyPageData> => buildMyPageData(),
};
