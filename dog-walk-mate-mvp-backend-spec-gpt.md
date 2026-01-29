# Dog Walk Mate 기능 기획서 v1.1 (Backend/MVP) — gpt

본 문서는 사용자가 작성한 v1 기획서를 **NestJS + Prisma + Postgres(PostGIS)** 기준으로 “바로 구현 가능한 수준”으로 재정리한 **MVP 중심 기능 기획서**다.

## 0) 결론(적용 적합성 요약)

- **적합(핵심 요구 충족)**
  - **카카오맵 UI 전제** + **PostGIS 반경 검색** + **최근 15분 이내 업데이트만 마커 노출** 정책이 백엔드 설계와 잘 맞는다.
  - Prisma의 공간 타입 제약을 **`queryRaw`로 우회**한다는 방향도 현실적이다.
- **보완 필요(구현 시 빠지기 쉬운 지점)**
  - **WebSocket 인증/인가(JWT 핸드셰이크)**, **채팅방 권한 체크**, **차단 로직의 전파 범위(지도/피드/채팅/매칭)**를 명확히 해야 한다.
  - **MatchRequest 만료(EXPIRED)** 기준(예: 10분/30분)과 배치 처리 방식이 필요하다.
  - **위치 privacy(오프셋) 정책**을 “저장 시 오프셋” vs “응답 시 오프셋” 중 하나로 고정해야 한다.

---

## 1) 목표와 범위

### 1-1. MVP 목표

- **지도(`/map`)**
  - 주변 산책 메이트를 마커로 표시
  - **최근 15분 이내 위치 업데이트 사용자만 노출**
- **매칭**
  - 마커 클릭 → 프로필 확인 → 산책 요청/수락
- **채팅(`/chat`)**
  - 매칭 수락 시 1:1 채팅방 생성
  - 실시간 메시지
- **피드(`/feed`)**
  - 브이로그/일기 게시글 업로드(사진/영상) + 댓글/좋아요
- **마이페이지(`/mypage`)**
  - 내/내 강아지 프로필, 내 게시글/로그

### 1-2. MVP 제외(명시)

- 결제/구독
- 추천 알고리즘(고도화)
- 그룹 산책/다대다 채팅
- 고급 영상 편집(압축/트랜스코딩은 2차)

---

## 2) 사용자 역할

- **User(일반 사용자)**
  - 위치 공유, 매칭, 채팅, 게시글 작성/열람
- **Admin(옵션)**
  - 신고 처리/차단 관리
  - 초기에는 **DB 레벨 관리만**(UI 없어도 됨)

---

## 3) 핵심 정책(고정)

- **지도 공급자**: 카카오맵(프론트)
- **주변 검색**: PostGIS 반경 검색
- **마커 노출 기준**: **최근 15분 내 위치 업데이트한 사용자만**
- **초기 배포**: 온프레미스(향후 Docker/클라우드 전환 고려)

### 3-1. “최근 15분”의 기준

- 기준 컬럼: `UserLocation.updatedAt`
- 조건: `updatedAt > now() - interval '15 minutes'`
- **수용 기준**: 15분 지난 유저는 **절대 응답에 포함되지 않음**

---

## 4) 기능 상세 요구사항(MVP)

## A. 인증/회원/프로필

### A-1. 회원/로그인(최소)

- 시작 옵션
  - **이메일/비밀번호** (권장: MVP 기본)
  - 소셜 로그인은 2차(선택)
- 토큰
  - **JWT Access Token 필수**
  - Refresh Token은 선택(초기 단순화를 위해 생략 가능)

### A-2. 사용자 프로필

- 필드
  - `nickname`(필수)
  - `profileImageUrl`(선택)
  - `bio`(선택)
- 공개 범위
  - 지도/피드/채팅에서 노출될 **최소 공개 정보**만 기본 제공

### A-3. 강아지 프로필(핵심)

- 필드
  - `name`, `photoUrl`, `breed`, `age`, `gender`
  - `isNeutered`(선택)
  - `temperamentTags`(예: 활발/소심/친화적)
  - `walkPreferences`(예: 시간대/거리/리드줄)
- 정책
  - 유저는 **최소 1마리 등록 가능**(MVP에서 “최소 1마리 필수”로 강제할지 여부는 선택)
- 수용 기준
  - 지도/피드/채팅에서 강아지 기본 카드가 표시 가능한 데이터 제공

---

## B. 위치 업데이트 & 주변 검색(PostGIS)

### B-1. 위치 업데이트

- 입력
  - `lat`, `lng` (필수)
  - `accuracy`(선택)
  - `visibility`(선택)
- 저장
  - `geom: geography(Point, 4326)`
  - `updatedAt`
- `visibility` 옵션(권장)
  - `public_approx`(기본): 약간 오프셋된 위치
  - `hidden`: 지도에 노출 안 함
  - `public_exact`는 포트폴리오 MVP에선 생략 가능

#### 오프셋 정책(MVP 고정)

- `visibility=public_approx`인 경우 **저장 시 오프셋 적용**
  - 서버는 원본 좌표를 입력받되 DB에 저장되는 `geom`은 오프셋된 좌표
- 오프셋 크기(권장): 반경 30~80m
- 오프셋 안정성(권장): **15분 단위(time bucket)로 고정**
  - 동일 유저는 같은 15분 구간에서는 동일 오프셋(마커가 흔들리지 않음)
  - 다음 15분 구간에 들어가면 오프셋이 재생성될 수 있음

### B-2. 주변 검색(`/map/nearby`)

- 입력
  - 기준 좌표 `lat/lng`
  - `radius`(m, 기본 2000)
- 조건
  - `updatedAt > now() - 15 minutes`
  - `visibility != hidden`
  - `ST_DWithin(geom, point, radius)`
- 응답
  - 유저 요약 + 강아지 요약 + 거리(m)
- 성능
  - `geom`에 **GIST 인덱스 필수**
  - 쿼리는 `queryRaw`로 수행
- 수용 기준
  - 반경 2km에서 빠르게 목록이 반환됨(인덱스 적용)
  - 15분 지난 유저는 절대 포함되지 않음

---

## C. 매칭(산책 요청/수락)

### C-1. 요청 생성

- 시작점: 지도 카드에서 “산책 요청”
- 상태
  - `PENDING` → `ACCEPTED` / `REJECTED` / `CANCELED` / `EXPIRED`

#### EXPIRED 정책(MVP 고정)

- 요청 생성 시 `expiresAt`를 설정
  - 기본값(권장): 생성 시각 + 30분
- 수락/거절/취소 가능 조건
  - `status=PENDING` 이고 `now() < expiresAt` 인 경우만 처리
- 만료 처리 방식(MVP)
  - `GET /matches/inbox` 조회 시, `PENDING`이면서 `expiresAt`이 지난 요청은 **DB에서 `EXPIRED`로 전환**
  - `POST /matches/:id/accept` 등 상태 변경 시에도 동일하게 만료 여부를 먼저 검사

### C-2. 수락 시 채팅방 생성

- `ACCEPTED` 시 `ChatRoom` 자동 생성
- 이미 방이 있으면 재사용(중복 생성 방지)
  - 권장 유니크 키: `(userAId, userBId)` 정규화(작은 쪽/큰 쪽)

### C-3. 안전장치(MVP 권장)

- 차단된 유저에게 요청 불가
- 최소한의 rate-limit 권장
  - 사용자 단/아이피 단(후술 “Safety”)

---

## D. 1:1 채팅(실시간)

### D-1. 채팅방/메시지

- 실시간: WebSocket(권장: Socket.IO)
- 메시지 타입
  - `TEXT`(필수)
  - `IMAGE`(선택)
  - `SYSTEM`(예: “매칭 성사”)

### D-2. 메시지 저장 & 조회

- 방 목록 조회
- 메시지 페이지네이션(권장: cursor 기반)

### D-3. 읽음 처리(선택)

- MVP에서는 생략하거나 “읽지 않은 수”만 제공

### 채팅 보안/권한(필수 보완)

- WS 연결 시 JWT로 인증
  - 권장: Socket.IO `handshake.auth.token`에 Access Token 전달
- `joinRoom(roomId)` 시
  - **해당 room에 속한 유저만** join 가능
- `sendMessage` 시
  - room 권한 재검증(서버 권한 체크)

---

## E. 피드(브이로그/일기)

### E-1. 게시글

- 텍스트 + 미디어(0~N)
- 태그(선택)
- 위치 태그(선택)

### E-2. 피드/상세

- 최신순 피드
- 상세 페이지(댓글 포함)
- 좋아요/댓글 CRUD
  - 댓글 수정/삭제는 선택

### 수용 기준

- 게시글 작성/목록/상세/댓글/좋아요 동작
- 페이징 제공(무한스크롤 대비)

---

## F. 마이페이지

- 내 프로필/강아지 프로필 수정
- 내 게시글 목록
- 최근 산책 로그는 MVP에서 “게시글=로그”로 대체 가능

---

## G. 미디어 업로드(이미지/영상)

### G-1. 업로드 방식

- MVP
  - 서버 업로드(온프레미스 파일 저장) 또는 S3 호환은 2차
- 파일 검증
  - 이미지: `jpg/png/webp`
  - 영상: `mp4/webm`(선택)
- 용량 제한 예시
  - 이미지 5MB
  - 영상 50~100MB

### G-2. 썸네일(선택)

- MVP에서는 클라이언트 썸네일/placeholder로 시작 가능

---

## H. 신고/차단(포트폴리오 최소)

- **차단(Block)**
  - 상대가 지도/피드/채팅에서 숨김
  - 매칭 요청 불가
- **신고(Report)**
  - 사유 + 대상(유저/게시글/메시지)

### 차단 적용 범위(MVP 고정)

- 차단 관계가 **한쪽이라도 존재**하면( A→B 또는 B→A ) 다음을 모두 차단
  - `/map/nearby` 결과에서 서로를 제외
  - `/matches/request` 생성 불가
  - `/chats` 목록 및 메시지 조회/전송 불가(권장: room 접근 자체 차단)
  - `/posts` 피드/상세에서 서로의 콘텐츠 숨김

---

## 5) API 설계 초안(REST + WS)

## 5-1. Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /me`

## 5-2. Profile

- `GET /users/:id`
- `PATCH /me`
- `POST /me/dogs`
- `PATCH /me/dogs/:dogId`

## 5-3. Location

- `POST /location` (내 위치 업데이트)
- `GET /map/nearby?lat=&lng=&radius=` (15분 조건)

## 5-4. Match

- `POST /matches/request` (body: `toUserId`)
- `GET /matches/inbox`
- `POST /matches/:id/accept`
- `POST /matches/:id/reject`
- `POST /matches/:id/cancel`

## 5-5. Chat

- `GET /chats`
- `GET /chats/:roomId/messages?cursor=`

### WS events

- client → server
  - `joinRoom(roomId)`
  - `sendMessage({ roomId, type, text?, mediaId? })`
- server → client
  - `messageCreated`

## 5-6. Posts

- `POST /posts`
- `GET /posts?cursor=`
- `GET /posts/:id`
- `POST /posts/:id/comments`
- `POST /posts/:id/like`
- `DELETE /posts/:id/like`

## 5-7. Media

- `POST /media/upload` → `{ mediaId, url, type }`

## 5-8. Safety

- `POST /blocks`
- `DELETE /blocks/:userId`
- `POST /reports`

---

## 5-9. API 응답 예시(JSON)

### 5-9-1. GET `/map/nearby?lat=&lng=&radius=`

응답 예시:

```json
[
  {
    "userId": "uuid",
    "nickname": "string",
    "profileImageUrl": "https://...",
    "dog": {
      "id": "uuid",
      "name": "뽀미",
      "breed": "포메라니안",
      "photoUrl": "https://..."
    },
    "distance": 450
  }
]
```

### 5-9-2. GET `/chats`

응답 예시:

```json
[
  {
    "roomId": "uuid",
    "otherUser": {
      "userId": "uuid",
      "nickname": "string",
      "profileImageUrl": "https://..."
    },
    "lastMessage": {
      "messageId": "uuid",
      "type": "TEXT",
      "text": "마커 보고 연락드려요!",
      "createdAt": "2026-01-29T02:30:00.000Z"
    },
    "unreadCount": 0
  }
]
```

### 5-9-3. GET `/chats/:roomId/messages?cursor=`

응답 예시:

```json
{
  "items": [
    {
      "messageId": "uuid",
      "roomId": "uuid",
      "senderId": "uuid",
      "type": "TEXT",
      "text": "오늘 저녁 7시에 산책 가능하세요?",
      "media": null,
      "createdAt": "2026-01-29T02:31:00.000Z"
    }
  ],
  "nextCursor": "opaque_cursor_or_message_id"
}
```

### 5-9-4. 에러 응답 규격(권장)

응답 예시:

```json
{
  "code": "AUTH_UNAUTHORIZED",
  "message": "Unauthorized",
  "details": null
}
```

---

## 6) DB 엔티티(요약)

- `User`
- `Dog`
- `UserLocation` (PostGIS `geom` + `updatedAt` + `visibility`)
- `MatchRequest`
- `ChatRoom`, `ChatMessage`
- `Post`, `PostMedia`, `Comment`, `Like`
- `Block`, `Report`

### 6-1. ERD 상세(컬럼/타입/관계 요약)

```text
User
├── id (uuid, PK)
├── email (text, unique)
├── passwordHash (text)
├── nickname (text)
├── profileImageUrl (text, nullable)
├── bio (text, nullable)
├── createdAt (timestamptz)
└── updatedAt (timestamptz)

Dog
├── id (uuid, PK)
├── userId (uuid, FK → User.id)
├── name (text)
├── photoUrl (text, nullable)
├── breed (text, nullable)
├── age (int, nullable)
├── gender (text, nullable)
├── isNeutered (boolean, nullable)
├── temperamentTags (jsonb, nullable)
├── walkPreferences (jsonb, nullable)
├── createdAt (timestamptz)
└── updatedAt (timestamptz)

UserLocation
├── id (uuid, PK)
├── userId (uuid, FK → User.id, unique)
├── geom (geography(Point, 4326))
├── accuracy (float, nullable)
├── visibility (enum: public_approx/hidden/public_exact)
└── updatedAt (timestamptz)

MatchRequest
├── id (uuid, PK)
├── fromUserId (uuid, FK → User.id)
├── toUserId (uuid, FK → User.id)
├── status (enum: PENDING/ACCEPTED/REJECTED/CANCELED/EXPIRED)
├── expiresAt (timestamptz, nullable)
├── createdAt (timestamptz)
└── processedAt (timestamptz, nullable)

ChatRoom
├── id (uuid, PK)
├── userAId (uuid, FK → User.id)
├── userBId (uuid, FK → User.id)
├── matchRequestId (uuid, FK → MatchRequest.id, nullable)
├── createdAt (timestamptz)
└── UNIQUE(userAId, userBId)

ChatMessage
├── id (uuid, PK)
├── roomId (uuid, FK → ChatRoom.id)
├── senderId (uuid, FK → User.id)
├── type (enum: TEXT/IMAGE/SYSTEM)
├── content (text)
├── mediaId (uuid, FK → Media.id, nullable)
├── createdAt (timestamptz)
└── readAt (timestamptz, nullable)

Post
├── id (uuid, PK)
├── authorId (uuid, FK → User.id)
├── content (text)
├── tags (jsonb, nullable)
├── locationTag (jsonb, nullable)
├── createdAt (timestamptz)
└── updatedAt (timestamptz)

PostMedia
├── id (uuid, PK)
├── postId (uuid, FK → Post.id)
├── mediaId (uuid, FK → Media.id)
└── order (int)

Comment
├── id (uuid, PK)
├── postId (uuid, FK → Post.id)
├── authorId (uuid, FK → User.id)
├── content (text)
├── createdAt (timestamptz)
└── updatedAt (timestamptz)

Like
├── id (uuid, PK)
├── postId (uuid, FK → Post.id)
├── userId (uuid, FK → User.id)
├── createdAt (timestamptz)
└── UNIQUE(postId, userId)

Media
├── id (uuid, PK)
├── uploaderId (uuid, FK → User.id)
├── type (enum: IMAGE/VIDEO)
├── url (text)
├── thumbnailUrl (text, nullable)
├── size (bigint, nullable)
└── createdAt (timestamptz)

Block
├── id (uuid, PK)
├── blockerId (uuid, FK → User.id)
├── blockedId (uuid, FK → User.id)
├── createdAt (timestamptz)
└── UNIQUE(blockerId, blockedId)

Report
├── id (uuid, PK)
├── reporterId (uuid, FK → User.id)
├── targetType (enum: USER/POST/MESSAGE)
├── targetId (uuid)
├── reason (text)
├── status (enum: PENDING/RESOLVED/DISMISSED)
└── createdAt (timestamptz)
```

### 6-2. PostGIS 핵심(필수)

- `geom: geography(Point, 4326)`
- `GIST index` 적용
- `nearby`는 Prisma 공간타입 한계로 `queryRaw` 사용

PostGIS/인덱스/nearby 쿼리 예시:

```sql
-- Extension 활성화
CREATE EXTENSION IF NOT EXISTS postgis;

-- 인덱스 생성 (필수)
CREATE INDEX IF NOT EXISTS idx_user_location_geom ON user_location USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_user_location_updated_at ON user_location (updated_at);

-- Nearby 쿼리 예시 (Prisma $queryRaw)
SELECT
  u.id AS "userId",
  u.nickname,
  u.profile_image_url AS "profileImageUrl",
  ST_Distance(ul.geom, ST_Point($2, $1)::geography) AS distance
FROM user_location ul
JOIN users u ON u.id = ul.user_id
WHERE ul.updated_at > NOW() - INTERVAL '15 minutes'
  AND ul.visibility <> 'hidden'
  AND ST_DWithin(ul.geom, ST_Point($2, $1)::geography, $3)
ORDER BY distance;
```

---

## 7) 구현 순서(백엔드 기준)

- Auth + User/Dog 프로필
- PostGIS 세팅 + Location update/nearby
- Match request/accept + ChatRoom 생성
- WebSocket 채팅 + 메시지 저장/조회
- Posts + Media 업로드 + 댓글/좋아요
- Block/Report 최소 기능

---

## 8) MVP 체크리스트(수용 기준 재정리)

- **지도/근처검색**
  - 최근 15분 사용자만 반환
  - 기본 반경 2km에서 지연 없이 동작(인덱스)
- **매칭/채팅**
  - 수락 시 채팅방 생성(중복 방지)
  - 메시지 저장/조회/실시간 전송
  - 채팅방 권한 체크(비인가 접근 차단)
- **피드**
  - 작성/목록/상세/댓글/좋아요 + 페이징
- **차단/신고**
  - 차단 시 지도/피드/채팅/매칭에서 영향 반영

---

## 9) 비기능 요구사항(메인 문서)

- 입력 검증
  - DTO + `class-validator` 기반
  - 숫자/범위(예: `lat/lng`, `radius`) 검증
- 인증/인가
  - REST는 Guard로 보호
  - WebSocket은 연결 시 JWT 인증 + room 권한 체크
- 업로드 파일 검증/제한
  - 이미지: `jpg/png/webp` / 예: 5MB
  - 영상: `mp4/webm` / 예: 50~100MB
- Rate limit(권장)
  - `/matches/request`, `/location` 최소 방어
- 에러 응답 형식 통일
  - `{ code, message, details }` 형태 권장
- 문서화
  - Swagger(OpenAPI) 제공
- 환경변수 분리
  - DB/JWT/업로드 경로/프론트 도메인(CORS) 등 운영 설정을 환경변수로 분리
