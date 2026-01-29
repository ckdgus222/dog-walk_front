// 피드 게시물 Mock 데이터
export interface FeedPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    dogName: string;
  };
  content: string;
  images: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  tags: string[];
  createdAt: Date;
  location?: string;
}

export const FEED_POSTS: FeedPost[] = [
  {
    id: "post-1",
    author: {
      id: "user-2",
      name: "이영희",
      dogName: "뽀미",
    },
    content:
      "오늘 여의도 한강공원에서 산책했어요! 날씨가 정말 좋았네요 🌸 뽀미가 너무 신나서 뛰어다녔어요",
    images: [],
    likes: 24,
    comments: 5,
    isLiked: false,
    tags: ["한강산책", "포메라니안", "봄산책"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    location: "여의도 한강공원",
  },
  {
    id: "post-2",
    author: {
      id: "user-3",
      name: "박지훈",
      dogName: "맥스",
    },
    content:
      "맥스와 함께 서울숲 완주! 오늘도 열심히 걸었습니다 💪 산책 메이트 덕분에 더 즐거웠어요",
    images: [],
    likes: 45,
    comments: 12,
    isLiked: true,
    tags: ["서울숲", "래브라도", "운동"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    location: "서울숲",
  },
  {
    id: "post-3",
    author: {
      id: "user-4",
      name: "최수진",
      dogName: "콩이",
    },
    content:
      "콩이가 오늘 새로운 친구를 사귀었어요! 같이 뛰어노는 모습이 너무 귀여웠습니다 🐕",
    images: [],
    likes: 67,
    comments: 8,
    isLiked: false,
    tags: ["강아지친구", "비숑", "놀이"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    location: "반포 한강공원",
  },
  {
    id: "post-4",
    author: {
      id: "user-5",
      name: "정다운",
      dogName: "두부",
    },
    content: "아침 산책은 역시 최고! 두부도 오늘 기분이 좋은 것 같아요 ☀️",
    images: [],
    likes: 31,
    comments: 3,
    isLiked: false,
    tags: ["아침산책", "시바이누", "일상"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

export const POPULAR_TAGS = [
  { tag: "한강산책", count: 1234 },
  { tag: "서울숲", count: 892 },
  { tag: "아침산책", count: 756 },
  { tag: "강아지친구", count: 543 },
  { tag: "반려견일상", count: 421 },
];

export const RECOMMENDED_MATES = [
  { id: "user-6", name: "김하늘", dogName: "별이", dogBreed: "푸들" },
  { id: "user-7", name: "이준호", dogName: "바둑이", dogBreed: "진돗개" },
  { id: "user-8", name: "박서연", dogName: "모카", dogBreed: "코카 스파니엘" },
];
