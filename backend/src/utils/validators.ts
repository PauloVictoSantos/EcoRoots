import { z } from 'zod';

export const SensorDataSchema = z.object({
  temperature:  z.coerce.number().min(-50).max(100),
  humidity:     z.coerce.number().min(0).max(100),
  soilMoisture: z.coerce.number().min(0).max(100),
});

export const FullAiAnalysisSchema = z.object({
  plant: z.object({
    commonName:       z.string().default('Unknown plant'),
    scientificName:   z.string().nullable().default(null),
    growthStage:      z.string().default('Unknown'),
    stageNormal:      z.boolean().default(true),
    stageObservation: z.string().default(''),
  }).default({}),
  problem: z.object({
    hasProblem:     z.boolean().default(false),
    problemType:    z.string().default('none'),
    name:           z.string().nullable().default(null),
    scientificName: z.string().nullable().default(null),
    isContagious:   z.boolean().default(false),
    stage:          z.string().default(''),
    symptoms:       z.array(z.string()).default([]),
    location:       z.string().default('unknown'),
  }).default({}),
  severity: z.object({
    severity:       z.enum(['low','medium','high']).default('low'),
    severityScore:  z.number().int().min(0).max(100).default(0),
    urgency:        z.enum(['immediate','short_term','monitor']).default('monitor'),
    urgencyDays:    z.number().int().min(0).default(30),
    urgencyMessage: z.string().default('Monitor regularly'),
  }).default({}),
  financial: z.object({
    estimatedLossMin:  z.number().int().min(0).max(100).default(0),
    estimatedLossMax:  z.number().int().min(0).max(100).default(0),
    estimatedLossText: z.string().default('0% (healthy)'),
    isEmergency:       z.boolean().default(false),
  }).default({}),
  actions: z.object({
    immediateActions:  z.array(z.string()).default([]),
    shortTermActions:  z.array(z.string()).default([]),
    preventiveActions: z.array(z.string()).default([]),
    productType:       z.string().default('none'),
    specificProduct:   z.string().nullable().default(null),
  }).default({}),
  irrigation: z.object({
    needed:     z.boolean().default(true),
    excess:     z.boolean().default(false),
    soilStatus: z.string().default('normal'),
    advice:     z.string().default('Maintain regular watering schedule'),
  }).default({}),
  environment: z.object({
    temperatureStatus: z.string().default('optimal'),
    humidityStatus:    z.string().default('optimal'),
    lightStatus:       z.string().default('adequate'),
    observation:       z.string().default(''),
  }).default({}),
  trend: z.object({
    willWorsen:          z.boolean().default(false),
    willSelfRecover:     z.boolean().default(false),
    spreadRisk:          z.string().default('none'),
    monitoringFrequency: z.string().default('Weekly'),
    forecast:            z.string().default('Stable condition expected'),
  }).default({}),
  health: z.object({
    alertType:    z.string().default('healthy'),
    alertMessage: z.string().default('Plant is healthy'),
    healthScore:  z.number().int().min(0).max(100).default(100),
    healthStatus: z.string().default('healthy'),
    confidence:   z.number().min(0).max(1).default(0.8),
  }).default({}),
  smart: z.object({
    bestTimeToApply:    z.string().default('Early morning (6-8 AM)'),
    monitoringSchedule: z.string().default('Weekly visual inspection'),
    controlStrategy:    z.string().default('Preventive monitoring'),
    additionalTips:     z.array(z.string()).default([]),
  }).default({}),
  oneLiner:  z.string().default('Analysis complete'),
  riskLevel: z.enum(['low','medium','high']).default('low'),
});

export type SensorDataInput = z.infer<typeof SensorDataSchema>;
export type FullAiAnalysis  = z.infer<typeof FullAiAnalysisSchema>;
