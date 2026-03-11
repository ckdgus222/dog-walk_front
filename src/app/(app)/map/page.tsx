"use client";

import { useState } from "react";
import { LocationHeader } from "@/components/layout";
import { List, Map as MapIcon, Plus } from "lucide-react";
import {
  FilterChipBar,
  MateListCard,
  MapPlaceholder,
  MateDetailSheet,
} from "@/features/map/components";
import {
  MAP_MARKERS,
  Filters,
  DOG_SIZES,
  WALK_STYLES,
  PREFERRED_TIMES,
} from "@/lib/mock/map";
import { MapMarker } from "@/lib/mock/map";
import { Button } from "@/components/ui";

const MapPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filters, setFilters] = useState<Filters>({
    dogSizes: [],
    walkStyles: [],
    preferredTimes: [],
  });

  // Filter Logic
  const filteredMarkers = MAP_MARKERS.filter((marker) => {
    if (filters.dogSizes.length && !filters.dogSizes.includes(marker.dogSize))
      return false;
    // ... basic logic (mock)
    return true;
  });

  return (
    <div className="bg-[#F8F9FA] min-h-full h-full flex flex-col relative">
      {/* 1. Header (Mobile Only) */}
      <LocationHeader />

      {/* 2. Filters (Fixed) */}
      <FilterChipBar filters={filters} onFiltersChange={setFilters} />

      {/* 3. Main Content (Split View on Desktop) */}
      <div className="flex-1 flex overflow-hidden lg:h-[calc(100vh-120px)]">
        {/* Left Panel: List View */}
        <div
          className={`
             flex-1 lg:flex-none lg:w-[400px] xl:w-[450px] bg-white border-r border-[#F1F3F5] overflow-y-auto no-scrollbar
             ${viewMode === "map" ? "hidden lg:block" : "block"}
         `}
        >
          <div className="p-4 space-y-4 pb-24 lg:pb-4">
            {/* List Header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="font-bold text-[#212529]">
                내 주변 산책 메이트{" "}
                <span className="text-[#FF8A3D]">{filteredMarkers.length}</span>
              </h2>
              <span className="text-xs text-[#868E96]">역삼 1동 기준</span>
            </div>

            {filteredMarkers.map((marker) => (
              <MateListCard
                key={marker.id}
                data={marker}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}
          </div>
        </div>

        {/* Right Panel: Map View */}
        <div
          className={`
             flex-1 relative bg-[#E9ECEF]
             ${viewMode === "list" ? "hidden lg:block" : "block"}
         `}
        >
          <MapPlaceholder
            markers={filteredMarkers}
            onMarkerClick={setSelectedMarker}
            selectedMarkerId={selectedMarker?.id}
          />

          {/* FAB (Mobile Only) */}
          <div className="absolute bottom-6 right-4 z-30 lg:hidden">
            <button
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
              className="flex items-center gap-2 bg-[#2D3748] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#1A202C] transition-all active:scale-95"
            >
              {viewMode === "list" ? (
                <>
                  <MapIcon className="w-5 h-5" />
                  <span className="font-bold">지도보기</span>
                </>
              ) : (
                <>
                  <List className="w-5 h-5" />
                  <span className="font-bold">목록보기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      <MateDetailSheet
        marker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
        onRequestWalk={() => {
          alert("산책 요청을 보냈습니다!");
          setSelectedMarker(null);
        }}
      />
    </div>
  );
};

export default MapPage;
