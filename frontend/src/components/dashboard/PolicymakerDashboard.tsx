"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MacroHeatmap } from "./MacroHeatmap";
import { LiveRequestFeed } from "./LiveRequestFeed";
import { AIPriorityProjects } from "./AIPriorityProjects";
import { BRICS_HOTSPOTS, HotspotPoint } from "@/data/mockHotspots";
import { MOCK_AI_PROJECTS, AIProjectRecommendation } from "@/data/mockProjects";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export const PolicymakerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPoint | null>(null);

  // Live Backend Data States
  const [hotspots, setHotspots] = useState<HotspotPoint[]>(BRICS_HOTSPOTS);
  const [aiProjects, setAiProjects] = useState<AIProjectRecommendation[]>(MOCK_AI_PROJECTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSynced, setLastSynced] = useState<string>("Initializing...");
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "fallback">("syncing");

  // Fetch clustered hotspots and AI project recommendations from FastAPI backend
  const fetchClusteredData = useCallback(async () => {
    setIsLoading(true);
    setSyncStatus("syncing");
    try {
      // Direct call to FastAPI backend on port 8000
      const response = await fetch("http://localhost:8000/api/v1/hotspots");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.hotspots && data.hotspots.length > 0) {
        setHotspots(data.hotspots);
      }
      if (data.ai_projects && data.ai_projects.length > 0) {
        setAiProjects(data.ai_projects);
      }

      setSyncStatus("synced");
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Backend /api/v1/hotspots offline or starting up. Using resilient local cache:", err);
      setSyncStatus("fallback");
      setLastSynced("Local Cache Active");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClusteredData();
    // Poll every 30 seconds for new clustered events
    const interval = setInterval(fetchClusteredData, 30000);
    return () => clearInterval(interval);
  }, [fetchClusteredData]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-main font-sans">
      {/* 1. Left Sidebar Navigation (#1E293B) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {/* Main Application Area (Canvas: #F8FAFC) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background">
        {/* Top Header Context & Telemetry */}
        <TopHeader
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />

        {/* Live Cluster Synchronization Action Bar */}
        <div className="px-4 py-1.5 bg-slate-100/80 border-b border-slate-200/80 flex items-center justify-between text-xs text-text-muted shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">DBSCAN Geospatial Pipeline:</span>
            {syncStatus === "synced" && (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live FastAPI Backend Synced ({hotspots.length} Clusters • {lastSynced})
              </span>
            )}
            {syncStatus === "syncing" && (
              <span className="flex items-center gap-1 text-accent font-medium">
                <RefreshCw className="w-3.5 h-3.5 text-accent animate-spin" />
                Clustering Citizen Signals...
              </span>
            )}
            {syncStatus === "fallback" && (
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Standby Cache ({hotspots.length} Clusters)
              </span>
            )}
          </div>

          <button
            onClick={fetchClusteredData}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-medium text-slate-700 shadow-2xs transition-colors disabled:opacity-50"
            title="Trigger DBSCAN Clustering & LLM Policy Summarizer"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-accent" : "text-slate-500"}`} />
            <span>Re-cluster Signals</span>
          </button>
        </div>

        {/* Dashboard Grid Workspace: Center Console (2/3 + 1/3) & Right Panel */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden p-3 md:p-4 gap-4">
          {/* Center Console: Takes up 8 cols on large screens, 9 on xl */}
          <div className="xl:col-span-8 2xl:col-span-9 flex flex-col h-full gap-4 min-h-0">
            {/* Top Two-Thirds: Geospatial Macro Heatmap (deck.gl + react-map-gl) */}
            <div className="h-[62%] min-h-[320px] w-full">
              <MacroHeatmap
                selectedRegion={selectedRegion}
                onSelectHotspot={setSelectedHotspot}
                externalHotspots={hotspots}
              />
            </div>

            {/* Bottom One-Third: Live Citizen Request Feed (LiveRequestFeed.tsx) */}
            <div className="h-[38%] min-h-[220px] w-full">
              <LiveRequestFeed selectedRegion={selectedRegion} />
            </div>
          </div>

          {/* Right Panel: AI Project Recommendations (card: #FFFFFF) */}
          <div className="xl:col-span-4 2xl:col-span-3 h-full min-h-0">
            <AIPriorityProjects
              selectedRegion={selectedRegion}
              externalProjects={aiProjects}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicymakerDashboard;
