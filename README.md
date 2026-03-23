# 🌿 Smart Greenhouse System

AI-powered IoT greenhouse monitoring with real-time plant health analysis using Google Gemini Vision, Node.js, Python FastAPI, ESP32, and a live dashboard.

```
┌──────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                           │
│                                                                  │
│  ESP32-CAM ──────────► Node.js Backend ──────────► Frontend    │
│  (sensor + image)       (Express/Socket.IO)        (Dashboard)  │
│                              │                                   │
│                              ▼                                   │
│                       Python AI Service                          │
│                       (FastAPI + Gemini)                         │
│                              │                                   │
│                              ▼                                   │
│                       LLM Insights                               │
│                       (Claude/OpenAI)                            │
│                              │                                   │
│                              ▼                                   │
│                         MySQL DB                                 │
│                         (Prisma ORM)                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
greenhouse/
├── python-ai/                  # FastAPI + Gemini Vision service
│   ├── app/
│   │   ├── main.py             # FastAPI app + /analyze endpoint
│   │   ├── services/
│   │   │   ├── gemini_service.py   # Gemini Vision API calls
│   │   │   └── analysis_service.py # Data enrichment + insights
│   │   ├── models/
│   │   │   └── response_model.py   # Pydantic schemas
│   │   └── utils/
│   │       └── parser.py           # JSON extraction utilities
│   ├── requirements.txt
│   └── .env.example
│
├── node-backend/               # Express + Prisma + Socket.IO backend
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── app.ts              # Express setup
│   │   ├── config/index.ts     # Environment config
│   │   ├── controllers/
│   │   │   ├── iotController.ts      # POST /iot/data pipeline
│   │   │   └── dashboardController.ts# GET /dashboard, /history
│   │   ├── services/
│   │   │   ├── pythonAiService.ts    # Calls Python AI
│   │   │   ├── llmService.ts         # Generates insights via LLM
│   │   │   └── databaseService.ts    # Prisma operations
│   │   ├── routes/index.ts     # All Express routes
│   │   ├── sockets/socketServer.ts # Socket.IO setup
│   │   └── utils/
│   │       ├── upload.ts       # Multer configuration
│   │       ├── validators.ts   # Zod schemas
│   │       └── logger.ts       # Winston logger
│   ├── prisma/schema.prisma    # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── esp32/
│   └── greenhouse_esp32.ino    # ESP32 Arduino firmware
│
└── frontend/
    └── index.html              # Dashboard (vanilla HTML/JS)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.10+
- MySQL 8+
- Arduino IDE (for ESP32)

---

### 1. MySQL Database

```sql
CREATE DATABASE greenhouse;
CREATE USER 'ghuser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON greenhouse.* TO 'ghuser'@'localhost';
FLUSH PRIVILEGES;
```

---

### 2. Python AI Service

```bash
cd greenhouse/python-ai

# Install dependencies
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
# Get a free key at: https://aistudio.google.com/apikey

# Start the service
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Test it:**
```bash
curl -X POST http://localhost:8000/analyze \
  -F "image=@/path/to/plant.jpg"
```

---

### 3. Node.js Backend

```bash
cd greenhouse/node-backend

# Install dependencies
npm install

# Configure
cp .env.example .env
# Edit .env:
#   DATABASE_URL = your MySQL connection string
#   LLM_API_KEY  = your Anthropic or OpenAI key (optional)
#   PYTHON_AI_URL = http://localhost:8000

# Run Prisma migration
npx prisma generate
npx prisma migrate dev --name init

# Start in development mode
npm run dev

# Or build and start for production
npm run build && npm start
```

---

### 4. Frontend Dashboard

Simply open `frontend/index.html` in your browser.

Or serve it:
```bash
cd greenhouse/frontend
npx serve .
# Or: python3 -m http.server 5500
```

---

### 5. ESP32 Firmware

#### Hardware Needed
| Component | Model | Purpose |
|-----------|-------|---------|
| ESP32-CAM | AI-Thinker | Camera + WiFi |
| DHT22 | Any | Temperature + Humidity |
| Capacitive Soil Sensor | v1.2 | Soil moisture |
| FTDI Adapter | Any | Programming |

#### Wiring
| Sensor | ESP32 Pin |
|--------|-----------|
| DHT22 DATA | GPIO 13 |
| Soil Sensor OUT | GPIO 34 |
| LED Flash | GPIO 4 (built-in) |

#### Setup
1. Open `esp32/greenhouse_esp32.ino` in Arduino IDE
2. Install required libraries:
   - **DHT sensor library** by Adafruit
   - **ArduinoJson** by Benoit Blanchon
3. Configure these values at the top of the file:
   ```cpp
   const char* WIFI_SSID     = "YOUR_WIFI_SSID";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   const char* SERVER_URL    = "http://192.168.1.100:3000/iot/data";
   //                           ^ Your Node.js server IP
   ```
4. Select **AI-Thinker ESP32-CAM** as board
5. Upload (GPIO0 must be LOW/GND during upload, then remove the jumper)

#### Soil Sensor Calibration
```cpp
// In greenhouse_esp32.ino, update these constants:
#define SOIL_AIR_VALUE    3200   // ADC reading in dry air
#define SOIL_WATER_VALUE  1400   // ADC reading submerged in water

// To find your values: read the serial monitor with the sensor in air, then in water
```

---

## 📡 API Reference

### Node.js Backend (port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/iot/data` | Receive ESP32 sensor data + image |
| `GET`  | `/dashboard` | Latest sensor reading, analysis, insights |
| `GET`  | `/history?limit=20&offset=0` | Paginated historical records |
| `GET`  | `/sensor-chart?hours=24` | Time-series sensor data |
| `GET`  | `/health` | Service health check |

**POST /iot/data — Request (multipart/form-data):**
```
temperature: 25.5
humidity: 68.0
soilMoisture: 42.0
image: <file>
```

**POST /iot/data — Response (to ESP32):**
```json
{
  "irrigation": true,
  "alert": "none",
  "message": "Plant healthy. Irrigation recommended"
}
```

### Python AI Service (port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze` | Analyze plant image |
| `GET`  | `/health` | Service health check |

---

## 🔌 Socket.IO Events

Connect from frontend:
```javascript
const socket = io('http://localhost:3000');

socket.on('greenhouse:update', (payload) => {
  console.log(payload.sensor);   // { temperature, humidity, soilMoisture }
  console.log(payload.analysis); // { plant, hasPest, severity, ... }
  console.log(payload.insights); // { riskLevel, recommendations, ... }
});
```

---

## 🔐 Environment Variables

### Python AI (`python-ai/.env`)
```env
GEMINI_API_KEY=your_key_here    # https://aistudio.google.com/apikey
GEMINI_TIMEOUT=45
PORT=8000
```

### Node.js (`node-backend/.env`)
```env
DATABASE_URL="mysql://user:pass@localhost:3306/greenhouse"
PORT=3000
NODE_ENV=development

# Python AI service
PYTHON_AI_URL=http://localhost:8000

# Gemini — SAME key as python-ai/.env, used for insight generation
GEMINI_API_KEY=your_key_here
GEMINI_TIMEOUT=45000

UPLOADS_DIR=./uploads
CORS_ORIGINS=*
```

> Both services share the same `GEMINI_API_KEY`. No other LLM provider needed.

---

## 🤖 AI Pipeline — 100% Gemini

Both AI steps use **the same `GEMINI_API_KEY`** — no other LLM needed:

```
Image uploaded by ESP32
     │
     ▼
Python AI Service (port 8000)
  → Sends image to Gemini Vision
  → Returns structured plant analysis JSON
  → (pest, disease, severity, confidence, leafCondition...)
     │
     ▼
Node.js Backend
  → Receives analysis + sensor data
  → Calls Gemini REST API directly (geminiInsightService.ts)
  → Gemini combines sensor context + vision data
  → Returns enriched agricultural insights JSON
  → (summary, recommendations, riskLevel, urgencyDays...)
     │
     ▼
Final Response
  + Real-time socket emission → Frontend
  + ESP32 command response (irrigation, alert)
  + Database persistence (MySQL/Prisma)
```

---

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| Gemini returns no JSON | Run `--testar` flag; check API key |
| ESP32 camera init fails | Ensure GPIO0 is HIGH (not GND) during run |
| Soil readings unstable | Use `analogRead` averaging; use ADC1 pins only (not ADC2 when WiFi active) |
| Socket not connecting | Check CORS_ORIGINS in Node.js .env |
| Prisma migration fails | Ensure MySQL is running and DATABASE_URL is correct |
| LLM timeout | Increase LLM_TIMEOUT in .env; LLM is optional (fallback uses AI data) |
