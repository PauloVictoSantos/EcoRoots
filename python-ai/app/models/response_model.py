from pydantic import BaseModel, Field, validator
from typing import Optional, List
from enum import Enum


class SeverityLevel(str, Enum):
    LOW    = "low"
    MEDIUM = "medium"
    HIGH   = "high"

class UrgencyLevel(str, Enum):
    IMMEDIATE  = "immediate"
    SHORT_TERM = "short_term"
    MONITOR    = "monitor"

class RiskLevel(str, Enum):
    LOW    = "low"
    MEDIUM = "medium"
    HIGH   = "high"

class PlantHealthScore(str, Enum):
    HEALTHY  = "healthy"
    STRESSED = "stressed"
    CRITICAL = "critical"

class ProblemType(str, Enum):
    PEST          = "pest"
    DISEASE       = "disease"
    ENVIRONMENTAL = "environmental"
    NONE          = "none"

class AlertType(str, Enum):
    NONE             = "none"
    PEST_DETECTED    = "pest_detected"
    DISEASE_DETECTED = "disease_detected"
    ENVIRONMENTAL    = "environmental_stress"
    CRITICAL         = "critical"
    HEALTHY          = "healthy"

class SpreadRisk(str, Enum):
    NONE   = "none"
    LOW    = "low"
    MEDIUM = "medium"
    HIGH   = "high"

class ProblemLocation(str, Enum):
    SINGLE_LEAF      = "single_leaf"
    MULTIPLE_LEAVES  = "multiple_leaves"
    WHOLE_PLANT      = "whole_plant"
    WHOLE_AREA       = "whole_area"
    UNKNOWN          = "unknown"


class PlantIdentification(BaseModel):
    commonName:       str           = Field(default="Unknown")
    scientificName:   Optional[str] = Field(default=None)
    growthStage:      str           = Field(default="Unknown")
    stageNormal:      bool          = Field(default=True)
    stageObservation: str           = Field(default="")

    @validator("commonName", pre=True)
    def default_name(cls, v):
        return v if v and str(v).strip() else "Unknown plant"


class ProblemDetail(BaseModel):
    hasProblem:     bool            = Field(default=False)
    problemType:    ProblemType     = Field(default=ProblemType.NONE)
    name:           Optional[str]   = Field(default=None)
    scientificName: Optional[str]   = Field(default=None)
    isContagious:   bool            = Field(default=False)
    stage:          str             = Field(default="")
    symptoms:       List[str]       = Field(default_factory=list)
    location:       ProblemLocation = Field(default=ProblemLocation.UNKNOWN)

    @validator("symptoms", pre=True)
    def ensure_list(cls, v):
        if isinstance(v, list): return v
        if isinstance(v, str):  return [v] if v else []
        return []


class SeverityUrgency(BaseModel):
    severity:       SeverityLevel = Field(default=SeverityLevel.LOW)
    severityScore:  int           = Field(default=0, ge=0, le=100)
    urgency:        UrgencyLevel  = Field(default=UrgencyLevel.MONITOR)
    urgencyDays:    int           = Field(default=30, ge=0)
    urgencyMessage: str           = Field(default="Monitor regularly")

    @validator("severityScore", pre=True)
    def clamp_score(cls, v):
        try: return max(0, min(100, int(v)))
        except: return 0

    @validator("urgencyDays", pre=True)
    def clamp_days(cls, v):
        try: return max(0, int(v))
        except: return 30


class FinancialImpact(BaseModel):
    estimatedLossMin:  int  = Field(default=0, ge=0, le=100)
    estimatedLossMax:  int  = Field(default=0, ge=0, le=100)
    estimatedLossText: str  = Field(default="0% (healthy)")
    isEmergency:       bool = Field(default=False)

    @validator("estimatedLossMin", "estimatedLossMax", pre=True)
    def clamp_loss(cls, v):
        try: return max(0, min(100, int(v)))
        except: return 0


class ActionPlan(BaseModel):
    immediateActions:  List[str]    = Field(default_factory=list)
    shortTermActions:  List[str]    = Field(default_factory=list)
    preventiveActions: List[str]    = Field(default_factory=list)
    productType:       str          = Field(default="none")
    specificProduct:   Optional[str]= Field(default=None)

    @validator("immediateActions", "shortTermActions", "preventiveActions", pre=True)
    def ensure_list(cls, v):
        if isinstance(v, list): return v
        if isinstance(v, str):  return [v] if v else []
        return []


class IrrigationAdvice(BaseModel):
    needed:     bool = Field(default=True)
    excess:     bool = Field(default=False)
    soilStatus: str  = Field(default="normal")
    advice:     str  = Field(default="Maintain regular watering schedule")


class EnvironmentalConditions(BaseModel):
    temperatureStatus: str = Field(default="optimal")
    humidityStatus:    str = Field(default="optimal")
    lightStatus:       str = Field(default="adequate")
    observation:       str = Field(default="")


class TrendForecast(BaseModel):
    willWorsen:          bool       = Field(default=False)
    willSelfRecover:     bool       = Field(default=False)
    spreadRisk:          SpreadRisk = Field(default=SpreadRisk.NONE)
    monitoringFrequency: str        = Field(default="Weekly")
    forecast:            str        = Field(default="Stable condition expected")


class HealthAssessment(BaseModel):
    alertType:    AlertType       = Field(default=AlertType.HEALTHY)
    alertMessage: str             = Field(default="Plant is healthy")
    healthScore:  int             = Field(default=100, ge=0, le=100)
    healthStatus: PlantHealthScore= Field(default=PlantHealthScore.HEALTHY)
    confidence:   float           = Field(default=0.8, ge=0.0, le=1.0)

    @validator("healthScore", pre=True)
    def clamp_health(cls, v):
        try: return max(0, min(100, int(v)))
        except: return 100

    @validator("confidence", pre=True)
    def clamp_conf(cls, v):
        try:
            f = float(v)
            return max(0.0, min(1.0, f/100 if f > 1.0 else f))
        except: return 0.8


class SmartRecommendations(BaseModel):
    bestTimeToApply:    str       = Field(default="Early morning (6-8 AM)")
    monitoringSchedule: str       = Field(default="Weekly visual inspection")
    controlStrategy:    str       = Field(default="Preventive monitoring")
    additionalTips:     List[str] = Field(default_factory=list)

    @validator("additionalTips", pre=True)
    def ensure_list(cls, v):
        if isinstance(v, list): return v
        if isinstance(v, str):  return [v] if v else []
        return []


class FullAnalysisResponse(BaseModel):
    plant:       PlantIdentification    = Field(default_factory=PlantIdentification)
    problem:     ProblemDetail          = Field(default_factory=ProblemDetail)
    severity:    SeverityUrgency        = Field(default_factory=SeverityUrgency)
    financial:   FinancialImpact        = Field(default_factory=FinancialImpact)
    actions:     ActionPlan             = Field(default_factory=ActionPlan)
    irrigation:  IrrigationAdvice       = Field(default_factory=IrrigationAdvice)
    environment: EnvironmentalConditions= Field(default_factory=EnvironmentalConditions)
    trend:       TrendForecast          = Field(default_factory=TrendForecast)
    health:      HealthAssessment       = Field(default_factory=HealthAssessment)
    smart:       SmartRecommendations   = Field(default_factory=SmartRecommendations)
    oneLiner:    str                    = Field(default="Analysis complete")
    riskLevel:   RiskLevel              = Field(default=RiskLevel.LOW)


class ErrorResponse(BaseModel):
    error:  str
    detail: Optional[str] = None
