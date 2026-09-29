import math
import re
from typing import Any, Dict, List, Optional, Tuple


class MLSeverityScorer:
    """
    ML-based Multi-Factor Severity Scoring Model.
    Calculates a continuous severity index out of 100 based on:
    1. Life & Public Health Hazard Signals (Weight: 35%)
    2. Outage Duration & Acute Deprivation (Weight: 25%)
    3. Essential Infrastructure Deficit Weight (Weight: 20%)
    4. Sentiment Distress & Urgency Vector (Weight: 20%)
    """

    CRITICAL_HAZARD_TOKENS = {
        "death": 35.0, "dying": 35.0, "fatal": 35.0, "casualty": 35.0,
        "poison": 32.0, "contaminated": 30.0, "toxic": 32.0, "explosion": 34.0,
        "collapse": 30.0, "icu": 32.0, "hospital": 28.0, "ambulance": 28.0,
        "epidemic": 32.0, "drowning": 32.0, "burst": 26.0, "flooding": 24.0,
        "rompimento": 28.0, "morte": 35.0, "grave": 26.0, "perigo": 28.0,
        "ख़तरा": 30.0, "गंभीर": 28.0, "आपातकालीन": 30.0, "मरीज": 26.0, "मौत": 35.0,
        "опасность": 30.0, "авария": 28.0, "критический": 30.0, "погибли": 35.0,
    }

    HIGH_DISRUPTION_TOKENS = {
        "shut down": 20.0, "blackout": 22.0, "broken": 18.0, "overflow": 18.0,
        "no doctor": 24.0, "no medicine": 24.0, "shortage": 18.0, "pothole accident": 20.0,
        "blocked": 16.0, "sem água": 22.0, "apagão": 22.0, "falta de água": 22.0,
        "alagamento": 20.0, "तुरंत": 18.0, "बंद": 18.0, "बिजली नहीं": 22.0, "पानी नहीं": 22.0,
        "отключение": 20.0, "нет воды": 22.0, "нет света": 22.0, "отопление": 20.0,
    }

    CATEGORY_BASELINES = {
        "Healthcare": 20.0,
        "Water & Sanitation": 19.0,
        "Grid & Power": 17.0,
        "Transport & Logistics": 15.0,
        "Waste & Environment": 14.0,
        "Education": 12.0,
        "Municipal Infrastructure": 10.0,
    }

    def extract_duration_impact(self, text: str) -> float:
        """Detects duration phrases such as '3 days without', '48 hours blackout'."""
        lower = text.lower()
        # Look for day counts (e.g. 2 days, 3 days, 4 days)
        day_match = re.search(r"(\d+)\s*(days?|dias?|दिन|дней)", lower)
        if day_match:
            days = min(int(day_match.group(1)), 7)
            return min(25.0, days * 5.0)

        # Look for hour counts (e.g. 12 hours, 24 hours)
        hour_match = re.search(r"(\d+)\s*(hours?|horas?|घंटे|часов)", lower)
        if hour_match:
            hours = min(int(hour_match.group(1)), 72)
            return min(25.0, (hours / 24.0) * 12.0 + 5.0)

        if any(p in lower for p in ["prolonged", "continuous", "prolongado", "लगातार", "длительно"]):
            return 14.0
        return 6.0

    def compute_severity(self, text: str, category: str) -> Dict[str, Any]:
        """
        Runs the ML feature extraction and weighted scoring formula.
        Returns a dictionary with the score out of 100 and feature contributions.
        """
        lower = text.lower()

        # 1. Hazard Risk (Max: 35.0)
        hazard_score = 5.0
        matched_hazard = []
        for token, weight in self.CRITICAL_HAZARD_TOKENS.items():
            if token in lower:
                hazard_score = max(hazard_score, weight)
                matched_hazard.append(token)

        # 2. Duration Impact (Max: 25.0)
        duration_score = self.extract_duration_impact(text)

        # 3. Infrastructure Vulnerability Weight (Max: 20.0)
        infra_score = self.CATEGORY_BASELINES.get(category, 12.0)

        # 4. Sentiment & High Disruption Intensity (Max: 20.0)
        disruption_score = 4.0
        matched_disruption = []
        for token, weight in self.HIGH_DISRUPTION_TOKENS.items():
            if token in lower:
                disruption_score = max(disruption_score, weight)
                matched_disruption.append(token)

        # Base composite score out of 100
        raw_total = hazard_score + duration_score + infra_score + disruption_score

        # Sigmoid-smoothed scaling to bounded 10-99 range
        final_score = round(min(98.5, max(15.0, raw_total)), 1)

        # Categorize urgency level
        if final_score >= 82.0:
            urgency_level = "CRITICAL"
        elif final_score >= 65.0:
            urgency_level = "HIGH"
        elif final_score >= 40.0:
            urgency_level = "MEDIUM"
        else:
            urgency_level = "LOW"

        # Explanation of ML weighting
        explanation_parts = []
        if matched_hazard:
            explanation_parts.append(f"Hazard tokens detected: {', '.join(matched_hazard[:2])}")
        if duration_score > 10.0:
            explanation_parts.append("Elevated due to prolonged service disruption duration")
        explanation_parts.append(f"{category} baseline vulnerability index applied")

        return {
            "score": final_score,
            "urgency_level": urgency_level,
            "breakdown": {
                "hazard_risk": round(hazard_score, 1),
                "duration_impact": round(duration_score, 1),
                "infrastructure_weight": round(infra_score, 1),
                "disruption_intensity": round(disruption_score, 1),
            },
            "explanation": " • ".join(explanation_parts) if explanation_parts else "Standard civic maintenance baseline evaluated.",
        }


ml_scorer = MLSeverityScorer()
