"use client";

import { ReactNode } from "react";
import {
  DOG_SIZES,
  MapMarker,
  PREFERRED_TIMES,
  WALK_STYLES,
} from "@/lib/mock/map";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Clock,
  Dog,
  Footprints,
  MapPin,
  Send,
  ShieldCheck,
  Thermometer,
  X,
} from "lucide-react";

interface Filters {
  dogSizes: string[];
  walkStyles: string[];
  preferredTimes: string[];
}

const DISTANCE_LABELS = ["280m", "430m", "620m", "850m", "1.2km"] as const;

const getMarkerIndex = (marker: MapMarker) => {
  const parsed = Number(marker.id.replace("marker-", "")) - 1;
  return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
};

const getDistanceLabel = (marker: MapMarker) =>
  DISTANCE_LABELS[getMarkerIndex(marker) % DISTANCE_LABELS.length];

const getPreferredTimeLabel = (value: MapMarker["preferredTime"]) =>
  PREFERRED_TIMES.find((time) => time.value === value)?.label ?? value;

const getWalkStyleLabel = (value: MapMarker["walkStyle"]) =>
  WALK_STYLES.find((style) => style.value === value)?.label ?? value;

const getDogSizeLabel = (value: MapMarker["dogSize"]) =>
  DOG_SIZES.find((size) => size.value === value)?.label ?? value;

const getTemperatureTone = (score: number) => {
  if (score >= 38.5) {
    return {
      value: "text-[var(--color-primary-dark)]",
      badge: "bg-[rgba(255,243,224,0.9)] text-[var(--color-primary-dark)]",
      meter: "bg-[var(--color-primary)]",
    };
  }

  if (score >= 37) {
    return {
      value: "text-[var(--color-warning)]",
      badge: "bg-[var(--color-warning-light)] text-[var(--color-text-secondary)]",
      meter: "bg-[var(--color-warning)]",
    };
  }

  return {
    value: "text-[var(--color-info)]",
    badge: "bg-[var(--color-info-light)] text-[var(--color-text-secondary)]",
    meter: "bg-[var(--color-info)]",
  };
};

export const FilterChipBar = ({
  filters,
  onFiltersChange,
  className,
}: {
  filters: Filters;
  onFiltersChange: (nextFilters: Filters) => void;
  className?: string;
}) => {
  const hasFilter =
    filters.dogSizes.length > 0 ||
    filters.walkStyles.length > 0 ||
    filters.preferredTimes.length > 0;

  const toggleFilter = (category: keyof Filters, value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    onFiltersChange({ ...filters, [category]: updated });
  };

  const renderChips = (
    options: readonly { value: string; label: string }[],
    category: keyof Filters,
  ) =>
    options.map((option) => {
      const isActive = filters[category].includes(option.value);

      return (
        <button
          key={`${category}-${option.value}`}
          onClick={() => toggleFilter(category, option.value)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
            isActive
              ? "border-[var(--color-primary)] bg-[var(--color-primary-lighter)] text-[var(--color-primary-dark)]"
              : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-light)] hover:text-[var(--color-text-primary)]",
          )}
        >
          {option.label}
        </button>
      );
    });

  return (
    <div className={cn("overflow-x-auto hide-scrollbar", className)}>
      <div className="flex min-w-max items-center gap-2">
        {hasFilter && (
          <button
            onClick={() =>
              onFiltersChange({
                dogSizes: [],
                walkStyles: [],
                preferredTimes: [],
              })
            }
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            초기화
          </button>
        )}
        {renderChips(DOG_SIZES, "dogSizes")}
        {renderChips(WALK_STYLES, "walkStyles")}
        {renderChips(PREFERRED_TIMES, "preferredTimes")}
      </div>
    </div>
  );
};

export const MateListCard = ({
  data,
  onClick,
  selected,
  requested,
}: {
  data: MapMarker;
  onClick: () => void;
  selected?: boolean;
  requested?: boolean;
}) => {
  const tone = getTemperatureTone(data.mannerScore);

  return (
    <Card
      onClick={onClick}
      className={cn(
        "border transition-all",
        selected
          ? "border-[var(--color-primary)] bg-[rgba(255,243,224,0.4)] shadow-[var(--shadow-sm)]"
          : "border-[var(--color-border-light)]",
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <Avatar
              src={data.avatar}
              alt={data.name}
              size="md"
              className="h-12 w-12 border-[var(--color-border-light)]"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-[var(--color-success)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="truncate text-[15px] font-bold text-[var(--color-text-primary)]">
                  {data.name}
                </h3>
                <div
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    tone.badge,
                  )}
                >
                  <Thermometer className="h-3 w-3" />
                  {data.mannerScore}°C
                </div>
              </div>
              <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
                {formatRelativeTime(data.lastActive)}
              </span>
            </div>

            <p className="mt-1 truncate text-sm text-[var(--color-text-secondary)]">
              {data.dogName} · {data.dogBreed}
            </p>

            <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {getDistanceLabel(data)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {getPreferredTimeLabel(data.preferredTime)}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge>{getDogSizeLabel(data.dogSize)}</Badge>
              <Badge variant="orange">{getWalkStyleLabel(data.walkStyle)}</Badge>
              <Badge variant="secondary">{getPreferredTimeLabel(data.preferredTime)}</Badge>
              {requested && (
                <Badge className="bg-[var(--color-success-light)] text-[var(--color-success)]">
                  요청 전송됨
                </Badge>
              )}
            </div>

            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {data.bio}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const MapPlaceholder = ({
  markers,
  onMarkerClick,
  selectedMarkerId,
}: {
  markers: MapMarker[];
  onMarkerClick: (marker: MapMarker) => void;
  selectedMarkerId?: string | null;
}) => {
  return (
    <div className="absolute inset-0 bg-[var(--color-bg-subtle)]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(90deg, rgba(229,226,219,0.4) 1px, transparent 1px), linear-gradient(rgba(229,226,219,0.4) 1px, transparent 1px), radial-gradient(circle at 30% 18%, rgba(245,166,35,0.12), transparent 20%), radial-gradient(circle at 78% 72%, rgba(74,144,217,0.12), transparent 18%)",
          backgroundSize: "76px 76px, 76px 76px, auto, auto",
        }}
      />

      <div className="absolute left-4 top-4 rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-sm)] md:left-6 md:top-6">
        역삼1동 주변 산책 메이트
      </div>

      {markers.map((marker, index) => {
        const isSelected = selectedMarkerId === marker.id;

        return (
          <button
            key={marker.id}
            onClick={() => onMarkerClick(marker)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 transition-transform",
              isSelected ? "z-20 scale-110" : "z-10 hover:scale-105",
            )}
            style={{
              left: `${18 + ((index * 15) % 68)}%`,
              top: `${22 + ((index * 18) % 52)}%`,
            }}
          >
            {isSelected && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] px-3 py-2 text-left shadow-[var(--shadow-md)]">
                <p className="whitespace-nowrap text-xs font-bold text-[var(--color-text-primary)]">
                  {marker.name}
                </p>
                <p className="whitespace-nowrap text-[11px] text-[var(--color-text-tertiary)]">
                  {marker.dogName} · {getDistanceLabel(marker)}
                </p>
              </div>
            )}
            <div
              className={cn(
                "flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-white text-white shadow-[var(--shadow-md)]",
                isSelected
                  ? "bg-[var(--color-primary)]"
                  : "bg-[rgba(232,118,10,0.84)]",
              )}
            >
              <Dog className="h-5 w-5" />
            </div>
          </button>
        );
      })}
    </div>
  );
};

const MateDetailContent = ({
  marker,
  onClose,
  onRequestWalk,
  hasRequested,
  mobile,
}: {
  marker: MapMarker;
  onClose: () => void;
  onRequestWalk: () => void;
  hasRequested?: boolean;
  mobile?: boolean;
}) => {
  const tone = getTemperatureTone(marker.mannerScore);

  return (
    <div className="h-full overflow-y-auto bg-[var(--color-bg-elevated)] hide-scrollbar">
      <div
        className={cn(
          "sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] px-5 py-4",
          mobile && "rounded-t-[28px]",
        )}
      >
        <div>
          <p className="text-xs font-semibold text-[var(--color-primary)]">
            MATE PROFILE
          </p>
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">
            메이트 상세 정보
          </h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-2 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-5 flex items-center gap-4">
          <div className="relative">
            <Avatar
              src={marker.avatar}
              alt={marker.name}
              size="xl"
              className="h-[72px] w-[72px] border-[var(--color-border-light)]"
            />
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[var(--color-success)] text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                {marker.name}
              </h2>
              <Badge className={tone.badge}>{marker.mannerScore}°C</Badge>
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {marker.dogName}와 함께 산책 중
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              최근 활동 {formatRelativeTime(marker.lastActive)}
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-[20px] border border-[var(--color-border-light)] bg-[var(--color-bg-subtle)] p-4">
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {marker.bio}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-3">
          <InfoMetric
            icon={<MapPin className="h-4 w-4" />}
            label="거리"
            value={getDistanceLabel(marker)}
          />
          <InfoMetric
            icon={<Clock className="h-4 w-4" />}
            label="선호 시간"
            value={getPreferredTimeLabel(marker.preferredTime)}
          />
          <InfoMetric
            icon={<Thermometer className="h-4 w-4" />}
            label="매너온도"
            value={`${marker.mannerScore}°C`}
          />
        </div>

        <div className="mb-5 rounded-[20px] border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-xs)]">
          <div className="mb-3 flex items-center gap-2">
            <Dog className="h-[18px] w-[18px] text-[var(--color-primary)]" />
            <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
              반려견 정보
            </h4>
          </div>
          <div className="rounded-[18px] bg-[var(--color-bg-subtle)] p-4">
            <p className="text-base font-semibold text-[var(--color-text-primary)]">
              {marker.dogName}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {marker.dogBreed} · {getDogSizeLabel(marker.dogSize)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="orange">{getWalkStyleLabel(marker.walkStyle)}</Badge>
              <Badge>{getPreferredTimeLabel(marker.preferredTime)}</Badge>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="mb-3 text-sm font-bold text-[var(--color-text-primary)]">
            산책 선호 정보
          </h4>
          <div className="flex flex-wrap gap-2">
            <PreferencePill
              icon={<Footprints className="h-3.5 w-3.5" />}
              label={getWalkStyleLabel(marker.walkStyle)}
            />
            <PreferencePill
              icon={<Clock className="h-3.5 w-3.5" />}
              label={`${getPreferredTimeLabel(marker.preferredTime)} 산책 선호`}
            />
            <PreferencePill
              icon={<MapPin className="h-3.5 w-3.5" />}
              label={`${getDistanceLabel(marker)} 거리`}
            />
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          onClick={onRequestWalk}
          disabled={hasRequested}
          className={cn(
            hasRequested &&
              "bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]",
          )}
        >
          <Send className="h-[18px] w-[18px]" />
          {hasRequested ? "요청 전송 완료" : "산책 요청 보내기"}
        </Button>
      </div>
    </div>
  );
};

const InfoMetric = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-[18px] bg-[var(--color-bg-subtle)] px-3 py-4 text-center">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-[var(--shadow-xs)]">
        {icon}
      </div>
      <p className="text-[11px] font-medium text-[var(--color-text-tertiary)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[var(--color-text-primary)]">
        {value}
      </p>
    </div>
  );
};

const PreferencePill = ({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-subtle)] px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)]">
      {icon}
      {label}
    </span>
  );
};

export const MateDetailPanel = ({
  marker,
  onClose,
  onRequestWalk,
  hasRequested,
}: {
  marker: MapMarker | null;
  onClose: () => void;
  onRequestWalk: () => void;
  hasRequested?: boolean;
}) => {
  if (!marker) return null;

  return (
    <MateDetailContent
      marker={marker}
      onClose={onClose}
      onRequestWalk={onRequestWalk}
      hasRequested={hasRequested}
    />
  );
};

export const MateDetailSheet = ({
  marker,
  onClose,
  onRequestWalk,
  hasRequested,
}: {
  marker: MapMarker | null;
  onClose: () => void;
  onRequestWalk: () => void;
  hasRequested?: boolean;
}) => {
  if (!marker) return null;

  return (
    <div className="md:hidden">
      <button
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-[28px] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-xl)]">
        <div className="flex justify-center pt-2">
          <div className="h-1.5 w-11 rounded-full bg-[var(--color-border)]" />
        </div>
        <div className="max-h-[72vh] overflow-hidden rounded-t-[28px]">
          <MateDetailContent
            marker={marker}
            onClose={onClose}
            onRequestWalk={onRequestWalk}
            hasRequested={hasRequested}
            mobile
          />
        </div>
      </div>
    </div>
  );
};
