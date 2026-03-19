"use client";

import { use, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui";
import {
  ChatList,
  ChatWindow,
  filterChatRooms,
} from "@/features/chat/components";
import { CHAT_ROOMS } from "@/lib/mock/chat";

interface ChatRoomPageProps {
  params: Promise<{ roomId: string }>;
}

const ChatRoomPage = ({ params }: ChatRoomPageProps) => {
  const { roomId } = use(params);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = useMemo(
    () => filterChatRooms(CHAT_ROOMS, searchQuery),
    [searchQuery],
  );

  return (
    <div className="flex h-full min-h-full bg-[var(--color-bg)]">
      <aside className="hidden w-[380px] shrink-0 flex-col border-r border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] md:flex">
        <div className="border-b border-[var(--color-border-light)] px-5 py-5">
          <p className="text-xs font-semibold text-[var(--color-primary)]">
            WALK COORDINATION
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">
            채팅
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
            약속과 일정이 보이도록 대화를 정리합니다.
          </p>
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="대화 상대 검색"
            leftIcon={<Search className="h-4 w-4" />}
            className="mt-4"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto hide-scrollbar">
          <ChatList rooms={filteredRooms} selectedRoomId={roomId} />
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <ChatWindow roomId={roomId} showHeader />
      </section>
    </div>
  );
};

export default ChatRoomPage;
