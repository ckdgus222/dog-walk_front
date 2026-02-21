"use client";

import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/ui";
import { ChatList, ChatEmptyState } from "@/features/chat/components";
import { CHAT_ROOMS } from "@/lib/mock/chat";
import { MessageSquare } from "lucide-react";

const ChatPage = () => {
  const rooms = CHAT_ROOMS;

  return (
    <div className="min-h-screen lg:h-screen lg:flex">
      {/* Chat List */}
      <div className="lg:w-96 lg:border-r lg:border-gray-100 bg-white">
        <PageHeader title="채팅" />

        {rooms.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12" />}
            title="아직 대화가 없어요"
            description="지도에서 산책 메이트를 찾아 대화를 시작해보세요!"
          />
        ) : (
          <ChatList rooms={rooms} />
        )}
      </div>

      {/* Chat Window - Desktop Empty State */}
      <div className="hidden lg:flex flex-1 bg-gray-50">
        <ChatEmptyState />
      </div>
    </div>
  );
};

export default ChatPage;
