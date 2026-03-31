import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL || '',
  },

  pythonAi: {
    url: process.env.PYTHON_AI_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.PYTHON_AI_TIMEOUT || '60000', 10),
  },

  // ── Gemini is used for BOTH image analysis (via Python) AND insights ────────
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    timeout: parseInt(process.env.GEMINI_TIMEOUT || '45000', 10),
  },

  uploads: {
    dir: process.env.UPLOADS_DIR || './uploads',
    maxSizeMb: parseInt(process.env.UPLOAD_MAX_MB || '10', 10),
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || '*').split(','),
  },
} as const;
