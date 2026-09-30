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
  Building,
  Users,
  Coins,
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
        <span className="px-2.5 py-1 rounded-full bg-alert-critical/15 text-alert-critical border border-alert-critical/30 font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-alert-critical animate-pulse" />
          Score: {score}
        </span>
      );
    }
    if (score >= 80) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-alert-warn/15 text-alert-warn border border-alert-warn/30 font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-alert-warn" />
          Score: {score}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono font-bold text-xs flex items-center gap-1.5">
        Score: {score}
      </span>
    );
  };

  return (
    <>
      <div className="w-full h-full bg-surface-card flex flex-col justify-between overflow-hidden font-sans">
        {/* Panel Header */}
        <div className="p-4 md:p-5 border-b border-border bg-surface shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-surface-card border border-accent/40 text-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                AI Priority Infrastructure Directives
              </h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold font-mono border border-accent/30">
              {filteredProjects.length} Directives Synthesized
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Prescriptive civic infrastructure interventions automatically prioritized from multi-channel citizen complaints.
          </p>
        </div>

        {/* Priority Project Cards List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3.5 scrollbar-thin scrollbar-thumb-border">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-text-muted text-xs">
              No AI recommendations synthesized yet for this region or threshold.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-border/80 bg-surface hover:border-accent/40 transition-all flex flex-col justify-between gap-3 group"
              >
                {/* Top Card Bar: Title & Priority Index Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider block">
                      {project.region} &bull; {project.country}
                    </span>
                    <h3 className="font-bold text-sm text-white group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  {/* Priority Index Score */}
                  <div className="shrink-0">
                    {getPriorityScoreBadge(project.priorityScore)}
                  </div>
                </div>

                {/* AI Justification Paragraph */}
                <p className="text-text-muted text-xs leading-relaxed bg-surface-card p-3 rounded-lg border border-border/60">
                  {project.aiJustification}
                </p>

                {/* Card Footer: Metadata & Action Button */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <div className="flex items-center gap-4 text-text-muted font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-text-dim" />
                      {project.beneficiaries}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-accent">
                      <Coins className="w-3.5 h-3.5" />
                      {project.estimatedCost}
                    </span>
                  </div>

                  {/* Review Button */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-surface-card text-white hover:text-accent hover:border-accent/50 font-medium text-xs transition-all flex items-center gap-1.5 active:scale-95"
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
        <div className="p-3.5 border-t border-border bg-surface text-xs text-text-muted flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-accent font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Public Good (DPG) Consensus Compliant</span>
          </div>
          <span className="font-mono text-text-dim text-[11px]">CivicPulse Engine v2.1</span>
        </div>
      </div>

      {/* Policy Review Modal */}
      <ProjectReviewModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};
