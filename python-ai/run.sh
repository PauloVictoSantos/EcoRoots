#!/bin/bash
# Run the Python AI service
set -e
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Created .env — please add your GEMINI_API_KEY"
  exit 1
fi

echo "🌿 Starting AgroVision AI Service..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
