import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/databaseService';
import { logger } from '../utils/logger';

const dbService = new DatabaseService();

export const getDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await dbService.getLatestDashboard();

    if (!data) {
      res.status(200).json({
        message: 'No data yet. Waiting for first ESP32 reading.',
        sensor: null,
        analysis: null,
        insights: null,
      });
      return;
    }

    const analysis = data.image?.analysis ?? null;
    const insight = analysis?.insight ?? null;

    res.status(200).json({
      sensor: {
        temperature: data.temperature,
        humidity: data.humidity,
        soilMoisture: data.soilMoisture,
        timestamp: data.createdAt,
      },
      analysis: analysis
        ? {
            plant: analysis.plant,
            hasPest: analysis.hasPest,
            pestType: analysis.pestType,
            hasDisease: analysis.hasDisease,
            diseaseType: analysis.diseaseType,
            severity: analysis.severity,
            confidence: analysis.confidence,
            leafCondition: analysis.leafCondition,
          }
        : null,
      insights: insight
        ? {
            summary: insight.summary,
            recommendations: insight.recommendations,
            riskLevel: insight.riskLevel,
            urgencyDays: insight.urgencyDays,
            estimatedLoss: insight.estimatedLoss,
            actions: {
              irrigation: insight.irrigationRecommendation,
              alert: insight.alert,
            },
          }
        : null,
    });
  } catch (error) {
    logger.error('Dashboard error: %s', error);
    next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string || '20', 10), 100);
    const offset = parseInt(req.query.offset as string || '0', 10);

    const { records, total } = await dbService.getHistory(limit, offset);

    const formatted = records.map((r) => {
      const analysis = r.image?.analysis ?? null;
      const insight = analysis?.insight ?? null;
      return {
        id: r.id,
        timestamp: r.createdAt,
        sensor: {
          temperature: r.temperature,
          humidity: r.humidity,
          soilMoisture: r.soilMoisture,
        },
        analysis: analysis
          ? {
              plant: analysis.plant,
              hasPest: analysis.hasPest,
              severity: analysis.severity,
              confidence: analysis.confidence,
            }
          : null,
        insights: insight
          ? {
              riskLevel: insight.riskLevel,
              alert: insight.alert,
              summary: insight.summary,
            }
          : null,
      };
    });

    res.status(200).json({
      data: formatted,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    });
  } catch (error) {
    logger.error('History error: %s', error);
    next(error);
  }
};

export const getSensorChart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hours = parseInt(req.query.hours as string || '24', 10);
    const stats = await dbService.getSensorStats(Math.min(hours, 168)); // max 7 days
    res.status(200).json({ data: stats, hours });
  } catch (error) {
    next(error);
  }
};
