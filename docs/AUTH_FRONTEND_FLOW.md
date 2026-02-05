# Auth 프론트엔드 흐름 정리 (현재 코드 기준)

## 범위
- `src/app/(auth)/*` 라우트(로그인/회원가입)
- `src/features/auth/*` UI/폼
- `src/features/auth/hooks/*` TanStack Query mutation 훅
- `src/lib/api.ts`, `src/lib/api/auth.ts` API 레이어
- `src/lib/auth.ts` 토큰 저장/리프레시 로직
- `src/app/providers.tsx` (React Query 전역 에러 처리)
- 강아지 사진 업로드: `DogProfileForm` + `apiFetchFormData`

---

## 1) 파일/모듈 구조 맵

## 라우트
- `src/app/(auth)/layout.tsx`
  - 인증 페이지용 레이아웃(가운데 카드 정렬)
- `src/app/(auth)/login/page.tsx`
  - `LoginForm` + `useLoginMutation` 연결
- `src/app/(auth)/signup/page.tsx`
  - `SignupForm` + `useSignupMutation` 연결

## UI/폼
- `src/features/auth/LoginForm.tsx`
  - 이메일/비밀번호 입력, `onSubmit` 콜백으로 상위에 전달
- `src/features/auth/SignupForm.tsx`
  - Step1(이메일/비번/닉네임) → Step2(강아지 프로필) 단계형
  - 최종 `onSubmit(formData)`
- `src/features/auth/DogProfileForm.tsx`
  - 강아지 정보 입력
  - 이미지 업로드(`apiFetchFormData`) + 미리보기 + 삭제

## TanStack Query 훅
- `src/features/auth/hooks/useLoginMutation.ts`
- `src/features/auth/hooks/useSignupMutation.ts`

## API/인증 유틸
- `src/lib/api.ts`
  - `apiFetch<T>()` JSON 요청
  - `apiFetchFormData<T>()` multipart/form-data 업로드
  - `ApiError(status, message, data?)`
- `src/lib/api/auth.ts`
  - `authApi.signup/login/refresh/getMe`
  - 응답 타입 `AuthResponse`
- `src/lib/auth.ts`
  - 토큰(localStorage) 저장/삭제
  - `attemptRefresh()` (리프레시 토큰으로 accessToken 재발급 시도)

## 전역 Provider
- `src/app/providers.tsx`
  - `QueryClientProvider` 생성
  - Query/Mutation 401 에러에서 `attemptRefresh()` 호출

---

## 2) API 베이스/헤더 규칙

## API_BASE_URL
- `src/lib/api.ts`:
  - `process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"`
- `src/lib/auth.ts`의 `attemptRefresh()`도 동일한 방식으로 별도 선언 사용

## endpoint 슬래시 정규화(최근 적용됨)
- `apiFetch`, `apiFetchFormData`는 endpoint가 `/`로 시작하지 않으면 자동으로 `/${endpoint}`로 보정
  - 예: `"auth/login"` → `"/auth/login"`

## Authorization 헤더
- `apiFetch`, `apiFetchFormData` 모두 내부에서 `getAccessToken()` 확인 후
  - `Authorization: Bearer <accessToken>` 자동 추가

## Refresh Token 전달 방식
- refresh는 쿠키가 아니라 **헤더 `X-Refresh-Token`**로 전달하는 구조

---

## 3) 타입 정의(현재 코드에 존재하는 것들)

## `src/lib/api/auth.ts`
- `type Signup = { email: string; password: string; nickname: string }`
- `export type Login = Pick<Signup, "email" | "password">`
- `export type AuthResponse = { accessToken: string; refreshToken: string; user: { id: string; email: string; nickname: string } }`
- `type RefreshResponse = { accessToken: string; refreshToken?: string }`
- `type MeResponse = { id: string; email: string; nickname: string; profileImage?: string; bio?: string }`

## Signup 폼/훅의 타입(중복 정의됨)
- `src/features/auth/SignupForm.tsx` 내부 `SignupData`
- `src/features/auth/hooks/useSignupMutation.ts` 내부 `SignupData`
- `src/app/(auth)/signup/page.tsx`에서 inline 타입

현재 `SignupData.dog`는 프론트에서 아래 형태로 사용 중:
- `name: string`
- `breed: string`
- `birthYear: string`
- `gender: "male" | "female"`
- `personality: string[]`
- `photoUrl?: string`

---

## 4) TanStack Query 전역 에러(401) 처리 흐름

파일: `src/app/providers.tsx`

- `QueryCache.onError`:
  - 에러가 `ApiError`이고 `status === 401`이면 `attemptRefresh()` 호출
  - refresh 성공 시 `client.invalidateQueries()`로 전체 쿼리 재검증
  - refresh 실패 시 `clearAuth()` 후 `/login`으로 이동

- `MutationCache.onError`:
  - 동일하게 401이면 refresh 시도
  - refresh 실패 시 `/login` 이동
  - **mutation은 자동 재시도하지 않음**

중요:
- 이 Provider가 실제로 루트 레이아웃에서 마운트되어야 위 동작이 유효합니다.
  - 현재 `src/app/layout.tsx`에는 `Providers`가 직접 포함되어 있지 않아서, 실제 앱에서 Provider가 적용 중인지 확인이 필요합니다.

---

## 5) 로그인(Login) 흐름

## UI → 훅 → API 호출
- 페이지: `src/app/(auth)/login/page.tsx`
  - `LoginForm`에서 `onSubmit({ email, password })`
  - `useLoginMutation().mutate(data)` 실행

## `useLoginMutation`
파일: `src/features/auth/hooks/useLoginMutation.ts`
- `useMutation<AuthResponse, Error, Login>`
- `mutationFn`: `authApi.login(data)`
- `onSuccess`:
  - `setAccessToken(data.accessToken)`
  - `setRefreshToken(data.refreshToken)`
  - `router.push("/map")`

## 실제 요청 스펙(프론트 기준)
- `POST /auth/login`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <accessToken>` (로그인 시점에는 보통 없음)
- Body(JSON):
  - `{ email, password }`

## 기대 응답 스펙(타입 기준)
- `AuthResponse`
  - `{ accessToken, refreshToken, user: { id, email, nickname } }`

---

## 6) 회원가입(Signup) 흐름

## UI 폼 흐름
파일: `src/features/auth/SignupForm.tsx`
- Step 1:
  - 이메일/비밀번호/닉네임 유효성 체크 후 Step 2로 이동
- Step 2:
  - `DogProfileForm`로 강아지 프로필 입력
  - 최소 검증: `dog.name`, `dog.breed` 필수
  - `onSubmit(formData)` 호출

## 페이지 연결
파일: `src/app/(auth)/signup/page.tsx`
- `SignupForm.onSubmit` → `signupMutation.mutate(data)`

## `useSignupMutation`
파일: `src/features/auth/hooks/useSignupMutation.ts`
- `useMutation<SignupResponse, Error, SignupData>`
- `mutationFn`: `authApi.signup(data)`
- `onSuccess`: 토큰 저장 후 `/map` 이동

## 실제 API 호출 정의
파일: `src/lib/api/auth.ts`
- `authApi.signup: (data: Signup) => apiFetch<AuthResponse>("/auth/signup", { method: "POST", body: JSON.stringify(data) })`

중요(현재 코드 기준 불일치 가능성):
- 프론트 폼/훅은 `dog` 정보를 포함해서 `mutate(data)`에 넘기지만
- `authApi.signup`은 타입상 `dog` 없는 `Signup`만 받도록 설계되어 있습니다.
  - TS 구조상(변수 전달) 컴파일이 통과할 수는 있지만,
  - 서버가 `dog` 필드를 허용하지 않으면 런타임에서 실패할 수 있습니다.

---

## 7) Refresh Token 재발급 흐름

## A) `authApi.refresh()`
파일: `src/lib/api/auth.ts`
- `POST /auth/refresh`
- Headers:
  - `X-Refresh-Token: <localStorage refreshToken>`

## B) `attemptRefresh()` (전역 401 처리에서 사용)
파일: `src/lib/auth.ts`
- `fetch(`${API_BASE_URL}/auth/refresh`, { headers: { ..., "X-Refresh-Token": refreshToken } })`
- 성공 시:
  - `setAccessToken(data.accessToken)`
  - `data.refreshToken`이 있으면 갱신

주의(현재 코드 기준):
- `attemptRefresh()`는 `method`가 지정되어 있지 않아 기본이 `GET`입니다.
  - 서버가 `POST /auth/refresh`만 받는다면 여기서 재발급이 실패할 수 있습니다.

---

## 8) 내 정보 조회(getMe)
파일: `src/lib/api/auth.ts`
- `authApi.getMe(): Promise<MeResponse> => apiFetch<MeResponse>("/me")`
- Authorization 헤더는 `apiFetch`에서 자동 부착

현재 코드베이스에서는 `getMe`를 실제로 호출하는 UI/훅은 검색 범위에서 확인되지 않았습니다.

---

## 9) 강아지 사진 업로드 흐름

파일: `src/features/auth/DogProfileForm.tsx`

## 업로드 트리거
- `<input type="file" ... onChange={handlePhotoUpload} />`

## 클라이언트 검증
- MIME type: `image/*` 인지 확인
- size: `<= 5MB`

## 요청
- `apiFetchFormData<{ url: string }>("media/upload", formData)`
  - endpoint는 현재 슬래시가 없어도 `apiFetchFormData`에서 자동 보정
- Headers:
  - `Authorization: Bearer <accessToken>` (있으면 자동)
  - `Content-Type`는 지정하지 않음(브라우저가 boundary 포함해서 자동 설정)
- Body:
  - `FormData`에 key `file`

## 기대 응답
- `{ url: string }`

## 업로드 이후 상태 반영
- `updateDog("photoUrl", response.url)`로 부모 상태(회원가입 데이터)에 반영
- `setPreviewUrl(response.url)`로 화면 미리보기 표시
- 삭제 시:
  - `photoUrl`을 `undefined`로 되돌리고 `previewUrl`을 `null`

---

## 10) 현재 코드 기준 TODO / 불일치 요약

- `Providers(QueryClientProvider)`가 실제로 전역에 마운트되어 있는지 확인 필요
- `attemptRefresh()`가 `GET`으로 호출되고 있어 서버가 `POST`만 지원하면 refresh가 동작하지 않을 수 있음
- 회원가입 payload:
  - 폼/훅은 `dog` 포함
  - `authApi.signup`은 `dog` 없는 스펙
  - 서버 스펙에 맞춰 (1) `authApi.signup`을 `dog` 포함으로 확장하거나, (2) 가입 후 별도 API로 dog 저장 분리 필요
- 응답 타입 불일치 가능성:
  - `useSignupMutation.ts`의 `SignupResponse.user.profileImage?`는 `AuthResponse.user` 타입에는 없음

---

## 빠른 흐름 요약

- 로그인:
  - `LoginForm` → `useLoginMutation` → `POST /auth/login` → 토큰 저장 → `/map`

- 회원가입:
  - `SignupForm(step)` → `useSignupMutation` → `POST /auth/signup` → 토큰 저장 → `/map`
  - (추가로 dog 포함 여부는 서버 스펙 확정 필요)

- 자동 토큰 재발급(의도):
  - 어떤 쿼리/뮤테이션이든 `ApiError(401)` 발생 → `attemptRefresh()` → 성공 시 쿼리 invalidate / 실패 시 로그인 페이지로
