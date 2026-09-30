"use client";

import React from "react";
import {
  Database,
  Mic,
  Trash2,
} from "lucide-react";

interface TopHeaderProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  onOpenReportModal?: () => void;
  onClearDatabase?: () => void;
  dbRecordCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenReportModal,
  onClearDatabase,
  dbRecordCount = 0,
}) => {
  return (
    <header className="h-14 bg-surface border-b border-border px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 shadow-sm z-20 font-mono select-none">
      {/* Left: Platform Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-white tracking-wider">
            CivicPulse
          </span>
          <span className="text-accent font-bold">//</span>
          <span className="text-xs text-text-muted font-medium hidden md:inline truncate">
            Citizen Grievance &amp; Infrastructure Resolution Platform
          </span>
        </div>
      </div>

      {/* Right: Real Actions & Real DBMS Indicator */}
      <div className="flex items-center gap-3">
        {/* Real DBMS Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-border text-text-muted text-xs">
          <Database className="w-3.5 h-3.5 text-accent" />
          <span className="text-text-dim text-[11px] hidden sm:inline">// DBMS Stored:</span>
          <span className="text-accent font-bold">
            [{dbRecordCount} {dbRecordCount === 1 ? "Problem" : "Problems"}]
          </span>
        </div>

        {/* Clear All Problems Button */}
        {dbRecordCount > 0 && onClearDatabase && (
          <button
            onClick={onClearDatabase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-alert-critical/40 hover:bg-alert-critical/10 text-alert-critical font-medium text-xs transition-colors"
            title="Clear all problems to start with a fresh slate"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">[ Reset / Clear All ]</span>
          </button>
        )}

        {/* Prominent Ghost Add Problem Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-accent bg-accent/5 text-accent hover:bg-accent/15 hover:shadow-neon-sm font-bold text-xs transition-all active:scale-95"
          title="Submit a citizen problem using voice speech or text"
        >
          <Mic className="w-3.5 h-3.5 text-accent" />
          <span>[ + Add Problem (Voice / Text) ]</span>
        </button>
      </div>
    </header>
  );
};
