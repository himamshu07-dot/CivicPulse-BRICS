export interface HotspotPoint {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  severity: "alert-critical" | "alert-warn";
  category: "Water & Sanitation" | "Healthcare" | "Grid & Power" | "Transport & Logistics" | "Digital Access";
  demandScore: number; // 0 to 100
  affectedPopulation: string;
  deficitDescription: string;
}

export const BRICS_HOTSPOTS: HotspotPoint[] = [
  // India (IN)
  {
    id: "in-01",
    name: "Marathwada Agricultural Basin",
    country: "India",
    coordinates: [75.3433, 19.8762],
    severity: "alert-critical",
    category: "Water & Sanitation",
    demandScore: 94,
    affectedPopulation: "3.2M",
    deficitDescription: "Severe groundwater aquifer depletion and rural potable water outage.",
  },
  {
    id: "in-02",
    name: "North Bihar Flood Corridor",
    country: "India",
    coordinates: [85.3131, 26.1209],
    severity: "alert-critical",
    category: "Healthcare",
    demandScore: 91,
    affectedPopulation: "4.8M",
    deficitDescription: "Post-monsoon vector-borne disease outbreak with zero cold-chain vaccine units.",
  },
  {
    id: "in-03",
    name: "Bundelkhand Solar Grid",
    country: "India",
    coordinates: [79.95, 25.4],
    severity: "alert-warn",
    category: "Grid & Power",
    demandScore: 78,
    affectedPopulation: "1.4M",
    deficitDescription: "Substation load shedding exceeding 8 hours daily during peak irrigation.",
  },

  // Brazil (BR)
  {
    id: "br-01",
    name: "Sertão Semi-Arid Zone",
    country: "Brazil",
    coordinates: [-40.5008, -9.3891],
    severity: "alert-critical",
    category: "Water & Sanitation",
    demandScore: 96,
    affectedPopulation: "2.1M",
    deficitDescription: "Cistern replenishment failure across 48 remote municipalities.",
  },
  {
    id: "br-02",
    name: "Western Amazon Fluvial Line",
    country: "Brazil",
    coordinates: [-63.9039, -8.7619],
    severity: "alert-warn",
    category: "Transport & Logistics",
    demandScore: 82,
    affectedPopulation: "850K",
    deficitDescription: "River channel drought paralyzing essential medical riverboat logistics.",
  },
  {
    id: "br-03",
    name: "Baixada Fluminense Peri-urban",
    country: "Brazil",
    coordinates: [-43.46, -22.75],
    severity: "alert-warn",
    category: "Healthcare",
    demandScore: 79,
    affectedPopulation: "1.9M",
    deficitDescription: "Primary maternal health triage bottlenecks in high-density suburbs.",
  },

  // South Africa (ZA)
  {
    id: "za-01",
    name: "Eastern Cape Rural Clinics",
    country: "South Africa",
    coordinates: [27.9535, -32.2968],
    severity: "alert-critical",
    category: "Healthcare",
    demandScore: 95,
    affectedPopulation: "1.8M",
    deficitDescription: "Chronic emergency medicine shortages and unpaved arterial ambulance delays.",
  },
  {
    id: "za-02",
    name: "Mpumalanga Coal-to-Clean Belt",
    country: "South Africa",
    coordinates: [29.2317, -25.8728],
    severity: "alert-warn",
    category: "Grid & Power",
    demandScore: 84,
    affectedPopulation: "1.2M",
    deficitDescription: "Grid transition instability and municipal load curtailment distress.",
  },

  // China (CN)
  {
    id: "cn-01",
    name: "Hexi Corridor Agricultural Oasis",
    country: "China",
    coordinates: [100.45, 38.93],
    severity: "alert-warn",
    category: "Water & Sanitation",
    demandScore: 76,
    affectedPopulation: "2.4M",
    deficitDescription: "Glacial runoff seasonal variance impacting high-efficiency drip networks.",
  },
  {
    id: "cn-02",
    name: "Yunnan Mountain Logistics Corridor",
    country: "China",
    coordinates: [102.71, 25.04],
    severity: "alert-warn",
    category: "Transport & Logistics",
    demandScore: 74,
    affectedPopulation: "1.6M",
    deficitDescription: "Monsoon landslide risks on tertiary community distribution routes.",
  },

  // Russia (RU)
  {
    id: "ru-01",
    name: "Urals Industrial Heating District",
    country: "Russia",
    coordinates: [60.6057, 56.8389],
    severity: "alert-critical",
    category: "Grid & Power",
    demandScore: 89,
    affectedPopulation: "1.1M",
    deficitDescription: "Centralized thermal grid pipe stress amidst sub-zero cold wave forecast.",
  },
  {
    id: "ru-02",
    name: "Siberian Remote Telehealth Arc",
    country: "Russia",
    coordinates: [92.8932, 56.0153],
    severity: "alert-warn",
    category: "Digital Access",
    demandScore: 77,
    affectedPopulation: "620K",
    deficitDescription: "Satellite broadband latency limiting remote diagnostic teleconsultations.",
  },

  // Egypt (EG)
  {
    id: "eg-01",
    name: "Upper Nile Delta Canal Terminus",
    country: "Egypt",
    coordinates: [31.2357, 30.0444],
    severity: "alert-critical",
    category: "Water & Sanitation",
    demandScore: 92,
    affectedPopulation: "3.7M",
    deficitDescription: "Secondary canal siltation causing acute irrigation shortages in downstream farmsteads.",
  },

  // Ethiopia (ET)
  {
    id: "et-01",
    name: "Rift Valley Highland Buffer",
    country: "Ethiopia",
    coordinates: [38.7578, 8.9806],
    severity: "alert-critical",
    category: "Healthcare",
    demandScore: 97,
    affectedPopulation: "4.1M",
    deficitDescription: "Nutritional triage and mobile clinic surge required across pastoral districts.",
  },

  // Iran (IR)
  {
    id: "ir-01",
    name: "Isfahan Zayandeh Basin",
    country: "Iran",
    coordinates: [51.666, 32.6539],
    severity: "alert-critical",
    category: "Water & Sanitation",
    demandScore: 93,
    affectedPopulation: "2.8M",
    deficitDescription: "Critical reservoir volume drops impacting agricultural water treaties.",
  },

  // UAE (AE)
  {
    id: "ae-01",
    name: "Al Dhafra Smart Microgrid",
    country: "UAE",
    coordinates: [54.3773, 24.4539],
    severity: "alert-warn",
    category: "Grid & Power",
    demandScore: 71,
    affectedPopulation: "450K",
    deficitDescription: "Peak thermal cooling demand surge during extreme heat index cycle.",
  },
];
