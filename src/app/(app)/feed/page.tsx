"use client";

import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/ui";
import { FeedCard, FeedWidget } from "@/features/feed/components";
import { FEED_POSTS } from "@/lib/mock/feed";
import { Bell, ImageOff } from "lucide-react";

type DemoState = "default" | "empty";
const DEMO_STATE: DemoState = "default";

export default function FeedPage() {
  const posts = DEMO_STATE === "empty" ? [] : FEED_POSTS;

  return (
    <div className="bg-[#F8F9FA] min-h-full pb-20">
      <PageHeader
        title="우리 동네 이야기"
        action={
          <button className="p-2 text-[#212529]">
            <Bell className="w-5 h-5" />
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-6 lg:flex lg:gap-6">
        {/* Feed List */}
        <div className="flex-1 max-w-xl">
          {posts.length === 0 ? (
            <EmptyState
              icon={<ImageOff className="w-12 h-12" />}
              title="아직 게시물이 없어요"
              description="첫 번째 산책 이야기를 공유해보세요!"
            />
          ) : (
            posts.map((post) => <FeedCard key={post.id} post={post} />)
          )}
        </div>

        {/* Widget - Desktop Only */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-4">
            <FeedWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
