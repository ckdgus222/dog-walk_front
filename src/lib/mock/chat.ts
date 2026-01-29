// 채팅 Mock 데이터
export interface ChatRoom {
  id: string;
  participant: UserProfile;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  dogName: string;
  mannerScore?: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export const CHAT_ROOMS: ChatRoom[] = [
  {
    id: "room-1",
    participant: {
      id: "user-3",
      name: "이영희",
      dogName: "초코",
      avatar: "",
      mannerScore: 42.0,
    },
    lastMessage: "내일 오전 10시에 여의도에서 만나요!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
  },
  {
    id: "room-2",
    participant: {
      id: "user-3",
      name: "박지훈",
      dogName: "맥스",
    },
    lastMessage: "오늘 산책 정말 재밌었어요! 다음에 또 해요 😊",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
  },
  {
    id: "room-3",
    participant: {
      id: "user-4",
      name: "최수진",
      dogName: "콩이",
    },
    lastMessage: "콩이가 초코 좋아하는 것 같아요!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
  },
  {
    id: "room-4",
    participant: {
      id: "user-5",
      name: "정다운",
      dogName: "두부",
    },
    lastMessage: "안녕하세요! 프로필 보고 연락드려요",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unreadCount: 1,
  },
];

export const CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  "room-1": [
    {
      id: "msg-1",
      roomId: "room-1",
      senderId: "user-2",
      content: "안녕하세요! 프로필 보고 연락드려요 ☺️",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
    {
      id: "msg-2",
      roomId: "room-1",
      senderId: "user-1",
      content: "안녕하세요! 반가워요~",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
      isRead: true,
    },
    {
      id: "msg-3",
      roomId: "room-1",
      senderId: "user-2",
      content:
        "골든 리트리버 너무 귀여워요! 우리 뽀미도 대형견이랑 잘 놀거든요",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
      isRead: true,
    },
    {
      id: "msg-4",
      roomId: "room-1",
      senderId: "user-1",
      content: "오 정말요? 그럼 조만간 같이 산책 어때요?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 21),
      isRead: true,
    },
    {
      id: "msg-5",
      roomId: "room-1",
      senderId: "user-2",
      content: "좋아요! 여의도 근처 어때요?",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
    },
    {
      id: "msg-6",
      roomId: "room-1",
      senderId: "user-1",
      content: "여의도 좋아요! 언제가 편하세요?",
      createdAt: new Date(Date.now() - 1000 * 60 * 20),
      isRead: true,
    },
    {
      id: "msg-7",
      roomId: "room-1",
      senderId: "user-2",
      content: "내일 오전 10시에 여의도에서 만나요!",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
    },
  ],
  "room-2": [
    {
      id: "msg-8",
      roomId: "room-2",
      senderId: "user-3",
      content: "오늘 산책 정말 재밌었어요! 다음에 또 해요 😊",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
    },
  ],
  "room-3": [
    {
      id: "msg-9",
      roomId: "room-3",
      senderId: "user-4",
      content: "콩이가 초코 좋아하는 것 같아요!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
  ],
  "room-4": [
    {
      id: "msg-10",
      roomId: "room-4",
      senderId: "user-5",
      content: "안녕하세요! 프로필 보고 연락드려요",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      isRead: false,
    },
  ],
};

export function getChatRoom(roomId: string): ChatRoom | undefined {
  return CHAT_ROOMS.find((room) => room.id === roomId);
}

export function getChatMessages(roomId: string): ChatMessage[] {
  return CHAT_MESSAGES[roomId] || [];
}
