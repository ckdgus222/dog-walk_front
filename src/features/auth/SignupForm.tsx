"use client";

import { useState } from "react";
import Link from "next/link";
import { Dog } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { ROUTES } from "@/routes";

const STEPS = [
  { number: 1, label: "계정 정보" },
  { number: 2, label: "강아지 정보" },
] as const;

const DOG_GENDERS = [
  { value: "male", label: "남아" },
  { value: "female", label: "여아" },
] as const;

type DogGender = "male" | "female";

export interface SignupFormValues {
  email: string;
  password: string;
  passwordConfirm: string;
  dogName: string;
  dogBreed: string;
  dogGender: DogGender | "";
  dogBirthDate: string;
}

const INITIAL_FORM_VALUES: SignupFormValues = {
  email: "",
  password: "",
  passwordConfirm: "",
  dogName: "",
  dogBreed: "",
  dogGender: "",
  dogBirthDate: "",
};

export const SignupForm = () => {
  const [step, setStep] = useState(1);
  const [stepOneError, setStepOneError] = useState("");
  const [formValues, setFormValues] =
    useState<SignupFormValues>(INITIAL_FORM_VALUES);

  const handleFieldChange = <K extends keyof SignupFormValues,>(
    field: K,
    value: SignupFormValues[K],
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (step === 1 && stepOneError) {
      setStepOneError("");
    }
  };

  const handleNextStep = () => {
    const isStepOneValid =
      formValues.email && formValues.password && formValues.passwordConfirm;

    if (!isStepOneValid) {
      setStepOneError("회원가입 첫 번째 단계의 정보를 모두 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      setStepOneError("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (formValues.password.length < 8) {
      setStepOneError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (formValues.password !== formValues.passwordConfirm) {
      setStepOneError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setStepOneError("");
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };


  const handleSubmit = () => {
    console.log("회원가입 폼 값", formValues);
  };

  return (
    <div className="flex flex-col max-h-[90dvh]">
      <div className="shrink-0 pt-8 pb-4 px-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#FF8A3D] to-[#FF6B6B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
          <Dog className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-[#2D3748] tracking-tight">
          회원가입
        </h1>
      </div>

      <div className="shrink-0 px-8 pb-4">
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <div
              key={s.number}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <div className="w-full h-1 rounded-full overflow-hidden bg-[#F1F3F5]">
                <div
                  className="h-full rounded-full bg-[#FF8A3D] transition-all duration-500"
                  style={{ width: step >= s.number ? "100%" : "0%" }}
                />
              </div>
              <span
                className={`text-xs font-semibold ${
                  step >= s.number ? "text-[#FF8A3D]" : "text-[#ADB5BD]"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-8">
        {step === 1 && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#343A40]">
                계정을 만들어주세요
              </h2>
              <p className="text-sm text-[#868E96] mt-0.5">
                이메일과 비밀번호로 간편하게 가입할 수 있어요
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
                  이메일
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formValues.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
                  비밀번호
                </label>
                <Input
                  type="password"
                  placeholder="8자 이상 입력해주세요"
                  value={formValues.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
                  비밀번호 확인
                </label>
                <Input
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={formValues.passwordConfirm}
                  onChange={(e) =>
                    handleFieldChange("passwordConfirm", e.target.value)
                  }
                />
              </div>
              {stepOneError && (
                <p className="text-sm font-medium text-[#E03131]">
                  {stepOneError}
                </p>
              )}

              <Button fullWidth size="lg" onClick={handleNextStep}>
                다음
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#343A40]">
                반려견을 소개해주세요
              </h2>
              <p className="text-sm text-[#868E96] mt-0.5">
                함께 산책할 강아지 정보를 입력해주세요
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
                  강아지 이름
                </label>
                <Input
                  type="text"
                  placeholder="우리 강아지 이름을 알려주세요"
                  value={formValues.dogName}
                  onChange={(e) => handleFieldChange("dogName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
                  견종
                </label>
                <Input
                  type="text"
                  placeholder="예: 골든 리트리버, 말티즈, 포메라니안"
                  value={formValues.dogBreed}
                  onChange={(e) => handleFieldChange("dogBreed", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
                  성별
                </label>
                <div className="flex gap-3">
                  {DOG_GENDERS.map((g) => {
                    const isSelected = formValues.dogGender === g.value;

                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => handleFieldChange("dogGender", g.value)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? "bg-[#FFF4E6] text-[#FF8A3D] ring-2 ring-[#FF8A3D]/20"
                            : "bg-[#F8F9FA] text-[#868E96] hover:bg-[#F1F3F5]"
                        }`}
                      >
                        {g.value === "male" ? "♂" : "♀"} {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
                  생년월일
                </label>
                <Input
                  type="date"
                  value={formValues.dogBirthDate}
                  onChange={(e) =>
                    handleFieldChange("dogBirthDate", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#343A40] mb-1.5">
                  프로필 사진
                </label>
                <div className="flex items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-[#DEE2E6] bg-[#F8F9FA]">
                  <div className="text-center">
                    <span className="block text-2xl mb-1">📷</span>
                    <span className="text-xs text-[#ADB5BD]">
                      사진 업로드 (준비 중)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handlePrevStep}
                >
                  이전
                </Button>
                <Button size="lg" fullWidth onClick={handleSubmit}>
                  가입 완료
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="text-center pt-6">
          <p className="text-sm text-[#868E96]">
            이미 계정이 있으신가요?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-bold text-[#FF8A3D] hover:text-[#F2701D] transition-colors"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
