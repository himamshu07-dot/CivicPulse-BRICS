"use client";

import React, { useState } from "react";
import { AIProjectRecommendation } from "@/data/mockProjects";
import {
  X,
  Sparkles,
  ShieldAlert,
  Coins,
  Users,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
  Send,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold border border-accent/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent" />
                AI Policy Synthesis Brief
              </span>
              <span className="text-xs text-text-muted">ID: {project.id}</span>
            </div>
            <h2 className="text-lg font-bold text-primary tracking-tight">
              {project.title}
            </h2>
            <p className="text-xs text-text-muted">
              Territory: <strong className="text-text-main">{project.region} ({project.country})</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-text-main scrollbar-thin scrollbar-thumb-slate-200">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-text-muted block mb-1">
                Priority Index
              </span>
              <span
                className={`text-xl font-extrabold ${
                  project.priorityScore >= 90
                    ? "text-alert-critical"
                    : "text-alert-warn"
                }`}
              >
                {project.priorityScore}/100
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1 mb-1">
                <Coins className="w-3 h-3 text-accent" /> Est. Facility
              </span>
              <span className="text-sm font-bold text-primary">
                {project.estimatedCost}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1 mb-1">
                <Users className="w-3 h-3 text-accent" /> Beneficiaries
              </span>
              <span className="text-sm font-bold text-primary">
                {project.beneficiaries}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-accent" /> Execution
              </span>
              <span className="text-sm font-bold text-primary">
                {project.timeframe}
              </span>
            </div>
          </div>

          {/* AI Evidence Justification */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              AI Recommendation Justification
            </h4>
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-slate-800 leading-relaxed font-serif text-[13px]">
              {project.aiJustification}
            </div>
          </div>

          {/* Signal Corroboration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-text-muted">
                Key Trigger Signals
              </h4>
              <ul className="space-y-1.5">
                {project.keySignals.map((signal, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-alert-critical shrink-0 mt-1" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-text-muted">
                Multilateral Co-Benefits
              </h4>
              <ul className="space-y-1.5">
                {project.coBenefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-700"
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
            <label className="font-bold text-[11px] uppercase tracking-wider text-text-muted">
              Policy Reviewer Notes & Directives
            </label>
            <textarea
              rows={2}
              placeholder="Add ministerial comments, co-funding approvals, or bilateral directives..."
              value={allocationNote}
              onChange={(e) => setAllocationNote(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {isApproved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Policy ratified! Forwarded to BRICS Development Bank DPG queue.
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-text-muted hover:bg-slate-200/70 font-medium text-xs transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Exported PDF Briefing to Ministerial Dossier.")}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              Export Brief
            </button>
            <button
              onClick={() => setIsApproved(true)}
              className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-teal-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Ratify Policy Recommendation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
