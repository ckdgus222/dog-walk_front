// React Query 훅을 사용해 MyPage 데이터를 캐시/재조회 관리한다.
import { useQuery } from "@tanstack/react-query";
// 실제 데이터 소스(mock 또는 실 API)를 숨긴 도메인 API 모듈.
import { myPageApi } from "@/lib/api/mypage";

// 쿼리 캐시 키.
// "mypage/me"를 고정해두면 invalidate 시 정확히 이 데이터만 갱신 가능하다.
export const MY_PAGE_QUERY_KEY = ["mypage", "me"] as const;

// MyPage 전용 조회 훅.
// 페이지/컴포넌트는 이 훅만 호출하면 되고, 내부 데이터 소스 변경은 몰라도 된다.
export const useMyPageQuery = () =>
  useQuery({
    // 캐시 식별 키
    queryKey: MY_PAGE_QUERY_KEY,
    // 실제 데이터 조회 함수
    queryFn: () => myPageApi.getMyPage(),
  });
