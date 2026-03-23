/*
 * ╔══════════════════════════════════════════════════════════╗
 * ║     SMART GREENHOUSE — ESP32 Firmware                   ║
 * ║     Sensors: DHT22 (temp/humidity) + Soil Moisture      ║
 * ║     Camera:  OV2640 (ESP32-CAM module)                  ║
 * ╠══════════════════════════════════════════════════════════╣
 * ║  Board: AI-Thinker ESP32-CAM                            ║
 * ║  Dependencies (install via Library Manager):            ║
 * ║    - DHT sensor library by Adafruit                     ║
 * ║    - Adafruit Unified Sensor                            ║
 * ║    - ArduinoJson by Benoit Blanchon                     ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * WIRING:
 *   DHT22      → GPIO 13
 *   Soil sensor → GPIO 34 (ADC1_CH6 — use ADC1 only with WiFi)
 *   LED Flash   → GPIO 4 (built-in on ESP32-CAM)
 *
 * NOTE: On ESP32-CAM, GPIO 16 is used by PSRAM.
 *       GPIO 0 must be HIGH (not GND) during normal operation.
 */

#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// ─── Wi-Fi ────────────────────────────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ─── Backend ──────────────────────────────────────────────────────────────────
const char* SERVER_URL    = "http://192.168.1.100:3000/iot/data";
// Change to your Node.js server IP on the local network

// ─── Pins ─────────────────────────────────────────────────────────────────────
#define DHTPIN        13
#define DHTTYPE       DHT22
#define SOIL_PIN      34       // Analog input — ADC1 only
#define LED_FLASH_PIN 4

// ─── Intervals ────────────────────────────────────────────────────────────────
#define SEND_INTERVAL_MS  30000   // Send every 30 seconds
#define WIFI_TIMEOUT_MS   15000

// ─── Soil calibration ────────────────────────────────────────────────────────
// Calibrate: put sensor in dry air → note ADC value (AIR_VALUE)
//            put sensor in water   → note ADC value (WATER_VALUE)
#define SOIL_AIR_VALUE    3200
#define SOIL_WATER_VALUE  1400

// ─── Camera pins (AI-Thinker ESP32-CAM) ──────────────────────────────────────
#define CAM_PIN_PWDN    32
#define CAM_PIN_RESET   -1
#define CAM_PIN_XCLK     0
#define CAM_PIN_SIOD    26
#define CAM_PIN_SIOC    27
#define CAM_PIN_D7      35
#define CAM_PIN_D6      34
#define CAM_PIN_D5      39
#define CAM_PIN_D4      36
#define CAM_PIN_D3      21
#define CAM_PIN_D2      19
#define CAM_PIN_D1      18
#define CAM_PIN_D0       5
#define CAM_PIN_VSYNC   25
#define CAM_PIN_HREF    23
#define CAM_PIN_PCLK    22

DHT dht(DHTPIN, DHTTYPE);

// ─── Globals ──────────────────────────────────────────────────────────────────
unsigned long lastSendTime = 0;
bool cameraReady = false;

// ═════════════════════════════════════════════════════════════════════════════
//  CAMERA INIT
// ═════════════════════════════════════════════════════════════════════════════
bool initCamera() {
  camera_config_t config;
  config.ledc_channel  = LEDC_CHANNEL_0;
  config.ledc_timer    = LEDC_TIMER_0;
  config.pin_d0        = CAM_PIN_D0;
  config.pin_d1        = CAM_PIN_D1;
  config.pin_d2        = CAM_PIN_D2;
  config.pin_d3        = CAM_PIN_D3;
  config.pin_d4        = CAM_PIN_D4;
  config.pin_d5        = CAM_PIN_D5;
  config.pin_d6        = CAM_PIN_D6;
  config.pin_d7        = CAM_PIN_D7;
  config.pin_xclk      = CAM_PIN_XCLK;
  config.pin_pclk      = CAM_PIN_PCLK;
  config.pin_vsync     = CAM_PIN_VSYNC;
  config.pin_href      = CAM_PIN_HREF;
  config.pin_sccb_sda  = CAM_PIN_SIOD;
  config.pin_sccb_scl  = CAM_PIN_SIOC;
  config.pin_pwdn      = CAM_PIN_PWDN;
  config.pin_reset     = CAM_PIN_RESET;
  config.xclk_freq_hz  = 20000000;
  config.pixel_format  = PIXFORMAT_JPEG;

  // Use PSRAM if available for higher resolution
  if (psramFound()) {
    config.frame_size    = FRAMESIZE_VGA;   // 640x480 — good for plant analysis
    config.jpeg_quality  = 12;
    config.fb_count      = 2;
    config.fb_location   = CAMERA_FB_IN_PSRAM;
  } else {
    config.frame_size    = FRAMESIZE_QVGA;  // 320x240 fallback
    config.jpeg_quality  = 15;
    config.fb_count      = 1;
    config.fb_location   = CAMERA_FB_IN_DRAM;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("[CAM] Init FAILED: 0x%x\n", err);
    return false;
  }

  // Adjust camera settings for plant photography
  sensor_t* s = esp_camera_sensor_get();
  s->set_brightness(s, 0);
  s->set_contrast(s, 0);
  s->set_saturation(s, 1);   // Slightly more saturated for plant colors
  s->set_whitebal(s, 1);     // Auto white balance ON
  s->set_awb_gain(s, 1);
  s->set_exposure_ctrl(s, 1);// Auto exposure ON
  s->set_gain_ctrl(s, 1);    // Auto gain ON

  Serial.println("[CAM] Initialized OK");
  return true;
}

// ═════════════════════════════════════════════════════════════════════════════
//  Wi-Fi
// ═════════════════════════════════════════════════════════════════════════════
bool connectWiFi() {
  Serial.printf("[WiFi] Connecting to %s", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - start > WIFI_TIMEOUT_MS) {
      Serial.println("\n[WiFi] TIMEOUT");
      return false;
    }
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WiFi] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
  return true;
}

// ═════════════════════════════════════════════════════════════════════════════
//  SENSORS
// ═════════════════════════════════════════════════════════════════════════════
float readTemperature() {
  float t = dht.readTemperature();
  if (isnan(t)) {
    Serial.println("[DHT] Temperature read failed!");
    return 25.0;  // Fallback value
  }
  return t;
}

float readHumidity() {
  float h = dht.readHumidity();
  if (isnan(h)) {
    Serial.println("[DHT] Humidity read failed!");
    return 60.0;  // Fallback value
  }
  return h;
}

float readSoilMoisture() {
  // Read multiple times and average for stability
  long sum = 0;
  const int samples = 5;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(SOIL_PIN);
    delay(10);
  }
  int raw = sum / samples;

  // Convert to 0-100% (invert: wet = low ADC, dry = high ADC)
  float pct = map(raw, SOIL_AIR_VALUE, SOIL_WATER_VALUE, 0, 100);
  pct = constrain(pct, 0.0, 100.0);

  Serial.printf("[SOIL] Raw ADC: %d → %.1f%%\n", raw, pct);
  return pct;
}

// ═════════════════════════════════════════════════════════════════════════════
//  CAMERA CAPTURE & SEND
// ═════════════════════════════════════════════════════════════════════════════
void sendData() {
  float temp     = readTemperature();
  float hum      = readHumidity();
  float soil     = readSoilMoisture();

  Serial.printf("[SENSORS] Temp: %.1f°C | Hum: %.1f%% | Soil: %.1f%%\n", temp, hum, soil);

  // Flash LED briefly to indicate capture
  digitalWrite(LED_FLASH_PIN, HIGH);
  delay(100);
  camera_fb_t* fb = esp_camera_fb_get();
  digitalWrite(LED_FLASH_PIN, LOW);

  if (!fb) {
    Serial.println("[CAM] Capture FAILED — sending sensor data only");
    // Still send sensor data without image (server should handle gracefully)
    sendSensorOnly(temp, hum, soil);
    return;
  }

  Serial.printf("[CAM] Captured %zu bytes (%.1f KB)\n", fb->len, fb->len / 1024.0);

  // ── Build multipart/form-data ────────────────────────────────────────────
  HTTPClient http;
  http.begin(SERVER_URL);
  http.setTimeout(30000);

  String boundary = "GreenHouseBoundary" + String(millis());
  http.addHeader("Content-Type", "multipart/form-data; boundary=" + boundary);

  // Build body manually
  String bodyStart = "";
  bodyStart += "--" + boundary + "\r\n";
  bodyStart += "Content-Disposition: form-data; name=\"temperature\"\r\n\r\n";
  bodyStart += String(temp, 2) + "\r\n";

  bodyStart += "--" + boundary + "\r\n";
  bodyStart += "Content-Disposition: form-data; name=\"humidity\"\r\n\r\n";
  bodyStart += String(hum, 2) + "\r\n";

  bodyStart += "--" + boundary + "\r\n";
  bodyStart += "Content-Disposition: form-data; name=\"soilMoisture\"\r\n\r\n";
  bodyStart += String(soil, 2) + "\r\n";

  bodyStart += "--" + boundary + "\r\n";
  bodyStart += "Content-Disposition: form-data; name=\"image\"; filename=\"plant.jpg\"\r\n";
  bodyStart += "Content-Type: image/jpeg\r\n\r\n";

  String bodyEnd = "\r\n--" + boundary + "--\r\n";

  size_t totalLen = bodyStart.length() + fb->len + bodyEnd.length();

  // Stream upload
  uint8_t* payload = (uint8_t*)malloc(totalLen);
  if (!payload) {
    Serial.println("[HTTP] malloc failed — not enough memory");
    esp_camera_fb_return(fb);
    http.end();
    return;
  }

  memcpy(payload, bodyStart.c_str(), bodyStart.length());
  memcpy(payload + bodyStart.length(), fb->buf, fb->len);
  memcpy(payload + bodyStart.length() + fb->len, bodyEnd.c_str(), bodyEnd.length());

  esp_camera_fb_return(fb);  // Return frame buffer ASAP

  Serial.printf("[HTTP] Sending %zu bytes to %s\n", totalLen, SERVER_URL);
  int httpCode = http.POST(payload, totalLen);
  free(payload);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.printf("[HTTP] Response %d: %s\n", httpCode, response.c_str());

    // Parse response and act
    handleServerResponse(response);
  } else {
    Serial.printf("[HTTP] FAILED: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

void sendSensorOnly(float temp, float hum, float soil) {
  // Fallback: send without image (server should reject gracefully)
  Serial.println("[HTTP] Skipping — no image captured");
}

// ═════════════════════════════════════════════════════════════════════════════
//  HANDLE SERVER RESPONSE
// ═════════════════════════════════════════════════════════════════════════════
void handleServerResponse(const String& json) {
  StaticJsonDocument<512> doc;
  DeserializationError err = deserializeJson(doc, json);

  if (err) {
    Serial.printf("[JSON] Parse error: %s\n", err.c_str());
    return;
  }

  bool irrigation = doc["irrigation"] | false;
  const char* alert   = doc["alert"]   | "none";
  const char* message = doc["message"] | "";

  Serial.printf("[CMD] Irrigation: %s | Alert: %s\n",
    irrigation ? "ON" : "OFF", alert);
  Serial.printf("[CMD] Message: %s\n", message);

  // ── Act on commands ──────────────────────────────────────────────────────
  if (irrigation) {
    // TODO: activate irrigation relay on your chosen GPIO
    // digitalWrite(RELAY_IRRIGATION_PIN, HIGH);
    Serial.println("[ACT] >>> IRRIGATION activated");
  }

  if (strcmp(alert, "critical") == 0) {
    // TODO: sound buzzer or turn on red LED
    Serial.println("[ACT] !!! CRITICAL ALERT — notify farmer");
  } else if (strcmp(alert, "pest_detected") == 0 ||
             strcmp(alert, "disease_detected") == 0) {
    Serial.println("[ACT] ⚠ Alert: check plants");
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SETUP
// ═════════════════════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);
  Serial.println("\n╔══════════════════════════════════╗");
  Serial.println("║  Smart Greenhouse ESP32 Starting ║");
  Serial.println("╚══════════════════════════════════╝");

  pinMode(LED_FLASH_PIN, OUTPUT);
  digitalWrite(LED_FLASH_PIN, LOW);

  dht.begin();
  delay(2000);  // DHT22 needs 2s after power-on

  cameraReady = initCamera();

  if (!connectWiFi()) {
    Serial.println("[WARN] WiFi failed — will retry in loop");
  }

  // Send first reading immediately
  if (cameraReady && WiFi.isConnected()) {
    sendData();
    lastSendTime = millis();
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  LOOP
// ═════════════════════════════════════════════════════════════════════════════
void loop() {
  // Reconnect WiFi if dropped
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Reconnecting...");
    WiFi.reconnect();
    delay(5000);
    return;
  }

  // Send data at interval
  if (millis() - lastSendTime >= SEND_INTERVAL_MS) {
    if (cameraReady) {
      sendData();
    } else {
      // Try reinit camera
      cameraReady = initCamera();
      if (cameraReady) sendData();
    }
    lastSendTime = millis();
  }

  delay(100);
}
