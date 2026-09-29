"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  MessageSquareText,
  Sparkles,
  Globe2,
  Settings,
  ShieldCheck,
  ChevronRight,
  Layers,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, badge: "Live" },
    { id: "map", label: "Macro Heatmap", icon: MapPin, count: "14 Hotspots" },
    { id: "requests", label: "Citizen Pulse", icon: MessageSquareText, count: "9 Stream" },
    { id: "ai-projects", label: "AI Priorities", icon: Sparkles, badge: "AI" },
    { id: "analytics", label: "Cross-Border Analytics", icon: BarChart3 },
    { id: "multilingual", label: "Translation Fabric", icon: Globe2 },
    { id: "layers", label: "PostGIS Layers", icon: Layers },
    { id: "settings", label: "Governance & Access", icon: Settings },
  ];

  const bricsNations = [
    { code: "ALL", name: "All BRICS+ Nodes" },
    { code: "BR", name: "Brazil" },
    { code: "RU", name: "Russia" },
    { code: "IN", name: "India" },
    { code: "CN", name: "China" },
    { code: "ZA", name: "South Africa" },
    { code: "EG", name: "Egypt" },
    { code: "ET", name: "Ethiopia" },
    { code: "IR", name: "Iran" },
    { code: "AE", name: "UAE" },
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
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm tracking-tight text-white">CivicPulse</h1>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/25 text-teal-300 font-semibold border border-accent/40">
                    BRICS
                  </span>
                </div>
                <p className="text-[11px] text-text-muted truncate">Digital Public Good</p>
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
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {!collapsed && (
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? "bg-slate-800/90 text-white shadow-sm border border-slate-700"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-accent rounded-r-full" />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-teal-300 font-semibold border border-teal-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* BRICS Territory Filter */}
        {!collapsed && (
          <div className="pt-4 px-2 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Territory Focus</span>
              <span className="text-[9px] text-teal-400 bg-teal-950/60 px-1 rounded border border-teal-800/40">
                10 Member States
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-1">
              {bricsNations.map((nation) => (
                <button
                  key={nation.code}
                  onClick={() => setSelectedRegion(nation.code)}
                  className={`text-left px-2 py-1.5 rounded text-[11px] truncate transition-colors ${
                    selectedRegion === nation.code
                      ? "bg-accent text-white font-semibold"
                      : "bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {nation.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>UN DPG Standard</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Synced
              </span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              CivicPulse v1.0 • Multilateral Governance
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="System Synced" />
          </div>
        )}
      </div>
    </aside>
  );
};
