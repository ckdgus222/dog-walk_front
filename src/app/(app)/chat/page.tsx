"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare, Search } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { Button, EmptyState, Input } from "@/components/ui";
import {
  ChatEmptyState,
  ChatList,
  filterChatRooms,
} from "@/features/chat/components";
import { CHAT_ROOMS } from "@/lib/mock/chat";
import { ROUTES } from "@/routes";

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const rooms = useMemo(
    () => filterChatRooms(CHAT_ROOMS, searchQuery),
    [searchQuery],
  );

  return (
    <div className="flex h-full min-h-full flex-col bg-[var(--color-bg)]">
      <PageHeader title="채팅" />

      <div className="min-h-0 flex-1 md:flex">
        <aside className="flex w-full shrink-0 flex-col border-r border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] md:w-[380px]">
          <div className="hidden border-b border-[var(--color-border-light)] px-5 py-5 md:block">
            <p className="text-xs font-semibold text-[var(--color-primary)]">
              WALK COORDINATION
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">
              채팅
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
              산책 약속을 조율하고 대화를 이어가세요.
            </p>
          </div>

          <div className="border-b border-[var(--color-border-light)] px-4 py-4">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="이름이나 반려견 이름으로 검색"
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto hide-scrollbar">
            {rooms.length === 0 ? (
              <div className="px-4 py-10">
                <EmptyState
                  icon={<MessageSquare className="h-12 w-12" />}
                  title="아직 대화가 없어요"
                  description="지도에서 메이트를 찾아 산책 요청을 보내보세요."
                  action={
                    <Link href={ROUTES.MAP}>
                      <Button size="sm">메이트 찾으러 가기</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <ChatList rooms={rooms} />
            )}
          </div>
        </aside>

        <div className="hidden min-w-0 flex-1 md:flex">
          <ChatEmptyState />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
