"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button, Card, CardContent, Input } from "@/components/ui";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
}

const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit?.({ email, password });
  };

  return (
    <Card>
      <CardContent className="p-6">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🐶</div>
          <h1 className="text-2xl font-bold text-[#343A40] mb-1">강아지 산책 메이트</h1>
          <p className="text-sm text-[#868E96]">산책 메이트와 함께 즐거운 시간을 보내세요!</p>
        </div>

        <div className="space-y-3">
          <Input type="email" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail size={18} />} />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={18} />}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#495057]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} disabled={isLoading || !email || !password}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-[#868E96]">
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="text-[#FF8A3D] font-semibold hover:underline">
            회원가입
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
