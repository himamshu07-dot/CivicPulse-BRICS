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
  ArrowRight,
  Zap,
  Navigation,
  Check,
} from "lucide-react";

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: () => void;
}

export const BRICS_COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳", defaultLat: 28.6139, defaultLon: 77.2090, lang: "hi-IN" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", defaultLat: -23.5505, defaultLon: -46.6333, lang: "pt-BR" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", defaultLat: -33.9249, defaultLon: 18.4241, lang: "en-ZA" },
  { code: "RU", name: "Russia", flag: "🇷🇺", defaultLat: 55.7558, defaultLon: 37.6173, lang: "ru-RU" },
  { code: "CN", name: "China", flag: "🇨🇳", defaultLat: 39.9042, defaultLon: 116.4074, lang: "zh-CN" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", defaultLat: 30.0444, defaultLon: 31.2357, lang: "ar-EG" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", defaultLat: 9.0300, defaultLon: 38.7400, lang: "am-ET" },
  { code: "IR", name: "Iran", flag: "🇮🇷", defaultLat: 35.6892, defaultLon: 51.3890, lang: "fa-IR" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", defaultLat: 25.2048, defaultLon: 55.2708, lang: "ar-AE" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", defaultLat: 24.7136, defaultLon: 46.6753, lang: "ar-SA" },
];

const PRESET_SCENARIOS = [
  {
    label: "🇮🇳 India — Water Pipeline Rupture (Hindi)",
    country: "India",
    location: "Ward 42, Rohini Sector 16, New Delhi",
    text: "हमारे वार्ड में 4 दिनों से मुख्य पेयजल पाइपलाइन टूटी हुई है और पानी नहीं आ रहा है, अस्पताल में मरीज परेशान हैं।",
  },
  {
    label: "🇧🇷 Brazil — Avenue Flooding & Transit Delay (Portuguese)",
    country: "Brazil",
    location: "Marginal Tietê, São Paulo",
    text: "O rompimento no cano principal e alagamento na Marginal Tietê paralisou todos os ônibus e o posto de saúde está sem água.",
  },
  {
    label: "🇿🇦 South Africa — Emergency Clinic Blackout (English)",
    country: "South Africa",
    location: "Khayelitsha Clinic 3, Cape Town",
    text: "Emergency clinic backup generator has failed during a 12-hour continuous grid load-shedding, vaccines risk spoiling.",
  },
  {
    label: "🇷🇺 Russia — District Heating Failure (Russian)",
    country: "Russia",
    location: "Kirovsky District, Yekaterinburg",
    text: "В поликлинике отключили теплоснабжение и горячую воду, температура в палатах критическая, срочно нужна аварийная бригада.",
  },
];

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [selectedCountryName, setSelectedCountryName] = useState("India");
  const [customLocation, setCustomLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationDetectedMessage, setLocationDetectedMessage] = useState<string | null>(null);

  const [inputText, setInputText] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"web" | "voice" | "whatsapp" | "telegram">("web");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedCountry = BRICS_COUNTRIES.find((c) => c.name === selectedCountryName) || BRICS_COUNTRIES[0];

  // Initialize Speech Recognition based on selected country
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedCountry.lang;

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          stopRecording();
        };

        recognitionRef.current = recognition;
      }
    }
  }, [selectedCountry.lang]);

  const startRecording = () => {
    setSelectedChannel("voice");
    setIsRecording(true);
    setRecordingSeconds(0);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = selectedCountry.lang;
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech API start error:", err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignored
      }
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setSelectedChannel("voice");
      if (!inputText) {
        setInputText(`[Voice Memo: ${file.name}] Critical municipal infrastructure reported.`);
      }
    }
  };

  // HTML5 Geolocation detect
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationDetectedMessage("GPS not supported on this browser");
      return;
    }

    setIsDetectingLocation(true);
    setLocationDetectedMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingLocation(false);
        const { latitude, longitude } = pos.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        if (!customLocation) {
          setCustomLocation(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setLocationDetectedMessage(`Acquired GPS Coordinates (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
      },
      (err) => {
        setIsDetectingLocation(false);
        setLocationDetectedMessage("GPS permission denied or unavailable. Enter location text manually.");
      },
      { timeout: 8000 }
    );
  };

  const handlePresetSelect = (preset: typeof PRESET_SCENARIOS[0]) => {
    setInputText(preset.text);
    setSelectedCountryName(preset.country);
    setCustomLocation(preset.location);
  };

  // Preview heuristic analysis
  const previewAnalysis = () => {
    const text = inputText.toLowerCase();
    let detectedLang = "en";
    let category = "Municipal Infrastructure";
    let urgency = "MEDIUM";
    let urgencyScore = 50;

    if (/[\u0900-\u097F]/.test(inputText)) detectedLang = "hi";
    else if (/[\u0400-\u04FF]/.test(inputText)) detectedLang = "ru";
    else if (/[\u4E00-\u9FFF]/.test(inputText)) detectedLang = "zh";
    else if (/água|rompimento|apagão|saúde|ônibus|esgoto/.test(text)) detectedLang = "pt";

    if (/water|água|drinking|pipe|drainage|नल|पानी/.test(text)) category = "Water & Sanitation";
    else if (/health|doctor|hospital|clinic|medicine|दवा|अस्पताल|saúde/.test(text)) category = "Healthcare";
    else if (/power|electricity|grid|blackout|बिजली|energia|luz/.test(text)) category = "Grid & Power";
    else if (/road|bus|transit|bridge|pothole|सड़क|ônibus/.test(text)) category = "Transport & Logistics";

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
      setErrorMessage("Please enter or dictate a problem statement.");
      return;
    }

    if (!customLocation.trim()) {
      setErrorMessage("Please specify your city, neighborhood, or street location.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    stopRecording();

    try {
      const finalLat = coordinates ? coordinates.lat : selectedCountry.defaultLat;
      const finalLon = coordinates ? coordinates.lon : selectedCountry.defaultLon;

      const payload = {
        text: inputText,
        channel: selectedChannel,
        latitude: finalLat,
        longitude: finalLon,
        country: selectedCountry.name,
        region: customLocation.trim(),
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
      setErrorMessage("Failed to connect to backend on http://localhost:8000. Ensure the FastAPI service is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-surface-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Report Public Infrastructure Problem
              </h2>
              <p className="text-xs text-text-muted">
                Citizen Grievance Ingestion with Custom Location &amp; Multilingual AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-surface-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4.5 scrollbar-thin scrollbar-thumb-border">
          {submissionResult ? (
            /* Successful Ingestion View */
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-lg animate-bounce">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Grievance Successfully Ingested</h3>
                <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                  Your report has been analyzed by the transformer classification pipeline and stored into the database with your location.
                </p>
              </div>

              <div className="bg-surface rounded-xl p-4 border border-border text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text-dim">Jurisdiction:</span>
                  <span className="font-semibold text-white">{selectedCountry.flag} {selectedCountry.name} &bull; {customLocation}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text-dim">Classified Sector:</span>
                  <span className="font-semibold text-white">{submissionResult.category}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text-dim">Assessed Urgency:</span>
                  <span className={`font-bold font-mono ${submissionResult.urgency === "CRITICAL" ? "text-alert-critical" : "text-alert-warn"}`}>
                    {submissionResult.urgency} ({submissionResult.urgency_score} / 100)
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text-dim">Hotspot Clustering:</span>
                  <span className="text-accent font-medium">
                    {submissionResult.is_duplicate
                      ? `Merged with localized issue cluster (${submissionResult.duplicate_count} complaints linked)`
                      : "Registered as new distinct signal"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">English Translation:</span>
                  <span className="text-text-muted italic max-w-xs text-right truncate">
                    &ldquo;{submissionResult.english_translation}&rdquo;
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmissionResult(null);
                    setInputText("");
                    setCustomLocation("");
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-border text-text-muted hover:text-white hover:bg-surface transition-colors"
                >
                  Submit Another Report
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-accent text-black hover:bg-accent-bright transition-all shadow-sm"
                >
                  View on Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Input Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>Instant Test Scenarios (BRICS Multilingual):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_SCENARIOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className="text-left px-3 py-2 text-xs rounded-xl border border-border bg-surface hover:border-accent/50 hover:bg-surface-card hover:text-white text-text-muted transition-all truncate"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. BRICS Country Selection */}
              <div>
                <label className="block text-xs font-medium text-text-dim mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-accent" />
                  <span>Select BRICS Member Country:</span>
                </label>
                <select
                  value={selectedCountryName}
                  onChange={(e) => setSelectedCountryName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-surface px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-accent transition-colors"
                >
                  {BRICS_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name} className="bg-surface-card text-white py-1">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Citizen Custom Location Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-text-dim flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>Your Location in {selectedCountry.name}:</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isDetectingLocation}
                    className="text-[11px] text-accent hover:underline flex items-center gap-1 font-medium"
                  >
                    <Navigation className={`w-3 h-3 ${isDetectingLocation ? "animate-spin" : ""}`} />
                    <span>{isDetectingLocation ? "Locating..." : "Detect Current GPS"}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter city, neighborhood, street, or ward (e.g., Koramangala 4th Block, Bengaluru)..."
                    className="w-full text-xs rounded-xl border border-border px-3.5 py-2.5 text-white placeholder-text-dim focus:outline-none focus:border-accent bg-surface transition-colors"
                  />
                  {customLocation && (
                    <button
                      type="button"
                      onClick={() => setCustomLocation("")}
                      className="absolute right-2.5 top-2.5 text-text-dim hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {locationDetectedMessage && (
                  <p className="text-[11px] text-accent flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" />
                    <span>{locationDetectedMessage}</span>
                  </p>
                )}
              </div>

              {/* Ingestion Channel Selection */}
              <div>
                <label className="block text-xs font-medium text-text-dim mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-accent" />
                  <span>Channel:</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: "web", label: "Web Portal" },
                    { id: "voice", label: "Voice Speech" },
                    { id: "whatsapp", label: "WhatsApp" },
                    { id: "telegram", label: "Telegram" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedChannel(ch.id as any)}
                      className={`text-center py-2 text-xs rounded-xl border transition-all ${
                        selectedChannel === ch.id
                          ? "bg-accent/15 border-accent text-accent font-semibold shadow-xs"
                          : "border-border bg-surface hover:bg-surface-card text-text-dim"
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Speech Dictation Control with Equalizer Waveform */}
              <div className="bg-surface rounded-xl p-3.5 border border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                      isRecording
                        ? "bg-alert-critical text-white animate-pulse shadow-lg"
                        : "border border-accent text-accent bg-accent/10 hover:bg-accent/20"
                    }`}
                    title={isRecording ? "Stop Dictation" : "Start Live Voice Dictation"}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span>{isRecording ? "Recording Speech..." : "Dictate via Voice Memo"}</span>
                      {isRecording && (
                        <div className="flex items-center gap-1 h-4 px-1.5">
                          <span className="w-1 bg-accent rounded-full animate-wave-1" />
                          <span className="w-1 bg-accent rounded-full animate-wave-2" />
                          <span className="w-1 bg-accent rounded-full animate-wave-3" />
                          <span className="w-1 bg-accent rounded-full animate-wave-4" />
                          <span className="w-1 bg-accent rounded-full animate-wave-5" />
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {isRecording
                        ? `Recording in progress (${recordingSeconds}s) &bull; Speaking in ${selectedCountry.lang}`
                        : `Click mic to speak in native vernacular (${selectedCountry.name})`}
                    </div>
                  </div>
                </div>

                <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-border hover:border-accent text-xs font-medium text-text-muted hover:text-white flex items-center gap-1.5 transition-colors bg-surface-card">
                  <Upload className="w-3.5 h-3.5 text-accent" />
                  <span>Upload Audio</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Text Input Area */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <label className="font-semibold text-text-muted">
                    Citizen Problem Statement (Multilingual Vernacular):
                  </label>
                  <span className="text-text-dim font-mono text-[11px]">
                    {inputText.length} chars
                  </span>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={3}
                  placeholder="Describe the urgent public infrastructure issue (e.g. water pipeline burst, clinic power blackout, street flood, road pothole)..."
                  className="w-full text-xs rounded-xl border border-border p-3 text-white focus:outline-none focus:border-accent bg-surface placeholder-text-dim transition-colors"
                />
              </div>

              {/* Live AI Analysis Badge Bar */}
              {inputText.trim().length > 3 && (
                <div className="bg-surface border border-accent/30 rounded-xl p-3 space-y-1.5 animate-fade-in-up">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>Live AI Inference Preview:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-surface-card px-2.5 py-1 rounded-lg border border-border">
                      <span className="text-text-dim block text-[10px] font-mono">LANGUAGE</span>
                      <span className="font-semibold text-white">{liveMeta.detectedLang.toUpperCase()}</span>
                    </div>
                    <div className="bg-surface-card px-2.5 py-1 rounded-lg border border-border">
                      <span className="text-text-dim block text-[10px] font-mono">SECTOR</span>
                      <span className="font-semibold text-white truncate block">{liveMeta.category}</span>
                    </div>
                    <div className="bg-surface-card px-2.5 py-1 rounded-lg border border-border">
                      <span className="text-text-dim block text-[10px] font-mono">URGENCY</span>
                      <span className={`font-semibold font-mono ${liveMeta.urgency === "CRITICAL" ? "text-alert-critical" : "text-alert-warn"}`}>
                        {liveMeta.urgency} ({liveMeta.urgencyScore})
                      </span>
                    </div>
                    <div className="bg-surface-card px-2.5 py-1 rounded-lg border border-border">
                      <span className="text-text-dim block text-[10px] font-mono">DEDUP RADIUS</span>
                      <span className="font-semibold text-accent font-mono">10 km DBSCAN</span>
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
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-border text-text-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-accent text-black hover:bg-accent-bright transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Classifying &amp; Persisting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Grievance</span>
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
