"use client";

import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { CURRENT_USER, WALK_HISTORY } from "@/lib/mock/user";
import { formatDate } from "@/lib/utils";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Dog,
  Footprints,
  Heart,
  MapPin,
  Settings,
  ShieldCheck,
  Star,
} from "lucide-react";

const DOG_SIZE_LABELS = {
  small: "소형견",
  medium: "중형견",
  large: "대형견",
} as const;

const COMPLIMENTS = [
  { label: "시간 약속을 잘 지켜요", count: 12 },
  { label: "강아지가 매너 있어요", count: 8 },
  { label: "산책이 편안하고 즐거워요", count: 5 },
];

const MENU_ITEMS = [
  "산책 기록 전체보기",
  "관심 메이트 관리",
  "알림 및 동네 설정",
];

const MyPage = () => {
  const user = CURRENT_USER;
  const totalDistance = WALK_HISTORY.reduce((sum, walk) => sum + walk.distance, 0);

  return (
    <div className="min-h-full bg-[var(--color-bg)]">
      <PageHeader
        title="마이페이지"
        action={
          <button className="rounded-xl p-2 text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-subtle)]">
            <Settings className="h-5 w-5" />
          </button>
        }
      />

      <div className="mx-auto max-w-4xl px-4 py-5 md:px-6 md:py-6">
        <div className="mb-6 hidden items-start justify-between md:flex">
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary)]">
              TRUST PROFILE
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
              나의 산책 프로필
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
              매너온도, 산책 기록, 반려견 정보까지 한 번에 관리합니다.
            </p>
          </div>

          <Button variant="outline">
            <Settings className="h-4 w-4" />
            프로필 설정
          </Button>
        </div>

        <Card className="mb-5 overflow-hidden">
          <div className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                <Avatar
                  alt={user.name}
                  size="xl"
                  className="h-[84px] w-[84px] border-[var(--color-border-light)]"
                />
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--color-success)] text-white">
                  <ShieldCheck className="h-[18px] w-[18px]" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {user.name}
                  </h2>
                  <Badge className="bg-[var(--color-primary-lighter)] text-[var(--color-primary-dark)]">
                    매너온도 {user.mannerScore}°C
                  </Badge>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {user.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{user.dogName}</Badge>
                  <Badge variant="orange">{user.dogBreed}</Badge>
                  <Badge variant="secondary">
                    {DOG_SIZE_LABELS[user.dogSize]}
                  </Badge>
                </div>
              </div>

              <Button variant="outline" className="sm:shrink-0">
                프로필 수정
              </Button>
            </div>

            <div className="mt-5 rounded-[20px] border border-[rgba(52,168,83,0.16)] bg-[var(--color-success-light)] p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-success)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-success)]">
                    신뢰할 수 있는 산책 메이트
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    총 산책 {user.totalWalks}회, 만난 메이트 {user.totalMates}명,
                    받은 칭찬 {COMPLIMENTS.reduce((sum, item) => sum + item.count, 0)}건
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Footprints className="h-[18px] w-[18px]" />}
            label="총 산책 횟수"
            value={`${user.totalWalks}회`}
          />
          <MetricCard
            icon={<Star className="h-[18px] w-[18px]" />}
            label="만난 메이트"
            value={`${user.totalMates}명`}
          />
          <MetricCard
            icon={<MapPin className="h-[18px] w-[18px]" />}
            label="누적 산책 거리"
            value={`${totalDistance.toFixed(1)}km`}
          />
          <MetricCard
            icon={<Heart className="h-[18px] w-[18px]" />}
            label="받은 칭찬"
            value={`${COMPLIMENTS.reduce((sum, item) => sum + item.count, 0)}건`}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Dog className="h-[18px] w-[18px] text-[var(--color-primary)]" />
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                반려견 정보
              </h3>
            </div>

            <div className="rounded-[20px] bg-[var(--color-bg-subtle)] p-4">
              <div className="flex items-start gap-4">
                <Avatar
                  alt={user.dogName}
                  size="xl"
                  className="h-[72px] w-[72px] border-[var(--color-border-light)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {user.dogName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {user.dogBreed} · {DOG_SIZE_LABELS[user.dogSize]}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{user.dogAge}살</Badge>
                    <Badge variant="orange">산책 경험 풍부</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="h-[18px] w-[18px] text-[var(--color-primary)]" />
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                산책 선호 정보
              </h3>
            </div>

            <div className="space-y-3">
              <PreferenceCard
                label="선호 시간대"
                value="아침 시간 산책 선호"
                icon={<CalendarDays className="h-4 w-4" />}
              />
              <PreferenceCard
                label="주요 활동 지역"
                value="한강공원과 동네 산책로"
                icon={<MapPin className="h-4 w-4" />}
              />
              <PreferenceCard
                label="메이트 성향"
                value="차분하고 책임감 있는 산책 메이트"
                icon={<Heart className="h-4 w-4" />}
              />
            </div>
          </Card>
        </div>

        <Card className="mt-5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-[18px] w-[18px] text-[var(--color-primary)]" />
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              받은 칭찬
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {COMPLIMENTS.map((compliment) => (
              <Badge
                key={compliment.label}
                className="bg-[var(--color-warning-light)] text-[var(--color-text-secondary)]"
              >
                {compliment.label} · {compliment.count}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="mt-5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-[18px] w-[18px] text-[var(--color-primary)]" />
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              최근 산책 기록
            </h3>
          </div>

          <div className="space-y-3">
            {WALK_HISTORY.map((walk) => (
              <div
                key={walk.id}
                className="flex flex-col gap-3 rounded-[18px] bg-[var(--color-bg-subtle)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {walk.location}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                    {walk.mateName}님과 {walk.duration}분 · {walk.distance}km
                  </p>
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {formatDate(walk.date)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-5 overflow-hidden">
          {MENU_ITEMS.map((item, index) => (
            <button
              key={item}
              className={`flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--color-bg-subtle)] ${
                index < MENU_ITEMS.length - 1
                  ? "border-b border-[var(--color-border-light)]"
                  : ""
              }`}
            >
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {item}
              </span>
              <ChevronRight className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-[20px] border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4 text-center shadow-[var(--shadow-xs)]">
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-lighter)] text-[var(--color-primary)]">
        {icon}
      </div>
      <p className="text-xs text-[var(--color-text-tertiary)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">
        {value}
      </p>
    </div>
  );
};

const PreferenceCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) => {
  return (
    <div className="rounded-[18px] bg-[var(--color-bg-subtle)] p-4">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-tertiary)]">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
        {value}
      </p>
    </div>
  );
};

export default MyPage;
