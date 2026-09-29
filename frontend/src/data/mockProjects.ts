export interface AIProjectRecommendation {
  id: string;
  title: string;
  region: string;
  country: string;
  priorityScore: number; // 0-100
  urgencyLevel: "critical" | "high" | "moderate";
  estimatedCost: string;
  beneficiaries: string;
  timeframe: string;
  aiJustification: string;
  keySignals: string[];
  coBenefits: string[];
}

export const MOCK_AI_PROJECTS: AIProjectRecommendation[] = [
  {
    id: "proj-001",
    title: "Deploy Mobile Solar Clinics & Cold-Chain Units",
    region: "North Bihar & Eastern UP",
    country: "India",
    priorityScore: 96,
    urgencyLevel: "critical",
    estimatedCost: "$4.2M DPG Co-Fund",
    beneficiaries: "1.85M Citizens",
    timeframe: "45-Day Rapid Deployment",
    aiJustification:
      "Synthesized 1,420+ real-time vernacular distress signals indicating severe post-monsoon vector-borne surges and cold-chain vaccine failures. Mobile solar clinics provide immediate triage while avoiding capital-heavy brick-and-mortar delays.",
    keySignals: [
      "87% surge in vernacular clinic distress keywords",
      "Flood plain isolation blocking 42 sub-districts",
      "High multi-state return on investment ratio (4.8x)",
    ],
    coBenefits: [
      "Solar battery backup resilience",
      "Real-time telehealth telemetry to district hubs",
      "Direct integration into National Health Stack",
    ],
  },
  {
    id: "proj-002",
    title: "Autonomous Desalination & Cistern Grid Pipeline",
    region: "Sertão Semi-Arid Basin",
    country: "Brazil",
    priorityScore: 93,
    urgencyLevel: "critical",
    estimatedCost: "$7.8M Multilateral Facility",
    beneficiaries: "920K Citizens",
    timeframe: "90-Day Modular Build",
    aiJustification:
      "Geospatial radar and citizen sentiment triangulation detect critical aquifer collapse across 48 interior municipalities. Modular brackish water desalination nodes mitigate agricultural abandonment and stabilize regional food supply.",
    keySignals: [
      "Aquifer replenishment deficit at 10-year low",
      "Cross-referenced with 840+ water tanker delay complaints",
      "Prevents rural-to-urban climate distress migration",
    ],
    coBenefits: [
      "Renewable wind/solar hybrid energy coupling",
      "Local community cooperative water governance",
      "Open hardware SCADA IoT monitoring",
    ],
  },
  {
    id: "proj-003",
    title: "Off-Grid Microgrid Hybridization for Rural Clinics",
    region: "Eastern Cape & Karoo Belt",
    country: "South Africa",
    priorityScore: 88,
    urgencyLevel: "high",
    estimatedCost: "$3.5M Just Energy Transition Grant",
    beneficiaries: "640K Citizens",
    timeframe: "60-Day Rollout",
    aiJustification:
      "Municipal load shedding data shows 32 rural clinics experiencing >14 hours of daily blackout, jeopardizing life-support and emergency maternity care. Containerized battery storage and rooftop PV offer instant grid autonomy.",
    keySignals: [
      "Emergency surgery cancellations up 44%",
      "High diesel generator expenditure burden",
      "Pre-mapped sun insolation index of 5.8 kWh/m²/day",
    ],
    coBenefits: [
      "100% reduction in clinic diesel emissions",
      "Excess power shared with surrounding school hubs",
      "Digital battery health telemetry to provincial Ministry",
    ],
  },
  {
    id: "proj-004",
    title: "Low-Altitude UAV Medical Supply Corridor",
    region: "Yunnan & Sichuan Highlands",
    country: "China",
    priorityScore: 84,
    urgencyLevel: "high",
    estimatedCost: "$2.9M Innovation Fund",
    beneficiaries: "480K Citizens",
    timeframe: "30-Day Pilot",
    aiJustification:
      "Landslide-prone mountain terrain repeatedly severs ground logistics for urgent serum and blood delivery. Autonomous vertical takeoff drone corridors bypass terrain risks with 15-minute emergency delivery windows.",
    keySignals: [
      "Mountain road blockages increased 31% year-on-year",
      "Zero-latency automated flight corridors tested",
      "High cross-BRICS transferability for mountainous zones",
    ],
    coBenefits: [
      "All-weather autonomous flight protocols",
      "Zero ground infrastructure requirement",
      "DPG open-standard airspace coordination layer",
    ],
  },
  {
    id: "proj-005",
    title: "Thermal Telemetry & Pipe Insulation Modernization",
    region: "Urals Industrial Belt",
    country: "Russia",
    priorityScore: 79,
    urgencyLevel: "moderate",
    estimatedCost: "$5.1M Infrastructure Bond",
    beneficiaries: "780K Citizens",
    timeframe: "75-Day Pre-Winter Overhaul",
    aiJustification:
      "Acoustic sensor telemetry and citizen feedback identify localized heat loss exceeding 35% in municipal steam conduits prior to extreme winter temperature drops.",
    keySignals: [
      "Acoustic sensor leak anomalies in 12 sectors",
      "Energy loss cost projected at $1.2M/month if unaddressed",
    ],
    coBenefits: [
      "Smart ultrasonic metering deployment",
      "District heating carbon footprint reduction",
    ],
  },
];
