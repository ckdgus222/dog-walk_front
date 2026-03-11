"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  MapPin,
  Hash,
} from "lucide-react";
import { Card, Badge, Avatar } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { FeedPost, POPULAR_TAGS, RECOMMENDED_MATES } from "@/lib/mock/feed";

// ============ FeedCard (동네 생활 글 스타일) ============
interface FeedCardProps {
  post: FeedPost;
}

export const FeedCard = ({ post }: FeedCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card className="mb-4 border-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="p-5">
        {/* Header: Author Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#F1F3F5] px-2 py-1 rounded text-[10px] text-[#495057] font-bold">
              일상
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#212529] text-sm">
                {post.author.name}
              </span>
              <span className="text-[#ADB5BD] text-xs">·</span>
              <span className="text-[#ADB5BD] text-xs font-medium">
                {post.location}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#ADB5BD]">
            {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-4">
          <p className="text-[#343A40] text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Image (Optional & Rounded) */}
          {post.images.length > 0 ? (
            <div className="h-48 rounded-xl bg-[#F8F9FA] flex items-center justify-center border border-[#F1F3F5] overflow-hidden">
              <span className="text-[#ADB5BD] text-sm font-medium">
                📷 사진 ({post.images.length})
              </span>
            </div>
          ) : (
            <div className="h-48 rounded-xl bg-[#F8F9FA] flex items-center justify-center border border-[#F1F3F5] overflow-hidden">
              <div className="text-center">
                <span className="text-4xl block mb-2">🐕</span>
                <span className="text-[#ADB5BD] text-xs">
                  사진이 없어도 귀여워요
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[#868E96] bg-[#F8F9FA] px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4 pt-3 border-t border-[#F8F9FA]">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 p-1 -ml-1 hover:bg-[#F8F9FA] rounded-lg transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-[#ADB5BD]"}`}
            />
            <span
              className={`text-xs ${isLiked ? "text-red-500 font-bold" : "text-[#868E96]"}`}
            >
              공감 {likeCount}
            </span>
          </button>

          <button className="flex items-center gap-1.5 p-1 hover:bg-[#F8F9FA] rounded-lg transition-colors">
            <MessageCircle className="w-4 h-4 text-[#ADB5BD]" />
            <span className="text-xs text-[#868E96]">댓글 {post.comments}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

// ============ FeedWidget (Clean List Style) ============
export const FeedWidget = () => {
  return (
    <div className="space-y-6">
      {/* Popular Tags */}
      <div className="bg-white rounded-2xl p-5 border border-[#F1F3F5] shadow-sm">
        <h3 className="font-bold text-[#343A40] text-sm mb-4">
          지금 우리 동네는 🔥
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map(({ tag }) => (
            <button
              key={tag}
              className="px-3 py-1.5 bg-[#FFF4E6] text-[#FF8A3D] text-xs font-bold rounded-full hover:bg-[#FFE8CC] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Mates */}
      <div className="bg-white rounded-2xl p-5 border border-[#F1F3F5] shadow-sm">
        <h3 className="font-bold text-[#343A40] text-sm mb-4">
          이웃과 친해져보세요
        </h3>
        <div className="space-y-4">
          {RECOMMENDED_MATES.map((mate) => (
            <div key={mate.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar size="sm" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#212529]">
                    {mate.name}
                  </span>
                  <span className="text-[10px] text-[#ADB5BD]">
                    {mate.dogName} 집사
                  </span>
                </div>
              </div>
              <button className="text-[10px] font-bold text-[#FF8A3D] bg-[#FFF4E6] px-2.5 py-1 rounded-full hover:bg-[#FFE8CC]">
                팔로우
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
