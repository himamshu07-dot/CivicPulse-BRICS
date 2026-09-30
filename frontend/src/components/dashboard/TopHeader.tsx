"use client";

import React, { useState } from "react";
import {
  Database,
  Plus,
  Mic,
  Trash2,
  Activity,
  Layers,
  Sparkles,
  Workflow,
  Radio,
} from "lucide-react";
import { AIArchitectureModal } from "./AIArchitectureModal";

interface TopHeaderProps {
  activeTab?: string;
  selectedRegion?: string;
  setSelectedRegion?: (region: string) => void;
  onOpenReportModal?: () => void;
  onClearDatabase?: () => void;
  dbRecordCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab = "dashboard",
  onOpenReportModal,
  onClearDatabase,
  dbRecordCount = 0,
}) => {
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  const getTabLabel = () => {
    switch (activeTab) {
      case "matrix":
        return { label: "Sector Health Matrix", icon: Activity };
      case "ai-projects":
        return { label: "AI Project Directives", icon: Sparkles };
      case "dashboard":
      default:
        return { label: "Problems Directory", icon: Layers };
    }
  };

  const currentTab = getTabLabel();
  const TabIcon = currentTab.icon;

  return (
    <>
      <header className="h-14 bg-surface border-b border-border px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 z-20 font-sans select-none">
        {/* Left: Active View Breadcrumb & Live DPG Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-text-muted">CivicPulse</span>
            <span className="text-text-dim">/</span>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <TabIcon className="w-3.5 h-3.5 text-accent" />
              <span>{currentTab.label}</span>
            </div>
          </div>

          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium font-mono bg-surface-card border border-border text-text-dim">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live BRICS Telemetry
          </span>
        </div>

        {/* Right: Architecture Blueprint, DBMS Status, Reset & Single Primary CTA */}
        <div className="flex items-center gap-2.5">
          {/* AI Architecture Blueprint Button */}
          <button
            onClick={() => setIsArchitectureModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-card hover:border-accent/40 text-text-muted hover:text-white text-xs font-medium transition-all"
            title="Inspect 6-Stage AI & ML Pipeline Architecture"
          >
            <Workflow className="w-3.5 h-3.5 text-accent" />
            <span>AI Architecture</span>
          </button>

          {/* Real DBMS Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-border text-xs">
            <Database className="w-3.5 h-3.5 text-accent" />
            <span className="text-text-muted text-[11px] hidden md:inline">Database:</span>
            <span className="font-mono font-semibold text-white">
              {dbRecordCount} {dbRecordCount === 1 ? "Report" : "Reports"}
            </span>
          </div>

          {/* Clear All Problems Button */}
          {dbRecordCount > 0 && onClearDatabase && (
            <button
              onClick={onClearDatabase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-alert-critical/30 hover:bg-alert-critical/10 text-alert-critical font-medium text-xs transition-colors"
              title="Clear all stored problems from database"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}

          {/* Sole Primary Action Button */}
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-accent text-black font-semibold text-xs hover:bg-accent-bright transition-all shadow-sm active:scale-95"
              title="Submit a citizen report with custom location"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Report Problem</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-black/15 text-black px-1.5 py-0.5 rounded font-mono font-medium">
                <Mic className="w-2.5 h-2.5" /> Voice / Text
              </span>
            </button>
          )}
        </div>
      </header>

      {/* AI Pipeline Architecture Blueprint Modal */}
      <AIArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </>
  );
};
