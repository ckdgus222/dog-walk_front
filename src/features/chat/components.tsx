"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Send,
  MoreVertical,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { Avatar, Input, Button } from "@/components/ui";
import { cn, formatRelativeTime, formatTime } from "@/lib/utils";
import { ROUTES } from "@/routes";
import { ChatRoom, getChatMessages, getChatRoom } from "@/lib/mock/chat";

// ============ ChatListItem ============
interface ChatListItemProps {
  room: ChatRoom;
  isSelected?: boolean;
}

export function ChatListItem({ room, isSelected }: ChatListItemProps) {
  return (
    <Link
      href={ROUTES.CHAT_ROOM(room.id)}
      className={cn(
        "flex items-center gap-4 p-4 border-b border-[#F1F3F5] transition-colors hover:bg-[#F8F9FA]",
        isSelected && "bg-[#F8F9FA]",
      )}
    >
      <div className="relative shrink-0">
        <Avatar size="lg" className="w-12 h-12 border-[#E9ECEF]" />
        {/* Unread Dot (Simple) */}
        {room.unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-[#FF8A3D] rounded-full border-2 border-white"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-bold text-[15px] text-[#212529]">
            {room.participant.name}
          </span>
          <span className="text-[11px] text-[#ADB5BD]">
            {formatRelativeTime(room.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-sm truncate max-w-[200px]",
              room.unreadCount > 0
                ? "text-[#495057] font-medium"
                : "text-[#868E96]",
            )}
          >
            {room.lastMessage}
          </p>
          {room.unreadCount > 0 && (
            <span className="bg-[#FF8A3D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============ ChatList ============
interface ChatListProps {
  rooms: ChatRoom[];
  selectedRoomId?: string;
}

export function ChatList({ rooms, selectedRoomId }: ChatListProps) {
  return (
    <div className="bg-white">
      {rooms.map((room) => (
        <ChatListItem
          key={room.id}
          room={room}
          isSelected={room.id === selectedRoomId}
        />
      ))}
    </div>
  );
}

// ============ ChatWindow ============
interface ChatWindowProps {
  roomId: string;
  showHeader?: boolean;
}

export function ChatWindow({ roomId, showHeader = true }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const room = getChatRoom(roomId);
  const messages = getChatMessages(roomId);
  const currentUserId = "user-1";

  if (!room) return <div className="p-4">채팅방을 찾을 수 없습니다.</div>;

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-[#E9ECEF]/30">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#F1F3F5] shrink-0">
          <Link
            href={ROUTES.CHAT}
            className="p-1 -ml-1 mr-1 lg:hidden text-[#212529]"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h2 className="font-bold text-base text-[#212529] cursor-pointer hover:underline">
              {room.participant.name}
            </h2>
            <span className="text-[11px] text-[#ADB5BD] bg-[#F1F3F5] px-1.5 py-0.5 rounded">
              매너 {room.participant.mannerScore}°C
            </span>
          </div>
          <button className="text-[#868E96] p-2 hover:bg-[#F8F9FA] rounded-full">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Date Divider Example */}
        <div className="flex justify-center my-4">
          <span className="bg-[#000000]/10 text-white text-[10px] px-3 py-1 rounded-full font-medium shadow-sm backdrop-blur-sm">
            2025년 5월 20일
          </span>
        </div>

        {messages.map((message, index) => {
          const isMe = message.senderId === currentUserId;
          const showProfile =
            !isMe &&
            (index === 0 || messages[index - 1].senderId !== message.senderId);

          return (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                isMe ? "justify-end" : "justify-start",
              )}
            >
              {/* Partner Profile */}
              {!isMe && (
                <div className="w-8 mr-2 flex flex-col items-center shrink-0">
                  {showProfile ? <Avatar size="sm" /> : <div className="w-8" />}
                </div>
              )}

              <div className="max-w-[70%]">
                {!isMe && showProfile && (
                  <p className="text-[11px] text-[#495057] mb-1 ml-1">
                    {room.participant.name}
                  </p>
                )}
                <div className="flex items-end gap-1.5 direction">
                  {isMe && (
                    <span className="text-[10px] text-[#ADB5BD] mb-1 whitespace-nowrap">
                      {formatTime(message.createdAt)}
                    </span>
                  )}
                  <div
                    className={cn(
                      "px-3 py-2.5 text-[14px] leading-snug break-words shadow-sm",
                      isMe
                        ? "bg-[#FF8A3D] text-white rounded-[18px_4px_18px_18px]"
                        : "bg-white text-[#212529] rounded-[4px_18px_18px_18px] border border-[#F1F3F5]",
                    )}
                  >
                    {message.content}
                  </div>
                  {!isMe && (
                    <span className="text-[10px] text-[#ADB5BD] mb-1 whitespace-nowrap text-right">
                      {formatTime(message.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-[#F1F3F5] shrink-0 safe-area-bottom">
        <div className="flex items-center gap-2">
          <button className="p-2 text-[#ADB5BD] bg-[#F8F9FA] rounded-full hover:text-[#495057]">
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-[#F8F9FA] rounded-[20px] px-4 py-2 flex items-center border border-transparent focus-within:border-[#FF8A3D]/50 transition-colors">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지 보내기"
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#ADB5BD]"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
          </div>
          {inputValue.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 bg-[#FF8A3D] text-white rounded-full transition-transform hover:scale-110 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : // Placeholder button
          null}
        </div>
      </div>
    </div>
  );
}

// ============ ChatEmptyState ============
export function ChatEmptyState() {
  /* Desktop Only View */
  return (
    <div className="hidden lg:flex flex-col items-center justify-center h-full bg-[#F8F9FA] text-center p-8">
      <div className="w-20 h-20 bg-[#FFF4E6] rounded-full flex items-center justify-center mb-4">
        <span className="text-4xl">💬</span>
      </div>
      <p className="text-[#868E96] text-sm leading-relaxed">
        동네 이웃들과 따뜻한 대화를 나눠보세요.
        <br />
        산책 약속을 잡을 때도 유용해요!
      </p>
    </div>
  );
}
