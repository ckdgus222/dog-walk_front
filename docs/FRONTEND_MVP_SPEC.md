# Frontend 기능 구현 기획서 v1 (Next.js App Router)

본 문서는 현재 프로젝트의 **UI-only 프로토타입**에 대해, 실제 기능(데이터/상태/네비게이션/실시간)을 단계적으로 연결하기 위한 **프론트엔드 구현 기획서**다.

---

## 0) 문서 사용 방식(중요: AI 협업/학습 운영 원칙)

- 이 프로젝트는 **AI와 협업**하되, AI가 코드를 “자동 구현/자동 수정”하는 방식이 아니라
  - AI는 설계/코드/쿼리/폴더 구조를 **제안**하고
  - 사용자는 제안을 **검증한 뒤 직접 작성/수정**한다.
- 각 기능(슬라이스)마다 아래를 기본 산출물로 한다.
  - API 계약(요청/응답/에러 코드)
  - 타입(요청/응답)
  - 로딩/에러/빈 상태 UI
  - 프론트 구현 포인트(라우팅/상태/권한)

---

## 1) 목표

- 완성된 UI에 **실제 기능(데이터/상태/네비게이션/실시간)**을 단계적으로 연결
- “포트폴리오 + 학습” 목적에 맞게, 구현 이유가 설명되는 구조(레이어 분리, 타입, 에러 처리, 로딩 상태)를 유지

---

## 2) 전제/정책(현재 프로젝트 기준)

### 2-1. 라우팅/구조

- Next.js **App Router** 사용
- 기존 UI 문서
  - `docs/ui/IMPLEMENTATION_PLAN.md`
  - `docs/ui/WALKTHROUGH.md`

### 2-2. 인증/토큰 정책(프론트)

- Access Token
  - 만료: **3시간**
  - 저장: **localStorage**
  - 전송: `Authorization: Bearer <accessToken>`
- Refresh Token
  - 만료: **30일**
  - 저장: **localStorage**
  - 전송: **오직** `POST /auth/refresh` 호출 시에만 헤더로 전달
    - `X-Refresh-Token: <refreshToken>`
  - 모든 API 호출에 Refresh를 붙이지 않음
- 쿠키(httpOnly)는 사용하지 않음(향후 앱 전환까지 고려하여 헤더 방식 유지)

### 2-3. 지도/위치 정책(프론트)

- 지도 UI: 카카오맵 사용(초기에는 placeholder 가능)
- 마커 노출 기준: **최근 15분 내 업데이트 유저만**(서버가 필터링)
- 프라이버시(오프셋)
  - 타인 마커: 서버가 **오프셋 저장된 좌표**를 내려주며, 이를 사용해 렌더링
  - 내 마커: 클라이언트가 단말 GPS로 **정확 표시**(권장 UX)

### 2-4. 차단(Block) 정책(프론트)

- 차단은 지도/피드/채팅/매칭에 전파됨(서버가 결과에서 제외/차단)
- 프론트는 기본적으로
  - 차단된 상대가 목록에서 “안 보이는 것”을 정상 동작으로 간주
  - (선택) 이미 열린 화면에서 차단이 발생했을 때의 UX(닫기/안내 문구)는 추후 보완

### 2-5. 상태관리

- MVP 기본은 `fetch + useState`로 시작 가능
- 단, 다음 기능부터는 React Query 도입을 권장
  - 피드 무한스크롤
  - 지도 polling/재조회
  - 좋아요 optimistic update
- 참고: 현재 프로젝트 `package.json`에는 React Query가 설치되어 있지 않음

---

## 3) 라우트/페이지 책임

- `/map`
  - 내 위치 획득
  - 위치 업데이트(`POST /location`)
  - nearby 조회(`GET /map/nearby`)
  - 마커 렌더
  - 유저 카드/산책 요청
- `/feed`
  - 게시글 목록(무한스크롤)
  - 상세 이동
  - 작성/업로드
- `/chat`
  - 채팅방 목록
  - 방 입장(`/chat/[roomId]`)
  - 메시지 조회 + 실시간 송수신
- `/mypage`
  - 내 프로필/강아지 프로필 조회·수정
  - 내 게시글 목록
- (옵션) `/profile/[userId]`
  - 타 유저/강아지 프로필
  - 산책 요청

---

## 4) 공통 구현 규칙(필수)

### 4-1. 데이터 레이어 분리

- `src/lib/api.ts`
  - 공통 fetcher(Access 토큰 자동 포함, 에러 표준화)
- `src/lib/api/*`
  - endpoint 함수 모음(예: `authApi`, `postsApi`)
- `src/features/*/queries.ts`
  - React Query hooks(도입 시)
- UI 컴포넌트는 데이터 fetching 직접 금지
  - 페이지/컨테이너(또는 hooks)에서만 호출

### 4-2. 상태 UI 표준화

- 모든 주요 페이지는 `loading/empty/error`를 동일한 컴포넌트로 처리
  - `components/ui/EmptyState`
  - `components/ui/ErrorState`
  - `components/ui/Skeleton`

### 4-3. 타입/검증

- 요청/응답 타입은 `src/shared/types/*`에 정의(권장)
- 필요 시 Zod로 런타임 검증(선택)

### 4-4. 클라이언트/서버 경계

- `localStorage`를 사용하므로, 토큰 접근 로직은 **클라이언트에서만** 동작해야 함
- 따라서 fetcher(`apiFetch`)는
  - **Client Component / client-only 모듈에서 사용**
  - Server Component에서 직접 호출하지 않음

---

## 5) 기능별 상세 계획

## A. 인증(Auth) + 세션

### A-1. 로그인/회원가입 UI 연결

- 로그인 폼 → `POST /auth/login`
- 회원가입 폼 → `POST /auth/signup`
- 성공 시 토큰 저장
  - `accessToken`, `refreshToken`
- 초기 로딩 시 `GET /me`로 세션 확인(선택)

수용 기준

- 로그인 후 보호 API 호출 가능
- Access 만료 시 refresh 로직을 통해 복구 가능

### A-2. 토큰 재발급

- `POST /auth/refresh`
  - 헤더에 `X-Refresh-Token` 전달
- 응답으로 받은 토큰을 저장(Access/Refresh 로테이션 가정)

---

## B. 지도(Map) 기능 연결

### B-1. 위치 권한/업데이트

- `navigator.geolocation.getCurrentPosition`으로 내 위치 획득
- 위치 업데이트 API 호출: `POST /location`

업데이트 주기(프론트 정책)

- (선택) 20~30초
- (선택) 50m 이동 시

### B-2. nearby 조회/마커 렌더

- `GET /map/nearby?lat&lng&radius`
- 마커 클릭 → 프리뷰 카드(유저/강아지 요약)
- “산책 요청” → `POST /matches/request`

수용 기준

- 지도 진입 시 주변 유저 마커가 표시
- 마커 클릭 시 카드가 열리고 요청 버튼이 동작

---

## C. 매칭(Match) 기능 연결

### C-1. 요청 생성/상태

- 요청 버튼 → `POST /matches/request`
- (선택) 요청 상태 표시
  - “요청 보냄/대기중” 뱃지

### C-2. 받은 요청(inbox)

- `GET /matches/inbox`로 받은 요청 리스트
- 수락: `POST /matches/:id/accept` → roomId 반환
- 거절: `POST /matches/:id/reject`

수용 기준

- 수락 시 자동으로 `/chat/[roomId]` 이동

---

## D. 채팅(Chat) 기능 연결

### D-1. 채팅방 목록

- `GET /chats`
- 클릭 시 `/chat/[roomId]` 이동

### D-2. 메시지 조회(초기 로딩)

- `GET /chats/:roomId/messages?cursor=`

### D-3. 실시간 송수신(WS)

- Socket 연결(Access 토큰 포함)
- `joinRoom(roomId)`
- `sendMessage({roomId, type: TEXT, text})`
- 서버 이벤트 수신 → 리스트 append

수용 기준

- 두 브라우저 탭에서 메시지 실시간 수신 확인
- 새로고침 후 메시지 유지(서버 저장)

---

## E. 피드(Posts) 기능 연결

### E-1. 피드 목록(무한스크롤)

- `GET /posts?cursor=`
- React Query infinite query 도입 추천

### E-2. 글 작성 + 미디어 업로드

- 업로드 순서
  - `POST /media/upload` → `mediaId/url`
  - `POST /posts`에 mediaId 포함

주의

- 업로드 시 `FormData`가 필요할 수 있으므로, JSON 기반 fetcher와 분리/예외 처리 필요

### E-3. 댓글/좋아요

- 댓글 작성: `POST /posts/:id/comments`
- 좋아요 토글: `POST/DELETE /posts/:id/like`

수용 기준

- 작성→피드 반영
- 좋아요/댓글 즉시 반영(optimistic update는 선택)

---

## F. 마이페이지(MyPage) 기능 연결

### F-1. 내 정보/강아지 프로필

- `GET /me`, `GET /me/dogs`
- 수정: `PATCH /me`, `PATCH /me/dogs/:id`

### F-2. 내 게시글 목록

- `GET /posts?author=me` (또는 별도 엔드포인트)

수용 기준

- 프로필 수정 반영
- 내 게시글 리스트 확인 가능

---

## 6) 에러/로딩/권한 처리 표준

- 공통 fetcher에서 HTTP 에러를 표준 객체로 변환(권장)
- 401 처리(권장)
  - 1. `/auth/refresh` 시도
  - 2. 실패 시 토큰 삭제 + 로그인 페이지로 이동
- 로딩
  - 페이지 진입 로딩은 Skeleton
- 빈 상태
  - “주변 메이트 없음”, “게시글 없음”, “채팅방 없음” 등

---

## 7) 구현 순서(프론트 추천 스프린트)

- 공통 API fetcher + 토큰 처리 + ErrorState/EmptyState/Skeleton 공통화
- Auth + `/me` 세션 확인
- Map: 위치 업데이트 + nearby 마커 + 요청 버튼
- Match inbox + 수락 시 roomId로 이동
- Chat: 방 목록 + 메시지 조회 + WS 송수신
- Feed: 목록 + 작성(업로드) + 댓글/좋아요
- MyPage: 프로필/강아지 수정 + 내 글 목록

---

## 8) 현재 진행 현황(코드 기준)

### 8-1. 공통 API 레이어

- [x] `src/lib/api.ts` 생성
  - `apiFetch(endpoint, options)` 구현
  - Access Token을 `Authorization` 헤더로 자동 포함
  - HTTP 에러 시 `Error` throw
- [ ] 환경변수 확정
  - `NEXT_PUBLIC_API_URL` 실제 값 세팅 필요
  - 현재 기본값은 임시 문자열(`local 대기`)

### 8-2. Auth API

- [x] `src/lib/api/auth.ts` 생성
  - `signup`, `login`, `refresh(X-Refresh-Token)`, `getMe` 구현
- [ ] 로그인/리프레시 성공 시 토큰 저장 로직 연결
  - 현재 `authApi`는 API 호출만 하고, `accessToken/refreshToken` 저장은 별도 구현 필요

### 8-3. UI 연결 상태

- [x] `/map`, `/feed`, `/chat`, `/mypage` UI는 Mock 데이터 기반으로 동작 중
  - 예: `/map`은 `src/lib/mock/map` 기반
  - 예: `/feed`는 `src/lib/mock/feed` 기반
  - 예: `/chat`은 `src/lib/mock/chat` 기반
  - 예: `/mypage`는 `src/lib/mock/user` 기반
- [ ] Auth 화면/API 연결
  - `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx` 및 `src/features/auth/*Form.tsx`는 현재 구현/연결이 필요
