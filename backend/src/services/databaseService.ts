import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { FullAiAnalysis } from '../utils/validators';
import { LlmInsight } from './geminiInsightService';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }, { emit: 'stdout', level: 'error' }],
});

export class DatabaseService {

  async createFullRecord(
    sensor:       { temperature: number; humidity: number; soilMoisture: number },
    imagePath:    string,
    originalName: string,
    sizeBytes:    number,
    ai:           FullAiAnalysis,
    insight:      LlmInsight,
  ) {
    return prisma.$transaction(async (tx) => {
      const sensorData = await tx.sensorData.create({
        data: { temperature: sensor.temperature, humidity: sensor.humidity, soilMoisture: sensor.soilMoisture },
      });

      const image = await tx.image.create({
        data: { path: imagePath, originalName, sizeBytes, sensorDataId: sensorData.id },
      });

      // Store key fields from the full analysis
      const analysis = await tx.analysis.create({
        data: {
          plant:        ai.plant.commonName,
          hasPest:      ai.problem.problemType === 'pest'    && ai.problem.hasProblem,
          pestType:     ai.problem.problemType === 'pest'    ? ai.problem.name : null,
          hasDisease:   ai.problem.problemType === 'disease' && ai.problem.hasProblem,
          diseaseType:  ai.problem.problemType === 'disease' ? ai.problem.name : null,
          damageType:   ai.problem.problemType !== 'none'    ? ai.problem.stage : 'none',
          severity:     ai.severity.severity,
          confidence:   ai.health.confidence,
          leafCondition:ai.health.healthStatus,
          riskLevel:    ai.riskLevel,
          urgencyDays:  ai.severity.urgencyDays,
          imageId:      image.id,
        },
      });

      const insightRecord = await tx.insight.create({
        data: {
          summary:                  insight.summary,
          recommendations:          insight.recommendations,
          riskLevel:                insight.riskLevel,
          urgencyDays:              insight.urgencyDays,
          estimatedLoss:            insight.estimatedLoss,
          irrigationRecommendation: insight.irrigationRecommendation,
          alert:                    insight.alert,
          analysisId:               analysis.id,
        },
      });

      return { sensorData, image, analysis, insight: insightRecord };
    });
  }

  async getLatestDashboard() {
    return prisma.sensorData.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { image: { include: { analysis: { include: { insight: true } } } } },
    });
  }

  async getHistory(limit = 50, offset = 0) {
    const [records, total] = await Promise.all([
      prisma.sensorData.findMany({
        take: limit, skip: offset,
        orderBy: { createdAt: 'desc' },
        include: { image: { include: { analysis: { include: { insight: true } } } } },
      }),
      prisma.sensorData.count(),
    ]);
    return { records, total, limit, offset };
  }

  async getSensorStats(hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return prisma.sensorData.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
      select: { temperature: true, humidity: true, soilMoisture: true, createdAt: true },
    });
  }

  async disconnect() { await prisma.$disconnect(); }
}
