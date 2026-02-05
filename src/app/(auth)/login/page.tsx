"use client";

import LoginForm from "@/features/auth/LoginForm";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";

const LoginPage = () => {
  const loginMutation = useLoginMutation();

  const handleSubmit = (data: { email: string; password: string }) => {
    loginMutation.mutate(data);
  };

  return (
    <LoginForm onSubmit={handleSubmit} isLoading={loginMutation.isPending} error={loginMutation.error instanceof Error ? loginMutation.error.message : ""} />
  );
};

export default LoginPage;
