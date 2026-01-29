// 라우트 상수
export const ROUTES = {
  HOME: "/",
  MAP: "/map",
  FEED: "/feed",
  CHAT: "/chat",
  CHAT_ROOM: (roomId: string) => `/chat/${roomId}`,
  MYPAGE: "/mypage",
} as const;

export const NAV_ITEMS = [
  { href: ROUTES.MAP, label: "지도", icon: "Map" },
  { href: ROUTES.FEED, label: "피드", icon: "Newspaper" },
  { href: ROUTES.CHAT, label: "채팅", icon: "MessageCircle" },
  { href: ROUTES.MYPAGE, label: "마이", icon: "User" },
] as const;
