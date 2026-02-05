import { getAccessToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const normalizeEndpoint = (endpoint: string) => {
  if (!endpoint) return "/";
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const apiFetch = async <T = unknown>(endpoint: string, options?: RequestInit): Promise<T> => {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${normalizeEndpoint(endpoint)}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    throw new ApiError(401, "UNAUTHORIZED");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      (typeof errorData === "object" && errorData && "message" in errorData ? (errorData as any).message : null) || `API 요청 실패: ${response.status}`;
    throw new ApiError(response.status, message, errorData);
  }

  return response.json() as Promise<T>;
};

export const apiFetchFormData = async <T = unknown>(endpoint: string, formData: FormData, options?: Omit<RequestInit, "body">): Promise<T> => {
  const token = getAccessToken();

  const headers: HeadersInit = {
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${normalizeEndpoint(endpoint)}`, {
    method: "POST",
    ...options,
    headers,
    body: formData,
  });

  if (response.status === 401) {
    throw new ApiError(401, "UNAUTHORIZED");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      (typeof errorData === "object" && errorData && "message" in errorData ? (errorData as any).message : null) || `API 요청 실패: ${response.status}`;
    throw new ApiError(response.status, message, errorData);
  }

  return response.json() as Promise<T>;
};
