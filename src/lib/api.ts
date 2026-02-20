/**
 * API Fetch 래퍼
 *
 * [핵심 기능]
 * 1. 토큰 자동 첨부 - 로그인 상태면 Authorization 헤더 자동 추가
 * 2. 응답 언랩 - 백엔드 { data: ... } 구조를 자동으로 풀어서 반환
 * 3. 에러 표준화 - 모든 에러를 ApiError로 변환 (status 포함)
 * 4. 401 특별 처리 - providers.tsx에서 자동 refresh 트리거
 *
 * [사용 예시]
 *   const user = await apiFetch<User>('/me');                    // GET
 *   const res = await apiFetch('/login', { method: 'POST', body: JSON.stringify(data) });  // POST
 *   const upload = await apiFetchFormData('/upload', formData);  // 파일 업로드
 */

// ============ Import ============
// localStorage에서 accessToken을 조회하는 함수
import { getAccessToken } from "./auth";

// ============ 상수 ============
// API 서버 기본 URL (환경변수 없으면 로컬 개발용 localhost:3001)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ============ 헬퍼 함수들 ============

/**
 * URL 정규화 - endpoint를 항상 "/"로 시작하게 변환
 *
 * [예시]
 *   "login"  → "/login"
 *   "/login" → "/login" (그대로)
 *   ""       → "/"
 */
const normalize = (ep: string) =>
  !ep ? "/" : ep.startsWith("/") ? ep : `/${ep}`;

/**
 * 타입 가드 - 값이 객체인지 확인
 *
 * [이유] null도 typeof가 "object"라서 별도 체크 필요
 * [용도] payload.message, payload.error 등에 접근하기 전 체크
 */
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/**
 * 응답 언랩 - 백엔드 표준 형식 { data: 실제데이터 }에서 실제 데이터만 추출
 *
 * [백엔드 응답] { data: { id: 1, name: "홍길동" } }
 * [언랩 후]    { id: 1, name: "홍길동" }
 *
 * [이유] 매번 response.data로 접근하는 게 번거로워서
 */
const unwrap = <T>(payload: unknown): T =>
  isRecord(payload) && "data" in payload
    ? (payload as { data: T }).data
    : (payload as T);

/**
 * 메시지 변환 - 문자열 또는 문자열 배열을 하나의 문자열로 변환
 *
 * [예시]
 *   "에러입니다"           → "에러입니다"
 *   ["오류1", "오류2"]     → "오류1, 오류2"
 *   123                    → null
 */
const toMsg = (v: unknown): string | null => {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.every((i) => typeof i === "string"))
    return v.join(", ");
  return null;
};

/**
 * 에러 메시지 추출 - 백엔드 에러 응답에서 사람이 읽을 수 있는 메시지 찾기
 *
 * [백엔드 에러 형식]
 *   표준: { error: { message: "이메일이 이미 존재합니다" } }
 *   대안: { message: "서버 오류" }
 *
 * [흐름]
 *   1. payload.error.message 시도 (백엔드 표준)
 *   2. payload.message 시도 (대안 형식)
 *   3. 못 찾으면 null 반환
 */
const extractMsg = (payload: unknown): string | null => {
  // payload가 객체가 아니면 메시지 추출 불가
  if (!isRecord(payload)) return null;

  // 1차 시도: 백엔드 표준 형식 { error: { message: ... } }
  if ("error" in payload && isRecord(payload.error)) {
    const found = toMsg(payload.error.message);
    if (found) return found;
  }

  // 2차 시도: 대안 형식 { message: ... }
  return toMsg(payload.message);
};

// ============ 커스텀 에러 클래스 ============

/**
 * ApiError - API 에러를 표준화해서 던짐
 *
 * [왜 필요한가?]
 *   - 일반 Error는 HTTP status 코드가 없음
 *   - 401인지 500인지 구분해야 자동 refresh 등을 할 수 있음
 *   - providers.tsx에서 error.status === 401로 체크함
 *
 * [사용 예시]
 *   throw new ApiError(401, "인증 만료", responseData);
 *   throw new ApiError(500, "서버 오류", responseData);
 */
export class ApiError extends Error {
  status: number; // HTTP 상태 코드 (401, 403, 404, 500 등)
  data?: unknown; // 백엔드 원본 에러 데이터 (디버깅용)

  constructor(status: number, message: string, data?: unknown) {
    super(message); // 부모 Error 클래스에 메시지 전달
    this.name = "ApiError"; // 에러 이름 (콘솔에 표시됨)
    this.status = status; // 상태 코드 저장
    this.data = data; // 원본 데이터 저장
  }
}

// ============ 공통 응답 처리 ============

/**
 * handleResponse - fetch 응답을 처리하는 공통 함수
 *
 * [처리 순서]
 *   1. 204 No Content → undefined 반환 (본문 없음)
 *   2. JSON 파싱
 *   3. 401 Unauthorized → ApiError throw (providers.tsx에서 자동 refresh 트리거)
 *   4. 기타 에러 → ApiError throw
 *   5. 성공 → 데이터 언랩 후 반환
 *
 * [401 특별 처리 이유]
 *   - providers.tsx의 QueryCache에서 error.status === 401을 감지
 *   - 자동으로 attemptRefresh() 호출 → 토큰 갱신
 *   - 갱신 성공 → 요청 재시도
 *   - 갱신 실패 → 로그인 페이지 이동
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // 204 No Content: 성공했지만 응답 본문이 없음 (DELETE 요청 등)
  if (response.status === 204) return undefined as T;

  // JSON 파싱 (실패 시 null 반환)
  const payload = await response.json().catch(() => null);

  // 401 Unauthorized: 토큰 만료 또는 유효하지 않음
  // → providers.tsx에서 자동 refresh 트리거
  if (response.status === 401) {
    throw new ApiError(
      401,
      extractMsg(payload) ?? "UNAUTHORIZED",
      payload ?? undefined,
    );
  }

  // 기타 에러 (403, 404, 500 등)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractMsg(payload) || `API 요청 실패: ${response.status}`,
      payload ?? undefined,
    );
  }

  // 성공: { data: ... } 언랩 후 반환
  return unwrap<T>(payload);
}

/**
 * authHeader - Authorization 헤더 생성
 *
 * [흐름]
 *   1. localStorage에서 accessToken 조회
 *   2. 토큰 있으면 { Authorization: "Bearer xxx" } 반환
 *   3. 토큰 없으면 빈 객체 {} 반환
 *
 * [Bearer 토큰 방식]
 *   "Bearer" + 공백 + 토큰값
 *   백엔드에서 이 토큰으로 사용자 식별
 */
const authHeader = (): HeadersInit => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============ 공개 API ============

/**
 * apiFetch - JSON API 요청
 *
 * [매개변수]
 *   endpoint: API 경로 ("/login", "me" 등)
 *   options: fetch 옵션 (method, body, headers 등)
 *
 * [반환값]
 *   성공: 백엔드 응답의 data 필드 내용
 *   실패: ApiError throw
 *
 * [헤더 구성 순서]
 *   1. "Content-Type": "application/json" (기본값)
 *   2. options.headers (추가 헤더 병합)
 *   3. Authorization (토큰 있을 때만)
 *
 * [사용 예시]
 *   // GET 요청
 *   const user = await apiFetch<User>('/me');
 *
 *   // POST 요청
 *   const res = await apiFetch('/login', {
 *     method: 'POST',
 *     body: JSON.stringify({ email, password })
 *   });
 */
export const apiFetch = async <T = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  // fetch 요청 실행
  const response = await fetch(`${API_BASE_URL}${normalize(endpoint)}`, {
    ...options, // method, body 등
    headers: {
      "Content-Type": "application/json", // 기본값: JSON 요청
      ...(options?.headers || {}), // 추가 헤더 병합
      ...authHeader(), // Authorization (토큰 있을 때만)
    },
  });

  // 공통 응답 처리 (에러, 언랩 등)
  return handleResponse<T>(response);
};

/**
 * apiFetchFormData - FormData(파일 업로드) 요청
 *
 * [왜 별도 함수인가?]
 *   - FormData는 Content-Type을 브라우저가 자동 설정 (multipart/form-data)
 *   - "Content-Type": "application/json"을 넣으면 안 됨
 *   - body를 JSON.stringify 하면 안 됨
 *
 * [매개변수]
 *   endpoint: API 경로
 *   formData: 전송할 FormData 객체
 *   options: fetch 옵션 (body 제외, method는 기본 POST)
 *
 * [사용 예시]
 *   const formData = new FormData();
 *   formData.append('file', fileInput.files[0]);
 *   formData.append('name', '뽀미');
 *
 *   const result = await apiFetchFormData('/upload', formData);
 */
export const apiFetchFormData = async <T = unknown>(
  endpoint: string,
  formData: FormData,
  options?: Omit<RequestInit, "body">, // body는 formData로 대체되므로 제외
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${normalize(endpoint)}`, {
    method: "POST", // FormData는 항상 POST
    ...options,
    headers: {
      ...(options?.headers || {}), // 추가 헤더 병합
      ...authHeader(), // Authorization (토큰 있을 때만)
      // 주의: Content-Type 넣지 않음! 브라우저가 자동 설정
    },
    body: formData, // FormData 직접 전달 (JSON.stringify 하지 않음!)
  });

  // 공통 응답 처리 (에러, 언랩 등)
  return handleResponse<T>(response);
};

/*
 * ============================================================
 * [전체 흐름 요약]
 * ============================================================
 *
 * apiFetch() 호출
 *     ↓
 * 1. authHeader() → localStorage에서 토큰 조회 → Authorization 헤더 생성
 *     ↓
 * 2. fetch() → 백엔드에 요청
 *     ↓
 * 3. handleResponse() → 응답 처리
 *     ├── 204 → undefined 반환
 *     ├── 401 → ApiError throw → providers.tsx에서 자동 refresh
 *     ├── 기타 에러 → ApiError throw
 *     └── 성공 → unwrap() → { data: ... } 언랩 후 반환
 */
