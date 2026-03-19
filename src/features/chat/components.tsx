"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  ChevronLeft,
  Clock3,
  MapPin,
  MoreVertical,
  Plus,
  Send,
} from "lucide-react";
import { Avatar, Badge, EmptyState } from "@/components/ui";
import { cn, formatDate, formatRelativeTime, formatTime } from "@/lib/utils";
import { ROUTES } from "@/routes";
import {
  ChatMessage,
  ChatRoom,
  getChatMessages,
  getChatRoom,
} from "@/lib/mock/chat";

const ROOM_META: Record<
  string,
  {
    status: string;
    tone: string;
    helper: string;
    appointment?: {
      title: string;
      time: string;
      location: string;
      note: string;
    };
  }
> = {
  "room-1": {
    status: "약속 확정",
    tone: "bg-[var(--color-success-light)] text-[var(--color-success)]",
    helper: "내일 오전 10시 산책 예정",
    appointment: {
      title: "산책 약속이 잡혔어요",
      time: "내일 오전 10:00",
      location: "여의도 한강공원",
      note: "산책 시작 전에 채팅으로 도착 여부를 한 번 더 확인해보세요.",
    },
  },
  "room-2": {
    status: "산책 완료",
    tone: "bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]",
    helper: "함께 산책한 메이트",
  },
  "room-3": {
    status: "대화 중",
    tone: "bg-[var(--color-primary-lighter)] text-[var(--color-primary-dark)]",
    helper: "다음 산책 일정 조율 중",
  },
  "room-4": {
    status: "요청 도착",
    tone: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
    helper: "첫 인사를 기다리는 중",
  },
};

const getRoomMeta = (roomId: string) =>
  ROOM_META[roomId] ?? {
    status: "대화 중",
    tone: "bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]",
    helper: "산책 메이트와 대화 중",
  };

const getRoomSearchText = (room: ChatRoom) =>
  `${room.participant.name} ${room.participant.dogName} ${room.lastMessage}`.toLowerCase();

const getPartnerBubbleColor = (roomId: string) => {
  if (roomId === "room-1") return "bg-[rgba(255,243,224,0.78)]";
  if (roomId === "room-2") return "bg-[rgba(230,244,234,0.82)]";
  if (roomId === "room-3") return "bg-[rgba(232,240,254,0.82)]";
  return "bg-[var(--color-bg-elevated)]";
};

interface ChatListItemProps {
  room: ChatRoom;
  isSelected?: boolean;
}

export const ChatListItem = ({ room, isSelected }: ChatListItemProps) => {
  const meta = getRoomMeta(room.id);

  return (
    <Link
      href={ROUTES.CHAT_ROOM(room.id)}
      className={cn(
        "block rounded-[20px] border p-4 transition-all",
        isSelected
          ? "border-[var(--color-primary)] bg-[rgba(255,243,224,0.46)] shadow-[var(--shadow-md)]"
          : "border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border)] hover:shadow-[var(--shadow-sm)]",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar
            alt={room.participant.name}
            size="md"
            className="h-12 w-12 border-[var(--color-border-light)]"
          />
          {room.unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white bg-[var(--color-primary)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate text-sm font-bold text-[var(--color-text-primary)]">
                  {room.participant.name}
                </span>
                {room.participant.mannerScore && (
                  <Badge className="bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]">
                    {room.participant.mannerScore}°C
                  </Badge>
                )}
                <Badge className={meta.tone}>{meta.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                {room.participant.dogName} · {meta.helper}
              </p>
            </div>

            <span className="shrink-0 text-[11px] text-[var(--color-text-tertiary)]">
              {formatRelativeTime(room.lastMessageTime)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p
              className={cn(
                "truncate text-sm",
                room.unreadCount > 0
                  ? "font-medium text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-secondary)]",
              )}
            >
              {room.lastMessage}
            </p>
            {room.unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[10px] font-bold text-white">
                {room.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

interface ChatListProps {
  rooms: ChatRoom[];
  selectedRoomId?: string;
}

export const ChatList = ({ rooms, selectedRoomId }: ChatListProps) => {
  return (
    <div className="space-y-3 p-3">
      {rooms.map((room) => (
        <ChatListItem
          key={room.id}
          room={room}
          isSelected={room.id === selectedRoomId}
        />
      ))}
    </div>
  );
};

interface ChatWindowProps {
  roomId: string;
  showHeader?: boolean;
}

export const ChatWindow = ({
  roomId,
  showHeader = true,
}: ChatWindowProps) => {
  const room = getChatRoom(roomId);
  const initialMessages = useMemo(() => getChatMessages(roomId), [roomId]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const currentUserId = "user-1";

  if (!room) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--color-bg)]">
        <EmptyState
          icon={<span>💬</span>}
          title="채팅방을 찾을 수 없어요"
          description="목록으로 돌아가 다른 메이트와의 대화를 확인해보세요."
        />
      </div>
    );
  }

  const roomMeta = getRoomMeta(room.id);
  const roomDate =
    messages.length > 0 ? formatDate(messages[0].createdAt) : formatDate(new Date());

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `message-${Date.now()}`,
        roomId,
        senderId: currentUserId,
        content: inputValue.trim(),
        createdAt: new Date(),
        isRead: false,
      },
    ]);
    setInputValue("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--color-bg)]">
      {showHeader && (
        <div className="flex shrink-0 items-center gap-3 border-b border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] px-4 py-3">
          <Link
            href={ROUTES.CHAT}
            className="rounded-xl p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-subtle)] md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar
              alt={room.participant.name}
              size="md"
              className="h-10 w-10 border-[var(--color-border-light)]"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="truncate text-sm font-bold text-[var(--color-text-primary)]">
                  {room.participant.name}
                </h2>
                {room.participant.mannerScore && (
                  <Badge className="bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]">
                    {room.participant.mannerScore}°C
                  </Badge>
                )}
                <Badge className={roomMeta.tone}>{roomMeta.status}</Badge>
              </div>
              <p className="mt-1 truncate text-xs text-[var(--color-text-tertiary)]">
                {room.participant.dogName} · {roomMeta.helper}
              </p>
            </div>
        </div>

          <button className="rounded-xl p-2 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]">
            <MoreVertical className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-5 hide-scrollbar">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <div className="flex justify-center">
            <span className="rounded-full bg-[var(--color-bg-subtle)] px-3 py-1 text-[11px] font-medium text-[var(--color-text-tertiary)]">
              {roomDate}
            </span>
          </div>

          {roomMeta.appointment && (
            <div className="rounded-[24px] border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-sm)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-primary)]">
                    WALK COORDINATION
                  </p>
                  <h3 className="mt-1 text-base font-bold text-[var(--color-text-primary)]">
                    {roomMeta.appointment.title}
                  </h3>
                </div>
                <Badge className={roomMeta.tone}>{roomMeta.status}</Badge>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] bg-[var(--color-bg-subtle)] p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-tertiary)]">
                    <CalendarClock className="h-3.5 w-3.5" />
                    시간
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {roomMeta.appointment.time}
                  </p>
                </div>
                <div className="rounded-[18px] bg-[var(--color-bg-subtle)] p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-tertiary)]">
                    <MapPin className="h-3.5 w-3.5" />
                    장소
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {roomMeta.appointment.location}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {roomMeta.appointment.note}
              </p>
            </div>
          )}

          {messages.map((message, index) => {
            const isMe = message.senderId === currentUserId;
            const previousMessage = messages[index - 1];
            const showProfile =
              !isMe &&
              (!previousMessage || previousMessage.senderId !== message.senderId);

            return (
              <div
                key={message.id}
                className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
              >
                {!isMe && (
                  <div className="mr-2 flex w-8 shrink-0 justify-center">
                    {showProfile ? (
                      <Avatar
                        alt={room.participant.name}
                        size="sm"
                        className="h-8 w-8 border-[var(--color-border-light)]"
                      />
                    ) : (
                      <div className="w-8" />
                    )}
                  </div>
                )}

                <div className="max-w-[78%]">
                  {!isMe && showProfile && (
                    <p className="mb-1 ml-1 text-[11px] font-medium text-[var(--color-text-secondary)]">
                      {room.participant.name}
                    </p>
                  )}

                  <div
                    className={cn(
                      "flex items-end gap-2",
                      isMe && "flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-[22px] px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-xs)]",
                        isMe
                          ? "rounded-br-md bg-[var(--color-primary)] text-white"
                          : `rounded-bl-md border border-[var(--color-border-light)] text-[var(--color-text-primary)] ${getPartnerBubbleColor(room.id)}`,
                      )}
                    >
                      {message.content}
                    </div>
                    <span className="mb-1 shrink-0 text-[10px] text-[var(--color-text-tertiary)]">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
          <button className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-subtle)]">
            <Plus className="h-[18px] w-[18px]" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[rgba(232,118,10,0.1)]">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="메시지를 입력하세요"
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
            />
            <Clock3 className="h-4 w-4 text-[var(--color-text-tertiary)]" />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="rounded-xl bg-[var(--color-primary)] p-2.5 text-white shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ChatEmptyState = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--color-bg)] p-8">
      <div className="max-w-md rounded-[28px] border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-8 text-center shadow-[var(--shadow-lg)]">
        <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--color-primary-lighter)] text-4xl">
          💬
        </div>
        <p className="text-xs font-semibold text-[var(--color-primary)]">
          WALK COORDINATION CHAT
        </p>
        <h3 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">
          대화를 선택하세요
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          산책 약속을 조율하고, 장소와 시간을 확인하고,
          <br />
          자연스럽게 메이트와 신뢰를 쌓을 수 있어요.
        </p>
      </div>
    </div>
  );
};

export const filterChatRooms = (rooms: ChatRoom[], searchQuery: string) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return rooms;
  }

  return rooms.filter((room) => getRoomSearchText(room).includes(normalizedQuery));
};
