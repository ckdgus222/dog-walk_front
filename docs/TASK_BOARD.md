# Frontend Task Board

작성일: 2026-02-20  
목적: 프론트 작업의 지시/진행/검수를 한 문서에서 관리

## 상태 규칙

- `todo`: 시작 전
- `in_progress`: 진행 중
- `blocked`: 외부 의존으로 중단
- `done`: 구현 + 검수 완료

## 우선순위

1. Feed
2. MyPage 백엔드 바인딩
3. Map
4. Chat

## Active Tasks

| ID | 도메인 | 작업 | 상태 | 검수 기준 | 비고 |
| --- | --- | --- | --- | --- | --- |
| FEED-01 | Feed | mock 데이터 계약 정리 | todo | 타입/화면 계약 확정 | 다음 우선순위 |
| FEED-02 | Feed | `lib/api/feed.ts` + query hook 구성 | todo | 페이지에서 query 결과 렌더 |  |
| FEED-03 | Feed | 작성/좋아요/댓글 UI 액션 정리 | todo | UI 이벤트 흐름 통일 |  |
| MYP-05 | MyPage | 실 API endpoint/응답 스펙 확정 | blocked | 백엔드 계약 합의 | API 협의 필요 |
| MYP-06 | MyPage | mock -> 실 API 바인딩 교체 | todo | `src/lib/api/mypage.ts` 실호출 전환 | MYP-05 이후 |

## Done Log

| ID | 도메인 | 작업 | 완료일 | 비고 |
| --- | --- | --- | --- | --- |
| MYP-01 | MyPage | `MyPage` 데이터 계약 정리 | 2026-02-20 | `user/manner/monthly/praise/walkRecords` |
| MYP-02 | MyPage | 매너 칭찬 5개 카테고리 구성 | 2026-02-20 | 시간약속/대화친절/강아지매너/페이스/약속이행 |
| MYP-03 | MyPage | 산책 기록(거리) UI 반영 | 2026-02-20 | 토글 테이블 |
| MYP-04 | MyPage | 불필요 메뉴 제거 | 2026-02-20 | 관심 목록/동네 설정 제거 |
