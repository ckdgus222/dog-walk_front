# Frontend 검수 체크리스트

작성일: 2026-02-20  
기준 문서: `docs/API_CHECKLIST_FRONTEND.md`  
기준 코드: `src/*` (현재 워크스페이스)

## 상태 기준

- `✅ 구현완료`: API 호출 코드가 있고 화면/훅에서 실제 사용
- `🟨 부분구현`: API 함수는 있으나 화면/훅 미연동
- `⬜ 미구현`: API 함수/연동 코드 없음

## 구현 현황 스냅샷 (필수 API 27개 기준)

- 필수 API: `27`
- `✅ 구현완료`: `3`
- `🟨 부분구현`: `2`
- `⬜ 미구현`: `22`
- 선택 API(3개): 전부 미구현

## Endpoint 검수표

### 2-1. Auth / Session

- `✅ POST /auth/login`  
  근거: `src/lib/api/auth.ts:46`, `src/features/auth/hooks/useLoginMutation.ts:13`
- `✅ POST /auth/signup`  
  근거: `src/lib/api/auth.ts:39`, `src/features/auth/hooks/useSignupMutation.ts:35`
- `✅ POST /auth/refresh`  
  근거: `src/lib/auth.ts:42`, `src/lib/api/auth.ts:53`, `src/app/providers.tsx:15`
- `🟨 GET /me` (정의만, UI 미연동)  
  근거: `src/lib/api/auth.ts:62`

### 2-2. Media Upload

- `🟨 POST /media/upload` (구현은 있으나 현재 가입 플로우에서는 비활성)  
  근거: `src/features/auth/DogProfileForm.tsx:58`, `src/features/auth/SignupForm.tsx:170`

### 2-3 ~ 2-8. 나머지 도메인

- `⬜ Location/Map` (`POST /location`, `GET /map/nearby`)
- `⬜ Match` (`/matches/*`)
- `⬜ Chat` (`GET /chats`, `GET /chats/:roomId/messages`, 선택 REST/WS)
- `⬜ Feed/Posts` (`/posts*`)
- `⬜ MyPage/Profile/Dogs` (`PATCH /me`, `/me/dogs*`, `GET /posts?author=me`)
- `⬜ Safety` (`/blocks*`, `/reports`)

## 계약 확정 항목(문서 3번 섹션 기준)

- `✅` 회원가입 1-step 최종 고정(user+dog 트랜잭션)
- `✅` Refresh `POST /auth/refresh` 고정
- `✅` 업로드 인증 정책 Protected(Bearer) 고정

## 실제 검수 체크리스트 (릴리즈 전)

- [ ] 로그인 성공 시 토큰 저장 후 `/map` 이동 확인
- [ ] 보호 API 401 발생 시 refresh 후 복구/실패 시 `/login` 이동 확인
- [ ] 회원가입 후(마이페이지) 강아지 이미지 업로드 성공/실패 UX 확인
- [ ] API 오류 메시지가 UI에서 사용자에게 보이는지 확인
- [ ] mock 화면(Map/Feed/Chat/MyPage)과 API 연동 화면 범위가 일치하는지 확인

## 업데이트 규칙

1. API 구현 상태 변경 시 이 문서의 스냅샷을 갱신합니다.
2. 작업 진행 상태는 `docs/TASK_BOARD.md`에서만 갱신합니다.
3. API 스펙 자체 변경은 `docs/API_CHECKLIST_FRONTEND.md`에서만 갱신합니다.
