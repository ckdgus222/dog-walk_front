# 강아지 산책 메이트 UI - Walkthrough

Next.js App Router와 Tailwind CSS를 사용한 UI-only 프로토타입입니다.

---

## 구현 완료 기능

### 1. 지도 (Map) - 핵심 기능

- **경로**: `/map` (홈에서 자동 리다이렉트)
- **기능**:
  - 지도 Placeholder (격자 패턴 + 가상 마커)
  - 마커 클릭 시 프로필 상세 패널 표시
  - 좌측 필터 패널 (데스크탑) / 오버레이 (모바일)
  - "산책 메이트 요청" 플로팅 버튼

### 2. 피드 (Feed)

- **경로**: `/feed`
- **기능**:
  - 인스타그램 스타일의 피드 카드 리스트
  - 좋아요, 댓글 수 표시
  - 우측 위젯: 인기 태그, 추천 메이트 (데스크탑)

### 3. 채팅 (Chat)

- **경로**: `/chat`, `/chat/room-1` 등
- **기능**:
  - 대화 목록 (읽지 않은 메시지 배지)
  - 채팅방: 메시지 버블 + 입력창
  - 반응형: 데스크탑은 분할 뷰, 모바일은 별도 페이지

### 4. 마이페이지 (MyPage)

- **경로**: `/mypage`
- **기능**:
  - 프로필 카드 (이름, 소개, 반려견 정보)
  - 통계: 총 산책, 메이트 수, 매너온도
  - 최근 산책 기록 리스트

---

## 파일 구조 요약

```
src/
├── app/(app)/
│   ├── map/page.tsx        # 지도 페이지
│   ├── feed/page.tsx       # 피드 페이지
│   ├── chat/page.tsx       # 채팅 목록
│   ├── chat/[roomId]/page.tsx  # 채팅방
│   └── mypage/page.tsx     # 마이페이지
├── components/
│   ├── ui/index.tsx        # Button, Card, Badge, Input 등
│   └── layout/index.tsx    # AppShell, AppNav, AppHeader
├── features/
│   ├── map/components.tsx  # 필터, 마커, 디테일시트
│   ├── feed/components.tsx # 피드카드, 위젯
│   └── chat/components.tsx # 채팅리스트, 채팅윈도우
└── lib/mock/
    ├── map.ts              # 마커, 프로필 데이터
    ├── feed.ts             # 게시물 데이터
    ├── chat.ts             # 채팅방, 메시지 데이터
    └── user.ts             # 사용자 프로필 데이터
```

---

## 실행 방법

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
open http://localhost:3000
```

---

## 확인 체크리스트

| 항목                   | 경로           | 상태 |
| ---------------------- | -------------- | ---- |
| 홈 → 지도 리다이렉트   | `/` → `/map`   | ✅   |
| 지도 마커 클릭         | `/map`         | ✅   |
| 필터 패널              | `/map`         | ✅   |
| 피드 카드 리스트       | `/feed`        | ✅   |
| 채팅 목록              | `/chat`        | ✅   |
| 채팅방 상세            | `/chat/room-1` | ✅   |
| 마이페이지 프로필      | `/mypage`      | ✅   |
| 모바일 하단 네비게이션 | 전체           | ✅   |
| 데스크탑 사이드바      | 전체           | ✅   |

---

## 참고 사항

- **데이터**: 모든 데이터는 `src/lib/mock/*`에 정적으로 정의됨
- **지도**: 실제 지도 SDK 없이 CSS로 구현된 Placeholder
- **테마**: Amber(호박색) 기반, Inter 폰트
- **상태 관리**: `useState`만 사용 (외부 라이브러리 없음)
