"use client";

import { PenLine } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { Button, EmptyState } from "@/components/ui";
import { FeedCard, FeedWidget } from "@/features/feed/components";
import { FEED_POSTS } from "@/lib/mock/feed";

const FeedPage = () => {
  const posts = FEED_POSTS;

  return (
    <div className="min-h-full bg-[var(--color-bg)]">
      <PageHeader
        title="동네 피드"
        action={
          <button className="rounded-xl p-2 text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-subtle)]">
            <PenLine className="h-5 w-5" />
          </button>
        }
      />

      <div className="mx-auto max-w-[var(--max-content-width)] px-4 py-5 md:px-6 md:py-6">
        <div className="mb-6 hidden items-start justify-between md:flex">
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary)]">
              NEIGHBORHOOD FEED
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
              우리 동네 산책 이야기
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
              주변 반려인들의 산책 후기와 일상을 한곳에서 확인하세요.
            </p>
          </div>

          <Button size="md">
            <PenLine className="h-4 w-4" />
            글쓰기
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,720px)_320px] lg:items-start">
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-[24px] border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-8 shadow-[var(--shadow-sm)]">
                <EmptyState
                  icon={<span>📰</span>}
                  title="아직 게시물이 없어요"
                  description="첫 번째 산책 이야기를 공유해보세요."
                />
              </div>
            ) : (
              posts.map((post) => <FeedCard key={post.id} post={post} />)
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-6">
              <FeedWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
