"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { setAccessToken, setRefreshToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { AuthResponse, Login } from "@/lib/api/auth";

export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation<AuthResponse, Error, Login>({
    mutationFn: (data: Login) => authApi.login(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      router.push("/map");
    },
  });
};
