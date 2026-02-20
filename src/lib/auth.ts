const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
// Access Token 관리
export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};
export const setAccessToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};
export const removeAccessToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
// Refresh Token 관리
export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};
export const setRefreshToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};
export const removeRefreshToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// 전체 인증 정보 삭제
export const clearAuth = () => {
  removeAccessToken();
  removeRefreshToken();
};

// 로그인 상태 확인
export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!getAccessToken();
};

export const attemptRefresh = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuth();
    return null;
  }

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Refresh-Token": refreshToken,
      },
    });

    if (!response.ok) {
      clearAuth();
      return null;
    }

    const payload = await response.json().catch(() => null);
    const data = payload && typeof payload === "object" && "data" in payload ? (payload as any).data : payload;

    if (!data?.accessToken) {
      clearAuth();
      return null;
    }

    setAccessToken(data.accessToken);
    if (data.refreshToken) setRefreshToken(data.refreshToken);
    return data.accessToken;
  } catch (error) {
    console.error("리프레시 토큰 확인", error);
    clearAuth();
    return null;
  }
};
