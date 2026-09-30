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

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div className="bg-surface-card rounded-xl shadow-neon-lg border border-border max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-border bg-surface flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-bold border border-accent/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent" />
                // AI Policy Synthesis Brief //
              </span>
              <span className="text-xs text-text-dim">ID: [{project.id}]</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight font-sans">
              {project.title}
            </h2>
            <p className="text-xs text-text-muted">
              Territory: <strong className="text-accent">{project.region} ({project.country})</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-text-dim hover:text-white hover:bg-surface-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-text-main scrollbar-thin scrollbar-thumb-border">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] uppercase font-bold text-text-dim block mb-1">
                // Priority Index //
              </span>
              <span
                className={`text-xl font-bold ${
                  project.priorityScore >= 90
                    ? "text-alert-critical"
                    : "text-alert-warn"
                }`}
              >
                {project.priorityScore}/100
              </span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] uppercase font-bold text-text-dim flex items-center gap-1 mb-1">
                <Coins className="w-3 h-3 text-accent" /> Est. Facility
              </span>
              <span className="text-sm font-bold text-accent">
                {project.estimatedCost}
              </span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] uppercase font-bold text-text-dim flex items-center gap-1 mb-1">
                <Users className="w-3 h-3 text-accent" /> Beneficiaries
              </span>
              <span className="text-sm font-bold text-white">
                {project.beneficiaries}
              </span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] uppercase font-bold text-text-dim flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-accent" /> Execution
              </span>
              <span className="text-sm font-bold text-white">
                {project.timeframe}
              </span>
            </div>
          </div>

          {/* AI Evidence Justification */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              // AI Recommendation Justification //
            </h4>
            <div className="p-4 bg-surface rounded-lg border border-border text-text-main leading-relaxed font-sans text-xs">
              {project.aiJustification}
            </div>
          </div>

          {/* Signal Corroboration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-text-dim">
                // Key Trigger Signals //
              </h4>
              <ul className="space-y-1.5">
                {project.keySignals.map((signal, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-2.5 bg-surface rounded-lg border border-border text-text-muted"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-alert-critical shrink-0 mt-1.5" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-text-dim">
                // Multilateral Co-Benefits //
              </h4>
              <ul className="space-y-1.5">
                {project.coBenefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-2.5 bg-surface rounded-lg border border-border text-text-muted"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Policymaker Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-[11px] uppercase tracking-wider text-text-dim">
              // Policy Reviewer Notes & Directives //
            </label>
            <textarea
              rows={2}
              placeholder="Add ministerial comments, co-funding approvals, or bilateral directives..."
              value={allocationNote}
              onChange={(e) => setAllocationNote(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border text-xs bg-surface text-white placeholder-text-dim focus:outline-none focus:border-accent font-sans"
            />
          </div>

          {isApproved && (
            <div className="p-3.5 bg-accent/10 border border-accent/40 rounded-lg text-accent flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>
                Policy ratified! Forwarded to BRICS Development Bank DPG queue.
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-text-dim hover:text-white hover:bg-surface-card font-medium text-xs transition-colors"
          >
            [ Close ]
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Exported PDF Briefing to Ministerial Dossier.")}
              className="px-3 py-2 rounded-lg border border-border bg-surface text-text-muted hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
              [ Export Brief ]
            </button>
            <button
              onClick={() => setIsApproved(true)}
              className="px-4 py-2 rounded-lg border border-accent bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-neon-sm text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5" />
              [ Ratify Policy Recommendation ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
