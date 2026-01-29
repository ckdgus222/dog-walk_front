# 강아지 산책 메이트 UI - 구현 계획서

강아지 산책 메이트 서비스를 위한 UI-only Next.js 프로토타입입니다.
모든 데이터는 Mock으로 구성되며, 실제 API 호출이나 인증은 포함되지 않습니다.

---

## 기술 스택

| 항목       | 기술                     |
| ---------- | ------------------------ |
| 프레임워크 | Next.js 16 (App Router)  |
| 언어       | TypeScript               |
| 스타일링   | Tailwind CSS v4          |
| 아이콘     | lucide-react             |
| 테마       | Amber (주황/호박색 계열) |

---

## 디렉토리 구조

```
src/
├── app/
│   ├── (app)/              # 메인 라우트 그룹 (AppShell 적용)
│   │   ├── map/            # 지도 페이지 (핵심)
│   │   ├── feed/           # 피드 페이지
│   │   ├── chat/           # 채팅 목록
│   │   │   └── [roomId]/   # 채팅방 상세
│   │   └── mypage/         # 마이페이지
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # / → /map 리다이렉트
├── components/
│   ├── ui/                 # 공통 UI 컴포넌트
│   └── layout/             # AppShell, AppNav, AppHeader
├── features/
│   ├── map/                # 지도 관련 컴포넌트
│   ├── feed/               # 피드 관련 컴포넌트
│   └── chat/               # 채팅 관련 컴포넌트
├── lib/
│   ├── mock/               # Mock 데이터
│   └── utils.ts            # 유틸리티 함수
└── routes.ts               # 라우트 상수
```

---

## 디자인 업그레이드 (v2)

- **디자인 테마**: "Premium Warmth" - 따뜻하고 활기찬 느낌의 고품질 UI
- **주요 변경 사항**:
  - **컬러**: Amber-Orange 그라데이션, Off-white 배경 적용
  - **컴포넌트**: 버튼/카드에 Soft Shadow 및 Hover Scale 효과 추가
  - **레이아웃**: Glassmorphism (배경 블러) 효과를 네비게이션과 오버레이에 적용
  - **지도**: 마커 애니메이션 강화 및 커스텀 디자인
  - **피드/마이페이지**: 시각적 계층 구조 강화 및 카드 스타일 개선

---

## 주요 기능별 구현 계획

### 1. Map (지도) - 핵심 기능

- **경로**: `/map`
- **구성요소**:
  - `MapPlaceholder`: 지도 SDK 없이 시각적 placeholder
  - `FilterPanel`: 좌측 필터 패널 (산책 스타일, 크기, 시간)
  - `MateDetailSheet`: 마커 클릭 시 프로필 상세
  - "산책 메이트 요청" CTA 버튼

### 2. Feed (피드)

- **경로**: `/feed`
- **구성요소**:
  - `FeedCard`: 게시물 카드 (이미지, 텍스트, 좋아요/댓글)
  - `FeedWidget`: 인기 태그, 추천 유저 (데스크탑 우측)

### 3. Chat (채팅)

- **경로**: `/chat`, `/chat/[roomId]`
- **구성요소**:
  - `ChatListItem`: 대화 목록 아이템
  - `ChatWindow`: 메시지 버블 + 입력창

### 4. MyPage (마이페이지)

- **경로**: `/mypage`
- **구성요소**:
  - 프로필 카드 (이름, 소개, 반려견 정보)
  - 통계 그리드 (산책 횟수, 메이트 수, 매너온도)
  - 최근 산책 기록 리스트

---

## 공통 UI 컴포넌트

| 컴포넌트     | 설명                                             |
| ------------ | ------------------------------------------------ |
| `Button`     | variant: primary/secondary/ghost, size: sm/md/lg |
| `Card`       | CardHeader, CardContent, CardFooter              |
| `Badge`      | variant: default/secondary/outline               |
| `Input`      | leftIcon 지원                                    |
| `Panel`      | title, rightSlot                                 |
| `EmptyState` | 빈 상태 UI                                       |
| `Skeleton`   | 로딩 placeholder                                 |

---

## 상태 UI 규칙

각 페이지는 `DEMO_STATE` 상수로 다음 상태를 전환:

- `"default"`: 정상 데이터 표시
- `"empty"`: EmptyState 컴포넌트 표시

---

## 검증 계획

### 자동화

```bash
npm run build   # 빌드 성공 확인
npm run dev     # 개발 서버 실행
```

### 수동 검증

1. 모든 라우트 접근 확인 (`/`, `/map`, `/feed`, `/chat`, `/mypage`)
2. 반응형 레이아웃 테스트 (모바일/데스크탑)
3. 상호작용 테스트 (마커 클릭, 채팅 입력 등)
