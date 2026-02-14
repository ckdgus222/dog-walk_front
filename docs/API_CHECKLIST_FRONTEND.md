# Frontend 기준 Backend API 체크리스트 (UI/코드 기준)

작성일: 2026-02-14  
기준: 현재 프론트 코드(`src/*`) + 기획 문서(`PLAN_FRONTEND.md`, `docs/*`)

이 문서는 “현재 프론트에 이미 존재하는 화면/흐름”을 기준으로, **백엔드가 제공해야 하는 API를 체크리스트 형태로 한 파일에 통합**한 것입니다.  
백엔드 구현(또는 OpenAPI 설계) 시, 아래 항목을 “프론트에서 실제로 쓰는 필드” 중심으로 우선 충족시키면 됩니다.

---

## 0) 전제(프론트 구현에 고정된 규칙)

### 0-1. API Base URL
- 프론트는 `NEXT_PUBLIC_API_URL`을 사용하며, 미설정 시 `http://localhost:3001`로 fallback 합니다.
  - `src/lib/api.ts`
  - `src/lib/auth.ts`
- 현재 `.env`가 `NEXT_PUBLIC_API_URL = ''`처럼 공백을 포함하고 있어, 로더에 따라 env 인식이 흔들릴 수 있습니다(공백 없이 권장).

### 0-2. 인증 헤더 규칙(중요)
- 일반 API: `Authorization: Bearer <accessToken>` (프론트 `apiFetch`가 자동 첨부)
- Refresh 전용: `X-Refresh-Token: <refreshToken>` (프론트가 refresh 호출에서만 사용)
  - `src/lib/api/auth.ts` (`authApi.refresh`)
  - `src/lib/auth.ts` (`attemptRefresh`)

### 0-3. 시간 포맷
- 프론트 mock은 `Date` 객체를 사용합니다. 실제 API 연동 시에는 **ISO 8601 문자열**을 내려주고, 프론트에서 `new Date(value)`로 파싱하는 형태를 권장합니다.

### 0-4. 응답/에러 포맷(백엔드 정본)
- 백엔드는 성공/실패를 전역으로 래핑합니다.
  - Success: `{ "data": <payload> }`
  - Error: `{ "error": { "code": "<CODE>", "message": "<MESSAGE>", "details"?: <ANY> } }`
- 프론트 `apiFetch`는 성공 응답의 `{ data }`를 **자동 언랩**해서 반환합니다.
  - 따라서 아래 Response 예시는 “언랩된 payload” 기준으로 적습니다.
- 정본 문서(백엔드): `dog-walk_backend/dog-walk_back/docs/API_RESPONSE_FORMAT.md`, `dog-walk_backend/dog-walk_back/docs/AUTH_API.md`

---

## 1) 유저 플로우별 “필수 API” 매핑(프론트 화면 기준)

### 1-1. 로그인 → 앱 진입(세션 유지)
- `POST /auth/login` → 토큰 저장 → `/map` 이동
- 이후 앱에서 보호 API 호출 중 401:
  - `POST /auth/refresh`(헤더 `X-Refresh-Token`) → 성공 시 재조회(invalidate)
  - 실패 시 토큰 삭제 후 `/login`
- (권장) 앱 시작 시 `GET /me`로 세션 부트스트랩(현 코드엔 호출 훅이 아직 없음)

관련 프론트:
- `src/app/(auth)/login/page.tsx`
- `src/features/auth/hooks/useLoginMutation.ts`
- `src/app/providers.tsx`

### 1-2. 회원가입(2-step) → (선택) 강아지 사진 업로드
- 현재 UI는 회원가입 폼에서 `dog` 프로필까지 입력합니다.
- 사진 업로드는 회원가입 중 `POST /media/upload`를 호출합니다(토큰 없이 호출될 수 있음).

관련 프론트:
- `src/app/(auth)/signup/page.tsx`
- `src/features/auth/SignupForm.tsx`
- `src/features/auth/DogProfileForm.tsx`

### 1-3. 지도(Map) → 주변 목록 → 산책 요청
- `POST /location` (내 위치 업데이트)
- `GET /map/nearby` (주변 유저/강아지 조회)
- “산책 메이트 신청” → `POST /matches/request`

관련 프론트:
- `src/app/(app)/map/page.tsx`
- `src/features/map/components.tsx`

### 1-4. 매칭 수락 → 채팅방 진입
- `GET /matches/inbox` (받은/보낸 요청)
- `POST /matches/:id/accept` → `roomId`를 받아 `/chat/[roomId]` 이동

관련 프론트(화면은 아직 없음, `PLAN_FRONTEND.md` 단계로 예정):
- `PLAN_FRONTEND.md`

### 1-5. 채팅(목록/방)
- `GET /chats` (방 목록)
- `GET /chats/:roomId/messages?cursor=&limit=` (메시지 조회)
- 전송은 아래 중 하나로 결정
  - REST: `POST /chats/:roomId/messages`
  - WS(Socket.IO 권장): `sendMessage` event

관련 프론트(UI는 mock, API 연결 예정):
- `src/app/(app)/chat/page.tsx`
- `src/app/(app)/chat/[roomId]/page.tsx`
- `src/features/chat/components.tsx`

### 1-6. 피드(목록/좋아요/댓글/작성)
- `GET /posts?cursor=&limit=` (목록)
- `POST /media/upload` → `POST /posts` (작성)
- `POST /posts/:id/like`, `DELETE /posts/:id/like` (좋아요)
- `POST /posts/:id/comments` (댓글)

관련 프론트(UI는 mock, API 연결 예정):
- `src/app/(app)/feed/page.tsx`
- `src/features/feed/components.tsx`

### 1-7. 마이페이지(내 정보/강아지/내 글)
- `GET /me` (내 정보)
- `PATCH /me` (내 프로필 수정)
- `GET /me/dogs`, `POST /me/dogs`, `PATCH /me/dogs/:dogId`
- `GET /posts?author=me`(또는 별도 endpoint)

관련 프론트(UI는 mock, API 연결 예정):
- `src/app/(app)/mypage/page.tsx`

---

## 2) API 체크리스트(백엔드 구현용)

아래 “응답”은 **현재 프론트 UI가 바로 쓰기 위해 필요한 최소 필드**만 적었습니다.  
백엔드는 더 많은 필드를 내려줘도 무방합니다(프론트는 필요한 것만 사용).

### 2-1. Auth / Session

- [ ] `POST /auth/login` (Public)
  - Request(JSON): `{ email: string; password: string }`
  - Response(JSON) (프론트 `AuthResponse` 기준):
    ```json
    {
      "accessToken": "string",
      "refreshToken": "string",
      "user": { "id": "string", "email": "string", "nickname": "string" }
    }
    ```
  - 사용처: `src/lib/api/auth.ts`, `src/features/auth/hooks/useLoginMutation.ts`

- [ ] `POST /auth/signup` (Public)  ✅ *계약 확정 필요*
  - 옵션 A(1-step): 가입 요청에 `dog` 포함 허용 → 가입과 동시에 dog 생성
  - 옵션 B(2-step): `/auth/signup`은 유저만 생성 → 성공 후 `POST /me/dogs`로 dog 생성
  - 현재 프론트 UI 입력값(2-step 폼):
    - `{ email, password, nickname, dog: { name, breed, birthYear, gender, personality[], photoUrl? } }`
  - 사용처: `src/app/(auth)/signup/page.tsx`, `src/features/auth/SignupForm.tsx`, `src/features/auth/hooks/useSignupMutation.ts`

- [ ] `POST /auth/refresh` (Public + RefreshHeader)
  - Headers: `X-Refresh-Token: <refreshToken>`
  - Response(JSON):
    ```json
    { "accessToken": "string", "refreshToken": "string (optional)" }
    ```
  - 사용처:
    - `src/lib/api/auth.ts` (`authApi.refresh`)
    - `src/lib/auth.ts` (`attemptRefresh`)
  - 참고: 프론트 `attemptRefresh()`는 `POST /auth/refresh`로 호출됩니다.

- [ ] `GET /me` (Bearer)
  - Response(JSON) (프론트 `MeResponse` 기준 최소 / `apiFetch` 언랩 후 payload):
    ```json
    {
      "user": {
        "id": "string",
        "email": "string",
        "nickname": "string",
        "profileImage": "string (optional)",
        "bio": "string (optional)"
      }
    }
    ```
  - 사용처: `src/lib/api/auth.ts` (`authApi.getMe`) *(현재 UI에서 실제 호출은 아직 없음)*

---

### 2-2. Media Upload

- [ ] `POST /media/upload` (multipart/form-data)
  - Request(FormData): `file=<binary>`
  - Response(JSON): 프론트는 현재 최소 `{ url }`을 기대
    ```json
    { "url": "https://..." }
    ```
  - 사용처: `src/features/auth/DogProfileForm.tsx`
  - 결정 포인트(중요):
    - 회원가입 전 업로드가 가능해야 UI가 그대로 동작합니다(토큰이 없을 수 있음).
    - 업로드에 인증을 걸고 싶다면, 프론트 플로우를 “회원가입 완료 후 업로드/수정”으로 바꾸는 게 안전합니다.

---

### 2-3. Location / Map

- [ ] `POST /location` (Bearer)
  - Request(JSON):
    ```json
    { "lat": 37.0, "lng": 127.0, "accuracy": 10 }
    ```
  - Response: 204 또는 `{ ok: true }` 등(프론트 의존도 낮음)
  - 예정 사용처: `/map` 진입 시(Phase 2)

- [ ] `GET /map/nearby?lat=&lng=&radius=` (Bearer 권장)
  - Query: `lat`, `lng`, `radius`(m)
  - Response(JSON) (문서+UI를 동시에 만족시키는 최소 예시):
    ```json
    [
      {
        "userId": "string",
        "nickname": "string",
        "profileImageUrl": "string (optional)",
        "bio": "string (optional)",
        "mannerScore": 36.5,
        "lastActiveAt": "2026-02-14T12:00:00.000Z",
        "lat": 37.0,
        "lng": 127.0,
        "distance": 450,
        "dog": {
          "name": "string",
          "breed": "string",
          "photoUrl": "string (optional)",
          "size": "small|medium|large (optional)"
        },
        "walkStyle": "active|slow|training (optional)",
        "preferredTime": "morning|afternoon|evening (optional)"
      }
    ]
    ```
  - 프론트 매핑(현재 UI 타입):
    - `MapMarker.name` ← `nickname`
    - `MapMarker.dogName`/`dogBreed` ← `dog.name`/`dog.breed`
    - `MapMarker.lastActive` ← `lastActiveAt`
  - 예정 사용처: `src/app/(app)/map/page.tsx`

---

### 2-4. Match

- [ ] `POST /matches/request` (Bearer)
  - Request(JSON): `{ "toUserId": "string" }`
  - Response(JSON): `{ "id": "string", "status": "PENDING", "expiresAt": "..." }` 등
  - 예정 사용처: 지도 상세 “신청” 버튼(현재는 alert)

- [ ] `GET /matches/inbox` (Bearer)
  - Response: incoming/outgoing을 분리하든 단일 배열로 주든 프론트에서 맞출 수 있게 규격 고정 필요
  - 예정 사용처: Phase 3(매칭 UI 연결)

- [ ] `POST /matches/:id/accept` (Bearer)
  - Response(JSON): `{ "roomId": "string" }` *(채팅방 진입에 필수)*

- [ ] `POST /matches/:id/reject` (Bearer)
- [ ] `POST /matches/:id/cancel` (Bearer)

---

### 2-5. Chat (REST + WS)

- [ ] `GET /chats` (Bearer)
  - Response(JSON) (현재 UI가 바로 렌더링 가능한 최소 예시):
    ```json
    [
      {
        "roomId": "string",
        "participant": { "id": "string", "name": "string", "dogName": "string", "mannerScore": 36.5 },
        "lastMessage": "string",
        "lastMessageAt": "2026-02-14T12:00:00.000Z",
        "unreadCount": 0
      }
    ]
    ```
  - 예정 사용처: `src/app/(app)/chat/page.tsx`

- [ ] `GET /chats/:roomId/messages?cursor=&limit=` (Bearer)
  - Response(JSON) (cursor pagination 권장):
    ```json
    {
      "items": [
        {
          "id": "string",
          "roomId": "string",
          "senderId": "string",
          "content": "string",
          "createdAt": "2026-02-14T12:00:00.000Z",
          "isRead": true
        }
      ],
      "nextCursor": "string|null"
    }
    ```
  - 예정 사용처: `src/app/(app)/chat/[roomId]/page.tsx`

- [ ] (선택) `POST /chats/:roomId/messages` (Bearer, REST 전송)
  - Request(JSON): `{ "content": "string" }` (또는 `{ type, text, mediaId }`)

- [ ] (선택) WebSocket(Socket.IO 권장)
  - Auth: handshake에 access token 전달(예: `handshake.auth.token`)
  - Events(권장):
    - `joinRoom({ roomId })`
    - `sendMessage({ roomId, type, text?, mediaId? })`
    - server → client: `messageCreated({ message })`

---

### 2-6. Feed / Posts

- [ ] `GET /posts?cursor=&limit=` (Bearer 권장)
  - Response(JSON) (현재 UI 최소 필드):
    ```json
    {
      "items": [
        {
          "id": "string",
          "author": { "id": "string", "name": "string", "dogName": "string" },
          "content": "string",
          "images": ["https://..."],
          "likes": 0,
          "comments": 0,
          "isLiked": false,
          "tags": ["string"],
          "createdAt": "2026-02-14T12:00:00.000Z",
          "location": "string (optional)"
        }
      ],
      "nextCursor": "string|null"
    }
    ```
  - 예정 사용처: `src/app/(app)/feed/page.tsx`

- [ ] `POST /posts` (Bearer)
  - Request(JSON): `{ content, mediaIds?, tags?, locationTag? }` 등(백엔드 모델에 맞게)
  - Response: 생성된 post

- [ ] `POST /posts/:id/comments` (Bearer)
  - Request(JSON): `{ content: string }`

- [ ] `POST /posts/:id/like` (Bearer)
- [ ] `DELETE /posts/:id/like` (Bearer)

- [ ] (선택) `GET /posts/:id` (Bearer)

---

### 2-7. MyPage / Profile / Dogs

- [ ] `PATCH /me` (Bearer)
  - Request(JSON): `{ nickname?, bio?, profileImage? }` 등

- [ ] `GET /me/dogs` (Bearer)
- [ ] `POST /me/dogs` (Bearer)
- [ ] `PATCH /me/dogs/:dogId` (Bearer)
  - 최소 필드(프론트 입력값): `name`, `breed`, `birthYear`, `gender`, `personality[]`, `photoUrl?`

- [ ] `GET /posts?author=me` (Bearer) *(또는 전용 endpoint)*

---

### 2-8. Safety (Block / Report)

- [ ] `POST /blocks` (Bearer)
  - Request(JSON): `{ "userId": "string" }` (또는 `{ blockedUserId }`)

- [ ] `DELETE /blocks/:userId` (Bearer)

- [ ] `POST /reports` (Bearer)
  - Request(JSON): `{ targetType: "USER|POST|MESSAGE", targetId: "string", reason: "string" }`

---

## 3) “계약 확정”이 필요한 항목(프론트/백엔드가 같이 결정해야 함)

- [ ] 회원가입: 1-step(`POST /auth/signup`에 dog 포함) vs 2-step(가입 후 `POST /me/dogs`)
  - 현재 UI는 2-step 입력을 이미 받음(`src/features/auth/SignupForm.tsx`)

- [ ] Refresh: `POST /auth/refresh`로 고정(권장). 프론트는 `attemptRefresh()`에서 POST로 호출합니다.

- [ ] 업로드 인증: `POST /media/upload`가 회원가입 전에도 호출될 수 있음(토큰 없음)
  - 백엔드에서 Public로 열지, 프론트 플로우를 바꿀지 결정 필요

---

## 4) 참고 문서(이 체크리스트의 근거)

- 실행 계획(최신): `PLAN_FRONTEND.md`
- Auth API 계약(정본, backend repo `docs/`): `dog-walk_backend/dog-walk_back/docs/AUTH_API.md`
- API 응답 포맷(정본, backend repo `docs/`): `dog-walk_backend/dog-walk_back/docs/API_RESPONSE_FORMAT.md`
