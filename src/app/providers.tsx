"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";
import { attemptRefresh, clearAuth } from "@/lib/auth";

export const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => {
    // QueryCache/MutationCache 안에서 client를 쓰려면 이런 식으로 클로저 변수로 둬야 안전함
    const queryCache = new QueryCache({
      onError: async (error) => {
        // Query(GET) 에러 처리
        if (error instanceof ApiError && error.status === 401) {
          const newToken = await attemptRefresh();

          if (!newToken) {
            clearAuth();
            if (typeof window !== "undefined") window.location.href = "/login";
            return;
          }

          // 성공: 전체 쿼리 재검증
          client.invalidateQueries();
        }
      },
    });

    const mutationCache = new MutationCache({
      onError: async (error) => {
        // Mutation(POST/PUT/DELETE) 에러 처리
        if (error instanceof ApiError && error.status === 401) {
          const newToken = await attemptRefresh();

          if (!newToken) {
            clearAuth();
            if (typeof window !== "undefined") window.location.href = "/login";
          }
          // mutation은 여기서 자동 재시도하지 않음(사용자가 다시 시도)
        }
      },
    });

    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          retry: 1,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 0,
        },
      },
      queryCache,
      mutationCache,
    });

    return client;
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
