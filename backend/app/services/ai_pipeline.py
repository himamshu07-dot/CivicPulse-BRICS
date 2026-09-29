import asyncio
import re
from typing import Optional, Tuple, Union
from fastapi import UploadFile


# Language script detection heuristics
CYRILLIC_PATTERN = re.compile(r"[\u0400-\u04FF]")
DEVANAGARI_PATTERN = re.compile(r"[\u0900-\u097F]")
CHINESE_PATTERN = re.compile(r"[\u4E00-\u9FFF]")
ARABIC_PATTERN = re.compile(r"[\u0600-\u06FF]")
ETHIOPIC_PATTERN = re.compile(r"[\u1200-\u137F]")


def detect_language(text: str) -> str:
    """
    Lightweight language detection heuristic across primary BRICS scripts.
    """
    if DEVANAGARI_PATTERN.search(text):
        return "hi"  # Hindi
    elif CYRILLIC_PATTERN.search(text):
        return "ru"  # Russian
    elif CHINESE_PATTERN.search(text):
        return "zh"  # Mandarin
    elif ARABIC_PATTERN.search(text):
        return "ar"  # Arabic
    elif ETHIOPIC_PATTERN.search(text):
        return "am"  # Amharic
    elif any(
        w in text.lower()
        for w in ["água", "saúde", "hospital", "energia", "escola", "ponte", "bairro", "prefeitura"]
    ):
        return "pt"  # Portuguese
    return "en"


def classify_category(text: str) -> str:
    """
    Keyword-based classification baseline for civic infrastructure signals.
    """
    lower = text.lower()
    if any(k in lower for k in ["water", "água", "drinking", "pipe", "canal", "tanque", "aquifer", "drought", "sewage", "drainage", "नल", "पानी"]):
        return "Water & Sanitation"
    elif any(k in lower for k in ["health", "clinic", "doctor", "hospital", "vaccine", "medicine", "saúde", "médico", "डॉक्टर", "अस्पताल", "दवा"]):
        return "Healthcare"
    elif any(k in lower for k in ["power", "electricity", "grid", "light", "generator", "energia", "luz", "apagão", "बिजली", "विद्युत"]):
        return "Grid & Power"
    elif any(k in lower for k in ["road", "bridge", "landslide", "transport", "bus", "estrada", "ponte", "सड़क", "पुल"]):
        return "Transport & Logistics"
    elif any(k in lower for k in ["school", "education", "teacher", "class", "escola", "professora", "स्कूल", "शिक्षा"]):
        return "Education"
    return "unclassified"


async def process_audio_stt(
    audio_file: Union[UploadFile, bytes],
    detected_lang: Optional[str] = None,
) -> str:
    """
    Placeholder async function representing an open-weight Whisper STT model.
    In a production DPG setup, this feeds into a quantized Whisper-large-v3 instance.
    """
    # Simulate non-blocking async inference latency
    await asyncio.sleep(0.05)

    filename = getattr(audio_file, "filename", "voice_memo.wav")
    
    # Mock transcript outputs based on detected filename or standard multilingual baseline
    if "hindi" in str(filename).lower():
        return "हमारे प्राथमिक स्वास्थ्य उप-केंद्र पर दो दिनों से कोई डॉक्टर उपस्थित नहीं है और दवाओं का स्टॉक समाप्त हो गया है।"
    elif "portuguese" in str(filename).lower() or "brasil" in str(filename).lower():
        return "Houve um rompimento no cano principal de abastecimento de água e estamos sem água potável há 3 dias."
    elif "russian" in str(filename).lower():
        return "В районной поликлинике отключили отопление, просим срочно прислать аварийную бригаду теплосетей."
    
    return "Voice report received: Local drinking water pipeline has burst near the community center, requiring urgent maintenance."


async def translate_to_english(
    text: str,
    source_lang: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Placeholder async function representing an open-weight LLM (e.g. Llama 3 / Mistral)
    that translates Russian, Portuguese, Hindi, or Mandarin into a unified English baseline.

    Returns:
        Tuple[str, str]: (english_translation, resolved_language_code)
    """
    await asyncio.sleep(0.02)

    resolved_lang = source_lang or detect_language(text)

    # Deterministic mock translation maps for test cases
    if resolved_lang == "hi" or DEVANAGARI_PATTERN.search(text):
        if "डॉक्टर" in text or "स्वास्थ्य" in text:
            return (
                "No doctor has been present at our primary health sub-center for two days and medical supplies are depleted.",
                "hi",
            )
        elif "पानी" in text or "जल" in text:
            return (
                "Potable water supply pipeline burst in the village sector; clean drinking water is unavailable.",
                "hi",
            )
        return (
            f"[Translated from Hindi]: {text}",
            "hi",
        )

    elif resolved_lang == "pt" or any(w in text.lower() for w in ["água", "saúde", "energia", "rompimento"]):
        if "água" in text.lower() or "cano" in text.lower():
            return (
                "Main municipal water feeder pipe burst; neighborhood is without drinking water for over 48 hours.",
                "pt",
            )
        elif "saúde" in text.lower() or "hospital" in text.lower():
            return (
                "Urgent medical triage support needed at the community outpatient unit due to staff shortage.",
                "pt",
            )
        return (
            f"[Translated from Portuguese]: {text}",
            "pt",
        )

    elif resolved_lang == "ru" or CYRILLIC_PATTERN.search(text):
        if "отоплен" in text.lower() or "теплосет" in text.lower():
            return (
                "District heating system disconnected in community clinic; urgent emergency repair brigade requested.",
                "ru",
            )
        return (
            f"[Translated from Russian]: {text}",
            "ru",
        )

    elif resolved_lang == "zh" or CHINESE_PATTERN.search(text):
        return (
            f"[Translated from Mandarin]: Rural roadway infrastructure affected by heavy runoff; clearway crew needed.",
            "zh",
        )

    elif resolved_lang == "ar" or ARABIC_PATTERN.search(text):
        return (
            f"[Translated from Arabic]: Critical sanitation drainage overflow near local community health center.",
            "ar",
        )

    # Default fallback when input is already English or generic
    return (text, resolved_lang or "en")
