# 프로젝트 구조 한눈에 보기

> 작성일: 2026-02-20  
> 목적: 학습을 위한 프로젝트 구조 정리

문서 책임:
- 이 문서는 코드 구조/아키텍처 이해만 담당합니다.
- 작업 진행 상태는 `docs/TASK_BOARD.md`에서 관리합니다.
- API 계약은 `docs/API_CHECKLIST_FRONTEND.md`에서 관리합니다.

---

## 1. 디렉토리 구조 (간단 버전)

```
src/
├── app/           # 페이지 (URL 경로)
├── features/      # 각 페이지 전용 UI + 훅
├── components/    # 공통 UI (버튼, 카드 등)
└── lib/           # 인프라 (API, 인증, 유틸)
```

---

## 2. 각 디렉토리 역할

### `app/` — 페이지 (URL 경로)

```
app/
├── (auth)/              # 인증 그룹 (로그인 전)
│   ├── layout.tsx       #   → 배경 효용 레이아웃
│   ├── login/           #   → /login
│   └── signup/          #   → /signup
│
├── (app)/               # 앱 그룹 (로그인 후)
│   ├── layout.tsx       #   → 네비게이션 바 포함
│   ├── map/             #   → /map
│   ├── feed/            #   → /feed
│   ├── chat/            #   → /chat
│   └── mypage/          #   → /mypage
│
├── layout.tsx           # 루트 레이아웃
└── providers.tsx       # React Query 설정
```

**핵심:**
- `(폴더명)` → URL에 포함되지 않음 (레이아웃 분리용)
- `[변수명]` → 동적 URL 파라미터 (예: `/chat/[roomId]`)

---

### `features/` — 각 페이지 전용 기능

```
features/
├── auth/
│   ├── LoginForm.tsx        # 로그인 폼 UI
│   ├── SignupForm.tsx       # 회원가입 폼 UI
│   └── hooks/
│       ├── useLoginMutation.ts   # 로그인 API 훅
│       └── useSignupMutation.ts  # 회원가입 API 훅
│
├── map/
│   └── components.tsx       # 지도 관련 UI
│
├── chat/
│   └── components.tsx       # 채팅 관련 UI
│
└── feed/
    └── components.tsx       # 피드 관련 UI
```

**핵심:**
- 페이지에서만 쓰는 UI와 훅을 모아둠
- 다른 페이지에서 재사용 안 함

---

### `components/` — 공통 UI

```
components/
├── layout/
│   ├── AppShell.tsx         # 네비게이션 바 포함 레이아웃
│   └── Header.tsx           # 페이지 헤더
│
└── ui/
    ├── Button.tsx           # 버튼
    ├── Card.tsx             # 카드
    ├── Input.tsx            # 입력창
    └── ...
```

**핵심:**
- 어디서든 재사용 가능한 UI
- 비즈니스 로직 없음 (순수 UI)

---

### `lib/` — 인프라

```
lib/
├── api.ts              # fetch 래퍼 (토큰 자동 첨부)
├── auth.ts             # 토큰 저장/조회 (localStorage)
├── utils.ts            # 공통 유틸 함수
│
├── api/                # API 함수 모음
│   └── auth.ts         #   → login(), signup(), refresh()
│
└── mock/               # Mock 데이터
    ├── chat.ts
    ├── feed.ts
    └── map.ts
```

---

## 3. 파일별 한 줄 요약

| 파일 | 역할 |
|------|------|
| `lib/api.ts` | fetch를 감싸서 토큰 자동 첨부, 에러 처리 |
| `lib/auth.ts` | 토큰을 localStorage에 저장/조회/삭제 |
| `lib/utils.ts` | 날짜 포맷, 클래스 병합 등 잡다한 함수 |
| `lib/api/auth.ts` | 로그인, 회원가입, 리프레시 API 함수 |
| `providers.tsx` | React Query 설정, 401 에러 자동 처리 |

---

## 4. 코드 연결 구조

### 로그인 흐름

```
┌─────────────────┐
│ login/page.tsx  │  ← 페이지 (훅 호출)
└────────┬────────┘
         │ 호출
         ↓
┌─────────────────────┐
│ useLoginMutation.ts │  ← 훅 (API 호출 + 성공 처리)
└────────┬────────────┘
         │ 호출
         ↓
┌─────────────────┐
│ lib/api/auth.ts │  ← API 함수 (엔드포인트 정의)
└────────┬────────┘
         │ 호출
         ↓
┌─────────────────┐
│ lib/api.ts      │  ← fetch 래퍼 (토큰 첨부)
└────────┬────────┘
         │ 호출
         ↓
┌─────────────────┐
│ lib/auth.ts     │  ← 토큰 저장
└─────────────────┘
```

### import 연결

```
login/page.tsx
    │
    ├── import LoginForm ─────────→ features/auth/LoginForm.tsx
    │
    └── import useLoginMutation ─→ features/auth/hooks/useLoginMutation.ts
                                        │
                                        ├── import authApi ──→ lib/api/auth.ts
                                        │                           │
                                        │                           └── import apiFetch ──→ lib/api.ts
                                        │                                                      │
                                        │                                                      └── import getAccessToken ──→ lib/auth.ts
                                        │
                                        └── import setAccessToken ──→ lib/auth.ts
```

---

## 5. 새 기능 추가하는 방법

### 예: Map에 실제 API 연동

**1단계: API 함수 만들기**
```tsx
// lib/api/map.ts 생성
import { apiFetch } from "../api";

export const mapApi = {
  getNearby: (lat, lng) => apiFetch(`/map/nearby?lat=${lat}&lng=${lng}`),
};
```

**2단계: 훅 만들기**
```tsx
// features/map/hooks/useNearbyQuery.ts 생성
import { useQuery } from "@tanstack/react-query";
import { mapApi } from "@/lib/api/map";

export const useNearbyQuery = (lat, lng) => {
  return useQuery({
    queryKey: ["map", "nearby"],
    queryFn: () => mapApi.getNearby(lat, lng),
  });
};
```

**3단계: 페이지에서 사용**
```tsx
// app/(app)/map/page.tsx 수정
import { useNearbyQuery } from "@/features/map/hooks/useNearbyQuery";

const MapPage = () => {
  const { data: markers } = useNearbyQuery(37.5, 126.9);
  // 기존: MAP_MARKERS (mock)
  // 변경: markers (실제 API)
};
```

---

## 6. 핵심 패턴 정리

```
┌────────────────────────────────────────────────────────────┐
│                        패턴                                │
├────────────────────────────────────────────────────────────┤
│ 1. 페이지 (page.tsx)                                      │
│    → 훅 호출, 컴포넌트에 props 전달                        │
│                                                            │
│ 2. 컴포넌트 (Component.tsx)                               │
│    → UI만 담당, 이벤트는 페이지에 전달                     │
│                                                            │
│ 3. 훅 (useXxx.ts)                                         │
│    → API 호출, 성공/실패 처리                              │
│                                                            │
│ 4. API 함수 (lib/api/xxx.ts)                              │
│    → 엔드포인트 정의, apiFetch 호출                         │
│                                                            │
│ 5. apiFetch (lib/api.ts)                                  │
│    → 토큰 자동 첨부, 에러 처리                              │
└────────────────────────────────────────────────────────────┘
```

---

## 7. 자주 수정하는 파일

| 작업 | 수정할 파일 |
|------|------------|
| UI 수정 | `features/xxx/Component.tsx` |
| API 엔드포인트 변경 | `lib/api/xxx.ts` |
| 새 기능 추가 | `features/xxx/hooks/useXxx.ts` |
| 공통 UI 추가 | `components/ui/Xxx.tsx` |

---

## 8. 현재 구현 상태

| 도메인 | 상태 | 비고 |
|--------|------|------|
| Auth | ✅ 실제 API | login, signup, refresh |
| Map | 🔶 Mock | `MAP_MARKERS` 사용 |
| Feed | 🔶 Mock | `FEED_POSTS` 사용 |
| Chat | 🔶 Mock | `CHAT_ROOMS` 사용 |
| MyPage | 🔶 Mock | `CURRENT_USER` 사용 |

---

## 9. 다음 단계

1. `providers.tsx` 학습 → 401 에러 자동 처리 이해
2. Map 도메인 API 연동 실습
3. Chat, Feed 도메인 API 연동
4. WebSocket (실시간 채팅) 추가
