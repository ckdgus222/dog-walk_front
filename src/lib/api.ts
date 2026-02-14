import { getAccessToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const normalizeEndpoint = (endpoint: string) => {
  if (!endpoint) return "/";
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const unwrapData = <T = unknown>(payload: unknown): T => {
  if (isRecord(payload) && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

const extractErrorMessage = (payload: unknown): string | null => {
  if (!isRecord(payload)) return null;

  // Backend standard: { error: { message: string | string[] } }
  if ("error" in payload && isRecord(payload.error)) {
    const message = payload.error.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message) && message.every((item) => typeof item === "string")) return message.join(", ");
  }

  // Fallback: { message: string | string[] } (some APIs/framework defaults)
  const message = payload.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message) && message.every((item) => typeof item === "string")) return message.join(", ");

  return null;
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

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    throw new ApiError(401, extractErrorMessage(payload) ?? "UNAUTHORIZED", payload ?? undefined);
  }

  if (!response.ok) {
    const message = extractErrorMessage(payload) || `API 요청 실패: ${response.status}`;
    throw new ApiError(response.status, message, payload ?? undefined);
  }

  return unwrapData<T>(payload);
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

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    throw new ApiError(401, extractErrorMessage(payload) ?? "UNAUTHORIZED", payload ?? undefined);
  }

  if (!response.ok) {
    const message = extractErrorMessage(payload) || `API 요청 실패: ${response.status}`;
    throw new ApiError(response.status, message, payload ?? undefined);
  }

  return unwrapData<T>(payload);
};
