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
  Cpu,
  ChevronDown,
  X,
  Plus,
  BarChart3,
  Activity,
  Globe2,
  Flame,
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
  const [showTelemetryRadar, setShowTelemetryRadar] = useState(false);

  // Filter problems based on search query, category, and urgency
  const filteredProblems = problems.filter((p) => {
    const matchesCat =
      selectedCategory === "ALL" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesUrgency =
      urgencyFilter === "ALL" ||
      p.urgency.toLowerCase() === urgencyFilter.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
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
        pill: "bg-alert-critical/15 text-alert-critical border-alert-critical/30",
        bar: "bg-alert-critical",
        text: "text-alert-critical",
        dot: "bg-alert-critical",
      };
    }
    if (score >= 65 || level.toLowerCase() === "high") {
      return {
        label: "HIGH",
        pill: "bg-alert-warn/15 text-alert-warn border-alert-warn/30",
        bar: "bg-alert-warn",
        text: "text-alert-warn",
        dot: "bg-alert-warn",
      };
    }
    if (score >= 40 || level.toLowerCase() === "medium") {
      return {
        label: "MEDIUM",
        pill: "bg-accent/15 text-accent border-accent/30",
        bar: "bg-accent",
        text: "text-accent",
        dot: "bg-accent",
      };
    }
    return {
      label: "LOW",
      pill: "bg-surface-card text-text-muted border-border",
      bar: "bg-text-dim",
      text: "text-text-muted",
      dot: "bg-text-dim",
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
  const highCount = problems.filter((p) => {
    const s = p.urgencyScore || 0;
    return s >= 65 && s < 82;
  }).length;
  const mediumCount = problems.filter((p) => {
    const s = p.urgencyScore || 0;
    return s >= 40 && s < 65;
  }).length;
  const lowCount = problems.filter((p) => (p.urgencyScore || 0) < 40).length;

  const avgSeverity =
    totalCount > 0
      ? (problems.reduce((sum, p) => sum + (p.urgencyScore || 50), 0) / totalCount).toFixed(1)
      : "0.0";

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-transparent overflow-hidden space-y-3 font-sans relative z-10">
      {/* Live Omnichannel BRICS Incident Ticker */}
      <div className="bg-surface/85 backdrop-blur-md border border-border/80 px-3.5 py-1.5 rounded-xl flex items-center gap-3 overflow-hidden shrink-0 text-xs font-mono shadow-xs">
        <div className="flex items-center gap-1.5 text-accent font-bold shrink-0">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span className="tracking-wider">LIVE TELEMETRY:</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee text-text-muted space-x-6 text-[11px]">
            <span>🇮🇳 New Delhi: Water pressure drop resolved in Ward 42</span>
            <span className="text-accent">&bull;</span>
            <span>🇧🇷 São Paulo: Bus Line 875C corridor clearing</span>
            <span className="text-accent">&bull;</span>
            <span>🇿🇦 Cape Town: Sub-station emergency backup active</span>
            <span className="text-accent">&bull;</span>
            <span>🇷🇺 Yekaterinburg: District heating restoration underway</span>
            <span className="text-accent">&bull;</span>
            <span>🇨🇳 Beijing: Urban flood drainage pumps operational</span>
            <span className="text-accent">&bull;</span>
            <span>🇪🇬 Cairo: Nile Basin water purity telemetry verified</span>
          </div>
        </div>
        <span className="text-[10px] text-text-dim shrink-0 hidden sm:inline font-mono">100% DPG Standard</span>
      </div>

      {/* Top 4 Key Metrics Cards with Interactive Glow */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <div className="cyber-card p-3.5 rounded-xl flex items-center justify-between group cursor-default">
          <div>
            <div className="text-[11px] font-medium text-text-muted flex items-center gap-1.5">
              <span>Recorded Citizen Signals</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-white mt-0.5 tracking-tight font-mono">{totalCount}</div>
            <div className="text-[10px] text-text-dim mt-0.5">Stored in SQLite database</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface border border-border group-hover:border-accent/40 flex items-center justify-center text-accent transition-colors">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-card p-3.5 rounded-xl flex items-center justify-between group cursor-default">
          <div>
            <div className="text-[11px] font-medium text-text-muted flex items-center gap-1.5">
              <span>Critical Hotspots (≥82)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-alert-critical animate-ping" />
            </div>
            <div className="text-2xl font-bold text-alert-critical mt-0.5 tracking-tight font-mono">{criticalCount}</div>
            <div className="text-[10px] text-text-dim mt-0.5">High hazard & infrastructure failure</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-alert-critical/10 border border-alert-critical/30 group-hover:border-alert-critical flex items-center justify-center text-alert-critical transition-colors">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-card p-3.5 rounded-xl flex items-center justify-between group cursor-default">
          <div>
            <div className="text-[11px] font-medium text-text-muted">Average Severity Score</div>
            <div className="text-2xl font-bold text-accent mt-0.5 flex items-baseline gap-1 font-mono tracking-tight">
              <span>{avgSeverity}</span>
              <span className="text-xs font-normal text-text-dim">/ 100</span>
            </div>
            <div className="text-[10px] text-text-dim mt-0.5">Multi-factor ML index</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 group-hover:border-accent flex items-center justify-center text-accent transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-card p-3.5 rounded-xl flex items-center justify-between group cursor-default">
          <div>
            <div className="text-[11px] font-medium text-text-muted">Inference Pipeline</div>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Multi-Factor v2.1</span>
            </div>
            <div className="text-[10px] text-text-dim mt-0.5">DBSCAN + Transformer active</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface border border-border group-hover:border-accent/40 flex items-center justify-center text-accent transition-colors">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Telemetry & Radar Drawer Toggle */}
      {showTelemetryRadar && (
        <div className="p-4 bg-surface-card rounded-xl border border-accent/30 shadow-lg animate-fade-in-up shrink-0 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              <span className="font-bold text-white">Live BRICS Incident Telemetry &amp; Urgency Radar</span>
            </div>
            <button
              onClick={() => setShowTelemetryRadar(false)}
              className="text-text-dim hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Severity Spectrum Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-text-muted">
              <span>Severity Spectrum Distribution</span>
              <span className="font-mono text-accent">{totalCount} Total Signals</span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface overflow-hidden flex border border-border">
              {totalCount > 0 ? (
                <>
                  <button
                    onClick={() => setUrgencyFilter("CRITICAL")}
                    style={{ width: `${(criticalCount / totalCount) * 100}%` }}
                    className="h-full bg-alert-critical hover:opacity-80 transition-opacity"
                    title={`Critical: ${criticalCount}`}
                  />
                  <button
                    onClick={() => setUrgencyFilter("HIGH")}
                    style={{ width: `${(highCount / totalCount) * 100}%` }}
                    className="h-full bg-alert-warn hover:opacity-80 transition-opacity"
                    title={`High: ${highCount}`}
                  />
                  <button
                    onClick={() => setUrgencyFilter("MEDIUM")}
                    style={{ width: `${(mediumCount / totalCount) * 100}%` }}
                    className="h-full bg-accent hover:opacity-80 transition-opacity"
                    title={`Medium: ${mediumCount}`}
                  />
                  <button
                    onClick={() => setUrgencyFilter("ALL")}
                    style={{ width: `${(lowCount / totalCount) * 100}%` }}
                    className="h-full bg-text-dim hover:opacity-80 transition-opacity"
                    title={`Low: ${lowCount}`}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-surface" />
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-text-dim pt-1">
              <span className="flex items-center gap-1 text-alert-critical">
                <span className="w-2 h-2 rounded-full bg-alert-critical" /> Critical ({criticalCount})
              </span>
              <span className="flex items-center gap-1 text-alert-warn">
                <span className="w-2 h-2 rounded-full bg-alert-warn" /> High ({highCount})
              </span>
              <span className="flex items-center gap-1 text-accent">
                <span className="w-2 h-2 rounded-full bg-accent" /> Medium ({mediumCount})
              </span>
              <span className="flex items-center gap-1 text-text-muted">
                <span className="w-2 h-2 rounded-full bg-text-dim" /> Baseline ({lowCount})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter, Search & Telemetry Toggle Bar */}
      <div className="cyber-card rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-text-dim absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by keywords, city, language, or description..."
            className="w-full text-xs pl-8.5 pr-8 py-2 rounded-lg border border-border bg-surface text-text-main placeholder-text-dim focus:outline-none focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-text-dim hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Urgency Filter Tabs & Telemetry Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border text-xs">
            {[
              { id: "ALL", label: "All" },
              { id: "CRITICAL", label: "Critical", dot: "bg-alert-critical" },
              { id: "HIGH", label: "High", dot: "bg-alert-warn" },
              { id: "MEDIUM", label: "Medium", dot: "bg-accent" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setUrgencyFilter(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  urgencyFilter === tab.id
                    ? "bg-surface-card text-accent font-semibold border border-accent/30 shadow-xs"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Interactive Radar Toggle */}
          <button
            onClick={() => setShowTelemetryRadar(!showTelemetryRadar)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              showTelemetryRadar
                ? "bg-accent/15 text-accent border-accent/40"
                : "border-border bg-surface text-text-muted hover:text-white hover:border-accent/40"
            }`}
            title="Toggle Live Telemetry Radar"
          >
            <BarChart3 className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main Problems Container */}
      <div className="flex-1 bg-surface-card/90 backdrop-blur-md rounded-xl border border-border shadow-xs overflow-hidden flex flex-col min-h-0">
        <div className="px-4 py-2.5 bg-surface border-b border-border flex items-center justify-between text-xs font-semibold text-white shrink-0">
          <div className="flex items-center gap-2">
            <span>Verified Citizen Grievances</span>
            <span className="text-[11px] font-normal text-text-muted font-mono">
              ({filteredProblems.length} active)
            </span>
          </div>
          <span className="text-[11px] font-mono text-text-dim hidden md:inline">
            ML Severity Pipeline &bull; Automated Deduplication
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/50 p-2 space-y-2 scrollbar-thin scrollbar-thumb-border">
          {filteredProblems.length === 0 ? (
            /* Clean Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center my-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-surface border border-accent/30 flex items-center justify-center text-accent shadow-xs animate-glow-pulse">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">No Citizen Problems Found</h3>
                <p className="text-xs text-text-muted max-w-md mx-auto">
                  {searchQuery || urgencyFilter !== "ALL" || selectedCategory !== "ALL"
                    ? "No problems match your current filters. Try changing or clearing your search criteria."
                    : "The database is currently empty. Use the Report Problem button to record a new voice or text grievance."}
                </p>
              </div>
              {searchQuery || urgencyFilter !== "ALL" || selectedCategory !== "ALL" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setUrgencyFilter("ALL");
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-border text-xs text-text-muted hover:text-white hover:bg-surface transition-all"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={onOpenReportModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black font-semibold text-xs hover:bg-accent-bright transition-all shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit First Report</span>
                </button>
              )}
            </div>
          ) : (
            /* Real Problems List with Staggered Scroll Entrance Animations */
            filteredProblems.map((prob, idx) => {
              const score = prob.urgencyScore || 50;
              const badge = getUrgencyBadge(score, prob.urgency);
              const isExpanded = expandedMlId === prob.id;
              const mlBreakdown = (prob as any).mlBreakdown;
              const mlExplanation = (prob as any).mlExplanation;

              return (
                <div
                  key={prob.id}
                  style={{ animationDelay: `${Math.min(idx * 45, 300)}ms` }}
                  className="animate-fade-in-up p-4 bg-surface hover:bg-surface-card-hover rounded-xl border border-border/70 hover:border-accent/40 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs group"
                >
                  {/* Left: Problem Information */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Sector Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-card border border-border font-medium text-white text-[11px] group-hover:border-accent/30 transition-colors">
                        {getCategoryIcon(prob.category)}
                        <span>{prob.category}</span>
                      </div>

                      {/* Language Badge */}
                      {prob.languageName && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-card border border-border text-text-muted font-medium font-mono">
                          {prob.languageName}
                        </span>
                      )}

                      {/* Duplicate Merged Badge */}
                      {prob.duplicateCount && prob.duplicateCount > 1 ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-alert-warn/15 text-alert-warn border border-alert-warn/30 font-mono flex items-center gap-1">
                          <Flame className="w-3 h-3 text-alert-warn" />
                          +{prob.duplicateCount} merged reports
                        </span>
                      ) : null}

                      {/* Channel Badge */}
                      {prob.channel === "voice" && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20 flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          <span>Voice Input</span>
                        </span>
                      )}
                    </div>

                    {/* Problem Statement (Translated) */}
                    <div className="font-medium text-white text-sm leading-snug group-hover:text-accent/95 transition-colors">
                      {prob.translatedText}
                    </div>

                    {/* Original Vernacular Text */}
                    {prob.originalText && prob.originalText !== prob.translatedText && (
                      <div className="text-text-muted italic text-[11px] line-clamp-2 pl-2.5 border-l-2 border-accent/40 font-serif">
                        &ldquo;{prob.originalText}&rdquo;
                      </div>
                    )}

                    {/* ML Breakdown Dropdown Toggle */}
                    {mlExplanation && (
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => setExpandedMlId(isExpanded ? null : prob.id)}
                          className="text-[11px] text-accent hover:underline flex items-center gap-1 font-medium"
                        >
                          <Info className="w-3 h-3" />
                          <span>{isExpanded ? "Hide ML Scoring Breakdown" : "View ML Model Scoring Factors"}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>

                        {isExpanded && (
                          <div className="mt-2.5 p-3.5 rounded-xl bg-surface-card border border-accent/30 text-xs space-y-2.5 animate-fade-in-up">
                            <div className="text-white">
                              <span className="text-text-dim text-[10px] uppercase tracking-wider font-mono block">Inference Rationale</span>
                              <span className="text-text-muted text-xs leading-relaxed">{mlExplanation}</span>
                            </div>
                            {mlBreakdown && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                                <div className="bg-surface p-2.5 rounded-lg border border-border">
                                  <span className="text-text-dim block mb-0.5">HAZARD RISK</span>
                                  <span className="font-bold text-accent text-xs">{mlBreakdown.hazard_risk} / 35</span>
                                </div>
                                <div className="bg-surface p-2.5 rounded-lg border border-border">
                                  <span className="text-text-dim block mb-0.5">DURATION</span>
                                  <span className="font-bold text-accent text-xs">{mlBreakdown.duration_impact} / 25</span>
                                </div>
                                <div className="bg-surface p-2.5 rounded-lg border border-border">
                                  <span className="text-text-dim block mb-0.5">INFRA DEFICIT</span>
                                  <span className="font-bold text-accent text-xs">{mlBreakdown.infrastructure_weight} / 20</span>
                                </div>
                                <div className="bg-surface p-2.5 rounded-lg border border-border">
                                  <span className="text-text-dim block mb-0.5">DISRUPTION</span>
                                  <span className="font-bold text-accent text-xs">{mlBreakdown.disruption_intensity} / 20</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Center: Location & Timestamp */}
                  <div className="flex md:flex-col items-start gap-1 shrink-0 min-w-[140px] text-text-muted">
                    <div className="flex items-center gap-1.5 font-medium text-xs text-white">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{prob.region}</span>
                    </div>
                    {prob.country && (
                      <span className="text-[11px] text-text-dim font-mono pl-5 md:pl-5">
                        {prob.country}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] text-text-dim font-mono mt-0.5 pl-5 md:pl-5">
                      <Clock className="w-3 h-3" />
                      <span>{prob.timestamp ? prob.timestamp.slice(11, 16) || "Today" : "Today"}</span>
                    </div>
                  </div>

                  {/* Right: ML Severity Meter & Delete Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end min-w-[100px]">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className={`text-base font-bold ${badge.text}`}>
                          {score.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-text-dim">/ 100</span>
                      </div>

                      {/* Score Meter Bar */}
                      <div className="w-20 h-1.5 bg-surface-card rounded-full overflow-hidden mt-1 border border-border">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${badge.bar}`}
                          style={{ width: `${Math.min(100, Math.max(10, score))}%` }}
                        />
                      </div>

                      <span className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.pill}`}>
                        {badge.label}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteProblem(prob.id)}
                      className="p-1.5 text-text-dim hover:text-alert-critical hover:bg-alert-critical/10 rounded-lg transition-colors border border-transparent hover:border-alert-critical/30"
                      title="Delete problem record"
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
