import { authApi } from "@/lib/api/auth";
import { setAccessToken, setRefreshToken } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type SignupData = {
  email: string;
  password: string;
  nickname: string;
  dog: {
    name: string;
    gender: "male" | "female";
    breed: string;
    birthYear: string;
    photoUrl?: string;
    personality: string[];
  };
};

type SignupResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    profileImage?: string;
  };
};

export const useSignupMutation = () => {
  const router = useRouter();

  return useMutation<SignupResponse, Error, SignupData>({
    mutationFn: (data) => authApi.signup(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      router.push("/map");
    },
  });
};
