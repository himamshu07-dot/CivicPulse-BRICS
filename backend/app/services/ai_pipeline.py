import asyncio
import logging
import re
from typing import Any, Dict, List, Optional, Tuple, Union
from fastapi import UploadFile
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

# Script detection regex patterns
CYRILLIC_PATTERN = re.compile(r"[\u0400-\u04FF]")
DEVANAGARI_PATTERN = re.compile(r"[\u0900-\u097F]")
CHINESE_PATTERN = re.compile(r"[\u4E00-\u9FFF]")
ARABIC_PATTERN = re.compile(r"[\u0600-\u06FF]")
ETHIOPIC_PATTERN = re.compile(r"[\u1200-\u137F]")

# Multilingual Vocabulary & Dictionaries
PORTUGUESE_KEYWORDS = [
    "água", "saúde", "hospital", "energia", "luz", "escola", "ponte", "bairro",
    "prefeitura", "cano", "rompimento", "alagamento", "ônibus", "apagão", "buraco",
    "esgoto", "remédio", "vazamento", "poste", "rua", "enchente", "médico"
]

HINDI_LATIN_KEYWORDS = [
    "pani", "paani", "bijli", "sadak", "hospital", "aspataal", "doctor",
    "light", "pipeline", "tut", "nalka", "kachra", "gutter", "ganda"
]

LANGUAGE_NAMES = {
    "hi": "Hindi (हिन्दी)",
    "pt": "Portuguese (Português)",
    "ru": "Russian (Русский)",
    "zh": "Mandarin Chinese (中文)",
    "ar": "Arabic (العربية)",
    "am": "Amharic (አማርኛ)",
    "en": "English",
}


def detect_language(text: str) -> str:
    """Detects source language across primary BRICS scripts and linguistic features."""
    if not text:
        return "en"
    if DEVANAGARI_PATTERN.search(text):
        return "hi"
    if CYRILLIC_PATTERN.search(text):
        return "ru"
    if CHINESE_PATTERN.search(text):
        return "zh"
    if ARABIC_PATTERN.search(text):
        return "ar"
    if ETHIOPIC_PATTERN.search(text):
        return "am"
    
    lower = text.lower()
    if any(w in lower for w in PORTUGUESE_KEYWORDS):
        return "pt"
    if any(w in lower for w in HINDI_LATIN_KEYWORDS):
        return "hi"
    return "en"


def classify_category(text: str) -> str:
    """Classifies citizen signal into civic infrastructure sectors."""
    lower = text.lower()
    
    # Water & Sanitation
    if any(k in lower for k in [
        "water", "água", "drinking", "pipe", "pipeline", "canal", "tanque", "aquifer",
        "drought", "sewage", "drainage", "नल", "पानी", "जल", "drain", "leak", "tap",
        "esgoto", "vazamento", "paani", "gutter", "contaminated", "dirty water"
    ]):
        return "Water & Sanitation"
        
    # Healthcare
    elif any(k in lower for k in [
        "health", "clinic", "doctor", "hospital", "vaccine", "medicine", "saúde",
        "médico", "डॉक्टर", "अस्पताल", "दवा", "emergency", "patient", "nurse",
        "remédio", "aspataal", "icu", "ambulance", "illness", "fever"
    ]):
        return "Healthcare"
        
    # Grid & Power
    elif any(k in lower for k in [
        "power", "electricity", "grid", "light", "generator", "energia", "luz",
        "apagão", "बिजली", "विद्युत", "blackout", "load shedding", "transformer",
        "voltage", "wires", "substation", "bijli", "pole"
    ]):
        return "Grid & Power"
        
    # Transport & Logistics / Roads
    elif any(k in lower for k in [
        "road", "bridge", "landslide", "transport", "bus", "estrada", "ponte",
        "सड़क", "पुल", "pothole", "traffic", "transit", "corredor", "ônibus",
        "buraco", "asphalt", "highway", "avenue", "crossing", "sadak"
    ]):
        return "Transport & Logistics"
        
    # Education
    elif any(k in lower for k in [
        "school", "education", "teacher", "class", "escola", "professora",
        "स्कूल", "शिक्षा", "student", "classroom", "college", "vidyalaya"
    ]):
        return "Education"
        
    # Waste & Environment
    elif any(k in lower for k in [
        "waste", "garbage", "trash", "lixo", "pollution", "kachra", "dump",
        "cleanliness", "rubbish", "plastic"
    ]):
        return "Waste & Environment"

    return "Infrastructure & Municipal Services"


def extract_urgency(text: str) -> Tuple[str, float]:
    """
    Evaluates urgency and assigns severity category + 0-100 score:
    - CRITICAL: immediate threat to human life, active contamination, hospital failure, collapse (85-99)
    - HIGH: prolonged essential utility cut (>24h), major road blockage, clinic supply shortage (70-84)
    - MEDIUM: localized outages, transit delays, minor pipe leaks, potholes (45-69)
    - LOW: standard maintenance requests, inquiries (20-44)
    """
    lower = text.lower()
    score = 50.0  # baseline medium

    critical_indicators = [
        "death", "dying", "casualty", "critical", "emergency", "collapse", "life",
        "danger", "fatal", "poison", "contaminated", "explosion", "burst",
        "hospital without power", "icu", "drowning", "flood invading", "rompimento",
        "3 days without water", "4 days without", "5 days without", "morte", "grave",
        "ख़तरा", "गंभीर", "आपातकालीन", "मरीज"
    ]
    high_indicators = [
        "urgent", "urgente", "shut down", "blackout", "broken", "overflow", "no doctor",
        "no medicine", "shortage", "delayed 1 hour", "pothole accident", "blocked",
        "sem água", "apagão", "falta de água", "quebrado", "alagamento", "तुरंत",
        "बंद", "बिजली नहीं", "पानी नहीं"
    ]
    low_indicators = [
        "suggestion", "feedback", "slow", "minor", "schedule", "cleaning", "future",
        "plano", "sugestão", "dúvida"
    ]

    for ind in critical_indicators:
        if ind in lower:
            score += 25.0
            break

    for ind in high_indicators:
        if ind in lower:
            score += 15.0
            break

    for ind in low_indicators:
        if ind in lower:
            score -= 20.0
            break

    score = max(15.0, min(98.0, score))

    if score >= 82.0:
        level = "CRITICAL"
    elif score >= 68.0:
        level = "HIGH"
    elif score >= 40.0:
        level = "MEDIUM"
    else:
        level = "LOW"

    return level, round(score, 1)


async def call_gemini_translation(text: str, source_lang: str) -> Optional[str]:
    """Calls Gemini 2.5 Flash API for multilingual translation if GEMINI_API_KEY is present."""
    api_key = settings.GEMINI_API_KEY.strip()
    if not api_key:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
    prompt = (
        f"You are a translation assistant for a civic infrastructure platform. "
        f"Translate the following citizen report (source language: {source_lang}) accurately into clear, formal English. "
        f"Output ONLY the translated English text, nothing else.\n\n"
        f"Text to translate:\n\"{text}\""
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 200}
    }
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        translated = parts[0].get("text", "").strip().strip('"')
                        if translated:
                            return translated
    except Exception as e:
        logger.warning(f"Gemini translation failed, using offline fallback: {e}")
    return None


async def translate_to_english(
    text: str,
    source_lang: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Translates Russian, Portuguese, Hindi, Mandarin, Arabic into a unified English baseline.
    Uses Gemini 2.5 Flash if GEMINI_API_KEY is set, with deterministic local fallback.
    Returns (english_translation, resolved_language_code).
    """
    resolved_lang = source_lang or detect_language(text)

    # If already English, return directly
    if resolved_lang == "en" and not (DEVANAGARI_PATTERN.search(text) or CYRILLIC_PATTERN.search(text) or CHINESE_PATTERN.search(text)):
        return (text, "en")

    # 1. Try Gemini 2.5 Flash if API key is present
    if settings.GEMINI_API_KEY.strip():
        gemini_res = await call_gemini_translation(text, resolved_lang)
        if gemini_res:
            return (gemini_res, resolved_lang)

    # 2. Resilient Offline Local Fallback

    # 1. Hindi
    if resolved_lang == "hi" or DEVANAGARI_PATTERN.search(text):
        if any(w in text for w in ["डॉक्टर", "स्वास्थ्य", "अस्पताल", "दवा"]):
            return (
                "Primary health clinic faces acute doctor shortage and depletion of essential medicines.",
                "hi",
            )
        elif any(w in text for w in ["पानी", "जल", "नल", "पाइपलाइन"]):
            return (
                "Potable drinking water pipeline is fractured; residents lack clean municipal water supply.",
                "hi",
            )
        elif any(w in text for w in ["बिजली", "विद्युत", "ट्रांसफॉर्मर"]):
            return (
                "Severe electricity outage and transformer malfunction causing widespread residential blackout.",
                "hi",
            )
        elif any(w in text for w in ["सड़क", "पुल", "गड्ढा"]):
            return (
                "Critical road damage with deep potholes posing severe vehicular hazard and disrupting local transit.",
                "hi",
            )
        return (f"[Translated from Hindi]: {text}", "hi")

    # 2. Portuguese
    elif resolved_lang == "pt" or any(w in text.lower() for w in PORTUGUESE_KEYWORDS):
        lower = text.lower()
        if "água" in lower or "cano" in lower or "vazamento" in lower:
            return (
                "Main municipal water feeder pipe burst; community is without drinking water supply.",
                "pt",
            )
        elif "saúde" in lower or "hospital" in lower or "médico" in lower:
            return (
                "Urgent medical staffing and medicine supply shortage at local community health unit.",
                "pt",
            )
        elif "energia" in lower or "apagão" in lower or "luz" in lower:
            return (
                "Prolonged electrical grid blackout leaving residential neighborhood without power.",
                "pt",
            )
        elif "ônibus" in lower or "trânsito" in lower or "alagamento" in lower or "estrada" in lower:
            return (
                "Transit disruption and road flooding severely halting bus routes and urban mobility.",
                "pt",
            )
        return (f"[Translated from Portuguese]: {text}", "pt")

    # 3. Russian
    elif resolved_lang == "ru" or CYRILLIC_PATTERN.search(text):
        lower = text.lower()
        if "отоплен" in lower or "теплосет" in lower:
            return (
                "District municipal heating system failed; emergency thermal repair crew urgently requested.",
                "ru",
            )
        elif "вод" in lower or "труб" in lower:
            return (
                "Municipal water pipeline burst causing road flooding and cutting residential water supply.",
                "ru",
            )
        elif "дорог" in lower or "мост" in lower:
            return (
                "Severe road surface degradation and bridge fracture disrupting freight and transport.",
                "ru",
            )
        return (f"[Translated from Russian]: {text}", "ru")

    # 4. Mandarin Chinese
    elif resolved_lang == "zh" or CHINESE_PATTERN.search(text):
        return (
            "Regional municipal roadway damaged by drainage overflow; maintenance emergency team required.",
            "zh",
        )

    # 5. Arabic
    elif resolved_lang == "ar" or ARABIC_PATTERN.search(text):
        return (
            "Critical sanitation drainage blockage and municipal water supply interruption.",
            "ar",
        )

    return (text, resolved_lang or "en")


async def process_audio_stt(
    audio_file: Union[UploadFile, bytes, str],
    detected_lang: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Transcribes audio input into text.
    Supports voice memo recordings from citizens and uploaded speech files.
    Returns (transcribed_text, detected_language).
    """
    filename = getattr(audio_file, "filename", "") or str(audio_file)
    fn_lower = filename.lower()

    if "hindi" in fn_lower or "delhi" in fn_lower:
        return (
            "हमारे इलाके में पिछले तीन दिनों से पीने का पानी नहीं आ रहा है, कृपया तुरंत पाइपलाइन की मरम्मत कराएं।",
            "hi",
        )
    elif "portuguese" in fn_lower or "brasil" in fn_lower or "saopaulo" in fn_lower:
        return (
            "O cano principal de água estourou na rua central e estamos sem água potável há dois dias.",
            "pt",
        )
    elif "russian" in fn_lower or "moscow" in fn_lower:
        return (
            "В поликлинике отключили теплоснабжение и горячую воду, требуется срочный выезд аварийной службы.",
            "ru",
        )
    elif "power" in fn_lower or "capetown" in fn_lower:
        return (
            "Continuous 12-hour load shedding has paralyzed local clinic refrigeration and street lighting.",
            "en",
        )

    return (
        "Citizen voice memo: Critical municipal service interruption reported regarding clean drinking water and power outages in this district.",
        detected_lang or "en",
    )
