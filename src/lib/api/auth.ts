import { apiFetch } from "../api";

type Signup = {
  email: string;
  password: string;
  nickname: string;
};
export type Login = Pick<Signup, "email" | "password">;

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
};

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

type MeResponse = {
  user: {
    id: string;
    email: string;
    nickname: string;
    profileImage?: string;
    bio?: string;
    createdAt?: string;
    updatedAt?: string;
  };
};

export const authApi = {
  // 회원가입
  signup: (data: Signup): Promise<AuthResponse> =>
    apiFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 로그인
  login: (data: Login): Promise<AuthResponse> =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 토큰 재발급
  refresh: () =>
    apiFetch<RefreshResponse>("/auth/refresh", {
      method: "POST",
      headers: {
        "X-Refresh-Token": localStorage.getItem("refreshToken") || "",
      },
    }),

  // 내 정보 조회
  getMe: (): Promise<MeResponse> => apiFetch<MeResponse>("/me"),
};
