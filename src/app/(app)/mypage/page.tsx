"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import {
  MyPageErrorState,
  MyPageLoadingState,
  MyPageView,
} from "@/features/mypage/MyPageView";
import { useMyPageQuery } from "@/features/mypage/hooks/useMyPageQuery";
import { Settings } from "lucide-react";

const MyPage = () => {
  const [showWalkHistory, setShowWalkHistory] = useState(false);
  const { data, isPending, isError, refetch } = useMyPageQuery();

  return (
    <div className="bg-[#F8F9FA] min-h-full pb-20">
      <PageHeader
        title="나의 산책"
        action={
          <button className="p-2 text-[#212529]">
            <Settings className="w-5 h-5" />
          </button>
        }
      />

      {isPending && <MyPageLoadingState />}

      {!isPending && (isError || !data) && (
        <MyPageErrorState
          onRetry={() => {
            void refetch();
          }}
        />
      )}

      {!isPending && data && (
        <MyPageView
          data={data}
          showWalkHistory={showWalkHistory}
          onToggleWalkHistory={() => setShowWalkHistory((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default MyPage;
