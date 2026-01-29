// 현재 사용자 프로필 Mock 데이터
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  dogName: string;
  dogBreed: string;
  dogAge: number;
  dogSize: "small" | "medium" | "large";
  totalWalks: number;
  totalMates: number;
  mannerScore: number;
}

export const CURRENT_USER: UserProfile = {
  id: "user-1",
  name: "김민수",
  bio: "매일 아침 한강 산책을 즐기는 골든 리트리버 집사입니다 🌅",
  dogName: "초코",
  dogBreed: "골든 리트리버",
  dogAge: 3,
  dogSize: "large",
  totalWalks: 127,
  totalMates: 23,
  mannerScore: 36.5,
};

export interface WalkHistory {
  id: string;
  date: Date;
  duration: number; // minutes
  distance: number; // km
  mateName: string;
  location: string;
}

export const WALK_HISTORY: WalkHistory[] = [
  {
    id: "walk-1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    duration: 45,
    distance: 2.3,
    mateName: "이영희",
    location: "여의도 한강공원",
  },
  {
    id: "walk-2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    duration: 60,
    distance: 3.1,
    mateName: "박지훈",
    location: "서울숲",
  },
  {
    id: "walk-3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    duration: 35,
    distance: 1.8,
    mateName: "최수진",
    location: "반포 한강공원",
  },
  {
    id: "walk-4",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    duration: 50,
    distance: 2.5,
    mateName: "정다운",
    location: "올림픽공원",
  },
];
