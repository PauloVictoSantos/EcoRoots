import os
import uuid
import logging
import tempfile
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from app.models.response_model import FullAnalysisResponse, ErrorResponse
from app.services.gemini_service import GeminiService
from app.services.analysis_service import AnalysisService

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ─── Config ───────────────────────────────────────────────────────────────────
load_dotenv()

GEMINI_API_KEY      = os.getenv("GEMINI_API_KEY", "")
GEMINI_TIMEOUT      = int(os.getenv("GEMINI_TIMEOUT", "60"))
ALLOWED_EXTENSIONS  = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE_MB    = 10

if not GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY not set — add it to .env")

# ─── Services ─────────────────────────────────────────────────────────────────
gemini_service:   GeminiService   = None
analysis_service: AnalysisService = AnalysisService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    global gemini_service
    logger.info("🌱 AgroVision AI Service starting...")
    gemini_service = GeminiService(api_key=GEMINI_API_KEY, timeout=GEMINI_TIMEOUT)
    logger.info("✅ Gemini service initialized")
    yield
    logger.info("🌿 AgroVision AI Service shutting down")


# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AgroVision AI — Smart Greenhouse Analysis",
    description="Professional plant health analysis powered by Google Gemini Vision",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "agrovision-ai",
        "version": "2.0.0",
        "gemini_configured": bool(GEMINI_API_KEY),
    }


@app.post(
    "/analyze",
    response_model=FullAnalysisResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Full professional plant analysis — 15 agronomic dimensions",
)
async def analyze_plant(image: UploadFile = File(...)):
    """
    Upload a plant image and receive a complete professional agronomic report:
    - Plant identification + growth stage
    - Problem detection (pest / disease / environmental)
    - Severity score + urgency timeline
    - Financial impact (% yield loss)
    - Action plan (immediate / short-term / preventive)
    - Irrigation advice
    - Environmental assessment
    - Trend forecast + spread risk
    - Health score (0–100%)
    - Smart recommendations
    """
    suffix = Path(image.filename or "image.jpg").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{suffix}'. Use JPG, PNG or WEBP.",
        )

    contents = await image.read()
    size_mb  = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size_mb:.1f} MB). Max: {MAX_FILE_SIZE_MB} MB",
        )

    logger.info("Received: %s (%.2f MB)", image.filename, size_mb)

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(
            suffix=suffix, delete=False,
            prefix=f"agrovision_{uuid.uuid4().hex}_"
        ) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # Call Gemini Vision
        raw_dict = await gemini_service.analyze_image(tmp_path)

        if not raw_dict:
            raise HTTPException(
                status_code=500,
                detail="AI analysis failed: could not parse Gemini response",
            )

        # Build validated response
        result = analysis_service.build(raw_dict)

        logger.info(
            "✅ Complete: plant=%s health=%d%% alert=%s risk=%s",
            result.plant.commonName,
            result.health.healthScore,
            result.health.alertType,
            result.riskLevel,
        )
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Analysis pipeline error: %s", e)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        if tmp_path and Path(tmp_path).exists():
            try:
                Path(tmp_path).unlink()
            except Exception as e:
                logger.warning("Could not delete temp file: %s", e)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )
