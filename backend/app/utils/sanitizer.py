import re
from typing import Any, Dict, List, Union


# Phone Regex (International E.164, local digits with country codes)
PHONE_REGEX = re.compile(
    r"(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}\b",
    re.IGNORECASE,
)

# Email Regex
EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b",
    re.IGNORECASE,
)

# Common National IDs (Aadhaar 12-digit, CPF 11-digit, Passport-like patterns)
NATIONAL_ID_REGEX = re.compile(
    r"\b(?:\d{4}\s\d{4}\s\d{4}|\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})\b"
)

# Exact street addresses, house numbers, apartment units
STREET_ADDRESS_REGEX = re.compile(
    r"\b(?:(?:Rua|Avenida|Av\.|Street|St|Road|Rd|Marg|Nagar|Colony|Sector|Block|House|Flat|Door|Plot|Apt|Building)\s+[A-Za-z0-9\s,.-]+(?:\d+)|"
    r"\d{1,5}\s+[A-Za-z0-9\.,\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Way|Rua|Marg|Nagar|Colony))\b",
    re.IGNORECASE,
)

# Self-identifying introductions / Personal Names
NAME_INTRODUCTION_REGEX = re.compile(
    r"((?:my name is|i am|this is|eu sou|meu nome é|меня зовут|mera naam|naam hai)\s+)([A-ZА-Я][a-zа-я]+(?:\s+[A-ZА-Я][a-zа-я]+){0,2})",
    re.IGNORECASE,
)


def sanitize_text(text: str) -> str:
    """
    Sanitize an individual text string by redacting PII (phone numbers, names, addresses)
    with [REDACTED], while preserving contextual infrastructure descriptions, city names, and coordinates.
    """
    if not text or not isinstance(text, str):
        return text

    sanitized = text

    # 1. Redact Emails
    sanitized = EMAIL_REGEX.sub("[REDACTED]", sanitized)

    # 2. Redact Phone Numbers
    sanitized = PHONE_REGEX.sub(
        lambda m: "[REDACTED]" if len(re.sub(r"\D", "", m.group())) >= 8 else m.group(),
        sanitized,
    )

    # 3. Redact Self-Identifying Names
    sanitized = NAME_INTRODUCTION_REGEX.sub(r"\1[REDACTED]", sanitized)

    # 4. Redact National Identification Numbers
    sanitized = NATIONAL_ID_REGEX.sub("[REDACTED]", sanitized)

    # 5. Redact Specific Street Addresses & House Numbers
    sanitized = STREET_ADDRESS_REGEX.sub("[REDACTED]", sanitized)

    return sanitized


def sanitize_payload(data: Union[Dict[str, Any], List[Any], str, Any]) -> Union[Dict[str, Any], List[Any], str, Any]:
    """
    Recursively sanitizes a JSON/dict payload or text, stripping out PII
    while keeping geolocation coordinates (latitude/longitude) and timestamps intact.
    """
    if isinstance(data, str):
        return sanitize_text(data)

    if isinstance(data, list):
        return [sanitize_payload(item) for item in data]

    if isinstance(data, dict):
        sanitized_dict: Dict[str, Any] = {}
        for key, value in data.items():
            lower_key = str(key).lower()

            # Preserve geographic coordinates and temporal telemetry untouched
            if lower_key in {
                "latitude",
                "longitude",
                "lat",
                "lon",
                "lng",
                "timestamp",
                "time",
                "created_at",
                "coordinates",
                "srid",
                "category",
                "channel",
                "original_language",
                "country",
                "country_code",
            }:
                sanitized_dict[key] = value

            # Explicit PII fields to redact directly
            elif lower_key in {
                "phone",
                "phone_number",
                "from",
                "wa_id",
                "sender_phone",
                "msisdn",
                "email",
                "user_id",
                "citizen_name",
                "caller_id",
                "sender_name",
            }:
                sanitized_dict[key] = "[REDACTED]"

            elif isinstance(value, (dict, list)):
                sanitized_dict[key] = sanitize_payload(value)

            elif isinstance(value, str):
                sanitized_dict[key] = sanitize_text(value)

            else:
                sanitized_dict[key] = value

        return sanitized_dict

    return data
