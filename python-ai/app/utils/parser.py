import json
import re
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


def extract_json_from_text(text: str) -> Optional[Dict[str, Any]]:
    """
    Robustly extract JSON from Gemini response text.
    Handles markdown code blocks, extra text, and partial responses.
    """
    if not text or not text.strip():
        logger.warning("Empty response text received")
        return None

    # 1. Try direct parse first (clean response)
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # 2. Strip markdown code fences
    cleaned = re.sub(r"```(?:json)?\s*", "", text)
    cleaned = re.sub(r"```\s*$", "", cleaned).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # 3. Extract first {...} block
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # 4. Try to fix common issues (trailing commas, single quotes)
    fixed = re.sub(r",\s*([}\]])", r"\1", text)   # trailing commas
    fixed = fixed.replace("'", '"')                 # single → double quotes
    match = re.search(r"\{[\s\S]*\}", fixed)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    logger.error("Could not extract JSON from Gemini response: %s", text[:300])
    return None


def safe_get(data: Dict, key: str, default=None):
    """Get a value from dict, returning default if missing or None."""
    val = data.get(key)
    return default if val is None else val


def normalize_analysis_dict(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize field names and values coming from Gemini
    to match our Pydantic model expectations.
    """
    # Handle alternative key names Gemini might use
    key_aliases = {
        "has_pest": "hasPest",
        "pest_type": "pestType",
        "has_disease": "hasDisease",
        "disease_type": "diseaseType",
        "damage_type": "damageType",
        "leaf_condition": "leafCondition",
        "risk_level": "riskLevel",
        "urgency_days": "urgencyDays",
    }

    normalized = {}
    for k, v in raw.items():
        canonical = key_aliases.get(k, k)
        normalized[canonical] = v

    # Normalize boolean fields that might come as strings
    for bool_field in ("hasPest", "hasDisease"):
        if bool_field in normalized:
            val = normalized[bool_field]
            if isinstance(val, str):
                normalized[bool_field] = val.lower() in ("true", "yes", "1")

    # Normalize numeric confidence
    if "confidence" in normalized:
        try:
            conf = float(normalized["confidence"])
            # If expressed as percentage (e.g., 92 instead of 0.92)
            if conf > 1.0:
                conf = conf / 100.0
            normalized["confidence"] = conf
        except (TypeError, ValueError):
            normalized["confidence"] = 0.5

    return normalized
