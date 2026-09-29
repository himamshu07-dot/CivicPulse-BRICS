"use client";

import React, { useState } from "react";
import {
  MOCK_AI_PROJECTS,
  AIProjectRecommendation,
} from "@/data/mockProjects";
import { ProjectReviewModal } from "./ProjectReviewModal";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AIPriorityProjectsProps {
  selectedRegion?: string;
  externalProjects?: AIProjectRecommendation[];
}

export const AIPriorityProjects: React.FC<AIPriorityProjectsProps> = ({
  selectedRegion = "ALL",
  externalProjects,
}) => {
  const [selectedProject, setSelectedProject] =
    useState<AIProjectRecommendation | null>(null);
  const [minScore, setMinScore] = useState<number>(75);
  const [internalProjects, setInternalProjects] = useState<AIProjectRecommendation[]>(MOCK_AI_PROJECTS);

  const activeProjects = externalProjects && externalProjects.length > 0 ? externalProjects : internalProjects;

  React.useEffect(() => {
    if (externalProjects && externalProjects.length > 0) return;
    async function loadLiveProjects() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/hotspots");
        if (res.ok) {
          const json = await res.json();
          if (json.ai_projects && json.ai_projects.length > 0) {
            setInternalProjects(json.ai_projects);
          }
        }
      } catch {
        // Fallback
      }
    }
    loadLiveProjects();
  }, [externalProjects]);

  const filteredProjects = activeProjects.filter((proj) => {
    const matchRegion =
      selectedRegion === "ALL" ||
      (selectedRegion === "BR" && proj.country === "Brazil") ||
      (selectedRegion === "RU" && proj.country === "Russia") ||
      (selectedRegion === "IN" && proj.country === "India") ||
      (selectedRegion === "CN" && proj.country === "China") ||
      (selectedRegion === "ZA" && proj.country === "South Africa") ||
      (selectedRegion === "EG" && proj.country === "Egypt") ||
      (selectedRegion === "ET" && proj.country === "Ethiopia");
    const matchScore = proj.priorityScore >= minScore;
    return matchRegion && matchScore;
  });

  const getPriorityScoreBadge = (score: number) => {
    if (score >= 90) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-alert-critical border border-rose-200 font-extrabold text-xs flex items-center gap-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-alert-critical animate-ping" />
          Score: {score}
        </span>
      );
    }
    if (score >= 80) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-extrabold text-xs flex items-center gap-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-alert-warn" />
          Score: {score}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-accent border border-teal-200 font-bold text-xs flex items-center gap-1">
        Score: {score}
      </span>
    );
  };

  return (
    <>
      <aside className="w-full h-full bg-card border-l border-slate-200 flex flex-col justify-between overflow-hidden shadow-sm">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-teal-100 text-accent flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-primary tracking-tight">
                AI Priority Projects
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-accent font-semibold border border-teal-200">
              {filteredProjects.length} Active Directives
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            Ranked prescriptive infrastructure interventions driven by multilateral citizen signals.
          </p>
        </div>

        {/* Priority Project Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-xs">
              No AI recommendations match current threshold.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 group"
              >
                {/* Top Card Bar: Title & Priority Index Score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
                      {project.region} • {project.country}
                    </span>
                    <h3 className="font-bold text-xs text-primary leading-tight group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  {/* Priority Index Score */}
                  <div className="shrink-0">
                    {getPriorityScoreBadge(project.priorityScore)}
                  </div>
                </div>

                {/* AI Justification Paragraph (Mock Text) */}
                <p className="text-text-muted text-[11px] leading-relaxed line-clamp-3 font-serif bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {project.aiJustification}
                </p>

                {/* Card Footer: Metadata & Action Button (#0F766E) */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <div className="flex flex-col text-slate-500 font-mono">
                    <span>{project.beneficiaries}</span>
                    <span className="text-text-main font-semibold">{project.estimatedCost}</span>
                  </div>

                  {/* Action Button styled with accent (#0F766E) */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-teal-800 font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                  >
                    <span>Review Policy</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Footer Summary */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80 text-[11px] text-text-muted flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-accent font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPG Policy Alignment: 100%</span>
          </div>
          <span className="font-mono text-slate-400">BRICS Consensus v2.4</span>
        </div>
      </aside>

      {/* Policy Review Modal */}
      <ProjectReviewModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};
