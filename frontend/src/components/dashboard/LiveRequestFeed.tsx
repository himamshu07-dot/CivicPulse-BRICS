"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MOCK_CITIZEN_REQUESTS,
  CitizenRequest,
} from "@/data/mockRequests";
import {
  Radio,
  Pause,
  Play,
  Languages,
  Clock,
  Filter,
  Flame,
  Search,
  CheckCircle2,
} from "lucide-react";

interface LiveRequestFeedProps {
  selectedRegion?: string;
}

export const LiveRequestFeed: React.FC<LiveRequestFeedProps> = ({
  selectedRegion = "ALL",
}) => {
  const [requests, setRequests] = useState<CitizenRequest[]>(MOCK_CITIZEN_REQUESTS);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter requests based on selected region, category, and search query
  const filteredRequests = requests.filter((req) => {
    const matchRegion =
      selectedRegion === "ALL" || req.countryCode === selectedRegion;
    const matchCategory =
      selectedCategory === "ALL" || req.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      searchQuery === "" ||
      req.translatedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.languageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.region.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRegion && matchCategory && matchSearch;
  });

  // Auto-scroll loop effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 2) {
          scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          scrollContainerRef.current.scrollBy({ top: 48, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Healthcare":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Water":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Power":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Infrastructure":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "Education":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Sanitation":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getUrgencyIndicator = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <span className="w-2 h-2 rounded-full bg-alert-critical shrink-0 animate-ping" title="Critical Urgency" />;
      case "high":
        return <span className="w-2 h-2 rounded-full bg-alert-warn shrink-0" title="High Urgency" />;
      default:
        return <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" title="Standard" />;
    }
  };

  return (
    <div className="w-full h-full bg-card rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      {/* Feed Header */}
      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-alert-critical animate-pulse" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">
              Live Citizen Request Feed
            </h3>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Multilingual Stream Active</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search incoming signals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1 text-xs rounded-md border border-slate-200 bg-white text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent w-44"
            />
          </div>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
              isAutoScrolling
                ? "bg-teal-50 text-accent border-teal-200"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
            }`}
            title={isAutoScrolling ? "Pause auto-ticker" : "Resume auto-ticker"}
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-3 h-3" />
                <span className="text-[10px]">Ticker On</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span className="text-[10px]">Paused</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="px-4 py-1.5 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
        <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wider mr-1">
          Category:
        </span>
        {["ALL", "Healthcare", "Water", "Power", "Infrastructure", "Sanitation"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-text-muted hover:bg-slate-200 hover:text-text-main"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Feed Items Container */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
        className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200"
      >
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-xs">
            No citizen requests match the current filters.
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-3 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              {/* Left Segment: Urgency, Timestamp, and Original Language */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  {getUrgencyIndicator(req.urgency)}
                  <div className="flex items-center gap-1 font-mono text-text-muted text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{req.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700">
                  <Languages className="w-3 h-3 text-accent" />
                  <span>{req.languageName}</span>
                </div>
              </div>

              {/* Center Segment: Translated English Text & Original Vernacular */}
              <div className="flex-1 min-w-0 px-1">
                <div className="text-text-main font-medium leading-snug">
                  {req.translatedText}
                </div>
                <div className="text-[11px] text-text-muted truncate mt-0.5 font-sans italic opacity-80">
                  &ldquo;{req.originalText}&rdquo;
                </div>
              </div>

              {/* Right Segment: Region Tag & Category Badge */}
              <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                <span className="text-[10px] text-text-muted font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {req.region}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(
                    req.category
                  )}`}
                >
                  {req.category}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Feed Bottom Status Ticker Bar */}
      <div className="px-4 py-1 bg-slate-50 border-t border-slate-100 text-[10px] text-text-muted flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span>Inbound Throughput: <strong className="text-accent">142 msg/min</strong></span>
          <span>•</span>
          <span>AI Translation Confidence: <strong className="text-emerald-700">98.4%</strong></span>
        </div>
        <span className="font-mono text-slate-400">Total Buffer: {requests.length} verified events</span>
      </div>
    </div>
  );
};
