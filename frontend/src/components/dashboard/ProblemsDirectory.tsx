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
  Filter,
  Layers,
  ArrowUpRight,
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
        label: "CRITICAL",
        bg: "bg-rose-100 text-rose-800 border-rose-300",
        bar: "bg-rose-600",
        text: "text-rose-600",
      };
    }
    if (score >= 65 || level.toLowerCase() === "high") {
      return {
        label: "HIGH",
        bg: "bg-amber-100 text-amber-800 border-amber-300",
        bar: "bg-amber-500",
        text: "text-amber-600",
      };
    }
    if (score >= 40 || level.toLowerCase() === "medium") {
      return {
        label: "MEDIUM",
        bg: "bg-teal-100 text-teal-800 border-teal-300",
        bar: "bg-teal-500",
        text: "text-teal-600",
      };
    }
    return {
      label: "LOW",
      bg: "bg-slate-100 text-slate-700 border-slate-300",
      bar: "bg-slate-400",
      text: "text-slate-500",
    };
  };

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes("water")) return <Droplets className="w-3.5 h-3.5 text-cyan-600" />;
    if (lower.includes("health")) return <HeartPulse className="w-3.5 h-3.5 text-rose-600" />;
    if (lower.includes("power") || lower.includes("grid")) return <Zap className="w-3.5 h-3.5 text-amber-600" />;
    if (lower.includes("road") || lower.includes("transport")) return <Car className="w-3.5 h-3.5 text-indigo-600" />;
    return <Layers className="w-3.5 h-3.5 text-slate-500" />;
  };

  // KPI Calculations
  const totalCount = problems.length;
  const criticalCount = problems.filter((p) => (p.urgencyScore || 0) >= 82 || p.urgency === "critical").length;
  const avgSeverity =
    totalCount > 0
      ? (problems.reduce((sum, p) => sum + (p.urgencyScore || 50), 0) / totalCount).toFixed(1)
      : "0.0";

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-background overflow-hidden space-y-3">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <div className="bg-card p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-text-muted">Total Real Problems</div>
            <div className="text-xl font-bold text-primary">{totalCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-primary font-bold">
            #
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-text-muted">Critical Severity (&ge;82)</div>
            <div className="text-xl font-bold text-rose-600">{criticalCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-text-muted">Avg ML Severity Score</div>
            <div className="text-xl font-bold text-accent">{avgSeverity} <span className="text-xs font-normal text-slate-400">/100</span></div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-text-muted">ML Model Status</div>
            <div className="text-xs font-bold text-emerald-600 mt-1">Multi-Factor v2.1 Active</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-mono text-xs">
            ML
          </div>
        </div>
      </div>

      {/* Filter and Search Action Bar */}
      <div className="bg-card rounded-xl border border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by keywords, location, or vernacular text..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Urgency Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setUrgencyFilter(lvl)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  urgencyFilter === lvl
                    ? "bg-white text-primary font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-white font-semibold text-xs hover:bg-teal-700 shadow-sm transition-all active:scale-95"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>+ Add Problem</span>
          </button>
        </div>
      </div>

      {/* Main Problems Container */}
      <div className="flex-1 bg-card rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-0">
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold text-primary shrink-0">
          <div className="flex items-center gap-2">
            <span>Verified Citizen Problems Directory</span>
            <span className="text-[11px] font-normal text-text-muted">
              ({filteredProblems.length} {filteredProblems.length === 1 ? "issue" : "issues"})
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            ML Multi-Factor Severity Pipeline
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredProblems.length === 0 ? (
            /* Clean Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center my-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-accent shadow-xs">
                <Mic className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-primary">No Citizen Problems in Database</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  There are no fake or mock problems. Click the button below to dictate using speech or type an issue to see the ML model calculate its severity score.
                </p>
              </div>
              <button
                onClick={onOpenReportModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md hover:bg-teal-700 transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>+ Add First Problem (Voice / Speech / Text)</span>
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
                  className="p-3.5 hover:bg-slate-50/80 rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  {/* Left: Problem & Vernacular Quote */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-semibold text-slate-800 text-[11px]">
                        {getCategoryIcon(prob.category)}
                        <span>{prob.category}</span>
                      </div>

                      {prob.languageName && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {prob.languageName}
                        </span>
                      )}

                      {prob.duplicateCount && prob.duplicateCount > 1 ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          +{prob.duplicateCount} merged reports
                        </span>
                      ) : null}

                      {prob.channel === "voice" && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-teal-50 text-accent border border-teal-200 flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          <span>Voice Input</span>
                        </span>
                      )}
                    </div>

                    <div className="font-semibold text-text-main text-sm leading-snug">
                      {prob.translatedText}
                    </div>

                    {prob.originalText && prob.originalText !== prob.translatedText && (
                      <div className="text-text-muted italic text-[11px] line-clamp-1 opacity-80">
                        &ldquo;{prob.originalText}&rdquo;
                      </div>
                    )}

                    {/* ML Breakdown Dropdown toggle */}
                    {mlExplanation && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedMlId(isExpanded ? null : prob.id)}
                          className="text-[11px] text-accent hover:underline flex items-center gap-1 font-medium"
                        >
                          <Info className="w-3 h-3" />
                          <span>{isExpanded ? "Hide ML Score Breakdown" : "View ML Model Scoring Factors"}</span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-2.5 rounded-lg bg-teal-50/60 border border-teal-200/80 text-[11px] space-y-1.5 font-mono">
                            <div className="font-bold text-slate-800 font-sans">
                              ML Explanation: <span className="font-normal text-slate-600">{mlExplanation}</span>
                            </div>
                            {mlBreakdown && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-sans">
                                <div className="bg-white p-1.5 rounded border border-teal-200">
                                  <span className="text-slate-400 block text-[9px]">HAZARD RISK:</span>
                                  <span className="font-bold text-slate-700">{mlBreakdown.hazard_risk}/35</span>
                                </div>
                                <div className="bg-white p-1.5 rounded border border-teal-200">
                                  <span className="text-slate-400 block text-[9px]">DURATION:</span>
                                  <span className="font-bold text-slate-700">{mlBreakdown.duration_impact}/25</span>
                                </div>
                                <div className="bg-white p-1.5 rounded border border-teal-200">
                                  <span className="text-slate-400 block text-[9px]">INFRA DEFICIT:</span>
                                  <span className="font-bold text-slate-700">{mlBreakdown.infrastructure_weight}/20</span>
                                </div>
                                <div className="bg-white p-1.5 rounded border border-teal-200">
                                  <span className="text-slate-400 block text-[9px]">DISRUPTION:</span>
                                  <span className="font-bold text-slate-700">{mlBreakdown.disruption_intensity}/20</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Center: Location */}
                  <div className="flex md:flex-col items-start gap-1 shrink-0 min-w-[140px] text-slate-600">
                    <div className="flex items-center gap-1 font-medium text-xs">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{prob.region}</span>
                    </div>
                    {prob.country && (
                      <span className="text-[11px] text-text-muted font-mono">
                        {prob.country}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{prob.timestamp ? prob.timestamp.slice(11, 16) || "Today" : "Today"}</span>
                    </div>
                  </div>

                  {/* Right: ML Severity Score (out of 100) & Delete Button */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col items-end min-w-[110px]">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-base font-extrabold ${badge.text}`}>
                          {score.toFixed(1)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                      </div>

                      {/* Score Meter Bar */}
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${badge.bar}`}
                          style={{ width: `${Math.min(100, Math.max(10, score))}%` }}
                        />
                      </div>

                      <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteProblem(prob.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
