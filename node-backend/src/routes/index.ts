import { Router } from 'express';
import { upload } from '../utils/upload';
import { handleIotData } from '../controllers/iotController';
import { getDashboard, getHistory, getSensorChart } from '../controllers/dashboardController';

const router = Router();

// ── IoT Data Ingestion ────────────────────────────────────────────────────────
/**
 * POST /iot/data
 * Called by ESP32 — sends image + sensor readings
 * Returns irrigation and alert commands for the device
 */
router.post('/iot/data', upload.single('image'), handleIotData);

// ── Dashboard ─────────────────────────────────────────────────────────────────
/**
 * GET /dashboard
 * Returns latest sensor reading, analysis, and insights
 */
router.get('/dashboard', getDashboard);

/**
 * GET /history
 * Returns paginated historical records
 * Query: ?limit=20&offset=0
 */
router.get('/history', getHistory);

/**
 * GET /sensor-chart
 * Returns time-series sensor data for charts
 * Query: ?hours=24
 */
router.get('/sensor-chart', getSensorChart);

// ── Health Check ─────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'greenhouse-backend', ts: new Date().toISOString() });
});

export default router;
