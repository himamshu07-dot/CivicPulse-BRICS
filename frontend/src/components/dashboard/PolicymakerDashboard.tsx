"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { ProblemsDirectory } from "./ProblemsDirectory";
import { AIPriorityProjects } from "./AIPriorityProjects";
import { InfrastructureHealthMatrix } from "./InfrastructureHealthMatrix";
import { CitizenReportModal } from "./CitizenReportModal";
import { CyberCanvas } from "./CyberCanvas";
import { CitizenRequest } from "@/data/mockRequests";
import { AIProjectRecommendation } from "@/data/mockProjects";

export const PolicymakerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Live DBMS data states
  const [problems, setProblems] = useState<CitizenRequest[]>([]);
  const [aiProjects, setAiProjects] = useState<AIProjectRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch real problems and AI project recommendations from FastAPI + SQLite backend
  const fetchProblemsData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch real citizen requests stored in SQLite DBMS
      const res = await fetch("http://localhost:8000/api/v1/requests?limit=100");
      if (res.ok) {
        const data = await res.json();
        setProblems(Array.isArray(data) ? data : []);
      }

      // 2. Fetch real synthesized AI projects based on the stored problems
      try {
        const projRes = await fetch("http://localhost:8000/api/v1/hotspots");
        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData.ai_projects) {
            setAiProjects(projData.ai_projects);
          }
        }
      } catch (e) {
        console.warn("AI Projects sync warning:", e);
      }
    } catch (err) {
      console.warn("Backend offline or starting up:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a single problem
  const handleDeleteProblem = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/requests/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProblems((prev) => prev.filter((p) => p.id !== id));
        fetchProblemsData();
      }
    } catch (err) {
      console.error("Failed to delete problem:", err);
    }
  };

  // Clear all problems from DBMS
  const handleClearDatabase = async () => {
    if (confirm("Are you sure you want to delete all problems from the database to start fresh?")) {
      try {
        const res = await fetch("http://localhost:8000/api/v1/requests", {
          method: "DELETE",
        });
        if (res.ok) {
          setProblems([]);
          setAiProjects([]);
        }
      } catch (err) {
        console.error("Failed to clear database:", err);
      }
    }
  };

  useEffect(() => {
    fetchProblemsData();
    // Poll every 12 seconds for live additions
    const interval = setInterval(fetchProblemsData, 12000);
    return () => clearInterval(interval);
  }, [fetchProblemsData]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-main font-sans relative">
      {/* Interactive Cyber Constellation Backdrop */}
      <CyberCanvas />

      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        problemCount={problems.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-transparent relative z-10">
        {/* Top Header with Breadcrumbs, DBMS Counter, and the Single Primary Action */}
        <TopHeader
          activeTab={activeTab}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onClearDatabase={handleClearDatabase}
          dbRecordCount={problems.length}
        />

        {/* Workspace Display */}
        <div className="flex-1 overflow-hidden p-3 md:p-4 min-h-0">
          {activeTab === "ai-projects" ? (
            <div className="h-full max-w-5xl mx-auto rounded-2xl border border-border overflow-hidden bg-surface-card/90 backdrop-blur-md shadow-lg">
              <AIPriorityProjects externalProjects={aiProjects} />
            </div>
          ) : activeTab === "matrix" ? (
            <div className="h-full max-w-6xl mx-auto rounded-2xl border border-border overflow-hidden bg-surface-card/90 backdrop-blur-md shadow-lg">
              <InfrastructureHealthMatrix
                problems={problems}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setActiveTab("dashboard");
                }}
              />
            </div>
          ) : (
            <ProblemsDirectory
              problems={problems}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onDeleteProblem={handleDeleteProblem}
              selectedCategory={selectedCategory}
            />
          )}
        </div>
      </div>

      {/* Citizen Speech & Text Report Modal */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={fetchProblemsData}
      />
    </div>
  );
};

export default PolicymakerDashboard;
