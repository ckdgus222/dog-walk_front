// 지도 마커 및 프로필 Mock 데이터
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  dogName: string;
  dogBreed: string;
  dogSize: "small" | "medium" | "large";
  walkStyle: "active" | "slow" | "training";
  avatar?: string;
  preferredTime: "morning" | "afternoon" | "evening";
  bio: string;
  mannerScore: number;
  lastActive: Date;
}

export const MAP_MARKERS: MapMarker[] = [
  {
    id: "marker-1",
    lat: 37.5285,
    lng: 126.9327,
    name: "이영희",
    dogName: "뽀미",
    dogBreed: "포메라니안",
    dogSize: "small",
    walkStyle: "slow",
    preferredTime: "morning",
    bio: "소형견과 함께 여유로운 산책을 좋아해요",
    mannerScore: 38.2,
    lastActive: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "marker-2",
    lat: 37.5245,
    lng: 126.9355,
    name: "박지훈",
    dogName: "맥스",
    dogBreed: "래브라도 리트리버",
    dogSize: "large",
    walkStyle: "active",
    preferredTime: "evening",
    bio: "활발한 산책 메이트를 찾고 있습니다! 🏃‍♂️",
    mannerScore: 36.8,
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "marker-3",
    lat: 37.5312,
    lng: 126.9298,
    name: "최수진",
    dogName: "콩이",
    dogBreed: "비숑 프리제",
    dogSize: "small",
    walkStyle: "training",
    preferredTime: "afternoon",
    bio: "강아지 훈련에 관심 있어요. 같이 배워요!",
    mannerScore: 37.5,
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "marker-4",
    lat: 37.5268,
    lng: 126.9402,
    name: "정다운",
    dogName: "두부",
    dogBreed: "시바 이누",
    dogSize: "medium",
    walkStyle: "slow",
    preferredTime: "morning",
    bio: "아침 산책 메이트 구해요 ☀️",
    mannerScore: 39.1,
    lastActive: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "marker-5",
    lat: 37.5298,
    lng: 126.9372,
    name: "한소희",
    dogName: "루이",
    dogBreed: "말티즈",
    dogSize: "small",
    walkStyle: "active",
    preferredTime: "evening",
    bio: "작지만 활발한 루이와 함께해요!",
    mannerScore: 35.9,
    lastActive: new Date(Date.now() - 1000 * 60 * 120),
  },
];

export const DOG_SIZES = [
  { value: "small", label: "소형견" },
  { value: "medium", label: "중형견" },
  { value: "large", label: "대형견" },
] as const;

export const WALK_STYLES = [
  { value: "active", label: "활발한 산책" },
  { value: "slow", label: "여유로운 산책" },
  { value: "training", label: "훈련 산책" },
] as const;

export const PREFERRED_TIMES = [
  { value: "morning", label: "오전" },
  { value: "afternoon", label: "오후" },
  { value: "evening", label: "저녁" },
] as const;

export interface Filters {
  dogSizes: string[];
  walkStyles: string[];
  preferredTimes: string[];
}
