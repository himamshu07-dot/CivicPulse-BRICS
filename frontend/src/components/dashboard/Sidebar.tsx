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
      className={`bg-primary text-white flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${
        collapsed ? "w-16" : "w-64"
      } h-screen border-r border-slate-800`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0 shadow-md shadow-teal-950/30">
              <span className="font-bold text-white text-base">CP</span>
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm tracking-tight text-white">CivicPulse</h1>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/25 text-teal-300 font-semibold border border-accent/40">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Citizen Grievance Engine</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors text-xs hidden lg:block"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`} />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {/* Primary Action Button */}
        {!collapsed ? (
          <button
            onClick={onOpenReportModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md hover:bg-teal-700 transition-all active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>+ Add Problem</span>
          </button>
        ) : (
          <button
            onClick={onOpenReportModal}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-accent text-white shadow-md hover:bg-teal-700"
            title="Add Problem via Voice or Text"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}

        {/* Views */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
          )}

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-slate-800 text-white font-semibold shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-accent" />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span>Problems Directory</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                  {problemCount}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ai-projects")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === "ai-projects"
                ? "bg-slate-800 text-white font-semibold shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            {!collapsed && <span>AI Project Solutions</span>}
          </button>
        </div>

        {/* Real Category Filter */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Filter By Sector
            </div>
          )}

          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-accent/20 text-teal-300 font-semibold border border-accent/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
                title={cat.label}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-teal-400" : "text-slate-400"}`} />
                {!collapsed && <span className="truncate">{cat.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>ML Model Active</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">v2.1</span>
        </div>
      )}
    </aside>
  );
};
