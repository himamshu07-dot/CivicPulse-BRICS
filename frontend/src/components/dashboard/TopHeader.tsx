"use client";

import React, { useState } from "react";
import {
  Bell,
  Search,
  Globe,
  Database,
  Activity,
  Layers,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface TopHeaderProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  selectedRegion,
  setSelectedRegion,
}) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English (Official)");

  const languages = [
    "English (Official)",
    "Português (Brasil)",
    "Русский (Россия)",
    "हिन्दी (India)",
    "中文 (China)",
    "isiZulu (South Africa)",
    "العربية (Egypt / UAE)",
    "አማርኛ (Ethiopia)",
    "فارسی (Iran)",
  ];

  return (
    <header className="h-14 bg-card border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 shadow-sm z-20">
      {/* Left: Platform Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary tracking-tight">
            Policymaker Strategic Operations
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-text-muted font-medium">
            BRICS Multilateral Synthesis Node
          </span>
        </div>
      </div>

      {/* Right: Live Telemetry & Actions */}
      <div className="flex items-center gap-3">
        {/* Backend & DB Status Pills */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700">
            <Database className="w-3 h-3 text-accent" />
            <span>PostGIS:</span>
            <span className="text-emerald-600 font-bold">14 Active Hotspots</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700">
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>FastAPI:</span>
            <span className="text-emerald-600 font-bold">8000/OK</span>
          </div>
        </div>

        {/* Multilingual Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-accent" />
            <span className="truncate max-w-[120px]">{selectedLanguage}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLanguageDropdown && (
            <div className="absolute right-0 mt-1.5 w-48 bg-card rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs animate-in fade-in-50">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-slate-100">
                Official Working Languages
              </div>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                    selectedLanguage === lang ? "text-accent font-semibold bg-teal-50/50" : "text-slate-700"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors relative"
          title="Citizen Alert Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-alert-critical ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};
