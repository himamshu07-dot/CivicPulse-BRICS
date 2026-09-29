"use client";

import React from "react";
import {
  Database,
  PlusCircle,
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
    <header className="h-14 bg-card border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs z-20">
      {/* Left: Platform Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary tracking-tight">
            CivicPulse
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-text-muted font-medium">
            Citizen Grievance & Infrastructure Resolution Platform
          </span>
        </div>
      </div>

      {/* Right: Real Actions & Real DBMS Indicator */}
      <div className="flex items-center gap-3">
        {/* Real DBMS Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono">
          <Database className="w-3.5 h-3.5 text-accent" />
          <span>DBMS Stored:</span>
          <span className="text-accent font-bold">{dbRecordCount} {dbRecordCount === 1 ? "Problem" : "Problems"}</span>
        </div>

        {/* Clear All Problems Button */}
        {dbRecordCount > 0 && onClearDatabase && (
          <button
            onClick={onClearDatabase}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 font-medium text-xs transition-colors"
            title="Clear all problems to start with a fresh slate"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset / Clear All</span>
          </button>
        )}

        {/* Prominent Add Problem Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-white hover:bg-teal-700 font-semibold text-xs shadow-sm transition-all active:scale-95"
          title="Submit a citizen problem using voice speech or text"
        >
          <Mic className="w-3.5 h-3.5 text-white" />
          <span>+ Add Problem (Voice / Text)</span>
        </button>
      </div>
    </header>
  );
};
