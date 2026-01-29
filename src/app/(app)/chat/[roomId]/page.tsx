"use client";

import { use } from "react";
import { ChatWindow, ChatList } from "@/features/chat/components";
import { CHAT_ROOMS } from "@/lib/mock/chat";
import { PageHeader } from "@/components/layout";

interface ChatRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = use(params);

  return (
    <div className="min-h-screen lg:h-screen lg:flex">
      <div className="hidden lg:block lg:w-96 lg:border-r lg:border-gray-100 bg-white overflow-hidden">
        <PageHeader title="채팅 목록" />
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          <ChatList rooms={CHAT_ROOMS} selectedRoomId={roomId} />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 h-screen lg:h-auto">
        <ChatWindow roomId={roomId} showHeader={true} />
      </div>
    </div>
  );
}
