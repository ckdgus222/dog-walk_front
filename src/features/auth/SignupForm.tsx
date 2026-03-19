"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Dog,
  Lock,
  Mail,
  PawPrint,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/routes";

const STEPS = [
  { number: 1, label: "기본 정보" },
  { number: 2, label: "반려견 정보" },
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

  const handleFieldChange = <K extends keyof SignupFormValues>(
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
    <div className="mx-auto w-full max-w-md">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
          <PawPrint className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
          회원가입
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
          계정과 반려견 정보를 등록해 산책 메이트를 찾아보세요.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        {STEPS.map((currentStep) => (
          <div key={currentStep.number} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step >= currentStep.number
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]"
              }`}
            >
              {step > currentStep.number ? (
                <Check className="h-4 w-4" />
              ) : (
                currentStep.number
              )}
            </div>
            {currentStep.number < STEPS.length && (
              <div
                className={`h-0.5 w-12 rounded-full transition-colors ${
                  step > currentStep.number
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-bg-muted)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[24px] border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-sm)]">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              기본 정보
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
              계정 생성에 필요한 정보를 입력해주세요.
            </p>

            <div className="mt-5 space-y-3">
              <Input
                type="email"
                placeholder="이메일"
                value={formValues.email}
                onChange={(event) =>
                  handleFieldChange("email", event.target.value)
                }
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Input
                type="password"
                placeholder="비밀번호"
                value={formValues.password}
                onChange={(event) =>
                  handleFieldChange("password", event.target.value)
                }
                leftIcon={<Lock className="h-4 w-4" />}
              />

              <Input
                type="password"
                placeholder="비밀번호 확인"
                value={formValues.passwordConfirm}
                onChange={(event) =>
                  handleFieldChange("passwordConfirm", event.target.value)
                }
                leftIcon={<Lock className="h-4 w-4" />}
              />

              {stepOneError && (
                <div className="rounded-[16px] border border-[rgba(234,67,53,0.16)] bg-[var(--color-error-light)] px-3 py-2 text-sm font-medium text-[var(--color-error)]">
                  {stepOneError}
                </div>
              )}

              <Button fullWidth size="lg" onClick={handleNextStep}>
                다음
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="flex items-center gap-1.5 text-lg font-bold text-[var(--color-text-primary)]">
              <Dog className="h-[18px] w-[18px] text-[var(--color-primary)]" />
              반려견 정보
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
              더 잘 맞는 산책 메이트를 추천하는 데 사용돼요.
            </p>

            <div className="mt-5 space-y-4">
              <Input
                type="text"
                placeholder="강아지 이름"
                value={formValues.dogName}
                onChange={(event) =>
                  handleFieldChange("dogName", event.target.value)
                }
                leftIcon={<Dog className="h-4 w-4" />}
              />

              <Input
                type="text"
                placeholder="견종"
                value={formValues.dogBreed}
                onChange={(event) =>
                  handleFieldChange("dogBreed", event.target.value)
                }
              />

              <div>
                <label className="mb-2 block text-xs font-semibold text-[var(--color-text-secondary)]">
                  성별
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DOG_GENDERS.map((gender) => {
                    const isSelected = formValues.dogGender === gender.value;

                    return (
                      <button
                        key={gender.value}
                        type="button"
                        onClick={() =>
                          handleFieldChange("dogGender", gender.value)
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          isSelected
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--color-border-light)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:border-[var(--color-border)]"
                        }`}
                      >
                        {gender.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                type="date"
                value={formValues.dogBirthDate}
                onChange={(event) =>
                  handleFieldChange("dogBirthDate", event.target.value)
                }
                leftIcon={<CalendarDays className="h-4 w-4" />}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handlePrevStep}
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </Button>
                <Button
                  size="lg"
                  fullWidth
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  시작하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-[var(--color-text-tertiary)]">
        이미 계정이 있으신가요?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-semibold text-[var(--color-primary)] hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
};
