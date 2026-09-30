"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  ChevronRight,
  Droplets,
  HeartPulse,
  Zap,
  Car,
  Activity,
  Layers,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  problemCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  problemCount = 0,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const categories = [
    { id: "ALL", label: "All Categories", icon: Layers },
    { id: "Water & Sanitation", label: "Water & Sanitation", icon: Droplets },
    { id: "Healthcare", label: "Healthcare", icon: HeartPulse },
    { id: "Grid & Power", label: "Grid & Power", icon: Zap },
    { id: "Transport & Logistics", label: "Transport & Roads", icon: Car },
  ];

  return (
    <aside
      className={`bg-surface text-text-main flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${
        collapsed ? "w-16" : "w-64"
      } h-screen border-r border-border font-sans`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-border/80 bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-surface-card border border-accent/40 flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-mono font-bold text-accent text-sm">CP</span>
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm tracking-wide text-white">CivicPulse</h1>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-mono font-bold border border-accent/30">
                    BRICS
                  </span>
                </div>
                <p className="text-[11px] text-text-muted truncate">Public Good Platform</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-text-muted hover:text-accent hover:bg-surface-card transition-colors text-xs hidden lg:block"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`} />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin scrollbar-thumb-border">
        {/* Navigation Views */}
        <div className="space-y-1.5">
          {!collapsed && (
            <div className="px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-text-dim">
              Platform Views
            </div>
          )}

          {/* Tab 1: Problems Directory */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-accent/10 text-accent font-semibold border border-accent/30 shadow-xs"
                : "text-text-muted hover:text-white hover:bg-surface-card"
            }`}
            title="Problems Directory"
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === "dashboard" ? "text-accent" : "text-text-dim"}`} />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span>Problems Directory</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-surface-card border border-border text-accent">
                  {problemCount}
                </span>
              </div>
            )}
          </button>

          {/* Tab 2: Sector Health Matrix (Rich Graphics & Telemetry) */}
          <button
            onClick={() => setActiveTab("matrix")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "matrix"
                ? "bg-accent/10 text-accent font-semibold border border-accent/30 shadow-xs"
                : "text-text-muted hover:text-white hover:bg-surface-card"
            }`}
            title="Sector Health Matrix & Graphics"
          >
            <Activity className={`w-4 h-4 shrink-0 ${activeTab === "matrix" ? "text-accent" : "text-text-dim"}`} />
            {!collapsed && <span>Sector Health Matrix</span>}
          </button>

          {/* Tab 3: AI Project Solutions */}
          <button
            onClick={() => setActiveTab("ai-projects")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "ai-projects"
                ? "bg-accent/10 text-accent font-semibold border border-accent/30 shadow-xs"
                : "text-text-muted hover:text-white hover:bg-surface-card"
            }`}
            title="AI Project Solutions"
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === "ai-projects" ? "text-accent" : "text-alert-warn"}`} />
            {!collapsed && <span>AI Project Directives</span>}
          </button>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5 pt-3 border-t border-border/70">
          {!collapsed && (
            <div className="px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-text-dim">
              Filter by Sector
            </div>
          )}

          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                  isSelected
                    ? "bg-surface-card text-accent font-semibold border border-accent/40 shadow-xs"
                    : "text-text-muted hover:text-white hover:bg-surface-card/60"
                }`}
                title={cat.label}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-accent" : "text-text-dim"}`} />
                {!collapsed && <span className="truncate text-xs">{cat.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-border bg-surface text-[11px] text-text-muted flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-wide font-medium">ML Model Online</span>
          </div>
          <span className="font-mono text-[10px] text-text-dim">v2.1</span>
        </div>
      )}
    </aside>
  );
};
