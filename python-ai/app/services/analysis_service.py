import logging
from app.models.response_model import (
    FullAnalysisResponse, PlantIdentification, ProblemDetail,
    SeverityUrgency, FinancialImpact, ActionPlan, IrrigationAdvice,
    EnvironmentalConditions, TrendForecast, HealthAssessment,
    SmartRecommendations, AlertType, SeverityLevel, UrgencyLevel,
    RiskLevel, PlantHealthScore, SpreadRisk, ProblemType, ProblemLocation
)

logger = logging.getLogger(__name__)


def build_fallback(raw: dict) -> FullAnalysisResponse:
    """
    Build a FullAnalysisResponse from a raw Gemini dict.
    Each nested object is constructed with safe .get() so missing fields
    fall back to model defaults — never raises KeyError.
    """
    def g(d, *keys, default=None):
        """Deep-safe getter."""
        cur = d
        for k in keys:
            if not isinstance(cur, dict):
                return default
            cur = cur.get(k, default)
            if cur is None:
                return default
        return cur

    rp = raw.get("plant",       {}) or {}
    rr = raw.get("problem",     {}) or {}
    rs = raw.get("severity",    {}) or {}
    rf = raw.get("financial",   {}) or {}
    ra = raw.get("actions",     {}) or {}
    ri = raw.get("irrigation",  {}) or {}
    re = raw.get("environment", {}) or {}
    rt = raw.get("trend",       {}) or {}
    rh = raw.get("health",      {}) or {}
    rm = raw.get("smart",       {}) or {}

    # ── Enums with safe fallback ──────────────────────────────────────────────
    def safe_enum(enum_cls, value, default):
        try:    return enum_cls(value)
        except: return default

    plant = PlantIdentification(
        commonName       = g(rp, "commonName",       default="Unknown plant"),
        scientificName   = g(rp, "scientificName"),
        growthStage      = g(rp, "growthStage",      default="Unknown"),
        stageNormal      = g(rp, "stageNormal",      default=True),
        stageObservation = g(rp, "stageObservation", default=""),
    )

    problem = ProblemDetail(
        hasProblem     = g(rr, "hasProblem",   default=False),
        problemType    = safe_enum(ProblemType,     g(rr, "problemType"),  ProblemType.NONE),
        name           = g(rr, "name"),
        scientificName = g(rr, "scientificName"),
        isContagious   = g(rr, "isContagious", default=False),
        stage          = g(rr, "stage",        default=""),
        symptoms       = g(rr, "symptoms",     default=[]),
        location       = safe_enum(ProblemLocation, g(rr, "location"),     ProblemLocation.UNKNOWN),
    )

    severity = SeverityUrgency(
        severity       = safe_enum(SeverityLevel, g(rs, "severity"),      SeverityLevel.LOW),
        severityScore  = g(rs, "severityScore",  default=0),
        urgency        = safe_enum(UrgencyLevel,  g(rs, "urgency"),       UrgencyLevel.MONITOR),
        urgencyDays    = g(rs, "urgencyDays",    default=30),
        urgencyMessage = g(rs, "urgencyMessage", default="Monitor regularly"),
    )

    financial = FinancialImpact(
        estimatedLossMin  = g(rf, "estimatedLossMin",  default=0),
        estimatedLossMax  = g(rf, "estimatedLossMax",  default=0),
        estimatedLossText = g(rf, "estimatedLossText", default="0% (healthy)"),
        isEmergency       = g(rf, "isEmergency",       default=False),
    )

    actions = ActionPlan(
        immediateActions  = g(ra, "immediateActions",  default=[]),
        shortTermActions  = g(ra, "shortTermActions",  default=[]),
        preventiveActions = g(ra, "preventiveActions", default=[]),
        productType       = g(ra, "productType",       default="none"),
        specificProduct   = g(ra, "specificProduct"),
    )

    irrigation = IrrigationAdvice(
        needed     = g(ri, "needed",     default=True),
        excess     = g(ri, "excess",     default=False),
        soilStatus = g(ri, "soilStatus", default="normal"),
        advice     = g(ri, "advice",     default="Maintain regular watering schedule"),
    )

    environment = EnvironmentalConditions(
        temperatureStatus = g(re, "temperatureStatus", default="optimal"),
        humidityStatus    = g(re, "humidityStatus",    default="optimal"),
        lightStatus       = g(re, "lightStatus",       default="adequate"),
        observation       = g(re, "observation",       default=""),
    )

    trend = TrendForecast(
        willWorsen          = g(rt, "willWorsen",          default=False),
        willSelfRecover     = g(rt, "willSelfRecover",     default=False),
        spreadRisk          = safe_enum(SpreadRisk, g(rt, "spreadRisk"), SpreadRisk.NONE),
        monitoringFrequency = g(rt, "monitoringFrequency", default="Weekly"),
        forecast            = g(rt, "forecast",            default="Stable condition expected"),
    )

    health = HealthAssessment(
        alertType    = safe_enum(AlertType,        g(rh, "alertType"),    AlertType.HEALTHY),
        alertMessage = g(rh, "alertMessage",       default="Plant is healthy"),
        healthScore  = g(rh, "healthScore",        default=100),
        healthStatus = safe_enum(PlantHealthScore, g(rh, "healthStatus"), PlantHealthScore.HEALTHY),
        confidence   = g(rh, "confidence",         default=0.8),
    )

    smart = SmartRecommendations(
        bestTimeToApply    = g(rm, "bestTimeToApply",    default="Early morning (6-8 AM)"),
        monitoringSchedule = g(rm, "monitoringSchedule", default="Weekly visual inspection"),
        controlStrategy    = g(rm, "controlStrategy",    default="Preventive monitoring"),
        additionalTips     = g(rm, "additionalTips",     default=[]),
    )

    risk_level = safe_enum(RiskLevel, raw.get("riskLevel"), RiskLevel.LOW)

    logger.info(
        "Analysis built: plant=%s problem=%s severity=%s health=%d%% alert=%s",
        plant.commonName,
        problem.name or problem.problemType,
        severity.severity,
        health.healthScore,
        health.alertType,
    )

    return FullAnalysisResponse(
        plant       = plant,
        problem     = problem,
        severity    = severity,
        financial   = financial,
        actions     = actions,
        irrigation  = irrigation,
        environment = environment,
        trend       = trend,
        health      = health,
        smart       = smart,
        oneLiner    = raw.get("oneLiner", "Analysis complete"),
        riskLevel   = risk_level,
    )


class AnalysisService:
    def build(self, raw: dict) -> FullAnalysisResponse:
        return build_fallback(raw)
