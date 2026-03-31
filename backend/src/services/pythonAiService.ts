import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { logger } from '../utils/logger';
import { FullAiAnalysis, FullAiAnalysisSchema } from '../utils/validators';

export class PythonAiService {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = config.pythonAi.url;
    this.timeout = config.pythonAi.timeout;
  }

  async analyzeImage(imagePath: string): Promise<FullAiAnalysis> {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath), {
      filename:    path.basename(imagePath),
      contentType: this.getMimeType(imagePath),
    });

    logger.info('Sending image to Python AI: %s', path.basename(imagePath));

    const response = await axios.post(`${this.baseUrl}/analyze`, form, {
      headers: { ...form.getHeaders() },
      timeout: this.timeout,
    });

    // Validate with Zod — fills any missing fields with safe defaults
    const parsed = FullAiAnalysisSchema.safeParse(response.data);
    if (!parsed.success) {
      logger.error('Python AI schema validation failed: %o', parsed.error.issues);
      // Try to use raw data with defaults rather than crashing
      const withDefaults = FullAiAnalysisSchema.parse({});
      return { ...withDefaults, ...response.data };
    }

    logger.info(
      'AI analysis received: plant="%s" alert=%s health=%d%% risk=%s',
      parsed.data.plant.commonName,
      parsed.data.health.alertType,
      parsed.data.health.healthScore,
      parsed.data.riskLevel,
    );

    return parsed.data;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const r = await axios.get(`${this.baseUrl}/health`, { timeout: 5000 });
      return r.data?.status === 'ok';
    } catch {
      return false;
    }
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    return ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' } as Record<string, string>)[ext] || 'image/jpeg';
  }
}
