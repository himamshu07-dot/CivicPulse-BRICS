"use client";

import React, { useState } from "react";
import {
  MOCK_AI_PROJECTS,
  AIProjectRecommendation,
} from "@/data/mockProjects";
import { ProjectReviewModal } from "./ProjectReviewModal";
import {
  Sparkles,
  ChevronRight,
  ShieldCheck,
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
  const [minScore, setMinScore] = useState<number>(50);
  const activeProjects = externalProjects !== undefined ? externalProjects : [];

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
        <span className="px-2.5 py-1 rounded-lg bg-alert-critical/15 text-alert-critical border border-alert-critical/40 font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-alert-critical animate-ping" />
          [Score: {score}]
        </span>
      );
    }
    if (score >= 80) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-alert-warn/15 text-alert-warn border border-alert-warn/40 font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-alert-warn" />
          [Score: {score}]
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent border border-accent/40 font-mono font-bold text-xs flex items-center gap-1.5">
        [Score: {score}]
      </span>
    );
  };

  return (
    <>
      <aside className="w-full h-full bg-surface-card border-l border-border flex flex-col justify-between overflow-hidden shadow-sm font-mono">
        {/* Panel Header */}
        <div className="p-4 border-b border-border bg-surface shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-surface border border-accent/40 text-accent flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-wider">
                // AI Priority Projects //
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/10 text-accent font-bold border border-accent/30">
              [{filteredProjects.length} Active Directives]
            </span>
          </div>
          <p className="text-[11px] text-text-muted font-sans">
            Ranked prescriptive infrastructure interventions driven by multilateral citizen signals.
          </p>
        </div>

        {/* Priority Project Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-xs">
              // No AI recommendations match current threshold. //
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-lg border border-border bg-surface hover:border-accent/50 hover:bg-surface-card-hover transition-all duration-200 flex flex-col justify-between gap-3 group"
              >
                {/* Top Card Bar: Title & Priority Index Score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider block">
                      {project.region} • {project.country}
                    </span>
                    <h3 className="font-bold text-xs text-white font-sans leading-tight group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  {/* Priority Index Score */}
                  <div className="shrink-0">
                    {getPriorityScoreBadge(project.priorityScore)}
                  </div>
                </div>

                {/* AI Justification Paragraph */}
                <p className="text-text-muted text-[11px] leading-relaxed line-clamp-3 font-sans bg-surface-card p-2.5 rounded-lg border border-border/70">
                  {project.aiJustification}
                </p>

                {/* Card Footer: Metadata & Ghost Action Button */}
                <div className="flex items-center justify-between pt-1 border-t border-dashed border-border/80 text-[10px]">
                  <div className="flex flex-col text-text-dim font-mono">
                    <span>{project.beneficiaries}</span>
                    <span className="text-accent font-bold">{project.estimatedCost}</span>
                  </div>

                  {/* Ghost Action Button */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-3 py-1.5 rounded-lg border border-accent/60 bg-accent/5 text-accent hover:bg-accent/15 hover:shadow-neon-sm font-bold text-xs transition-all flex items-center gap-1 active:scale-95"
                  >
                    <span>[ Review Policy ]</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Footer Summary */}
        <div className="p-3 border-t border-border bg-surface text-[11px] text-text-muted flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-accent font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPG Policy Alignment: 100%</span>
          </div>
          <span className="font-mono text-text-dim">BRICS Consensus v2.4</span>
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
