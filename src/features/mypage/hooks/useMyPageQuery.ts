import { useQuery } from "@tanstack/react-query";
import { myPageApi } from "@/lib/api/mypage";

export const MY_PAGE_QUERY_KEY = ["mypage", "me"] as const;

export const useMyPageQuery = () =>
  useQuery({
    queryKey: MY_PAGE_QUERY_KEY,
    queryFn: () => myPageApi.getMyPage(),
  });
