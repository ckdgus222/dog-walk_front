"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@/components/ui";
import { LocationHeader } from "@/components/layout";
import { List, Map as MapIcon, Search, SlidersHorizontal } from "lucide-react";
import {
  FilterChipBar,
  MateDetailPanel,
  MateDetailSheet,
  MateListCard,
  MapPlaceholder,
} from "@/features/map/components";
import { Filters, MAP_MARKERS, MapMarker } from "@/lib/mock/map";
import { cn } from "@/lib/utils";

const MapPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("map");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [requestedMarkerIds, setRequestedMarkerIds] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    dogSizes: [],
    walkStyles: [],
    preferredTimes: [],
  });

  const filteredMarkers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return MAP_MARKERS.filter((marker) => {
      if (filters.dogSizes.length && !filters.dogSizes.includes(marker.dogSize)) {
        return false;
      }

      if (
        filters.walkStyles.length &&
        !filters.walkStyles.includes(marker.walkStyle)
      ) {
        return false;
      }

      if (
        filters.preferredTimes.length &&
        !filters.preferredTimes.includes(marker.preferredTime)
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        marker.name,
        marker.dogName,
        marker.dogBreed,
        marker.bio,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [filters, searchQuery]);

  const activeSelectedMarker =
    selectedMarker &&
    filteredMarkers.some((marker) => marker.id === selectedMarker.id)
      ? selectedMarker
      : null;

  const handleRequestWalk = () => {
    if (!activeSelectedMarker) return;

    setRequestedMarkerIds((prev) =>
      prev.includes(activeSelectedMarker.id)
        ? prev
        : [...prev, activeSelectedMarker.id],
    );
  };

  const selectedRequested =
    !!activeSelectedMarker &&
    requestedMarkerIds.includes(activeSelectedMarker.id);

  const hasFilters =
    filters.dogSizes.length > 0 ||
    filters.walkStyles.length > 0 ||
    filters.preferredTimes.length > 0;

  return (
    <div className="flex min-h-[calc(100dvh-var(--bottom-nav-height))] flex-col bg-[var(--color-bg)] md:min-h-[calc(100dvh-var(--header-height))]">
      <LocationHeader />

      <div className="sticky top-[60px] z-20 border-b border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] px-4 py-3 md:hidden">
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={() => setViewMode("map")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              viewMode === "map"
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            }`}
          >
            <MapIcon className="h-4 w-4" />
            지도
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              viewMode === "list"
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            }`}
          >
            <List className="h-4 w-4" />
            목록
          </button>
          <button
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className={`ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              showMobileFilters || hasFilters
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            필터
          </button>
        </div>

        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="이름, 반려견, 견종으로 검색"
          leftIcon={<Search className="h-4 w-4" />}
        />

        {showMobileFilters && (
          <div className="mt-3">
            <FilterChipBar
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}

        <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
          주변 메이트{" "}
          <span className="font-semibold text-[var(--color-primary)]">
            {filteredMarkers.length}
          </span>
          명
        </p>
      </div>

      <div className="min-h-0 flex-1 md:flex">
        <aside className="hidden w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] md:flex">
          <div className="border-b border-[var(--color-border-light)] px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)]">
              Local Walk Map
            </p>
            <h1 className="mt-1 text-[28px] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
              주변 메이트
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="이름, 반려견, 견종으로 검색"
                leftIcon={<Search className="h-4 w-4" />}
              />
              <Button
                variant={hasFilters ? "primary" : "outline"}
                size="md"
                className="shrink-0 px-3"
                onClick={() => setShowDesktopFilters((prev) => !prev)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                필터
              </Button>
            </div>

            {(showDesktopFilters || hasFilters) && (
              <FilterChipBar
                filters={filters}
                onFiltersChange={setFilters}
                className="mt-3"
              />
            )}

            <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
              역삼1동 기준으로 가까운 메이트를 보여드려요.{" "}
              <span className="font-semibold text-[var(--color-primary)]">
                {filteredMarkers.length}
              </span>
              명
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 hide-scrollbar">
            <div className="space-y-3">
              {filteredMarkers.map((marker) => (
                <MateListCard
                  key={marker.id}
                  data={marker}
                  selected={activeSelectedMarker?.id === marker.id}
                  requested={requestedMarkerIds.includes(marker.id)}
                  onClick={() => setSelectedMarker(marker)}
                />
              ))}
            </div>
          </div>
        </aside>

        <section className="relative min-h-0 flex-1 overflow-hidden bg-[var(--color-bg-subtle)]">
          {viewMode === "list" ? (
            <div className="h-full overflow-y-auto px-4 py-4 hide-scrollbar md:hidden">
              <div className="space-y-3 pb-20">
                {filteredMarkers.map((marker) => (
                  <MateListCard
                    key={marker.id}
                    data={marker}
                    selected={activeSelectedMarker?.id === marker.id}
                    requested={requestedMarkerIds.includes(marker.id)}
                    onClick={() => {
                      setSelectedMarker(marker);
                      setViewMode("map");
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <MapPlaceholder
              markers={filteredMarkers}
              onMarkerClick={setSelectedMarker}
              selectedMarkerId={activeSelectedMarker?.id}
            />
          )}
        </section>

        <aside
          className={cn(
            "map-detail-panel-shell hidden shrink-0 overflow-hidden bg-[var(--color-bg-elevated)] md:block",
            activeSelectedMarker
              ? "w-[360px] border-l border-[var(--color-border-light)] opacity-100"
              : "w-0 border-l border-transparent opacity-0",
          )}
          aria-hidden={!activeSelectedMarker}
        >
          <div
            className={cn(
              "map-detail-panel-inner h-full w-[360px]",
              activeSelectedMarker
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0",
            )}
          >
            {activeSelectedMarker && (
              <div className="map-detail-panel-enter h-full">
                <MateDetailPanel
                  marker={activeSelectedMarker}
                  onClose={() => setSelectedMarker(null)}
                  onRequestWalk={handleRequestWalk}
                  hasRequested={selectedRequested}
                />
              </div>
            )}
          </div>
        </aside>
      </div>

      <MateDetailSheet
        marker={activeSelectedMarker}
        onClose={() => setSelectedMarker(null)}
        onRequestWalk={handleRequestWalk}
        hasRequested={selectedRequested}
      />
    </div>
  );
};

export default MapPage;
