"use client";
import { SignupForm } from "@/features/auth/SignupForm";
import { useSignupMutation } from "@/features/auth/hooks/useSignupMutation";
const SignupPage = () => {
  const signupMutation = useSignupMutation();
  const handleSubmit = (data: {
    email: string;
    password: string;
    nickname: string;
    dog: {
      name: string;
      breed: string;
      birthYear: string;
      gender: "male" | "female";
      personality: string[];
      photoUrl?: string;
    };
  }) => {
    signupMutation.mutate(data);
  };
  return <SignupForm onSubmit={handleSubmit} isLoading={signupMutation.isPending} error={signupMutation.error?.message || ""} />;
};

export default SignupPage;
