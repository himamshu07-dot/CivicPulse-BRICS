"use client";

import React from "react";
import {
  X,
  Cpu,
  ShieldCheck,
  Languages,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  Radio,
  FileCheck,
  CheckCircle2,
  Workflow,
} from "lucide-react";

interface AIArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIArchitectureModal: React.FC<AIArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const pipelineSteps = [
    {
      step: "01",
      title: "Omnichannel Ingestion",
      tech: "Web Speech API & REST Gateway",
      desc: "Captures raw vernacular citizen voice audio and multilingual text across WhatsApp, Telegram, Web portal.",
      icon: Radio,
      accent: "text-cyan-400",
      border: "border-cyan-400/30",
      bg: "bg-cyan-400/10",
    },
    {
      step: "02",
      title: "Zero-Knowledge PII Masking",
      tech: "RegEx + Entity Scrubbing",
      desc: "Sanitizes phone numbers, citizen identities, and IP metadata before analytical ingestion to guarantee DPG privacy.",
      icon: ShieldCheck,
      accent: "text-emerald-400",
      border: "border-emerald-400/30",
      bg: "bg-emerald-400/10",
    },
    {
      step: "03",
      title: "Multilingual Transformer Baseline",
      tech: "Indic & BRICS NLU Pipeline",
      desc: "Translates Hindi, Portuguese, Russian, Mandarin, and Arabic into a unified semantic English baseline in real time.",
      icon: Languages,
      accent: "text-indigo-400",
      border: "border-indigo-400/30",
      bg: "bg-indigo-400/10",
    },
    {
      step: "04",
      title: "4-Factor ML Severity Scorer",
      tech: "Weighted Linear Regression (0-100)",
      desc: "Auditable mathematical scoring: Hazard Risk (35%), Outage Duration (25%), Sector Deficit (20%), Distress Intensity (20%).",
      icon: Cpu,
      accent: "text-accent",
      border: "border-accent/40",
      bg: "bg-accent/10",
    },
    {
      step: "05",
      title: "Semantic Deduplication & Cosine Match",
      tech: "TF-IDF + 10km Haversine Radius",
      desc: "Automatically merges identical citizen complaints into existing problem tickets with '+N merged' clustering.",
      icon: Layers,
      accent: "text-amber-400",
      border: "border-amber-400/30",
      bg: "bg-amber-400/10",
    },
    {
      step: "06",
      title: "Prescriptive LLM Directives",
      tech: "Cluster Synthesis + Fiscal Allocator",
      desc: "Synthesizes actionable infrastructure interventions, budget requirements, and multilateral DPG policy briefs.",
      icon: Sparkles,
      accent: "text-rose-400",
      border: "border-rose-400/30",
      bg: "bg-rose-400/10",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-surface-card rounded-2xl shadow-2xl border border-border max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-border bg-surface flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-mono font-bold border border-accent/30 flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-accent" />
                Autonomous Engine Blueprint
              </span>
              <span className="text-xs text-text-dim font-mono">CivicPulse Core v2.1</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              End-to-End AI &amp; Machine Learning Architecture
            </h2>
            <p className="text-xs text-text-muted">
              Auditable 6-stage analytical pipeline processing citizen complaints into prioritized public good infrastructure interventions.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-surface-card transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Visual Flow */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${step.border} bg-surface hover:bg-surface-card-hover transition-all flex flex-col justify-between space-y-3 group`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-text-dim">
                        STAGE {step.step}
                      </span>
                      <div className={`w-8 h-8 rounded-lg ${step.bg} border ${step.border} flex items-center justify-center ${step.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-accent transition-colors">
                      {step.title}
                    </h3>

                    <div className="inline-block px-2 py-0.5 rounded bg-surface-card border border-border text-[10px] font-mono text-text-dim">
                      {step.tech}
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/80 flex items-center gap-1.5 text-[11px] text-accent font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>Active in Runtime</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mathematical ML Scoring Formula Box */}
          <div className="p-4 rounded-xl bg-surface border border-accent/30 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs text-white">
              <span className="font-bold text-accent flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-accent" />
                ML Severity Scoring Mathematical Formulation:
              </span>
              <span className="text-text-dim text-[11px]">Formula Matrix</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-card border border-border text-xs text-text-main overflow-x-auto leading-relaxed">
              <span className="text-accent font-bold">SeverityScore</span> = (0.35 &times; HazardRisk) + (0.25 &times; OutageDuration) + (0.20 &times; SectorWeight) + (0.20 &times; DisruptionIntensity)
            </div>
            <p className="text-[11px] text-text-muted font-sans">
              Every score out of 100 is deterministic, auditable by civil audits, and fully transparent to municipal ministers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-text-muted">Digital Public Good (DPG) Open Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-card border border-border text-white hover:border-accent font-semibold transition-all"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
