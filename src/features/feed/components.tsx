"use client";

import { useState } from "react";
import {
  Hash,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { FeedPost, POPULAR_TAGS, RECOMMENDED_MATES } from "@/lib/mock/feed";

const getPostCategory = (post: FeedPost) => {
  if (post.tags.some((tag) => tag.includes("산책"))) {
    return {
      label: "산책 기록",
      tone: "bg-[var(--color-success-light)] text-[var(--color-success)]",
    };
  }

  return {
    label: "동네 일상",
    tone: "bg-[var(--color-primary-lighter)] text-[var(--color-primary-dark)]",
  };
};

interface FeedCardProps {
  post: FeedPost;
}

export const FeedCard = ({ post }: FeedCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const category = getPostCategory(post);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="mb-4 flex items-start gap-3">
          <Avatar
            alt={post.author.name}
            size="md"
            className="h-11 w-11 border-[var(--color-border-light)]"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-sm font-bold text-[var(--color-text-primary)]">
                    {post.author.name}
                  </span>
                  <Badge className={category.tone}>{category.label}</Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                  <span>{post.author.dogName}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {post.location ?? "우리 동네"}
                  </span>
                  <span>·</span>
                  <span>{formatRelativeTime(post.createdAt)}</span>
                </div>
              </div>

              <button className="rounded-xl p-2 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
          {post.content}
        </p>
      </div>

      <div className="px-5 pb-4">
        <div className="overflow-hidden rounded-[22px] border border-[var(--color-border-light)] bg-[var(--color-bg-subtle)]">
          {post.images.length > 0 ? (
            <div className="flex h-56 items-end justify-between px-5 py-5">
              <div>
                <p className="text-xs font-semibold text-[var(--color-primary)]">
                  PHOTO STORY
                </p>
                <p className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">
                  {post.author.dogName}와 함께한 산책 기록
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  사진 {post.images.length}장
                </p>
              </div>
              <div className="text-5xl">🐶</div>
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 text-5xl">🐕</div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                사진이 없어도 산책 기록은 남아요
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                {post.author.dogName}와 보낸 오늘의 산책 이야기를 공유한 글입니다.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-[var(--color-border-light)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-5 border-t border-[var(--color-border-light)] pt-4">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
              isLiked
                ? "text-[var(--color-error)]"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-error)]"
            }`}
          >
            <Heart
              className="h-4 w-4"
              fill={isLiked ? "currentColor" : "none"}
            />
            공감 {likeCount}
          </button>

          <button className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]">
            <MessageCircle className="h-4 w-4" />
            댓글 {post.comments}
          </button>
        </div>
      </div>
    </Card>
  );
};

export const FeedWidget = () => {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Hash className="h-4 w-4 text-[var(--color-primary)]" />
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            지금 많이 이야기하는 태그
          </h3>
        </div>

        <div className="space-y-2">
          {POPULAR_TAGS.map(({ tag, count }) => (
            <button
              key={tag}
              className="flex w-full items-center justify-between rounded-[16px] bg-[var(--color-bg-subtle)] px-3 py-3 text-left transition-colors hover:bg-[var(--color-bg-muted)]"
            >
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                #{tag}
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                {count.toLocaleString()}건
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          가까운 메이트 추천
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
          피드에서 자주 보이는 이웃들이에요.
        </p>

        <div className="mt-4 space-y-4">
          {RECOMMENDED_MATES.map((mate) => (
            <div key={mate.id} className="flex items-center gap-3">
              <Avatar
                alt={mate.name}
                size="sm"
                className="h-10 w-10 border-[var(--color-border-light)]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {mate.name}
                </p>
                <p className="truncate text-xs text-[var(--color-text-tertiary)]">
                  {mate.dogName} · {mate.dogBreed}
                </p>
              </div>
              <Button size="sm" variant="outline">
                팔로우
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
