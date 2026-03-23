import asyncio
import logging
from pathlib import Path
from typing import Optional, Dict, Any

from google import genai
from google.genai import types
from PIL import Image

from app.utils.parser import extract_json_from_text, normalize_analysis_dict

logger = logging.getLogger(__name__)

# ─── Professional Agronomic Prompt ───────────────────────────────────────────

ANALYSIS_PROMPT = """You are a senior agronomist and plant pathologist with 20 years of experience
in Brazilian agriculture (soja, milho, tomate, pimentão, alface, morango, café, mandioca, feijão).

Analyze this plant image with maximum technical precision and return ONLY a valid JSON object.
No markdown, no explanation, no text outside the JSON.

Return this EXACT structure (fill every field — never leave null unless specified as optional):

{
  "plant": {
    "commonName": "common name in Portuguese (e.g. Tomateiro, Alface, Pimentão)",
    "scientificName": "Latin name or null",
    "growthStage": "e.g. Plântula / Vegetativo / Floração / Frutificação / Senescência",
    "stageNormal": true or false,
    "stageObservation": "1 sentence about whether this stage looks normal"
  },

  "problem": {
    "hasProblem": true or false,
    "problemType": "pest" | "disease" | "environmental" | "none",
    "name": "specific name in Portuguese (e.g. Lagarta-do-cartucho, Míldio, Estresse hídrico) or null",
    "scientificName": "Latin name or null",
    "isContagious": true or false,
    "stage": "e.g. Infestação leve / Infestação moderada / Infestação severa / Inicial / Avançado",
    "symptoms": ["symptom 1 visible in image", "symptom 2", "symptom 3"],
    "location": "single_leaf" | "multiple_leaves" | "whole_plant" | "whole_area" | "unknown"
  },

  "severity": {
    "severity": "low" | "medium" | "high",
    "severityScore": 0-100,
    "urgency": "immediate" | "short_term" | "monitor",
    "urgencyDays": 0-30,
    "urgencyMessage": "e.g. Agir em até 24h / Tratar em 2-3 dias / Monitorar semanalmente"
  },

  "financial": {
    "estimatedLossMin": 0-100,
    "estimatedLossMax": 0-100,
    "estimatedLossText": "e.g. 0% (planta saudável) / 30-60% se não tratar",
    "isEmergency": true or false
  },

  "actions": {
    "immediateActions": ["action to do RIGHT NOW — be specific"],
    "shortTermActions": ["action for next 1-3 days"],
    "preventiveActions": ["ongoing prevention measure"],
    "productType": "biological" | "chemical" | "cultural" | "none",
    "specificProduct": "e.g. Dipel WP (Bacillus thuringiensis) 1g/L, aplicar foliar OR null"
  },

  "irrigation": {
    "needed": true or false,
    "excess": true or false,
    "soilStatus": "dry" | "normal" | "wet" | "waterlogged",
    "advice": "specific irrigation advice based on what you see"
  },

  "environment": {
    "temperatureStatus": "optimal" | "too_hot" | "too_cold",
    "humidityStatus": "optimal" | "too_high" | "too_low",
    "lightStatus": "adequate" | "insufficient" | "excessive",
    "observation": "1 sentence about visible environmental stress signs"
  },

  "trend": {
    "willWorsen": true or false,
    "willSelfRecover": true or false,
    "spreadRisk": "none" | "low" | "medium" | "high",
    "monitoringFrequency": "e.g. Diário / A cada 2 dias / Semanal",
    "forecast": "1-2 sentences predicting what will happen if no action is taken"
  },

  "health": {
    "alertType": "none" | "pest_detected" | "disease_detected" | "environmental_stress" | "critical" | "healthy",
    "alertMessage": "ONE clear sentence — e.g. 'Infestação de lagarta — ação imediata' or 'Planta saudável'",
    "healthScore": 0-100,
    "healthStatus": "healthy" | "stressed" | "critical",
    "confidence": 0.0-1.0
  },

  "smart": {
    "bestTimeToApply": "e.g. Manhã cedo (6-8h) para evitar evaporação e estresse térmico",
    "monitoringSchedule": "e.g. Inspecionar diariamente nas próximas 2 semanas",
    "controlStrategy": "brief strategy name e.g. MIP — Manejo Integrado de Pragas",
    "additionalTips": ["tip 1", "tip 2"]
  },

  "oneLiner": "SINGLE sentence alert — e.g. 'Míldio detectado — aplicar fungicida em 24h' or 'Tomate saudável, sem ameaças'",
  "riskLevel": "low" | "medium" | "high"
}

CRITICAL RULES:
1. severity "high"    → severityScore 70-100, urgencyDays 0-2,  urgency "immediate",   healthScore 10-40
2. severity "medium"  → severityScore 40-69,  urgencyDays 3-7,  urgency "short_term",  healthScore 41-70
3. severity "low"     → severityScore 10-39,  urgencyDays 8-21, urgency "monitor",     healthScore 71-89
4. No problem at all  → severityScore 0-9,    urgencyDays 30,   urgency "monitor",     healthScore 90-100, alertType "healthy"
5. isEmergency = true ONLY if estimatedLossMax > 50 OR urgency = "immediate"
6. If pest + disease together → severity must be "high", alertType = "critical"
7. symptoms must describe ONLY what is VISUALLY OBSERVABLE in this specific image
8. oneLiner must be in Portuguese and mention the specific problem found
9. All text in Portuguese (Brazil)
10. Return ONLY the JSON. No markdown. No explanation."""

# ─── Model Fallback List ──────────────────────────────────────────────────────

MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
]

# ─── Service ──────────────────────────────────────────────────────────────────

class GeminiService:
    def __init__(self, api_key: str, timeout: int = 60):
        self.client  = genai.Client(api_key=api_key)
        self.timeout = timeout

    async def analyze_image(self, image_path: str) -> Optional[Dict[str, Any]]:
        path = Path(image_path)
        if not path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")

        img = Image.open(image_path).convert("RGB")
        logger.info("Analyzing image: %s (%dx%d)", path.name, img.width, img.height)

        last_error = None
        for model_name in MODELS:
            try:
                logger.info("Trying model: %s", model_name)
                raw_text = await asyncio.wait_for(
                    self._call_gemini(model_name, img),
                    timeout=self.timeout,
                )
                parsed = extract_json_from_text(raw_text)
                if parsed:
                    logger.info("Analysis successful with model: %s", model_name)
                    return parsed

                logger.warning("Model %s returned unparseable response", model_name)

            except asyncio.TimeoutError:
                logger.warning("Timeout with model %s after %ds", model_name, self.timeout)
                last_error = TimeoutError(f"Gemini timeout ({self.timeout}s)")
            except Exception as e:
                msg = str(e).lower()
                if "404" in msg or "not found" in msg or "model" in msg:
                    logger.warning("Model %s not available: %s", model_name, e)
                    last_error = e
                    continue
                logger.error("Unexpected error with model %s: %s", model_name, e)
                raise

        raise RuntimeError(f"All Gemini models failed. Last error: {last_error}")

    async def _call_gemini(self, model_name: str, img: Image.Image) -> str:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._sync_call, model_name, img)

    def _sync_call(self, model_name: str, img: Image.Image) -> str:
        response = self.client.models.generate_content(
            model=model_name,
            contents=[ANALYSIS_PROMPT, img],
            config=types.GenerateContentConfig(
                max_output_tokens=2500,
                temperature=0.1,
            ),
        )
        return response.text
