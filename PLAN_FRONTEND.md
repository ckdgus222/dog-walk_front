# Dog Walk Mate (VillageMate) — 프론트엔드 구현 계획서

작성일: 2026-02-12  
대상: Next.js(App Router) + React Query 기반 프론트엔드

> 이 계획서는 현재 프론트 상태(대부분 UI는 mock 데이터로 동작, Auth만 일부 실 API 연동)를 기준으로,
> “mock → real API” 전환을 **도메인 슬라이스 단위로** 진행하기 위한 실행 계획입니다.

---

## 0. 현재 상태 요약 (기준선)

- 라우팅/화면
  - `(auth)`: `/login`, `/signup`
  - `(app)`: `/map`, `/feed`, `/chat`, `/chat/[roomId]`, `/mypage`
  - `/` → `/map` 리다이렉트
- 데이터
  - Map/Feed/Chat/MyPage: `src/lib/mock/*` 기반 UI 동작
  - Auth: `NEXT_PUBLIC_API_URL` 기반 실제 호출 존재
- 인증
  - `accessToken`, `refreshToken`을 `localStorage`에 저장
  - React Query 전역 onError에서 401 감지 시 refresh 시도
- 품질/환경
  - `.env` 키에 공백이 포함된 형태(`KEY = ''`)는 파서에 따라 env 미인식 가능 → 정리 필요
  - `npm run lint` 실패 항목 존재(사용하지 않는 import, hook lint, any 등)

---

## 1. 목표 / 비목표

### 목표
1. **세션 부트스트랩(/me) + 라우트 가드**를 안정화하여 “로그인 상태”의 기준을 단일화한다.
2. 도메인별로 mock을 제거하고 **실제 API 연동**을 완료한다.
3. 채팅은 **REST 기반 히스토리/목록**을 먼저 붙이고, 마지막에 **WS 실시간**을 추가한다.
4. MVP 범위에서 **안전(차단/신고)** 동작을 UI/데이터 레이어까지 관통시킨다.

### 비목표(현재 단계에서 보류)
- 복잡한 실시간 상태 동기화(읽음 처리/타이핑 인디케이터/온라인 표시 등)
- 고급 지도 UX(클러스터링/경로 안내/지도 내 검색) — 1차 MVP 이후

---

## 2. 공통 합의(백엔드와 API 계약 확정 필요)

> 아래 3가지만 “고정”되면, 이후 프론트 개발 속도가 급격히 빨라집니다.

1) **Signup 2-step 기본값**
- `POST /auth/signup` : 유저 생성 + 토큰 발급
- `POST /dogs` : 강아지 등록(온보딩에서 필수 step)

2) **Refresh 계약 단일화**
- `POST /auth/refresh`
- 요청: `X-Refresh-Token: <token>` 헤더(현 프론트 구현 방향에 맞춤)
- 응답: `{ accessToken, refreshToken }`

3) **에러 응답 표준**
- 실패 시: `{ error: { code: string, message: string, details?: any } }`
- 프론트에서 code 기반 분기 처리(예: `AUTH_INVALID`, `AUTH_EXPIRED`, `VALIDATION_ERROR`)

---

## 3. 프론트 아키텍처/코딩 컨벤션 (권장)

### 3.1 API Layer
- `src/lib/api.ts`를 “단일 fetch 래퍼”로 유지하되,
  - **method 명시**(특히 refresh)
  - **timeout / retry 정책**은 React Query 레벨에서 관리
- DTO 타입은 가능하면 OpenAPI에서 자동 생성(추후)

### 3.2 React Query 구성
- 도메인별 Query Key 규칙
  - `['me']`
  - `['map', 'nearby', { lat, lng, radiusM }]`
  - `['matches', 'inbox', { type, status }]`
  - `['chats']`, `['chat', roomId, 'messages', cursor]`
- Mutation 성공 시 invalidate 규칙 명확화
  - match accept/reject → `['matches', ...]`, `['chats']` invalidate

### 3.3 세션/라우트 가드
- “SessionGate” 컴포넌트/로직을 만들어
  - 앱 진입 시 `GET /me` 시도
  - 401 → refresh → me 재시도
  - 실패 → `/login` 이동
- `(app)` 라우트는 **me 존재**를 전제로 작성

---

## 4. 실행 계획 (도메인 슬라이스별)

아래 순서는 “UI를 거의 유지하면서 데이터 레이어만 교체”하는 방식으로 설계했습니다.

### Phase 0 — 기반 정리(필수)
**Deliverables**
- `.env` 공백 제거 및 환경값 정상화
- `attemptRefresh()`에서 method를 POST로 고정
- lint failure 최소화(기능 연동 전에 비용이 가장 적음)

**Acceptance**
- `npm run lint` 통과
- 로그인 → 토큰 저장 → 새로고침 후에도 세션 유지

---

### Phase 1 — 세션 부트스트랩 & /me
**Todo**
- `GET /me` 연동
- SessionGate 도입(앱 진입 공통)
- `(app)` 라우트 보호(로그인 없으면 `/login`)

**Acceptance**
- 토큰 만료 시 자동 refresh 후 정상 복구
- refresh 실패 시 토큰 삭제 + 로그인 이동
- UI가 “로그인 상태/비로그인 상태”에서 예측 가능하게 동작

---

### Phase 2 — Map (위치 업데이트 + 주변 조회)
**Todo**
- 브라우저 geolocation 권한/좌표 획득
- `POST /location` 주기적 업데이트(최소: 페이지 진입 시 1회, 이후 간단한 interval)
- `GET /map/nearby?lat&lng&radiusM=...`
- “최근 15분 내 업데이트 유저만 노출”은 서버 필터를 신뢰하고, 프론트는 결과만 렌더
- 지도 SDK 결정
  - (권장) 카카오맵 SDK
  - (대안) MVP 1차는 단순 리스트/placeholder 지도 UI

**Acceptance**
- 지도(또는 리스트)에 주변 유저/강아지 표시
- 새로고침/재진입 시에도 안정적으로 동작(권한 거부 케이스 포함)

---

### Phase 3 — Match (요청/수락/거절/취소/만료)
**Todo**
- `POST /matches/request`
- `GET /matches/inbox` (incoming/outgoing)
- `POST /matches/:id/accept|reject|cancel`
- 상태별 UI 맵핑(버튼/배지/비활성 조건)
- accept 성공 시 roomId를 받아 채팅 화면 이동

**Acceptance**
- 요청/수락/거절/취소 플로우가 UI에서 완결
- 수락 시 채팅방 진입(최소: 빈 메시지 히스토리라도 화면 표시)

---

### Phase 4 — Chat (REST 우선 → WS는 다음 단계)
**Todo**
- `GET /chats` (방 목록)
- `GET /chats/:roomId/messages?cursor&limit`
- `POST /chats/:roomId/messages`(또는 send endpoint)로 전송
- 메시지 리스트 가상화/무한 스크롤은 추후(우선은 cursor 기반 “더보기”)

**Acceptance**
- 방 목록 진입 가능
- 메시지 히스토리 조회/전송 가능(새로고침 후에도 유지)

---

### Phase 5 — Chat 실시간(WS)
**Todo**
- Socket.IO 연결(핸드셰이크에 access token)
- room join / message receive
- 전송 성공 시 optimistic update + 서버 ack

**Acceptance**
- 두 브라우저에서 실시간 송수신
- reconnect 시 room 재join 및 메시지 동기화(최소: 재조회)

---

### Phase 6 — Feed / Media
**Todo**
- `GET /posts?cursor`
- `POST /posts`
- `POST /media/upload` (FormData)
- 댓글/좋아요 토글 연동
- 업로드 실패/재시도 UX(최소 수준)

**Acceptance**
- 글 작성/조회/좋아요/댓글이 동작
- 이미지 포함 글 작성 가능

---

### Phase 7 — MyPage + Safety(차단/신고)
**Todo**
- 내 프로필 수정(`PATCH /me`)
- 강아지 프로필 CRUD(`GET /dogs/my`, `POST /dogs`, `PATCH /dogs/:id`)
- 차단/신고 UI
- 차단 시: 지도/피드/채팅/매칭에서 상대 노출 제거(서버 필터 + 프론트 반영)

**Acceptance**
- 내 정보/강아지 정보 관리 가능
- 차단 시 앱 전 영역에서 상대가 보이지 않음

---

## 5. 테스트/품질 체크리스트

- 라우트 단위 “핵심 유저 여정” 수동 테스트 시나리오
  1) 회원가입 → 강아지 등록 → 지도에서 주변 보기
  2) 매칭 요청 → 수락 → 채팅 진입 → 메시지 전송
  3) 피드 글 작성(이미지 포함) → 좋아요/댓글
  4) 차단 → 지도/채팅/피드에서 상대 숨김 확인
- Playwright/E2E는 나중에 붙이더라도, 위 4개는 스모크 테스트로 고정

---

## 6. 리스크 & 대응

- **Auth 계약 흔들림**: signup(1-step/2-step), refresh 헤더/바디가 바뀌면 프론트가 연쇄 수정
  - → Phase 0에서 계약을 문서화하고 고정
- **지도 SDK 도입 비용**: Kakao Map 연동은 키/도메인/빌드 설정 이슈가 빈번
  - → Phase 2에서 대안(리스트 기반 주변 보기)을 항상 유지
- **WS 실시간 난이도**: 인증/재연결/중복 메시지 처리
  - → Phase 4에서 REST 기반 채팅을 먼저 완성 후 진행

---

## 부록) 산출물(권장 파일 구조)

- `src/lib/api/*` : 도메인별 API 모듈(auth, me, map, match, chat, posts)
- `src/lib/queryKeys.ts` : query key 모음
- `src/components/session/SessionGate.tsx`
- `src/features/*` : 도메인별 hooks/components 분리(선택)
