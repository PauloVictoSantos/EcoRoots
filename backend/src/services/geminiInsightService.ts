import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { FullAiAnalysis } from '../utils/validators';

export interface LlmInsight {
  summary:                  string;
  recommendations:          string[];
  riskLevel:                string;
  urgencyDays:              number;
  estimatedLoss:            string;
  irrigationRecommendation: boolean;
  alert:                    string;
}

const GEMINI_MODELS = [
  'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash',
  'gemini-1.5-flash', 'gemini-1.5-pro',
];

function buildPrompt(
  sensor: { temperature: number; humidity: number; soilMoisture: number },
  ai: FullAiAnalysis,
): string {
  const allActions = [
    ...ai.actions.immediateActions,
    ...ai.actions.shortTermActions,
    ...ai.actions.preventiveActions,
  ].slice(0, 5).join('; ');

  return `Você é um assistente agrícola inteligente ajudando produtores brasileiros.

DADOS DOS SENSORES:
- Temperatura : ${sensor.temperature.toFixed(1)}°C
- Umidade     : ${sensor.humidity.toFixed(0)}%
- Solo        : ${sensor.soilMoisture.toFixed(0)}%

ANÁLISE DE VISÃO COMPUTACIONAL (Gemini Vision):
- Planta       : ${ai.plant.commonName} (${ai.plant.growthStage})
- Problema     : ${ai.problem.hasProblem ? `${ai.problem.problemType} — ${ai.problem.name || 'desconhecido'}` : 'Nenhum'}
- Severidade   : ${ai.severity.severity} (score ${ai.severity.severityScore}/100)
- Urgência     : ${ai.severity.urgencyDays} dias
- Saúde        : ${ai.health.healthScore}/100 — ${ai.health.healthStatus}
- Alerta       : ${ai.health.alertType}
- Perda estim. : ${ai.financial.estimatedLossMin}–${ai.financial.estimatedLossMax}%
- Irrigação    : ${ai.irrigation.advice}
- Tendência    : ${ai.trend.willWorsen ? 'Vai piorar' : 'Estável'} · spread ${ai.trend.spreadRisk}
- Ações IA     : ${allActions}
- Resumo IA    : ${ai.oneLiner}

Gere um JSON APENAS (sem markdown):
{
  "summary": "2-3 frases simples para o produtor, integrando dados de sensores e visão",
  "recommendations": ["ação 1", "ação 2", "ação 3"],
  "riskLevel": "low | medium | high",
  "urgencyDays": número,
  "estimatedLoss": "texto curto de perda",
  "irrigationRecommendation": true|false,
  "alert": "none | pest_detected | disease_detected | environmental_stress | critical | healthy"
}

Regras:
- Se temp > 35°C e planta estressada → mencionar estresse térmico
- Se umidade > 85% e doença presente → avisar que a umidade agrava
- Se solo < 30% e sem doença → irrigationRecommendation=true
- Se doença presente → irrigationRecommendation=false
- urgencyDays deve refletir a urgência real da situação
- Texto em português do Brasil
Retorne APENAS o JSON.`;
}

function extractJson(text: string): Record<string, unknown> | null {
  try { return JSON.parse(text.trim()); } catch { /* continue */ }
  const stripped = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim();
  try { return JSON.parse(stripped); } catch { /* continue */ }
  const m = text.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* continue */ } }
  return null;
}

async function callGemini(model: string, prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const r = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 1024, responseMimeType: 'application/json' },
  }, { timeout: config.gemini.timeout, headers: { 'Content-Type': 'application/json' } });
  const text = r.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  return text;
}

export class GeminiInsightService {
  async generateInsights(
    sensor: { temperature: number; humidity: number; soilMoisture: number },
    ai: FullAiAnalysis,
  ): Promise<LlmInsight> {
    const apiKey = config.gemini.apiKey;
    if (!apiKey) { logger.warn('No GEMINI_API_KEY — using fallback'); return this.fallback(ai); }

    const prompt = buildPrompt(sensor, ai);
    let lastError: Error | null = null;

    for (const model of GEMINI_MODELS) {
      try {
        logger.info('Generating insights with Gemini: %s', model);
        const raw    = await callGemini(model, prompt, apiKey);
        const parsed = extractJson(raw);
        if (!parsed) { logger.warn('Unparseable from %s', model); continue; }

        return {
          summary:                  String(parsed.summary                  || this.fallback(ai).summary),
          recommendations:          Array.isArray(parsed.recommendations)   ? parsed.recommendations as string[] : this.fallback(ai).recommendations,
          riskLevel:                String(parsed.riskLevel                || ai.riskLevel),
          urgencyDays:              typeof parsed.urgencyDays === 'number'  ? Math.round(parsed.urgencyDays) : ai.severity.urgencyDays,
          estimatedLoss:            String(parsed.estimatedLoss            || ai.financial.estimatedLossText),
          irrigationRecommendation: typeof parsed.irrigationRecommendation === 'boolean' ? parsed.irrigationRecommendation : ai.irrigation.needed,
          alert:                    String(parsed.alert                    || ai.health.alertType),
        };
      } catch (e: any) {
        const msg = String(e?.response?.data?.error?.message || e?.message || '').toLowerCase();
        lastError = e;
        if (msg.includes('404') || msg.includes('not found') || msg.includes('quota') || msg.includes('429')) continue;
        logger.error('Gemini insight error on %s: %s', model, e.message);
        break;
      }
    }

    logger.warn('Gemini insights failed (%s) — using fallback', lastError?.message);
    return this.fallback(ai);
  }

  private fallback(ai: FullAiAnalysis): LlmInsight {
    const allActions = [
      ...ai.actions.immediateActions,
      ...ai.actions.shortTermActions,
      ...ai.actions.preventiveActions,
    ].slice(0, 5);

    return {
      summary:                  ai.health.alertMessage || ai.oneLiner,
      recommendations:          allActions.length > 0 ? allActions : ['Monitorar regularmente'],
      riskLevel:                ai.riskLevel,
      urgencyDays:              ai.severity.urgencyDays,
      estimatedLoss:            ai.financial.estimatedLossText,
      irrigationRecommendation: ai.irrigation.needed,
      alert:                    ai.health.alertType,
    };
  }
}
