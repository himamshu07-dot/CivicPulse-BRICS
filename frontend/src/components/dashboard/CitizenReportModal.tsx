"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Upload,
  Globe,
  MapPin,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  X,
  RefreshCw,
  Layers,
} from "lucide-react";

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: () => void;
}

const BRICS_HUBS = [
  { name: "New Delhi (National Capital Region)", country: "India", lat: 28.6139, lon: 77.2090, lang: "hi-IN" },
  { name: "São Paulo (Metropolitan Area)", country: "Brazil", lat: -23.5505, lon: -46.6333, lang: "pt-BR" },
  { name: "Cape Town (Western Cape)", country: "South Africa", lat: -33.9249, lon: 18.4241, lang: "en-ZA" },
  { name: "Moscow (Central Federal District)", country: "Russia", lat: 55.7558, lon: 37.6173, lang: "ru-RU" },
  { name: "Beijing / Yunnan (Urban Corridor)", country: "China", lat: 39.9042, lon: 116.4074, lang: "zh-CN" },
  { name: "Cairo (Nile Basin)", country: "Egypt", lat: 30.0444, lon: 31.2357, lang: "ar-EG" },
  { name: "Addis Ababa (Highland Corridor)", country: "Ethiopia", lat: 9.0300, lon: 38.7400, lang: "am-ET" },
];

const PRESET_SCENARIOS = [
  {
    label: "🇮🇳 New Delhi — Water Crisis (Hindi)",
    text: "हमारे वार्ड में 4 दिनों से मुख्य पेयजल पाइपलाइन टूटी हुई है और पानी नहीं आ रहा है, अस्पताल में मरीज परेशान हैं।",
    hubIndex: 0,
    langCode: "hi",
  },
  {
    label: "🇧🇷 São Paulo — Transit Flooding (Portuguese)",
    text: "O rompimento no cano principal e alagamento na Marginal Tietê paralisou todos os ônibus e o posto de saúde está sem água.",
    hubIndex: 1,
    langCode: "pt",
  },
  {
    label: "🇿🇦 Cape Town — Clinic Blackout (English)",
    text: "Emergency clinic backup generator has failed during a 12-hour continuous grid load-shedding, vaccines risk spoiling.",
    hubIndex: 2,
    langCode: "en",
  },
  {
    label: "🇷🇺 Urals — Heating Failure (Russian)",
    text: "В поликлинике отключили теплоснабжение и горячую воду, температура в палатах критическая, срочно нужна аварийная бригада.",
    hubIndex: 3,
    langCode: "ru",
  },
];

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedHubIndex, setSelectedHubIndex] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState<"web" | "voice" | "whatsapp" | "telegram">("web");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Speech Recognition instance
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedHub = BRICS_HUBS[selectedHubIndex];

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedHub.lang;

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition notice:", err);
          stopRecording();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
    return () => {
      stopRecording();
    };
  }, [selectedHub.lang]);

  const startRecording = () => {
    setErrorMessage(null);
    setSelectedChannel("voice");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = selectedHub.lang;
        recognitionRef.current.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    } else {
      setErrorMessage("Web Speech API not supported in this browser. Please type or upload an audio file.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setSelectedChannel("voice");
      if (!inputText) {
        setInputText(`[Voice Memo Uploaded: ${file.name}] Critical infrastructure issue reported.`);
      }
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_SCENARIOS[0]) => {
    setInputText(preset.text);
    setSelectedHubIndex(preset.hubIndex);
  };

  // Client-side live analysis preview
  const previewAnalysis = () => {
    const text = inputText.toLowerCase();
    let detectedLang = "en";
    let category = "Municipal Infrastructure";
    let urgency = "MEDIUM";
    let urgencyScore = 50;

    // Language detection heuristics
    if (/[\u0900-\u097F]/.test(inputText)) detectedLang = "hi";
    else if (/[\u0400-\u04FF]/.test(inputText)) detectedLang = "ru";
    else if (/[\u4E00-\u9FFF]/.test(inputText)) detectedLang = "zh";
    else if (/água|rompimento|apagão|saúde|ônibus|esgoto/.test(text)) detectedLang = "pt";

    // Category
    if (/water|água|drinking|pipe|drainage|नल|पानी/.test(text)) category = "Water & Sanitation";
    else if (/health|doctor|hospital|clinic|medicine|दवा|अस्पताल|saúde/.test(text)) category = "Healthcare";
    else if (/power|electricity|grid|blackout|बिजली|energia|luz/.test(text)) category = "Grid & Power";
    else if (/road|bus|transit|bridge|pothole|सड़क|ônibus/.test(text)) category = "Transport & Logistics";

    // Urgency
    if (/emergency|death|burst|critical|icu|fatal|ख़तरा|3 days without|4 days without/.test(text)) {
      urgency = "CRITICAL";
      urgencyScore = 90;
    } else if (/urgent|broken|shut down|no water|no power|बंद|तुरंत/.test(text)) {
      urgency = "HIGH";
      urgencyScore = 75;
    }

    return { detectedLang, category, urgency, urgencyScore };
  };

  const liveMeta = previewAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMessage("Please enter or record a problem statement.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    stopRecording();

    try {
      const payload = {
        text: inputText,
        channel: selectedChannel,
        latitude: selectedHub.lat,
        longitude: selectedHub.lon,
        country: selectedHub.country,
        region: selectedHub.name,
      };

      const res = await fetch("http://localhost:8000/api/v1/ingest/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const result = await res.json();
      setSubmissionResult(result);
      onReportSubmitted();
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage("Failed to connect to backend API on http://localhost:8000. Ensure the FastAPI backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50 font-mono">
      <div className="bg-surface-card w-full max-w-2xl rounded-xl border border-border shadow-neon-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-surface border-b border-border text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-accent/40 flex items-center justify-center text-accent shadow-neon-sm">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white flex items-center gap-2 font-mono">
                // Citizen Voice & Issue Portal //
                <span className="text-[10px] bg-accent/10 text-accent border border-accent/30 px-1.5 py-0.5 rounded font-bold">
                  [Live DBMS Persistence]
                </span>
              </h2>
              <p className="text-xs text-text-muted font-sans">
                Direct public infrastructure report via Speech or Multilingual Text
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-dim hover:text-white hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-border">
          {submissionResult ? (
            /* Success Receipt View */
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 bg-accent/10 border border-accent/30 text-accent rounded-full flex items-center justify-center mx-auto shadow-neon-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white uppercase font-mono">// Complaint Successfully Persisted to Government DBMS //</h3>
              <p className="text-xs text-text-muted max-w-md mx-auto font-sans">
                Your report has been analyzed by the transformer classification pipeline and stored in the municipal database.
              </p>

              {/* Data Receipt Card */}
              <div className="bg-surface border border-border rounded-lg p-4 text-left space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-dashed border-border/80 pb-1.5">
                  <span className="text-text-dim">// Tracking ID:</span>
                  <span className="font-bold text-accent">{submissionResult.request_id}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border/80 pb-1.5">
                  <span className="text-text-dim">// Detected Language:</span>
                  <span className="text-white font-semibold">[{submissionResult.original_language.toUpperCase()}]</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border/80 pb-1.5">
                  <span className="text-text-dim">// Classified Category:</span>
                  <span className="font-semibold text-white">{submissionResult.category}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border/80 pb-1.5">
                  <span className="text-text-dim">// Assessed Urgency:</span>
                  <span className={`font-bold ${submissionResult.urgency === "CRITICAL" ? "text-alert-critical" : "text-alert-warn"}`}>
                    [{submissionResult.urgency}] ({submissionResult.urgency_score}/100)
                  </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border/80 pb-1.5">
                  <span className="text-text-dim">// Deduplication Status:</span>
                  <span className="text-accent font-semibold">
                    {submissionResult.is_duplicate
                      ? `Merged with localized issue cluster (${submissionResult.duplicate_count} complaints linked)`
                      : "Registered as new distinct signal"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">// Unified English Baseline:</span>
                  <span className="text-text-muted italic max-w-xs text-right truncate font-serif">
                    "{submissionResult.english_translation}"
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmissionResult(null);
                    setInputText("");
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-border hover:border-accent text-text-muted hover:text-white transition-colors"
                >
                  [ Submit Another Report ]
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-bold rounded-lg border border-accent bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-neon-sm transition-all"
                >
                  [ View on Dashboard ]
                </button>
              </div>
            </div>
          ) : (
            /* Input Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5">
                  // ⚡ Quick Test Scenarios (BRICS Multilingual): //
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {PRESET_SCENARIOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className="text-left px-2.5 py-1.5 text-[11px] rounded-lg border border-border bg-surface hover:border-accent hover:text-white text-text-muted transition-colors truncate"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hub & Channel Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-dim mb-1">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-accent" />
                    Target Jurisdiction / BRICS Hub:
                  </label>
                  <select
                    value={selectedHubIndex}
                    onChange={(e) => setSelectedHubIndex(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-white focus:outline-none focus:border-accent"
                  >
                    {BRICS_HUBS.map((hub, idx) => (
                      <option key={idx} value={idx} className="bg-surface-card text-white">
                        {hub.country}: {hub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-dim mb-1">
                    <Layers className="w-3.5 h-3.5 inline mr-1 text-accent" />
                    Ingestion Channel:
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { id: "web", label: "Web Portal" },
                      { id: "voice", label: "Voice / Speech" },
                      { id: "whatsapp", label: "WhatsApp" },
                      { id: "telegram", label: "Telegram" },
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSelectedChannel(ch.id as any)}
                        className={`flex-1 text-center py-2 text-xs rounded-lg border transition-all ${
                          selectedChannel === ch.id
                            ? "bg-accent/15 border-accent text-accent font-bold shadow-neon-sm"
                            : "border-border bg-surface hover:bg-surface-card-hover text-text-dim"
                        }`}
                      >
                        [{ch.label}]
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Voice Recording Control */}
              <div className="bg-surface rounded-lg p-3 border border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                      isRecording
                        ? "bg-alert-critical text-white animate-pulse shadow-neon-lg"
                        : "border border-accent text-accent bg-accent/10 hover:bg-accent/20 hover:shadow-neon-sm"
                    }`}
                    title={isRecording ? "Stop Recording" : "Start Live Voice Speech Input"}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {isRecording ? "// Listening to Citizen Speech... //" : "Record Voice Memo (Web Speech API)"}
                    </div>
                    <div className="text-[11px] text-text-muted font-sans">
                      {isRecording
                        ? `Recording active (${recordingSeconds}s) — Speaking in ${selectedHub.lang}`
                        : "Click microphone to dictate in Hindi, Portuguese, Russian, or English"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-2.5 py-1.5 rounded-lg border border-border hover:border-accent text-[11px] font-bold text-text-muted hover:text-white flex items-center gap-1.5 transition-colors bg-surface-card">
                    <Upload className="w-3.5 h-3.5 text-accent" />
                    <span>[ Upload Audio ]</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Text Input Area */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-text-muted">
                    // Citizen Problem Statement (Multilingual Vernacular): //
                  </label>
                  <span className="text-[11px] text-text-dim">
                    [{inputText.length} characters]
                  </span>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={4}
                  placeholder="Describe the urgent public infrastructure failure (e.g. water pipeline broken, hospital power cut, sewage overflow, transit delay)..."
                  className="w-full text-xs rounded-lg border border-border p-3 text-white focus:outline-none focus:border-accent bg-surface placeholder-text-dim font-sans"
                />
              </div>

              {/* Live AI Analysis Badge Bar */}
              {inputText.trim().length > 3 && (
                <div className="bg-surface border border-accent/30 rounded-lg p-3 space-y-1.5 animate-in fade-in-30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>// Live AI Processing Preview: //</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-surface-card px-2 py-1 rounded border border-border">
                      <span className="text-text-dim block text-[9px]">// LANGUAGE //</span>
                      <span className="font-bold text-white">{liveMeta.detectedLang.toUpperCase()}</span>
                    </div>
                    <div className="bg-surface-card px-2 py-1 rounded border border-border">
                      <span className="text-text-dim block text-[9px]">// SECTOR //</span>
                      <span className="font-bold text-white truncate block">{liveMeta.category}</span>
                    </div>
                    <div className="bg-surface-card px-2 py-1 rounded border border-border">
                      <span className="text-text-dim block text-[9px]">// URGENCY //</span>
                      <span className={`font-bold ${liveMeta.urgency === "CRITICAL" ? "text-alert-critical" : "text-alert-warn"}`}>
                        [{liveMeta.urgency}]
                      </span>
                    </div>
                    <div className="bg-surface-card px-2 py-1 rounded border border-border">
                      <span className="text-text-dim block text-[9px]">// DEDUP RADIUS //</span>
                      <span className="font-bold text-accent">15 km Proximity</span>
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="text-xs text-alert-critical bg-alert-critical/10 border border-alert-critical/30 rounded-lg p-2.5 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-border hover:border-accent text-text-dim hover:text-white transition-colors"
                >
                  [ Cancel ]
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-lg border border-accent bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-neon-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>[ Classifying & Storing to DBMS... ]</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>[ Submit Complaint to Government ]</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
