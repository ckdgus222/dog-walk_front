# Dog Walk Mate - Backend MVP 기능 기획서 v1.0

> **기술 스택**: NestJS + Prisma + PostgreSQL (PostGIS)
> **프론트엔드 지도**: 카카오맵 (카카오 Maps SDK)
> **위치 검색 조건**: 최근 15분 이내 업데이트된 사용자만 마커 노출

---

## 1. 목표와 범위

### 1.1 MVP 목표

| 기능                       | 설명                                                               |
| -------------------------- | ------------------------------------------------------------------ |
| **지도 (`/map`)**          | 주변 산책 메이트를 마커로 표시 (최근 15분 이내 위치 업데이트 유저) |
| **매칭**                   | 마커 클릭 → 프로필 확인 → 산책 요청 → 수락/거절                    |
| **채팅 (`/chat`)**         | 수락 시 1:1 채팅방 자동 생성 + 실시간 메시지 (WebSocket)           |
| **피드 (`/feed`)**         | 브이로그/일기 게시글 (사진/영상) 업로드 + 댓글/좋아요              |
| **마이페이지 (`/mypage`)** | 내 프로필, 강아지 프로필, 내 게시글 관리                           |

### 1.2 MVP 제외 항목 (명시적 Scope Out)

- 결제, 구독 기능
- 추천 알고리즘 (고도화)
- 그룹 산책 / 다대다 채팅
- 고급 영상 편집 (압축/트랜스코딩은 2차)
- 관리자 UI (DB 직접 관리로 대체)

---

## 2. 사용자 역할

| 역할                   | 설명                                           |
| ---------------------- | ---------------------------------------------- |
| **일반 사용자 (User)** | 위치 공유, 매칭, 채팅, 게시글 작성/열람        |
| **관리자 (Admin)**     | 신고 처리/차단 관리 (초기에는 DB로만, UI 없음) |

---

## 3. 핵심 정책 (불변)

| 항목               | 정책                                              |
| ------------------ | ------------------------------------------------- |
| **지도 공급자**    | 카카오맵 (프론트엔드 SDK)                         |
| **위치 검색**      | PostGIS 반경 검색 (`ST_DWithin`)                  |
| **마커 노출 기준** | `updatedAt > NOW() - INTERVAL '15 minutes'`       |
| **초기 배포**      | 온프레미스 (Docker/클라우드 전환 가능하도록 설계) |

---

## 4. 기능 상세 요구사항

### A. 인증/회원/프로필

#### A-1. 회원가입/로그인 (MVP 최소)

- **인증 방식**: 이메일/비밀번호 (또는 소셜 로그인 중 1가지)
- **토큰**: JWT 기반 Access Token (Refresh Token은 선택)

#### A-2. 사용자 프로필

| 필드           | 필수 | 설명              |
| -------------- | ---- | ----------------- |
| `nickname`     | ✅   | 닉네임            |
| `profileImage` | ❌   | 프로필 이미지 URL |
| `bio`          | ❌   | 자기소개          |

#### A-3. 강아지 프로필 ⭐ (핵심)

| 필드             | 필수 | 설명                                    |
| ---------------- | ---- | --------------------------------------- |
| `name`           | ✅   | 강아지 이름                             |
| `breed`          | ✅   | 견종                                    |
| `age`            | ❌   | 나이                                    |
| `gender`         | ❌   | 성별                                    |
| `neutered`       | ❌   | 중성화 여부                             |
| `photo`          | ❌   | 강아지 사진 URL                         |
| `personality`    | ❌   | 성향 태그 (`활발`, `소심`, `친화적` 등) |
| `walkPreference` | ❌   | 산책 선호 (시간대/거리/리드줄 여부)     |

> **수용 기준**: 유저는 최소 1마리 강아지 프로필을 등록할 수 있어야 함

---

### B. 위치 업데이트 & 주변 검색 (PostGIS)

#### B-1. 위치 업데이트 (`POST /location`)

```
{
  "lat": 37.5285,
  "lng": 126.9327,
  "accuracy": 10  // 선택
}
```

**저장 필드**:
| 컬럼 | 타입 | 설명 |
|------|------|------|
| `geom` | `geography(Point, 4326)` | PostGIS 좌표 |
| `updatedAt` | `timestamp` | 마지막 업데이트 시각 |
| `accuracy` | `float` | GPS 정확도 (m) |
| `visibility` | `enum` | 공개 범위 |

**Visibility 옵션**:
| 값 | 설명 |
|----|------|
| `public_approx` | (기본) 약간 오프셋된 위치 저장/응답 |
| `public_exact` | 정확 위치 (MVP에서는 생략 가능) |
| `hidden` | 지도에 노출 안 함 |

#### B-2. 주변 검색 (`GET /map/nearby`)

```
GET /map/nearby?lat=37.5285&lng=126.9327&radius=2000
```

**조건 (SQL)**:

```sql
WHERE updated_at > NOW() - INTERVAL '15 minutes'
  AND ST_DWithin(geom, ST_Point(lng, lat)::geography, radius)
```

**응답**:

```json
[
  {
    "userId": "uuid",
    "nickname": "string",
    "profileImage": "url",
    "dog": { "name": "뽀미", "breed": "포메라니안", "photo": "url" },
    "distance": 450 // meters
  }
]
```

> **수용 기준**:
>
> - 반경 2km(기본값)에서 빠르게 목록 반환 (GIST 인덱스 필수)
> - 15분 지난 유저는 **절대** 응답에 포함되지 않음

---

### C. 매칭 (산책 요청/수락)

#### C-1. 요청 상태 흐름

```
PENDING → ACCEPTED / REJECTED / CANCELED / EXPIRED
```

#### C-2. API 흐름

1. `POST /matches/request` - 산책 요청 생성
2. `GET /matches/inbox` - 내게 온 요청 목록
3. `POST /matches/:id/accept` - 수락 → **채팅방 자동 생성**
4. `POST /matches/:id/reject` - 거절
5. `POST /matches/:id/cancel` - 요청자가 취소

#### C-3. 안전장치 (MVP 권장)

- 차단된 유저에게 요청 불가
- Rate Limit (IP/유저 단위, 과도한 요청 방지)

> **수용 기준**: 수락 시 `ChatRoom`이 자동 생성되거나 기존 방 재사용

---

### D. 1:1 채팅 (실시간)

#### D-1. 기술

- **프로토콜**: WebSocket (Socket.IO 권장)
- **메시지 타입**:
  | 타입 | 설명 |
  |------|------|
  | `TEXT` | 일반 텍스트 (필수) |
  | `IMAGE` | 이미지 첨부 (선택) |
  | `SYSTEM` | 시스템 메시지 ("매칭 성사" 등) |

#### D-2. WebSocket Events

| Event            | Direction       | Payload                            |
| ---------------- | --------------- | ---------------------------------- |
| `joinRoom`       | Client → Server | `{ roomId }`                       |
| `sendMessage`    | Client → Server | `{ roomId, type, text, mediaId? }` |
| `messageCreated` | Server → Client | `{ message }`                      |

#### D-3. REST API

- `GET /chats` - 채팅방 목록 (최근 메시지, 읽지 않은 수 포함)
- `GET /chats/:roomId/messages?cursor=` - 메시지 조회 (Cursor 기반 페이징)

> **수용 기준**: 매칭 수락 후 채팅방 생성, 메시지 저장/조회 가능

---

### E. 피드 (브이로그/일기)

#### E-1. 게시글 구조

| 필드       | 필수 | 설명                           |
| ---------- | ---- | ------------------------------ |
| `content`  | ✅   | 텍스트 본문                    |
| `media[]`  | ❌   | 첨부 미디어 (사진/영상, 0~N개) |
| `tags[]`   | ❌   | 태그 배열                      |
| `location` | ❌   | 위치 태그                      |

#### E-2. API

| Method   | Endpoint              | 설명                              |
| -------- | --------------------- | --------------------------------- |
| `POST`   | `/posts`              | 게시글 작성                       |
| `GET`    | `/posts?cursor=`      | 피드 목록 (최신순, Cursor 페이징) |
| `GET`    | `/posts/:id`          | 게시글 상세 (댓글 포함)           |
| `POST`   | `/posts/:id/comments` | 댓글 작성                         |
| `POST`   | `/posts/:id/like`     | 좋아요                            |
| `DELETE` | `/posts/:id/like`     | 좋아요 취소                       |

> **수용 기준**: 게시글 CRUD + 댓글/좋아요 + 페이징 구현

---

### F. 마이페이지

- 내 프로필 수정
- 강아지 프로필 수정
- 내 게시글 목록

> MVP에서는 "산책 로그"를 별도 테이블로 만들지 않고, **게시글 = 로그**로 대체 가능

---

### G. 미디어 업로드

#### G-1. 업로드 방식

- **MVP**: 서버 로컬 파일 저장 (온프레미스)
- **2차**: S3 호환 스토리지 전환

#### G-2. 파일 검증

| 타입   | 허용 확장자          | 용량 제한 |
| ------ | -------------------- | --------- |
| 이미지 | `jpg`, `png`, `webp` | 5MB       |
| 영상   | `mp4`, `webm`        | 50~100MB  |

#### G-3. API

```
POST /media/upload
→ { mediaId, url, type }
```

---

### H. 신고/차단 (최소 기능)

| 기능     | 설명                                       |
| -------- | ------------------------------------------ |
| **차단** | 상대가 지도/피드/채팅에서 숨김 + 요청 불가 |
| **신고** | 사유 + 대상 (유저/게시글/메시지) 저장      |

```
POST /blocks        # 차단
DELETE /blocks/:userId  # 차단 해제
POST /reports       # 신고
```

---

## 5. API 엔드포인트 요약

### Auth

| Method | Endpoint       | 설명         |
| ------ | -------------- | ------------ |
| POST   | `/auth/signup` | 회원가입     |
| POST   | `/auth/login`  | 로그인       |
| GET    | `/me`          | 내 정보 조회 |

### Profile

| Method | Endpoint          | 설명             |
| ------ | ----------------- | ---------------- |
| GET    | `/users/:id`      | 유저 프로필 조회 |
| PATCH  | `/me`             | 내 프로필 수정   |
| POST   | `/me/dogs`        | 강아지 등록      |
| PATCH  | `/me/dogs/:dogId` | 강아지 수정      |

### Location

| Method | Endpoint      | 설명             |
| ------ | ------------- | ---------------- |
| POST   | `/location`   | 내 위치 업데이트 |
| GET    | `/map/nearby` | 주변 메이트 검색 |

### Match

| Method | Endpoint              | 설명           |
| ------ | --------------------- | -------------- |
| POST   | `/matches/request`    | 산책 요청      |
| GET    | `/matches/inbox`      | 받은 요청 목록 |
| POST   | `/matches/:id/accept` | 수락           |
| POST   | `/matches/:id/reject` | 거절           |
| POST   | `/matches/:id/cancel` | 취소           |

### Chat

| Method | Endpoint                  | 설명        |
| ------ | ------------------------- | ----------- |
| GET    | `/chats`                  | 채팅방 목록 |
| GET    | `/chats/:roomId/messages` | 메시지 조회 |

### Posts

| Method      | Endpoint              | 설명        |
| ----------- | --------------------- | ----------- |
| POST        | `/posts`              | 게시글 작성 |
| GET         | `/posts`              | 피드 목록   |
| GET         | `/posts/:id`          | 게시글 상세 |
| POST        | `/posts/:id/comments` | 댓글 작성   |
| POST/DELETE | `/posts/:id/like`     | 좋아요 토글 |

### Media

| Method | Endpoint        | 설명          |
| ------ | --------------- | ------------- |
| POST   | `/media/upload` | 미디어 업로드 |

### Safety

| Method | Endpoint          | 설명      |
| ------ | ----------------- | --------- |
| POST   | `/blocks`         | 차단      |
| DELETE | `/blocks/:userId` | 차단 해제 |
| POST   | `/reports`        | 신고      |

---

## 6. DB 엔티티 (ERD 요약)

```
User
├── id (uuid, PK)
├── email
├── passwordHash
├── nickname
├── profileImage
├── bio
├── createdAt
└── updatedAt

Dog
├── id (uuid, PK)
├── userId (FK → User)
├── name
├── breed
├── age
├── gender
├── neutered
├── photo
├── personality (json)
└── walkPreference (json)

UserLocation
├── id (uuid, PK)
├── userId (FK → User, UNIQUE)
├── geom (geography(Point, 4326))  ← PostGIS
├── accuracy
├── visibility (enum)
└── updatedAt

MatchRequest
├── id (uuid, PK)
├── fromUserId (FK)
├── toUserId (FK)
├── status (enum: PENDING/ACCEPTED/REJECTED/CANCELED/EXPIRED)
├── createdAt
└── processedAt

ChatRoom
├── id (uuid, PK)
├── matchRequestId (FK, nullable)
├── createdAt
└── participants (relation → User)

ChatMessage
├── id (uuid, PK)
├── roomId (FK → ChatRoom)
├── senderId (FK → User)
├── type (enum: TEXT/IMAGE/SYSTEM)
├── content
├── mediaId (FK, nullable)
├── createdAt
└── readAt (nullable)

Post
├── id (uuid, PK)
├── authorId (FK → User)
├── content
├── tags (json)
├── locationTag (json)
├── createdAt
└── updatedAt

PostMedia
├── id (uuid, PK)
├── postId (FK → Post)
├── mediaId (FK → Media)
└── order (int)

Comment
├── id (uuid, PK)
├── postId (FK → Post)
├── authorId (FK → User)
├── content
├── createdAt
└── updatedAt

Like
├── id (uuid, PK)
├── postId (FK → Post)
├── userId (FK → User)
├── createdAt
└── UNIQUE(postId, userId)

Media
├── id (uuid, PK)
├── uploaderId (FK → User)
├── type (enum: IMAGE/VIDEO)
├── url
├── thumbnailUrl
├── createdAt
└── size (bytes)

Block
├── id (uuid, PK)
├── blockerId (FK → User)
├── blockedId (FK → User)
├── createdAt
└── UNIQUE(blockerId, blockedId)

Report
├── id (uuid, PK)
├── reporterId (FK → User)
├── targetType (enum: USER/POST/MESSAGE)
├── targetId (uuid)
├── reason (text)
├── status (enum: PENDING/RESOLVED/DISMISSED)
└── createdAt
```

### PostGIS 핵심 설정

```sql
-- Extension 활성화
CREATE EXTENSION IF NOT EXISTS postgis;

-- 인덱스 생성 (필수)
CREATE INDEX idx_user_location_geom ON user_location USING GIST (geom);
CREATE INDEX idx_user_location_updated ON user_location (updated_at);

-- Nearby 쿼리 예시 (Prisma $queryRaw)
SELECT u.*, ST_Distance(ul.geom, ST_Point($lng, $lat)::geography) AS distance
FROM user_location ul
JOIN users u ON u.id = ul.user_id
WHERE ul.updated_at > NOW() - INTERVAL '15 minutes'
  AND ST_DWithin(ul.geom, ST_Point($lng, $lat)::geography, $radius)
ORDER BY distance;
```

---

## 7. 구현 순서 (백엔드 기준)

| 순서 | 모듈                   | 세부 내용                               |
| ---- | ---------------------- | --------------------------------------- |
| 1️⃣   | **Auth + Profile**     | 회원가입/로그인, User/Dog 프로필 CRUD   |
| 2️⃣   | **Location (PostGIS)** | 위치 업데이트, Nearby 검색, 15분 조건   |
| 3️⃣   | **Matching**           | 요청/수락/거절, ChatRoom 자동 생성      |
| 4️⃣   | **Chat (WebSocket)**   | Socket.IO 연동, 메시지 저장/조회        |
| 5️⃣   | **Posts + Media**      | 게시글 CRUD, 미디어 업로드, 댓글/좋아요 |
| 6️⃣   | **Safety**             | Block/Report 최소 기능                  |

---

## 8. 검토 의견 (Reviewer Notes)

### ✅ 잘 정리된 부분

1. **MVP 범위 명확화**: 제외 항목을 명시하여 Scope Creep 방지
2. **PostGIS 핵심 정책**: 15분 조건, `ST_DWithin`, GIST 인덱스 명시
3. **수용 기준(AC)**: 각 기능별 검증 조건 명시

### 💡 보완 권장 사항

1. **Refresh Token**: 보안 강화를 위해 MVP에서도 구현 권장 (짧은 Access + 긴 Refresh)
2. **EXPIRED 상태 처리**: 요청 만료 시간(예: 24시간) 및 자동 상태 변경 로직 명시 필요
3. **채팅 읽음 처리**: MVP에서는 "읽지 않은 수"만 카운트하는 방식 명시 완료 ✔
4. **미디어 썸네일**: 영상의 경우 서버 사이드 썸네일 생성 또는 클라이언트 리사이징 방식 결정 필요

### ⚠️ 주의 사항

- **Prisma + PostGIS**: Prisma는 공간 타입을 네이티브 지원하지 않음 → `$queryRaw` 사용 필수
- **WebSocket 인증**: Socket.IO 연결 시 JWT 검증 미들웨어 구현 필요

---

**문서 버전**: v1.0
**최종 수정일**: 2026-01-29
**작성자**: AI Assistant (Antigravity)
