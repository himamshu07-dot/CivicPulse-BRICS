"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  ChevronRight,
  Mic,
  Droplets,
  HeartPulse,
  Zap,
  Car,
  CheckCircle,
  Terminal,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenReportModal?: () => void;
  problemCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  onOpenReportModal,
  problemCount = 0,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const categories = [
    { id: "ALL", label: "All Categories", icon: LayoutDashboard },
    { id: "Water & Sanitation", label: "Water & Sanitation", icon: Droplets },
    { id: "Healthcare", label: "Healthcare", icon: HeartPulse },
    { id: "Grid & Power", label: "Grid & Power", icon: Zap },
    { id: "Transport & Logistics", label: "Transport & Roads", icon: Car },
  ];

  return (
    <aside
      className={`bg-surface text-text-main flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${
        collapsed ? "w-16" : "w-64"
      } h-screen border-r border-border font-mono`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-border/80 bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-surface-card border border-accent/60 flex items-center justify-center shrink-0 shadow-neon-sm">
              <span className="font-bold text-accent text-sm">CP</span>
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm tracking-wider text-white">CivicPulse</h1>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent/15 text-accent font-mono font-bold border border-accent/40">
                    [LIVE]
                  </span>
                </div>
                <p className="text-[10px] text-text-muted truncate">// Citizen Grievance Engine //</p>
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
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 scrollbar-thin scrollbar-thumb-border">
        {/* Primary Ghost / Outline Action Button */}
        {!collapsed ? (
          <button
            onClick={onOpenReportModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-accent text-accent font-bold text-xs tracking-wider bg-accent/5 hover:bg-accent/15 shadow-neon-sm transition-all active:scale-95"
          >
            <Mic className="w-4 h-4 text-accent" />
            <span>[ + ADD PROBLEM ]</span>
          </button>
        ) : (
          <button
            onClick={onOpenReportModal}
            className="w-full flex items-center justify-center p-2 rounded-lg border border-accent text-accent shadow-neon-sm hover:bg-accent/15"
            title="Add Problem via Voice or Text"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}

        {/* Views */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-text-dim">
              // NAVIGATION //
            </div>
          )}

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-surface-card text-accent border border-accent/40 font-bold shadow-neon-sm"
                : "text-text-muted hover:text-white hover:bg-surface-card/60"
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-accent" : "text-text-dim"}`} />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span>Problems Directory</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border text-accent">
                  [{problemCount}]
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ai-projects")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === "ai-projects"
                ? "bg-surface-card text-accent border border-accent/40 font-bold shadow-neon-sm"
                : "text-text-muted hover:text-white hover:bg-surface-card/60"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === "ai-projects" ? "text-accent" : "text-alert-warn"}`} />
            {!collapsed && <span>AI Project Solutions</span>}
          </button>
        </div>

        {/* Category Filter */}
        <div className="space-y-1 pt-1 border-t border-dashed border-border/80">
          {!collapsed && (
            <div className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-text-dim">
              // FILTER BY SECTOR //
            </div>
          )}

          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  isSelected
                    ? "bg-accent/10 text-accent font-bold border border-accent/30"
                    : "text-text-muted hover:text-white hover:bg-surface-card/40"
                }`}
                title={cat.label}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-accent" : "text-text-dim"}`} />
                {!collapsed && <span className="truncate text-[11px]">{cat.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-border bg-surface text-[10px] text-text-muted flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-accent">
            <CheckCircle className="w-3.5 h-3.5 text-accent" />
            <span>[ML_MODEL_ACTIVE]</span>
          </div>
          <span className="text-text-dim">v2.1</span>
        </div>
      )}
    </aside>
  );
};
