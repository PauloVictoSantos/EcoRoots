import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { SensorDataSchema, FullAiAnalysis } from '../utils/validators';
import { PythonAiService }      from '../services/pythonAiService';
import { GeminiInsightService } from '../services/geminiInsightService';
import { DatabaseService }      from '../services/databaseService';
import { getSocketServer }      from '../sockets/socketServer';
import { logger }               from '../utils/logger';

const pythonAi      = new PythonAiService();
const geminiInsight = new GeminiInsightService();
const dbService     = new DatabaseService();

export const handleIotData = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;
  try {
    // ── 1. Validate sensor ───────────────────────────────────────────────
    const sensorParsed = SensorDataSchema.safeParse(req.body);
    if (!sensorParsed.success) {
      res.status(400).json({ error: 'Invalid sensor data', details: sensorParsed.error.issues });
      return;
    }
    const sensor = sensorParsed.data;
    logger.info('IoT received: temp=%.1f°C hum=%.1f%% soil=%.1f%%',
      sensor.temperature, sensor.humidity, sensor.soilMoisture);

    if (!file) { res.status(400).json({ error: 'Image file is required' }); return; }

    // ── 2. Python AI — full 15-dimension analysis ────────────────────────
    logger.info('Calling Python AI...');
    const aiResult: FullAiAnalysis = await pythonAi.analyzeImage(file.path);

    // ── 3. Gemini enriched insights (combines sensor + vision) ───────────
    logger.info('Generating Gemini insights...');
    const insight = await geminiInsight.generateInsights(sensor, aiResult);

    // ── 4. Persist ───────────────────────────────────────────────────────
    logger.info('Saving to database...');
    await dbService.createFullRecord(sensor, file.path, file.originalname, file.size, aiResult, insight);

    // ── 5. Socket.IO — emit COMPLETE payload to frontend ─────────────────
    const io = getSocketServer();
    if (io) {
      io.emit('greenhouse:update', {
        // Raw sensor readings
        sensor,

        // Full Python AI result (all 15 dimensions)
        aiAnalysis: aiResult,

        // Gemini-enriched insights (sensor + vision combined)
        insights: {
          summary:                 insight.summary,
          recommendations:         insight.recommendations,
          riskLevel:               insight.riskLevel,
          urgencyDays:             insight.urgencyDays,
          estimatedLoss:           insight.estimatedLoss,
          irrigationRecommendation:insight.irrigationRecommendation,
          alert:                   insight.alert,
        },

        // Convenience flat fields (for legacy consumers)
        alert:     insight.alert,
        irrigation:insight.irrigationRecommendation,

        timestamp: new Date().toISOString(),
      });
      logger.info('Socket emitted: greenhouse:update — plant="%s" alert=%s health=%d%%',
        aiResult.plant.commonName, aiResult.health.alertType, aiResult.health.healthScore);
    }

    // ── 6. Respond to ESP32 ──────────────────────────────────────────────
    res.status(200).json({
      irrigation: insight.irrigationRecommendation,
      alert:      insight.alert === 'healthy' ? 'none' : insight.alert,
      message:    buildEsp32Message(insight, aiResult),
    });

  } catch (err: any) {
    logger.error('IoT pipeline error: %s', err.message);
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    next(err);
  }
};

function buildEsp32Message(insight: any, ai: FullAiAnalysis): string {
  if (insight.alert === 'critical')         return `CRITICO: ${ai.oneLiner}`;
  if (insight.alert === 'pest_detected')    return `Praga: agir em ${insight.urgencyDays}d. ${ai.actions.specificProduct || ''}`.trim();
  if (insight.alert === 'disease_detected') return `Doenca: agir em ${insight.urgencyDays}d. ${ai.actions.specificProduct || ''}`.trim();
  if (insight.irrigationRecommendation)     return 'Planta saudavel. Irrigar agora.';
  return 'Planta saudavel. Sem acao necessaria.';
}
