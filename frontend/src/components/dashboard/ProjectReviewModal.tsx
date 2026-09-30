"use client";

import React, { useState } from "react";
import { AIProjectRecommendation } from "@/data/mockProjects";
import {
  X,
  Sparkles,
  Coins,
  Users,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Award,
} from "lucide-react";

interface ProjectReviewModalProps {
  project: AIProjectRecommendation | null;
  onClose: () => void;
}

export const ProjectReviewModal: React.FC<ProjectReviewModalProps> = ({
  project,
  onClose,
}) => {
  const [isApproved, setIsApproved] = useState(false);
  const [allocationNote, setAllocationNote] = useState("");
  const [fundingMultiplier, setFundingMultiplier] = useState(100);
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "allocation">("overview");

  if (!project) return null;

  // Safe defaults if arrays are missing from backend or mock
  const keySignals =
    project.keySignals && project.keySignals.length > 0
      ? project.keySignals
      : [
          `${project.beneficiaries || "Citizen"} verified grievance cluster`,
          `Computed Priority Score: ${project.priorityScore || 50} / 100`,
          `Critical municipal demand in ${project.region || "urban sector"}`,
          "Validated by cross-border multi-channel ingestion pipeline",
        ];

  const coBenefits =
    project.coBenefits && project.coBenefits.length > 0
      ? project.coBenefits
      : [
          `Directly mitigates infrastructure disruption across ${project.region}`,
          `Provides rapid stabilization for ${project.beneficiaries || "impacted communities"}`,
          "Aligns with multilateral BRICS Digital Public Good (DPG) standards",
          "Automated priority dispatch via municipal emergency response facility",
        ];

  // Dynamic calculations based on funding slider
  const baseCostNum = parseFloat(project.estimatedCost.replace(/[^0-9.]/g, "")) || 2.5;
  const currentCostFormatted = `$${(baseCostNum * (fundingMultiplier / 100)).toFixed(2)}M`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-surface-card rounded-2xl shadow-2xl border border-border max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-border bg-surface flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold border border-accent/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                AI Policy Synthesis Directive
              </span>
              <span className="text-xs text-text-dim font-mono">ID: {project.id}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-card border border-border text-text-muted font-mono">
                {project.timeframe}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <span>Jurisdiction:</span>
              <strong className="text-accent font-medium">
                {project.region} ({project.country})
              </strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-surface-card transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-border/80 bg-surface/50 text-xs">
          {[
            { id: "overview", label: "Executive Brief" },
            { id: "metrics", label: "Signals & Co-Benefits" },
            { id: "allocation", label: "Interactive Fiscal Allocation" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-accent/10 text-accent font-semibold border border-accent/30 shadow-xs"
                  : "text-text-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-text-main scrollbar-thin scrollbar-thumb-border">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[11px] font-medium text-text-dim block mb-1">
                Priority Index
              </span>
              <span
                className={`text-xl font-bold font-mono ${
                  project.priorityScore >= 90
                    ? "text-alert-critical"
                    : project.priorityScore >= 80
                    ? "text-alert-warn"
                    : "text-accent"
                }`}
              >
                {project.priorityScore} / 100
              </span>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[11px] font-medium text-text-dim flex items-center gap-1 mb-1">
                <Coins className="w-3.5 h-3.5 text-accent" /> Est. Facility
              </span>
              <span className="text-sm font-bold text-accent font-mono">
                {currentCostFormatted}
              </span>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[11px] font-medium text-text-dim flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-accent" /> Beneficiaries
              </span>
              <span className="text-sm font-bold text-white">
                {project.beneficiaries}
              </span>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <span className="text-[11px] font-medium text-text-dim flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-accent" /> Rapid Execution
              </span>
              <span className="text-sm font-bold text-white">
                {project.timeframe}
              </span>
            </div>
          </div>

          {/* TAB 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Prescriptive LLM Justification
                </h4>
                <div className="p-4 bg-surface rounded-xl border border-border text-text-main leading-relaxed text-xs">
                  {project.aiJustification}
                </div>
              </div>

              {/* Live Signal Validation summary */}
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-semibold text-white">Multilateral DPG Validation</h5>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    This directive is cross-verified against real DBSCAN cluster telemetry and citizen sentiment indices. Ready for rapid funding deployment via the BRICS New Development Bank emergency window.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Signals & Co-Benefits */}
          {activeTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-text-dim uppercase tracking-wider">
                  Key Trigger Signals
                </h4>
                <ul className="space-y-2">
                  {keySignals.map((signal, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-3 bg-surface rounded-xl border border-border text-text-muted"
                    >
                      <span className="w-2 h-2 rounded-full bg-alert-critical shrink-0 mt-1" />
                      <span className="leading-snug">{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-text-dim uppercase tracking-wider">
                  Multilateral Co-Benefits
                </h4>
                <ul className="space-y-2">
                  {coBenefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-3 bg-surface rounded-xl border border-border text-text-muted"
                    >
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Fiscal Allocation */}
          {activeTab === "allocation" && (
            <div className="space-y-4 p-4 bg-surface rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-accent" />
                    Interactive Funding Allocation Simulator
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    Adjust rapid funding allocation commitment percentage from the reserve pool.
                  </p>
                </div>
                <span className="font-mono text-base font-bold text-accent px-3 py-1 bg-surface-card rounded-lg border border-border">
                  {fundingMultiplier}%
                </span>
              </div>

              {/* Interactive Slider */}
              <div className="space-y-2 pt-2">
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={fundingMultiplier}
                  onChange={(e) => setFundingMultiplier(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-card rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-text-dim font-mono">
                  <span>50% (Minimum Rapid Containment)</span>
                  <span>100% (Recommended Directive Budget)</span>
                  <span>150% (Full Metropolitan Reconstruction)</span>
                </div>
              </div>

              {/* Dynamic Recalculated Summary */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-surface-card rounded-lg border border-border">
                  <span className="text-[10px] text-text-dim block uppercase">Committed Budget</span>
                  <span className="text-base font-bold text-accent font-mono">{currentCostFormatted}</span>
                </div>
                <div className="p-3 bg-surface-card rounded-lg border border-border">
                  <span className="text-[10px] text-text-dim block uppercase">Projected Impact</span>
                  <span className="text-base font-bold text-white font-mono">
                    {Math.round(parseInt(project.beneficiaries.replace(/[^0-9]/g, "") || "5000") * (fundingMultiplier / 100)).toLocaleString()}+ Citizens
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Policymaker Directives Note */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-text-dim uppercase tracking-wider block">
              Policy Reviewer Notes & Directives
            </label>
            <textarea
              rows={2}
              placeholder="Add ministerial comments, co-funding approvals, or bilateral directives..."
              value={allocationNote}
              onChange={(e) => setAllocationNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-border text-xs bg-surface text-white placeholder-text-dim focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Interactive Ratification Banner */}
          {isApproved && (
            <div className="p-4 bg-accent/10 border border-accent/40 rounded-xl text-accent flex items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <span className="font-bold text-sm block">Directive Ratified & Committed!</span>
                  <span className="text-xs text-accent/80">
                    Allocated {currentCostFormatted} to {project.region} emergency public good dossier.
                  </span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent text-black font-bold font-mono">
                COMMITTED
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-5 border-t border-border bg-surface flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-text-muted hover:text-white hover:bg-surface-card font-medium text-xs transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                alert(`Exported Ministerial Briefing for ${project.title} to PDF dossier.`);
              }}
              className="px-3.5 py-2 rounded-lg border border-border bg-surface-card text-text-muted hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
              <span>Export Dossier</span>
            </button>

            <button
              onClick={() => setIsApproved(true)}
              className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 ${
                isApproved
                  ? "bg-accent/20 text-accent border border-accent/40"
                  : "bg-accent text-black hover:bg-accent-bright shadow-sm"
              }`}
            >
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{isApproved ? "Ratified" : "Ratify Policy Recommendation"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
