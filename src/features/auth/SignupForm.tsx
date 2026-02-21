"use client"
import { useState } from "react"
import Link from "next/link"
import { Lock, Mail, User } from "lucide-react"
import { Button, Card, CardContent, Input } from "@/components/ui"
import { DogProfileForm } from "./DogProfileForm"
type SignupData = {
  email: string
  password: string
  nickname: string
  dog: {
    name: string
    breed: string
    birthYear: string
    gender: "male" | "female"
    personality: string[]
    photoUrl?: string
  }
}
interface SignupFormProps {
  onSubmit: (data: SignupData) => void
  isLoading?: boolean
  error?: string
}
export const SignupForm = ({ onSubmit, isLoading, error }: SignupFormProps) => {
  const [step, setStep] = useState(1)
  const [localError, setLocalError] = useState("")
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    nickname: "",
    dog: {
      name: "",
      breed: "",
      birthYear: "",
      gender: "male",
      personality: [],
      photoUrl: undefined,
    },
  })
  const updateField = <K extends keyof SignupData>(field: K, value: SignupData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value } as SignupData))
  }
  const updateDog = (dog: SignupData["dog"]) => {
    setFormData((prev) => ({ ...prev, dog }))
  }
  const handleNext = () => {
    setLocalError("")
    if (!formData.email.trim()) {
      setLocalError("이메일을 입력해주세요.")
      return
    }
    if (!formData.email.includes("@")) {
      setLocalError("올바른 이메일 형식을 입력해주세요.")
      return
    }
    if (!formData.password) {
      setLocalError("비밀번호를 입력해주세요.")
      return
    }
    if (formData.password.length < 6) {
      setLocalError("비밀번호는 6자 이상이어야 합니다.")
      return
    }
    if (!formData.nickname.trim()) {
      setLocalError("닉네임을 입력해주세요.")
      return
    }
    setStep(2)
  }
  const handlePrev = () => {
    setStep(1)
    setLocalError("")
  }
  const handleSubmit = () => {
    setLocalError("")
    if (!formData.dog.name.trim()) {
      setLocalError("강아지 이름을 입력해주세요.")
      return
    }
    if (!formData.dog.breed.trim()) {
      setLocalError("견종을 입력해주세요.")
      return
    }
    onSubmit(formData)
  }
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* 에러 메시지 */}
        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error || localError}
          </div>
        )}
        {/* 로고/타이틀 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🐶</div>
          <h1 className="text-2xl font-bold text-[#343A40] mb-1">
            강아지 산책 메이트
          </h1>
          <p className="text-sm text-[#868E96]">
            {step === 1 ? "기본 정보를 입력해주세요" : "강아지 프로필을 입력해주세요"}
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <span className={`text-xs font-medium ${step === 1 ? "text-[#FF8A3D]" : "text-[#ADB5BD]"}`}>Step 1</span>
            <span className="text-[#ADB5BD]">•</span>
            <span className={`text-xs font-medium ${step === 2 ? "text-[#FF8A3D]" : "text-[#ADB5BD]"}`}>Step 2</span>
          </div>
        </div>
        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#495057] mb-1">
                이메일 <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                leftIcon={<Mail size={18} />}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#495057] mb-1">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요 (6자 이상)"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                leftIcon={<Lock size={18} />}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#495057] mb-1">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={formData.nickname}
                onChange={(e) => updateField("nickname", e.target.value)}
                leftIcon={<User size={18} />}
                disabled={isLoading}
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNext}
              disabled={isLoading}
            >
              다음으로
            </Button>
          </div>
        )}
        {/* Step 2: 강아지 프로필 */}
        {step === 2 && (
          <DogProfileForm
            initialData={formData.dog}
            onChange={updateDog}
            disabled={isLoading}
            allowPhotoUpload={false}
          />
        )}
        {/* 버튼 영역 */}
        {step === 2 && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handlePrev}
              disabled={isLoading}
            >
              이전으로
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "가입 중..." : "회원가입 완료"}
            </Button>
          </div>
        )}
        {/* 로그인 링크 */}
        <div className="mt-4 text-center text-sm text-[#868E96]">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-[#FF8A3D] font-semibold hover:underline">
            로그인
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
