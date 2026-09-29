"use client";

import React, { useState, useMemo, useCallback } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { BRICS_HOTSPOTS, HotspotPoint } from "@/data/mockHotspots";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  Flame,
  Info,
  Activity,
  Filter,
} from "lucide-react";

// Default initial viewport centered over Africa/Indian Ocean to span South America, Africa, Asia & Eurasia
const INITIAL_VIEW_STATE = {
  longitude: 45.0,
  latitude: 15.0,
  zoom: 1.8,
  minZoom: 1,
  maxZoom: 12,
  pitch: 20,
  bearing: 0,
};

interface MacroHeatmapProps {
  selectedRegion?: string;
  onSelectHotspot?: (hotspot: HotspotPoint | null) => void;
  externalHotspots?: HotspotPoint[];
}

export const MacroHeatmap: React.FC<MacroHeatmapProps> = ({
  selectedRegion = "ALL",
  onSelectHotspot,
  externalHotspots,
}) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hoveredObject, setHoveredObject] = useState<HotspotPoint | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<HotspotPoint | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showScatter, setShowScatter] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<"ALL" | "critical" | "warn">("ALL");
  const [internalHotspots, setInternalHotspots] = useState<HotspotPoint[]>(BRICS_HOTSPOTS);

  const activeHotspots = externalHotspots && externalHotspots.length > 0 ? externalHotspots : internalHotspots;

  // Fallback direct fetch if not passed externally
  React.useEffect(() => {
    if (externalHotspots && externalHotspots.length > 0) return;
    async function loadLiveHotspots() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/hotspots");
        if (res.ok) {
          const json = await res.json();
          if (json.hotspots && json.hotspots.length > 0) {
            setInternalHotspots(json.hotspots);
          }
        }
      } catch {
        // Fallback
      }
    }
    loadLiveHotspots();
  }, [externalHotspots]);

  // Filter hotspots based on region and severity
  const filteredData = useMemo(() => {
    return activeHotspots.filter((point) => {
      const matchRegion =
        selectedRegion === "ALL" ||
        (selectedRegion === "BR" && point.country === "Brazil") ||
        (selectedRegion === "RU" && point.country === "Russia") ||
        (selectedRegion === "IN" && point.country === "India") ||
        (selectedRegion === "CN" && point.country === "China") ||
        (selectedRegion === "ZA" && point.country === "South Africa") ||
        (selectedRegion === "EG" && point.country === "Egypt") ||
        (selectedRegion === "ET" && point.country === "Ethiopia") ||
        (selectedRegion === "IR" && point.country === "Iran") ||
        (selectedRegion === "AE" && point.country === "UAE");

      const matchSeverity =
        filterSeverity === "ALL" ||
        (filterSeverity === "critical" && point.severity === "alert-critical") ||
        (filterSeverity === "warn" && point.severity === "alert-warn");

      return matchRegion && matchSeverity;
    });
  }, [selectedRegion, filterSeverity]);

  // Deck.gl Layers configuration
  const layers = useMemo(() => {
    const activeLayers: any[] = [];

    // Aggregation Heatmap Layer
    if (showHeatmap) {
      activeLayers.push(
        new HeatmapLayer({
          id: "brics-heatmap-layer",
          data: filteredData,
          getPosition: (d: HotspotPoint) => d.coordinates,
          getWeight: (d: HotspotPoint) => d.demandScore / 10,
          radiusPixels: 60,
          intensity: 1.5,
          threshold: 0.1,
          colorRange: [
            [251, 191, 36, 60],   // alert-warn (#FBBF24) low
            [251, 191, 36, 140],  // alert-warn (#FBBF24) mid
            [244, 63, 94, 180],   // rose mid
            [225, 29, 72, 220],   // alert-critical (#E11D48) high
            [190, 18, 60, 255],   // deep crimson peak
          ],
        })
      );
    }

    // Precise Interactive Scatterplot Hotspot Layer
    if (showScatter) {
      activeLayers.push(
        new ScatterplotLayer({
          id: "brics-scatterplot-layer",
          data: filteredData,
          pickable: true,
          opacity: 0.9,
          stroked: true,
          filled: true,
          radiusScale: 25000,
          radiusMinPixels: 7,
          radiusMaxPixels: 24,
          lineWidthMinPixels: 2,
          getPosition: (d: HotspotPoint) => d.coordinates,
          getRadius: (d: HotspotPoint) => Math.pow(d.demandScore / 10, 2) * 1200,
          // #E11D48 = [225, 29, 72], #FBBF24 = [251, 191, 36]
          getFillColor: (d: HotspotPoint) =>
            d.severity === "alert-critical"
              ? [225, 29, 72, 210] // alert-critical
              : [251, 191, 36, 210], // alert-warn
          getLineColor: (d: HotspotPoint) =>
            d.severity === "alert-critical"
              ? [255, 255, 255, 240]
              : [30, 41, 59, 200],
          onHover: (info: any) => {
            setHoveredObject(info.object as HotspotPoint | null);
          },
          onClick: (info: any) => {
            if (info.object) {
              const hotspot = info.object as HotspotPoint;
              setActiveHotspot(hotspot);
              onSelectHotspot?.(hotspot);
            }
          },
        })
      );
    }

    return activeLayers;
  }, [filteredData, showHeatmap, showScatter, onSelectHotspot]);

  const handleZoom = useCallback((delta: number) => {
    setViewState((prev) => ({
      ...prev,
      zoom: Math.min(Math.max(prev.zoom + delta, prev.minZoom), prev.maxZoom),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setViewState(INITIAL_VIEW_STATE);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200/80 flex flex-col">
      {/* Top Map Console Header */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title & Live Status */}
        <div className="pointer-events-auto bg-primary/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-700/80 shadow-md text-white flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-alert-critical animate-pulse" />
            <span className="text-xs font-bold tracking-tight">
              Macro Geospatial Demand Heatmap
            </span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>PostGIS Engine</span>
            <span className="font-mono text-teal-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
              {filteredData.length} Hotspots
            </span>
          </div>
        </div>

        {/* Map Filter Controls */}
        <div className="pointer-events-auto bg-primary/95 backdrop-blur-md p-1 rounded-lg border border-slate-700/80 shadow-md flex items-center gap-1">
          <button
            onClick={() => setFilterSeverity("ALL")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              filterSeverity === "ALL"
                ? "bg-slate-700 text-white shadow-inner"
                : "text-slate-300 hover:text-white"
            }`}
          >
            All Hotspots
          </button>
          <button
            onClick={() => setFilterSeverity("critical")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              filterSeverity === "critical"
                ? "bg-alert-critical text-white shadow-sm font-semibold"
                : "text-rose-300 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-alert-critical ring-1 ring-white/40" />
            Critical (#E11D48)
          </button>
          <button
            onClick={() => setFilterSeverity("warn")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              filterSeverity === "warn"
                ? "bg-alert-warn text-slate-900 shadow-sm font-semibold"
                : "text-amber-300 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-alert-warn ring-1 ring-slate-800/40" />
            Moderate (#FBBF24)
          </button>

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          {/* Layer toggles */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            title="Toggle Density Heatmap Layer"
            className={`p-1.5 rounded transition-colors ${
              showHeatmap ? "bg-accent text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowScatter(!showScatter)}
            title="Toggle Scatter Nodes"
            className={`p-1.5 rounded transition-colors ${
              showScatter ? "bg-accent text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Deck.GL Canvas Area */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        {/* Stylized Vector World Base Canvas */}
        <div className="absolute inset-0 bg-[#0B1120] overflow-hidden pointer-events-none">
          {/* Subtle Grid Lines to emphasize GIS Precision */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px),
                                linear-gradient(to bottom, #334155 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Latitude Equatorial Indicator */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-teal-500/20 dashed border-t border-teal-500/30" />
          <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-slate-700/30" />
          <div className="absolute top-[70%] left-0 right-0 h-[1px] bg-slate-700/30" />
        </div>

        {/* DeckGL Map Layer Container */}
        <DeckGL
          viewState={viewState}
          onViewStateChange={(e: any) => setViewState(e.viewState)}
          controller={true}
          layers={layers}
          getCursor={({ isHovering }) => (isHovering ? "pointer" : "grab")}
        />

        {/* Hover Tooltip Overlay */}
        {hoveredObject && (
          <div
            className="absolute z-30 pointer-events-none bg-primary/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs max-w-xs backdrop-blur-sm"
            style={{
              left: "50%",
              bottom: "20px",
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-bold text-sm text-white truncate">
                {hoveredObject.name}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  hoveredObject.severity === "alert-critical"
                    ? "bg-alert-critical text-white"
                    : "bg-alert-warn text-slate-900"
                }`}
              >
                Score: {hoveredObject.demandScore}/100
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mb-2 leading-relaxed">
              {hoveredObject.deficitDescription}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700 pt-1.5">
              <span>{hoveredObject.country} • {hoveredObject.category}</span>
              <span className="font-semibold text-teal-300">
                Pop: {hoveredObject.affectedPopulation}
              </span>
            </div>
          </div>
        )}

        {/* Floating Map Navigation Controls */}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5 bg-primary/90 p-1 rounded-lg border border-slate-700 shadow-md backdrop-blur-sm">
          <button
            onClick={() => handleZoom(0.5)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.5)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset Global View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 z-20 bg-primary/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700 shadow-md text-white text-[11px] space-y-1.5">
          <div className="font-semibold text-[10px] uppercase tracking-wider text-slate-400">
            Geospatial Deficit Severity
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-alert-critical ring-2 ring-rose-500/30 inline-block" />
              <span>Severe Deficit (Alert-Critical)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-alert-warn ring-2 ring-amber-500/30 inline-block" />
              <span>Moderate Hotspot (Alert-Warn)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
