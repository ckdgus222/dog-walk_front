# Frontend Roadmap

작성일: 2026-02-12  
최종 업데이트: 2026-02-20

## 문서 역할

이 문서는 프론트엔드의 **장기 실행 순서(로드맵)**만 관리합니다.

- 진행 상태/담당/검수 결과: `docs/TASK_BOARD.md`
- API 엔드포인트/필드/응답 규약: `docs/API_CHECKLIST_FRONTEND.md`
- 코드 구조/아키텍처 설명: `docs/PROJECT_STRUCTURE.md`

## 범위

- 대상: Next.js(App Router) + React Query 프론트엔드
- 목적: mock 중심 UI를 도메인 단위로 실 API로 전환
- 비목표: 상세 진행률 관리, 개별 API 스펙 관리

## 실행 순서

1. 기반 정리 (Auth/세션/공통 규칙)
2. MyPage
3. Feed
4. Map + Match
5. Chat(REST)
6. Chat(WS)
7. Safety(차단/신고) 통합

## 단계별 완료 정의

### Phase 0. 기반 정리

- 세션 부트스트랩과 401 복구 흐름이 안정적으로 동작
- 공통 fetch/에러 처리 규칙 고정
- lint/build 기준선 확보

### Phase 1. MyPage

- 사용자 정보, 매너온도, 월간 산책 지표, 매너 칭찬 노출
- 산책 거리 기록 조회 가능
- 실 API 바인딩 시 타입/화면 재작업 없이 교체 가능

### Phase 2. Feed

- 목록/작성/좋아요/댓글 최소 플로우 동작
- 미디어 업로드 실패/재시도 UX 제공

### Phase 3. Map + Match

- 위치 업데이트 + 주변 조회 동작
- 요청/수락/거절/취소 상태 흐름이 UI에 반영

### Phase 4. Chat (REST)

- 채팅방 목록/메시지 히스토리/전송 동작
- 새로고침 후 상태 복원

### Phase 5. Chat (WS)

- 실시간 송수신 + 재연결 동기화

### Phase 6. Safety 통합

- 차단/신고 후 지도/피드/채팅/매칭 전역 반영

## 운영 규칙

1. 새로운 작업은 먼저 `docs/TASK_BOARD.md`에 등록합니다.
2. 작업 완료 기준은 이 문서의 단계 정의를 따릅니다.
3. API 변경 논의는 `docs/API_CHECKLIST_FRONTEND.md`에서만 관리합니다.
