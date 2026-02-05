"use client";

import { Input } from "@/components/ui";
import { apiFetchFormData } from "@/lib/api";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

const PERSONALITY_TAGS = ["활발함", "소심함", "친화적", "독립적", "순함", "경계심강함", "장난기많음", "산책좋아함"];

type DogData = {
  name: string;
  breed: string;
  birthYear: string;
  gender: "male" | "female";
  personality: string[];
  photoUrl?: string;
};

interface DogProfileFormProps {
  initialData: DogData;
  onChange: (data: DogData) => void;
  disabled?: boolean;
}

export const DogProfileForm = ({ initialData, onChange, disabled }: DogProfileFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.photoUrl || null);

  useEffect(() => {
    setPreviewUrl(initialData.photoUrl || null);
  }, [initialData.photoUrl]);

  const updateDog = (field: keyof DogData, value: any) => {
    onChange({ ...initialData, [field]: value });
  };

  const togglePersonality = (tag: string) => {
    const current = initialData.personality;
    const updated = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    updateDog("personality", updated);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하로 설정해주세요");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiFetchFormData<{ url: string }>("media/upload", formData);
      updateDog("photoUrl", response.url);
      setPreviewUrl(response.url);
    } catch (error) {
      console.error("사진 업로드에 실패했습니다.", error);
    }
  };
  const removePhoto = () => {
    updateDog("photoUrl", undefined);
    setPreviewUrl(null);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium text-[#495057] mb-1">
          강아지 이름 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="강아지 이름을 입력하세요"
          value={initialData.name}
          onChange={(e) => updateDog("name", e.target.value)}
          disabled={disabled}
        />
      </div>
      {/* 견종 */}
      <div>
        <label className="block text-sm font-medium text-[#495057] mb-1">
          견종 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="견종을 입력하세요 (예: 포메라니안)"
          value={initialData.breed}
          onChange={(e) => updateDog("breed", e.target.value)}
          disabled={disabled}
        />
      </div>
      {/* 출생연도 */}
      <div>
        <label className="block text-sm font-medium text-[#495057] mb-1">출생연도</label>
        <div className="relative">
          <select
            value={initialData.birthYear}
            onChange={(e) => updateDog("birthYear", e.target.value)}
            disabled={disabled}
            className="w-full rounded-xl bg-[#F8F9FA] px-4 py-3 text-sm text-[#495057] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/20 disabled:opacity-50"
          >
            <option value="">선택해주세요</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* 성별 */}
      <div>
        <label className="block text-sm font-medium text-[#495057] mb-2">성별</label>
        <div className="flex gap-4">
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${initialData.gender === "male" ? "border-[#FF8A3D] bg-[#FFF4E6]" : "border-[#DEE2E6] bg-white"}`}
          >
            <input
              type="radio"
              name="gender"
              value="male"
              checked={initialData.gender === "male"}
              onChange={() => updateDog("gender", "male")}
              disabled={disabled}
              className="hidden"
            />
            <span className="text-sm font-medium">수컷</span>
          </label>
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${initialData.gender === "female" ? "border-[#FF8A3D] bg-[#FFF4E6]" : "border-[#DEE2E6] bg-white"}`}
          >
            <input
              type="radio"
              name="gender"
              value="female"
              checked={initialData.gender === "female"}
              onChange={() => updateDog("gender", "female")}
              disabled={disabled}
              className="hidden"
            />
            <span className="text-sm font-medium">암컷</span>
          </label>
        </div>
      </div>
      {/* 성격 태그 */}
      <div>
        <label className="block text-sm font-medium text-[#495057] mb-2">성격 (복수 선택 가능)</label>
        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TAGS.map((tag) => {
            const isSelected = initialData.personality.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => togglePersonality(tag)}
                disabled={disabled}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${isSelected ? "bg-[#FF8A3D] text-white" : "bg-[#F1F3F5] text-[#495057] hover:bg-[#DEE2E6]"}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
      {/* 사진 업로드 */}
      <div>
        <label className="block text-sm font-medium text-[#495057] mb-2">강아지 사진</label>
        {previewUrl ? (
          <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[#F1F3F5]">
            <img src={previewUrl} alt="강아지 사진" className="w-full h-full object-cover" />
            {!disabled && (
              <button type="button" onClick={removePhoto} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100">
                <X size={16} className="text-[#495057]" />
              </button>
            )}
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-[#DEE2E6] bg-[#F8F9FA] cursor-pointer hover:bg-[#F1F3F5] transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Upload size={24} className="text-[#ADB5BD] mb-2" />
            <span className="text-sm text-[#868E96]">클릭하여 사진 업로드</span>
            <span className="text-xs text-[#ADB5BD] mt-1">JPG, PNG, WEBP (최대 5MB)</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} disabled={disabled} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};
