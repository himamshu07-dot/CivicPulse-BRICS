import json
import logging
import re
from typing import Any, Dict, List, Optional, Union
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

# Exact System Prompt as Specified by Policy Architecture
SYSTEM_PROMPT = (
    "You are an expert infrastructure policy advisor for a BRICS nation. "
    "Given the following localized citizen requests, generate a single, highly actionable "
    "project title (max 8 words) and a 2-sentence justification for why this project is critical. "
    "Prioritize immediate public health and economic impact."
)


def format_llm_user_prompt(requests: List[Union[str, Dict[str, Any]]]) -> str:
    """Formats the citizen requests into a structured prompt for the LLM."""
    formatted_texts: List[str] = []
    for idx, r in enumerate(requests, 1):
        if isinstance(r, dict):
            text = r.get("trans") or r.get("english_translation") or r.get("text") or str(r)
        else:
            text = str(r)
        formatted_texts.append(f"{idx}. {text}")

    prompt_body = "\n".join(formatted_texts)
    return (
        f"Localized Citizen Requests ({len(requests)} verified events):\n"
        f"{prompt_body}\n\n"
        f"Respond in JSON format with keys 'title' (string, max 8 words) and 'justification' (string, exactly 2 sentences)."
    )


def call_gemini_api(prompt_text: str) -> Optional[Dict[str, str]]:
    """
    Calls Google Gemini 2.5 Flash API if GEMINI_API_KEY is configured.
    Returns structured {title, justification} or None on error/missing key.
    """
    api_key = settings.GEMINI_API_KEY.strip()
    if not api_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{SYSTEM_PROMPT}\n\n{prompt_text}"}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }
    try:
        with httpx.Client(timeout=6.0) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        parsed = json.loads(parts[0].get("text", "{}"))
                        if "title" in parsed and "justification" in parsed:
                            return {
                                "title": str(parsed["title"])[:90],
                                "justification": str(parsed["justification"]),
                            }
    except Exception as e:
        logger.warning(f"Gemini API request failed, falling back to local NLU engine: {e}")
    return None


def generate_cluster_insight(requests: List[Union[str, Dict[str, Any]]]) -> Dict[str, str]:
    """
    Executes the LLM infrastructure policy advisor logic against clustered citizen requests.
    If GEMINI_API_KEY is set, calls Gemini 2.5 Flash API.
    Otherwise, gracefully falls back to the deterministic local offline NLU engine.
    """
    if not requests:
        return {
            "title": "Municipal Infrastructure Stabilization Initiative",
            "justification": "Localized citizen reports indicate acute municipal service interruptions requiring immediate intervention. Rapid deployment will prevent further economic downtime and restore baseline community wellbeing.",
        }

    # 1. Try Gemini 2.5 Flash if API key is provided
    if settings.GEMINI_API_KEY.strip():
        prompt = format_llm_user_prompt(requests)
        gemini_insight = call_gemini_api(prompt)
        if gemini_insight:
            return gemini_insight

    # 2. Resilient Offline Local NLU Engine Fallback


    # Extract all text contents for semantic analysis
    all_texts: List[str] = []
    for r in requests:
        if isinstance(r, dict):
            t = r.get("trans") or r.get("english_translation") or r.get("text") or ""
        else:
            t = str(r)
        all_texts.append(t.lower())

    joined = " ".join(all_texts)

    # 1. Water Access & Aquifer Crisis (e.g. New Delhi / Marathwada)
    if any(k in joined for k in ["water", "drinking", "pipeline", "tanker", "aquifer", "leak", "contaminated", "tap", "dry", "सड़क", "पानी", "नल"]):
        if any(k in joined for k in ["delhi", "yamuna", "tanker", "ganga", "piping"]):
            return {
                "title": "Rapid Potable Water Feeder Pipeline Modernization",
                "justification": "Widespread feeder pipe fractures and contaminated supply have left thousands of households without clean drinking water. Immediate deployment of pressurized distribution pipelines and emergency sensor-monitored tankers will mitigate waterborne disease outbreaks and protect public health.",
            }
        return {
            "title": "Autonomous Desalination & Solar Cistern Pipeline",
            "justification": "Critical aquifer depletion and prolonged cistern replenishment failures are threatening basic survival and agricultural livelihoods. Deploying modular solar desalination units and resilient feeder pipelines will secure potable water access and prevent rural climate displacement.",
        }

    # 2. Electricity & Grid Outages (e.g. Cape Town / Mpumalanga)
    elif any(k in joined for k in ["power", "electricity", "grid", "load shedding", "blackout", "generator", "voltage", "substation", "ugesi", "luz", "energia", "solar", "battery"]):
        if any(k in joined for k in ["cape", "township", "load shedding", "substation"]):
            return {
                "title": "Solar Microgrid Hybridization for Essential Facilities",
                "justification": "Severe daily load-shedding cycles are paralyzing community health clinics and critical refrigeration cold-chains. Installing modular rooftop solar arrays with containerized battery storage guarantees uninterrupted emergency healthcare and stabilizes local commerce.",
            }
        return {
            "title": "Smart Microgrid Deployment for Rural Substations",
            "justification": "Persistent grid transition instability and substation overload have caused prolonged blackouts across high-density neighborhoods. Deploying hybridized microgrids and automated load balancers will ensure vital public utilities remain operational during peak demand periods.",
        }

    # 3. Transport & Urban Mobility (e.g. São Paulo / Yunnan)
    elif any(k in joined for k in ["transport", "bus", "road", "bridge", "landslide", "transit", "drainage", "flood", "ônibus", "trânsito", "alagamento", "estrada", "via"]):
        if any(k in joined for k in ["são paulo", "paulista", "ônibus", "alagamento", "corredor"]):
            return {
                "title": "Dedicated Transit Corridors & Smart Drainage Retrofit",
                "justification": "Severe arterial transit congestion and chronic storm drainage backups are stalling bus rapid transit and flooding urban access ways. Upgrading permeable stormwater infrastructure and implementing dedicated transit priority corridors will eliminate transit delays and ensure commuter safety.",
            }
        return {
            "title": "Low-Altitude Medical Drone & Clearway Logistics Corridor",
            "justification": "Severe mountain landslides and arterial road damage have isolated peripheral communities from critical medical supply chains. Deploying autonomous vertical-takeoff cargo corridors and clearing transit arteries provides life-saving pharmaceutical access within minutes.",
        }

    # 4. Healthcare Clinic Shortages & Cold-Chains
    elif any(k in joined for k in ["health", "clinic", "doctor", "vaccine", "medicine", "hospital", "saúde", "médico", "अस्पताल"]):
        return {
            "title": "Deploy Mobile Solar Clinics & Cold-Chain Units",
            "justification": "Acute staffing shortages and broken cold-chains are preventing life-saving medical care and immunizations across vulnerable districts. Dispatching mobile solar-powered triage clinics will immediately bridge the primary healthcare deficit and curb preventable mortality.",
        }

    # Default general synthesis
    return {
        "title": "Targeted Public Good Infrastructure Modernization",
        "justification": "Synthesized citizen signals demonstrate localized infrastructure deficits that require prompt multi-agency capital allocation. Targeted deployment will restore public utility baselines and strengthen long-term economic resilience.",
    }
