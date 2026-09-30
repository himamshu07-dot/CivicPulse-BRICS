"use client";

import React, { useState } from "react";
import {
  Droplets,
  Zap,
  HeartPulse,
  Car,
  Activity,
  Globe2,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Radio,
  Cpu,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { CitizenRequest } from "@/data/mockRequests";

interface InfrastructureHealthMatrixProps {
  problems: CitizenRequest[];
  onSelectCountry?: (country: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const InfrastructureHealthMatrix: React.FC<InfrastructureHealthMatrixProps> = ({
  problems = [],
  onSelectCountry,
  selectedCategory = "ALL",
  onSelectCategory,
}) => {
  const [activeFilterCountry, setActiveFilterCountry] = useState<string>("ALL");

  // Calculate sector counts
  const waterCount = problems.filter((p) => p.category.toLowerCase().includes("water")).length;
  const powerCount = problems.filter((p) => p.category.toLowerCase().includes("power") || p.category.toLowerCase().includes("grid")).length;
  const healthCount = problems.filter((p) => p.category.toLowerCase().includes("health")).length;
  const transportCount = problems.filter((p) => p.category.toLowerCase().includes("transport") || p.category.toLowerCase().includes("road")).length;

  const total = problems.length || 1;

  // Sector health scores (higher complaints = lower health)
  const waterHealth = Math.max(25, Math.round(100 - (waterCount / total) * 60));
  const powerHealth = Math.max(30, Math.round(100 - (powerCount / total) * 60));
  const healthHealth = Math.max(20, Math.round(100 - (healthCount / total) * 60));
  const transportHealth = Math.max(35, Math.round(100 - (transportCount / total) * 60));

  // BRICS nations telemetry
  const bricsCountries = [
    { code: "IN", name: "India", flag: "🇮🇳", lat: "28.6°N, 77.2°E" },
    { code: "BR", name: "Brazil", flag: "🇧🇷", lat: "23.5°S, 46.6°W" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦", lat: "33.9°S, 18.4°E" },
    { code: "RU", name: "Russia", flag: "🇷🇺", lat: "55.7°N, 37.6°E" },
    { code: "CN", name: "China", flag: "🇨🇳", lat: "39.9°N, 116.4°E" },
    { code: "EG", name: "Egypt", flag: "🇪🇬", lat: "30.0°N, 31.2°E" },
    { code: "ET", name: "Ethiopia", flag: "🇪🇹", lat: "9.0°N, 38.7°E" },
    { code: "IR", name: "Iran", flag: "🇮🇷", lat: "35.6°N, 51.3°E" },
    { code: "AE", name: "UAE", flag: "🇦🇪", lat: "25.2°N, 55.2°E" },
    { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", lat: "24.7°N, 46.6°E" },
  ];

  const getCountryProblemCount = (name: string) => {
    return problems.filter((p) => p.country && p.country.toLowerCase().includes(name.toLowerCase())).length;
  };

  return (
    <div className="w-full h-full overflow-y-auto space-y-4 p-4 md:p-6 font-sans scrollbar-thin scrollbar-thumb-border">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-card border border-border relative overflow-hidden shadow-lg">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              Live Infrastructure Telemetry
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            BRICS Infrastructure Health Matrix
          </h2>
          <p className="text-xs text-text-muted max-w-xl">
            Real-time multilateral sensor network synthesizing citizen grievance streams, infrastructure integrity scores, and autonomous public good alerts.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="px-4 py-2 rounded-xl bg-surface border border-border text-center">
            <span className="text-[10px] text-text-dim block uppercase font-mono">Total Recorded</span>
            <span className="text-xl font-bold text-white font-mono">{problems.length}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-surface border border-border text-center">
            <span className="text-[10px] text-text-dim block uppercase font-mono">DBSCAN Clusters</span>
            <span className="text-xl font-bold text-accent font-mono">Active</span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Sector Radial Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Water */}
        <div
          onClick={() => onSelectCategory && onSelectCategory("Water & Sanitation")}
          className="cyber-card p-4 rounded-xl cursor-pointer hover:border-cyan-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Water &amp; Sanitation</span>
                <span className="text-[10px] text-text-dim font-mono">{waterCount} Signals Logged</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">{waterHealth}%</span>
          </div>

          {/* SVG Radial Meter */}
          <div className="relative flex items-center justify-center py-2">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="#1f1f1f" strokeWidth="8" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#22d3ee"
                strokeWidth="8"
                fill="none"
                strokeDasharray="238.7"
                strokeDashoffset={238.7 - (238.7 * waterHealth) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-base font-bold text-white">{waterHealth}</span>
              <span className="text-[9px] text-text-dim uppercase">HEALTH</span>
            </div>
          </div>
          <div className="text-[10px] text-text-muted text-center mt-1">Aquifer &amp; pipeline resilience</div>
        </div>

        {/* Power */}
        <div
          onClick={() => onSelectCategory && onSelectCategory("Grid & Power")}
          className="cyber-card p-4 rounded-xl cursor-pointer hover:border-amber-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Grid &amp; Power</span>
                <span className="text-[10px] text-text-dim font-mono">{powerCount} Signals Logged</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">{powerHealth}%</span>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="#1f1f1f" strokeWidth="8" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#fbbf24"
                strokeWidth="8"
                fill="none"
                strokeDasharray="238.7"
                strokeDashoffset={238.7 - (238.7 * powerHealth) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-base font-bold text-white">{powerHealth}</span>
              <span className="text-[9px] text-text-dim uppercase">STABILITY</span>
            </div>
          </div>
          <div className="text-[10px] text-text-muted text-center mt-1">Turbine &amp; blackout containment</div>
        </div>

        {/* Healthcare */}
        <div
          onClick={() => onSelectCategory && onSelectCategory("Healthcare")}
          className="cyber-card p-4 rounded-xl cursor-pointer hover:border-rose-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-400/15 border border-rose-400/30 flex items-center justify-center text-rose-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Healthcare Access</span>
                <span className="text-[10px] text-text-dim font-mono">{healthCount} Signals Logged</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">{healthHealth}%</span>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="#1f1f1f" strokeWidth="8" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#f43f5e"
                strokeWidth="8"
                fill="none"
                strokeDasharray="238.7"
                strokeDashoffset={238.7 - (238.7 * healthHealth) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-base font-bold text-white">{healthHealth}</span>
              <span className="text-[9px] text-text-dim uppercase">READINESS</span>
            </div>
          </div>
          <div className="text-[10px] text-text-muted text-center mt-1">ICU backup &amp; medicine stock</div>
        </div>

        {/* Transport */}
        <div
          onClick={() => onSelectCategory && onSelectCategory("Transport & Logistics")}
          className="cyber-card p-4 rounded-xl cursor-pointer hover:border-indigo-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-400/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Transport &amp; Roads</span>
                <span className="text-[10px] text-text-dim font-mono">{transportCount} Signals Logged</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400">{transportHealth}%</span>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="#1f1f1f" strokeWidth="8" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#818cf8"
                strokeWidth="8"
                fill="none"
                strokeDasharray="238.7"
                strokeDashoffset={238.7 - (238.7 * transportHealth) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-base font-bold text-white">{transportHealth}</span>
              <span className="text-[9px] text-text-dim uppercase">MOBILITY</span>
            </div>
          </div>
          <div className="text-[10px] text-text-muted text-center mt-1">Pothole &amp; transit corridors</div>
        </div>
      </div>

      {/* Middle Row: Cyber Radar Scanner + Ingestion Velocity Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Animated Cyber Radar Scanner */}
        <div className="cyber-card p-5 rounded-xl flex flex-col justify-between items-center text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-accent" />
              Autonomous Threat Radar
            </span>
            <span className="text-[10px] font-mono text-accent bg-accent/15 px-2 py-0.5 rounded-full border border-accent/30">
              SCANNING
            </span>
          </div>

          {/* Radar Circles and Rotating Sweep */}
          <div className="relative w-44 h-44 my-3 flex items-center justify-center">
            {/* Concentric rings */}
            <div className="absolute inset-0 rounded-full border border-accent/20" />
            <div className="absolute inset-6 rounded-full border border-accent/25" />
            <div className="absolute inset-12 rounded-full border border-accent/30" />
            <div className="absolute inset-18 rounded-full border border-accent/40" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-accent/20" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-accent/20" />

            {/* Rotating radar sweep */}
            <div className="absolute inset-0 rounded-full animate-radar origin-center bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(57,255,20,0.35)_360deg)] pointer-events-none" />

            {/* Pulsing incident blips */}
            <span className="absolute top-10 left-14 w-2 h-2 rounded-full bg-alert-critical animate-ping" />
            <span className="absolute top-10 left-14 w-2 h-2 rounded-full bg-alert-critical" />

            <span className="absolute bottom-12 right-10 w-2 h-2 rounded-full bg-alert-warn animate-ping" />
            <span className="absolute bottom-12 right-10 w-2 h-2 rounded-full bg-alert-warn" />

            <span className="absolute top-20 right-14 w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="absolute top-20 right-14 w-2 h-2 rounded-full bg-accent" />

            {/* Center node */}
            <div className="w-3 h-3 rounded-full bg-accent shadow-neon-sm z-10" />
          </div>

          <div className="text-[11px] text-text-muted font-mono">
            Epsilon Radius: 10km &bull; Multi-Hazard Blips
          </div>
        </div>

        {/* 24h Ingestion Velocity Wave Graphic */}
        <div className="cyber-card p-5 rounded-xl lg:col-span-2 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="font-bold text-white">Grievance Ingestion Velocity &amp; Severity Curve</span>
            </div>
            <span className="text-[11px] font-mono text-text-dim">24h Continuous Stream</span>
          </div>

          {/* SVG Animated Area Graphic */}
          <div className="h-36 w-full relative flex items-end pt-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39FF14" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#39FF14" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#222" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#222" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#222" strokeDasharray="4 4" />

              {/* Area fill */}
              <path
                d="M 0,100 Q 50,70 100,85 T 200,45 T 300,75 T 400,25 T 500,60 L 500,120 L 0,120 Z"
                fill="url(#areaGradient)"
              />

              {/* Neon Curve */}
              <path
                d="M 0,100 Q 50,70 100,85 T 200,45 T 300,75 T 400,25 T 500,60"
                fill="none"
                stroke="#39FF14"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Glowing Peaks */}
              <circle cx="200" cy="45" r="4" fill="#39FF14" />
              <circle cx="400" cy="25" r="4" fill="#FF3366" />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-border">
            <div>
              <span className="text-text-dim text-[10px] block">PEAK INGESTION</span>
              <span className="font-bold text-white">48 signals / hr</span>
            </div>
            <div>
              <span className="text-text-dim text-[10px] block">AVG RESOLUTION</span>
              <span className="font-bold text-accent">14.2 Days</span>
            </div>
            <div>
              <span className="text-text-dim text-[10px] block">AUTONOMOUS DEDUP</span>
              <span className="font-bold text-white">94.8% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* BRICS Member Nations Telemetry Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-accent" />
            <span className="font-bold text-white">BRICS Member States Incident Telemetry</span>
          </div>
          <span className="text-[11px] text-text-dim font-mono">10 Member Hubs</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {bricsCountries.map((c) => {
            const count = getCountryProblemCount(c.name);
            return (
              <div
                key={c.code}
                onClick={() => onSelectCountry && onSelectCountry(c.name)}
                className="cyber-card p-3 rounded-xl cursor-pointer hover:border-accent/40 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{c.flag}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-text-dim">
                    {c.code}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-accent transition-colors block">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-text-dim font-mono block">{c.lat}</span>
                </div>
                <div className="mt-2 pt-1.5 border-t border-border/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-text-dim">Signals:</span>
                  <span className={`font-bold ${count > 0 ? "text-accent" : "text-text-dim"}`}>
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
