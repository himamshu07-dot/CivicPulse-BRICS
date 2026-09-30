"use client";

import React, { useState } from "react";
import {
  Mic,
  MapPin,
  AlertTriangle,
  Clock,
  Trash2,
  Sparkles,
  Info,
  Droplets,
  HeartPulse,
  Zap,
  Car,
  Search,
  Layers,
} from "lucide-react";
import { CitizenRequest } from "@/data/mockRequests";

interface ProblemsDirectoryProps {
  problems: CitizenRequest[];
  onOpenReportModal: () => void;
  onDeleteProblem: (id: string) => void;
  selectedCategory: string;
}

export const ProblemsDirectory: React.FC<ProblemsDirectoryProps> = ({
  problems,
  onOpenReportModal,
  onDeleteProblem,
  selectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");
  const [expandedMlId, setExpandedMlId] = useState<string | null>(null);

  // Filter problems based on search query, category, and urgency
  const filteredProblems = problems.filter((p) => {
    const matchesCat =
      selectedCategory === "ALL" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesUrgency =
      urgencyFilter === "ALL" ||
      p.urgency.toLowerCase() === urgencyFilter.toLowerCase();

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      p.translatedText.toLowerCase().includes(q) ||
      p.originalText.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q) ||
      (p.country && p.country.toLowerCase().includes(q));

    return matchesCat && matchesUrgency && matchesSearch;
  });

  const getUrgencyBadge = (score: number, level: string) => {
    if (score >= 82 || level.toLowerCase() === "critical") {
      return {
        label: "[CRITICAL]",
        bg: "bg-alert-critical/15 text-alert-critical border-alert-critical/40",
        bar: "bg-alert-critical shadow-sm",
        text: "text-alert-critical",
      };
    }
    if (score >= 65 || level.toLowerCase() === "high") {
      return {
        label: "[HIGH]",
        bg: "bg-alert-warn/15 text-alert-warn border-alert-warn/40",
        bar: "bg-alert-warn",
        text: "text-alert-warn",
      };
    }
    if (score >= 40 || level.toLowerCase() === "medium") {
      return {
        label: "[MEDIUM]",
        bg: "bg-accent/15 text-accent border-accent/40",
        bar: "bg-accent",
        text: "text-accent",
      };
    }
    return {
      label: "[LOW]",
      bg: "bg-surface text-text-muted border-border",
      bar: "bg-text-dim",
      text: "text-text-muted",
    };
  };

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes("water")) return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
    if (lower.includes("health")) return <HeartPulse className="w-3.5 h-3.5 text-rose-400" />;
    if (lower.includes("power") || lower.includes("grid")) return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    if (lower.includes("road") || lower.includes("transport")) return <Car className="w-3.5 h-3.5 text-indigo-400" />;
    return <Layers className="w-3.5 h-3.5 text-accent" />;
  };

  // KPI Calculations
  const totalCount = problems.length;
  const criticalCount = problems.filter((p) => (p.urgencyScore || 0) >= 82 || p.urgency === "critical").length;
  const avgSeverity =
    totalCount > 0
      ? (problems.reduce((sum, p) => sum + (p.urgencyScore || 50), 0) / totalCount).toFixed(1)
      : "0.0";

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-background overflow-hidden space-y-3 font-mono">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <div className="bg-surface-card p-3 rounded-lg border border-border flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-text-muted">// TOTAL REAL PROBLEMS //</div>
            <div className="text-xl font-bold text-white mt-0.5">{totalCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent font-bold">
            #
          </div>
        </div>

        <div className="bg-surface-card p-3 rounded-lg border border-border flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-text-muted">// CRITICAL SEVERITY (≥82) //</div>
            <div className="text-xl font-bold text-alert-critical mt-0.5">{criticalCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-alert-critical/10 border border-alert-critical/30 flex items-center justify-center text-alert-critical">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-surface-card p-3 rounded-lg border border-border flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-text-muted">// AVG ML SEVERITY SCORE //</div>
            <div className="text-xl font-bold text-accent mt-0.5">
              {avgSeverity} <span className="text-xs font-normal text-text-dim">/100</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-surface-card p-3 rounded-lg border border-border flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-text-muted">// ML MODEL STATUS //</div>
            <div className="text-xs font-bold text-accent mt-1">[Multi-Factor v2.1 Active]</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-mono text-xs font-bold">
            ML
          </div>
        </div>
      </div>

      {/* Filter and Search Action Bar */}
      <div className="bg-surface-card rounded-lg border border-border p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-text-dim absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by keywords, location, or vernacular text..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border bg-surface text-text-main placeholder-text-dim focus:outline-none focus:border-accent"
            />
          </div>

          {/* Urgency Filter Tabs */}
          <div className="flex items-center gap-1 bg-surface p-0.5 rounded-lg border border-border text-[11px]">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setUrgencyFilter(lvl)}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  urgencyFilter === lvl
                    ? "bg-accent/20 text-accent border border-accent/40 shadow-neon-sm"
                    : "text-text-muted hover:text-white"
                }`}
              >
                [{lvl}]
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-accent bg-accent/5 text-accent font-bold text-xs hover:bg-accent/15 hover:shadow-neon-sm transition-all active:scale-95"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>[ + Add Problem ]</span>
          </button>
        </div>
      </div>

      {/* Main Problems Container */}
      <div className="flex-1 bg-surface-card rounded-lg border border-border shadow-xs overflow-hidden flex flex-col min-h-0">
        <div className="px-4 py-2.5 bg-surface border-b border-border flex items-center justify-between text-xs font-bold text-white shrink-0">
          <div className="flex items-center gap-2">
            <span>// Verified Citizen Problems Directory //</span>
            <span className="text-[11px] font-normal text-text-muted">
              ({filteredProblems.length} {filteredProblems.length === 1 ? "issue" : "issues"})
            </span>
          </div>
          <span className="text-[11px] font-mono text-text-dim">
            [ML_MULTI_FACTOR_SEVERITY_PIPELINE]
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-dashed divide-border/60 p-2 scrollbar-thin scrollbar-thumb-border">
          {filteredProblems.length === 0 ? (
            /* Clean Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center my-auto space-y-4">
              <div className="w-16 h-16 rounded-lg bg-surface border border-accent/40 flex items-center justify-center text-accent shadow-neon-sm">
                <Mic className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white uppercase">// No Citizen Problems in Database //</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto font-sans">
                  There are no fake or mock problems. Click the button below to dictate using speech or type an issue to see the ML model calculate its severity score.
                </p>
              </div>
              <button
                onClick={onOpenReportModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-accent bg-accent/10 text-accent font-bold text-xs shadow-neon-sm hover:bg-accent/20 transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>[ + Add First Problem (Voice / Speech / Text) ]</span>
              </button>
            </div>
          ) : (
            /* Real Problems List */
            filteredProblems.map((prob) => {
              const score = prob.urgencyScore || 50;
              const badge = getUrgencyBadge(score, prob.urgency);
              const isExpanded = expandedMlId === prob.id;
              const mlBreakdown = (prob as any).mlBreakdown;
              const mlExplanation = (prob as any).mlExplanation;

              return (
                <div
                  key={prob.id}
                  className="p-3.5 hover:bg-surface-card-hover/80 rounded-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  {/* Left: Problem & Vernacular Quote */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface border border-border font-bold text-white text-[11px]">
                        {getCategoryIcon(prob.category)}
                        <span>{prob.category}</span>
                      </div>

                      {prob.languageName && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-text-muted font-medium">
                          {prob.languageName}
                        </span>
                      )}

                      {prob.duplicateCount && prob.duplicateCount > 1 ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-alert-warn/15 text-alert-warn border border-alert-warn/40">
                          +{prob.duplicateCount} merged reports
                        </span>
                      ) : null}

                      {prob.channel === "voice" && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/30 flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          <span>[Voice Input]</span>
                        </span>
                      )}
                    </div>

                    <div className="font-semibold text-white text-sm leading-snug font-sans">
                      {prob.translatedText}
                    </div>

                    {prob.originalText && prob.originalText !== prob.translatedText && (
                      <div className="text-text-muted italic text-[11px] line-clamp-1 opacity-80 font-serif">
                        &ldquo;{prob.originalText}&rdquo;
                      </div>
                    )}

                    {/* ML Breakdown Dropdown toggle */}
                    {mlExplanation && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedMlId(isExpanded ? null : prob.id)}
                          className="text-[11px] text-accent hover:underline flex items-center gap-1 font-bold"
                        >
                          <Info className="w-3 h-3" />
                          <span>{isExpanded ? "[ Hide ML Score Breakdown ]" : "[ View ML Model Scoring Factors ]"}</span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-2.5 rounded-lg bg-surface border border-border text-[11px] space-y-1.5 font-mono">
                            <div className="font-bold text-white font-sans">
                              ML Explanation: <span className="font-normal text-text-muted">{mlExplanation}</span>
                            </div>
                            {mlBreakdown && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                                <div className="bg-surface-card p-2 rounded border border-border">
                                  <span className="text-text-dim block text-[9px]">// HAZARD RISK //</span>
                                  <span className="font-bold text-accent">{mlBreakdown.hazard_risk}/35</span>
                                </div>
                                <div className="bg-surface-card p-2 rounded border border-border">
                                  <span className="text-text-dim block text-[9px]">// DURATION //</span>
                                  <span className="font-bold text-accent">{mlBreakdown.duration_impact}/25</span>
                                </div>
                                <div className="bg-surface-card p-2 rounded border border-border">
                                  <span className="text-text-dim block text-[9px]">// INFRA DEFICIT //</span>
                                  <span className="font-bold text-accent">{mlBreakdown.infrastructure_weight}/20</span>
                                </div>
                                <div className="bg-surface-card p-2 rounded border border-border">
                                  <span className="text-text-dim block text-[9px]">// DISRUPTION //</span>
                                  <span className="font-bold text-accent">{mlBreakdown.disruption_intensity}/20</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Center: Location */}
                  <div className="flex md:flex-col items-start gap-1 shrink-0 min-w-[140px] text-text-muted">
                    <div className="flex items-center gap-1 font-medium text-xs text-white">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{prob.region}</span>
                    </div>
                    {prob.country && (
                      <span className="text-[11px] text-text-dim font-mono">
                        {prob.country}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-text-dim font-mono mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{prob.timestamp ? prob.timestamp.slice(11, 16) || "Today" : "Today"}</span>
                    </div>
                  </div>

                  {/* Right: ML Severity Score & Delete Button */}
                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <div className="flex flex-col items-end min-w-[110px]">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-base font-extrabold ${badge.text}`}>
                          {score.toFixed(1)}
                        </span>
                        <span className="text-[10px] font-bold text-text-dim">/ 100</span>
                      </div>

                      {/* Score Meter Bar */}
                      <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden mt-1 border border-border">
                        <div
                          className={`h-full rounded-full ${badge.bar}`}
                          style={{ width: `${Math.min(100, Math.max(10, score))}%` }}
                        />
                      </div>

                      <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteProblem(prob.id)}
                      className="p-1.5 text-text-dim hover:text-alert-critical hover:bg-alert-critical/10 rounded-lg transition-colors border border-transparent hover:border-alert-critical/30"
                      title="Delete problem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
