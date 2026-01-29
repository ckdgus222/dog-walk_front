"use client";

import {
  MapMarker,
  DOG_SIZES,
  WALK_STYLES,
  PREFERRED_TIMES,
} from "@/lib/mock/map";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Thermometer,
  X,
  ChevronRight,
  Send,
} from "lucide-react";

// ============ FilterChipBar ============
interface Filters {
  dogSizes: string[];
  walkStyles: string[];
  preferredTimes: string[];
}

export function FilterChipBar({
  filters,
  onFiltersChange,
}: {
  filters: Filters;
  onFiltersChange: any;
}) {
  const toggleFilter = (category: keyof Filters, value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [category]: updated });
  };

  const renderChips = (options: readonly any[], category: keyof Filters) =>
    options.map((opt) => {
      const isActive = filters[category].includes(opt.value);
      return (
        <button
          key={opt.value}
          onClick={() => toggleFilter(category, opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0",
            isActive
              ? "bg-[#2D3748] border-[#2D3748] text-white shadow-sm"
              : "bg-white border-[#E2E8F0] text-[#495057] hover:bg-[#F8F9FA]",
          )}
        >
          {opt.label}
        </button>
      );
    });

  return (
    <div className="sticky top-[56px] z-20 bg-white border-b border-[#F1F3F5]">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar scroll-smooth">
        {/* Reset */}
        {(filters.dogSizes.length > 0 ||
          filters.walkStyles.length > 0 ||
          filters.preferredTimes.length > 0) && (
          <button
            onClick={() =>
              onFiltersChange({
                dogSizes: [],
                walkStyles: [],
                preferredTimes: [],
              })
            }
            className="px-3 py-1.5 rounded-full bg-[#F1F3F5] text-[#ADB5BD] text-xs font-bold whitespace-nowrap flex-shrink-0"
          >
            초기화 ↺
          </button>
        )}
        {renderChips(DOG_SIZES, "dogSizes")}
        {renderChips(WALK_STYLES, "walkStyles")}
        {renderChips(PREFERRED_TIMES, "preferredTimes")}

        {/* Spacer for right padding */}
        <div className="w-2 flex-shrink-0" />
      </div>
    </div>
  );
}

// ============ MateListCard (핵심 컴포넌트) ============
export function MateListCard({
  data,
  onClick,
}: {
  data: MapMarker;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="border-none shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="p-4 flex gap-4">
        {/* Profile Image */}
        <div className="relative shrink-0">
          <Avatar
            src={data.avatar}
            size="lg"
            className="border-0 shadow-inner w-16 h-16"
          />
          {/* Active Dot */}
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-[#212529] text-base flex items-center gap-1">
                {data.name}
                <span className="text-xs font-normal text-[#ADB5BD]">
                  · {formatRelativeTime(data.lastActive)}
                </span>
              </h3>
              <p className="text-xs text-[#868E96] mt-0.5 truncate max-w-[140px]">
                {data.bio}
              </p>
            </div>
            {/* Manner Score Badge */}
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[#FF8A3D] font-bold text-sm">
                {data.mannerScore}°C
              </span>
              <div className="w-16 h-1.5 bg-[#FFE8CC] rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-[#FF8A3D] rounded-full"
                  style={{ width: `${(data.mannerScore / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
              {DOG_SIZES.find((s) => s.value === data.dogSize)?.label}
            </Badge>
            <Badge variant="orange" className="text-[11px] px-2 py-0.5">
              {WALK_STYLES.find((s) => s.value === data.walkStyle)?.label}
            </Badge>
            <div className="ml-auto text-xs text-[#ADB5BD] flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>300m</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============ MapPlaceholder (지도 뷰) ============
export function MapPlaceholder({
  markers,
  onMarkerClick,
  selectedMarkerId,
}: any) {
  return (
    <div className="absolute inset-0 bg-[#E9ECEF] w-full h-full">
      {/* Map Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(#CED4DA 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Markers */}
      {markers.map((marker: MapMarker, index: number) => (
        <button
          key={marker.id}
          onClick={() => onMarkerClick(marker)}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
            selectedMarkerId === marker.id
              ? "z-20 scale-110"
              : "z-10 hover:scale-105",
          )}
          style={{
            left: `${20 + ((index * 15) % 70)}%`,
            top: `${20 + ((index * 20) % 50)}%`,
          }}
        >
          <div className="relative">
            {selectedMarkerId === marker.id && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2D3748] text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap mb-1 animate-in fade-in zoom-in duration-200">
                {marker.dogName}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2D3748]"></div>
              </div>
            )}
            <div
              className={cn(
                "w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden flex items-center justify-center transition-colors",
                selectedMarkerId === marker.id
                  ? "bg-[#FF8A3D]"
                  : "bg-[#FFD8A8]",
              )}
            >
              <span className="text-lg">🐶</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ============ MateDetailSheet ============
export function MateDetailSheet({ marker, onClose, onRequestWalk }: any) {
  if (!marker) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-[24px] shadow-2xl p-6 pb-[calc(24px+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
        <div className="w-12 h-1.5 bg-[#E9ECEF] rounded-full mx-auto mb-6" />

        <div className="flex gap-4 items-center mb-6">
          <Avatar
            src={marker.avatar}
            size="xl"
            className="w-20 h-20 shadow-md border-2 border-white"
          />
          <div>
            <h2 className="text-xl font-bold text-[#212529] flex items-center gap-1">
              {marker.name}님
              <Badge
                variant="secondary"
                className="bg-[#E7F5FF] text-[#1C7ED6] ml-2 text-[10px] py-0.5"
              >
                인증됨
              </Badge>
            </h2>
            <p className="text-sm text-[#868E96] mt-1">
              {marker.dogName} ({marker.dogBreed})
            </p>
          </div>
          <div className="ml-auto text-right self-start">
            <span className="text-[#FF8A3D] font-bold text-xl">
              {marker.mannerScore}°C
            </span>
            <p className="text-[10px] text-[#ADB5BD] underline decoration-dashed">
              매너온도
            </p>
          </div>
        </div>

        <div className="bg-[#F8F9FA] rounded-xl p-4 mb-6 border border-[#F1F3F5]">
          <p className="text-sm text-[#495057] leading-relaxed">
            "{marker.bio}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-[#495057] bg-white border border-[#E9ECEF] p-3 rounded-lg">
            <Clock className="w-4 h-4 text-[#ADB5BD]" />
            <span className="font-medium">
              {marker.preferredTime === "morning"
                ? "아침"
                : marker.preferredTime === "afternoon"
                  ? "오후"
                  : "저녁"}{" "}
              산책 선호
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#495057] bg-white border border-[#E9ECEF] p-3 rounded-lg">
            <MapPin className="w-4 h-4 text-[#ADB5BD]" />
            <span className="font-medium">약 300m 거리</span>
          </div>
        </div>

        <Button
          onClick={onRequestWalk}
          className="w-full py-4 text-base shadow-lg shadow-[#FF8A3D]/20 bg-[#FF8A3D] hover:bg-[#F2701D]"
        >
          <Send className="w-5 h-5 mr-2" />
          산책 메이트 신청하기
        </Button>
      </div>
    </>
  );
}
