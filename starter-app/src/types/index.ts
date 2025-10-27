// User types
export interface UserProfile {
  id: string
  email: string
  createdAt: string
  updatedAt: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  emailVerified: boolean
  subscriptionStatus: 'free' | 'active' | 'past_due' | 'canceled' | 'trialing'
  subscriptionId?: string
  themePreference: 'light' | 'dark' | 'system'
  onboardingCompleted: boolean
}

// Subscription types
export interface Subscription {
  id: string
  userId: string
  stripeSubscriptionId: string
  stripeCustomerId: string
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  planId: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

// Document types for RAG
export interface Document {
  id: string
  userId: string
  title: string
  fileName: string
  fileSize: number
  fileType: string
  storagePath: string
  uploadStatus: 'uploading' | 'uploaded' | 'failed'
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  chunkCount: number
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

export interface DocumentChunk {
  id: string
  documentId: string
  chunkIndex: number
  content: string
  tokenCount: number
  pageNumber?: number
  embedding: number[]
  metadata?: Record<string, unknown>
  createdAt: string
}

// Chat types
export interface ChatSession {
  id: string
  userId: string
  documentId?: string
  title: string
  status: 'active' | 'archived' | 'deleted'
  createdAt: string
  updatedAt: string
  messageCount: number
  settings?: Record<string, unknown>
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  tokenCount?: number
  sourceChunks?: string[]
  modelUsed?: string
  processingTimeMs?: number
  createdAt: string
  metadata?: Record<string, unknown>
}

// Email types
export interface EmailSubscriber {
  id: string
  userId?: string
  email: string
  provider: 'convertkit' | 'mailerlite' | 'brevo' | 'sender'
  providerSubscriberId?: string
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained'
  subscribedAt: string
  unsubscribedAt?: string
  tags?: string[]
  customFields?: Record<string, unknown>
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Form types
export interface SignupFormData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface SigninFormData {
  email: string
  password: string
}

export interface PasswordResetFormData {
  email: string
}

export interface ProfileUpdateFormData {
  firstName?: string
  lastName?: string
  avatarUrl?: string
  themePreference?: 'light' | 'dark' | 'system'
}

// Stripe types
export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
  popular?: boolean
}

// Health check types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  checks: {
    service: string
    status: 'healthy' | 'unhealthy' | 'disabled'
    message?: string
    latency?: number
  }[]
}

// Utility types
export type Result<T, E = Error> = { success: true; value: T } | { success: false; error: E }

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

// ============================================================================
// PEPTIDE TRACKER TYPES
// ============================================================================

// Medication types
export type MedicationType = 'peptide' | 'TRT' | 'GLP-1' | 'other'
export type DoseUnits = 'mg' | 'IU' | 'mcg' | 'units' | 'mL'
export type ConcentrationUnits = 'mg/mL' | 'IU/mL' | 'mcg/mL' | 'units/mL'

export interface Medication {
  id: string
  userId: string
  name: string
  type: MedicationType
  units: DoseUnits
  notes?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// Vial types
export interface Vial {
  id: string
  medicationId: string
  concentrationValue: number // e.g., 5.0 for "5 mg/mL"
  concentrationUnits: ConcentrationUnits
  totalVolume: number // Total mL in vial
  remainingVolume: number // Remaining mL
  expirationDate?: string
  batchNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface VialWithMedication extends Vial {
  medication: Medication
}

// Protocol types
export type ScheduleType = 'every_x_days' | 'weekly' | 'custom'
export type InjectionSite =
  | 'left_glute'
  | 'right_glute'
  | 'left_delt'
  | 'right_delt'
  | 'left_thigh'
  | 'right_thigh'
  | 'abdomen_upper_left'
  | 'abdomen_upper_right'
  | 'abdomen_lower_left'
  | 'abdomen_lower_right'
  | 'left_ventrogluteal'
  | 'right_ventrogluteal'

export interface Protocol {
  id: string
  medicationId: string
  name: string
  scheduleType: ScheduleType

  // For 'every_x_days' schedule
  frequencyDays?: number

  // For 'weekly' schedule
  weeklyDays?: number[] // [0-6] where 0 is Sunday

  // For 'custom' schedule
  customSchedule?: Record<string, unknown>

  // Cycle configuration
  cycleLengthWeeks?: number
  offWeeks?: number

  // Dosing details
  doseValue: number
  doseUnits: DoseUnits

  // Timing
  startDate: string // ISO date string
  endDate?: string
  timeOfDay?: string // HH:mm:ss format

  // Site rotation
  siteRotation?: InjectionSite[]

  // Versioning
  supersedesId?: string
  version: number

  // Status
  isActive: boolean

  notes?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface ProtocolWithMedication extends Protocol {
  medication: Medication
}

// Injection types
export interface Injection {
  id: string
  protocolId: string
  vialId?: string
  dateTime: string // ISO timestamp
  doseValue: number
  doseUnits: DoseUnits
  volumeMl?: number // Actual volume injected
  site: InjectionSite
  notes?: string
  sideEffects?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface InjectionWithDetails extends Injection {
  protocol: ProtocolWithMedication
  vial?: VialWithMedication
}

// Reminder types
export type ReminderStatus = 'pending' | 'sent' | 'completed' | 'snoozed' | 'cancelled'
export type NotificationMethod = 'email' | 'push' | 'sms'

export interface Reminder {
  id: string
  protocolId: string
  injectionId?: string
  nextDueDate: string // ISO date string
  nextDueTime?: string // HH:mm:ss format
  recurrenceRule?: Record<string, unknown>
  status: ReminderStatus
  snoozedUntil?: string // ISO timestamp
  notificationSentAt?: string
  notificationMethod?: NotificationMethod
  createdAt: string
  updatedAt: string
}

export interface ReminderWithProtocol extends Reminder {
  protocol: ProtocolWithMedication
}

// Symptom types
export interface Symptom {
  id: string
  userId: string
  dateTime: string // ISO timestamp
  symptomType: string // e.g., 'fatigue', 'energy', 'mood', 'libido', etc.
  severity: number // 1-5 scale
  notes?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// Measurement types
export type MeasurementType =
  // Body composition
  | 'weight'
  | 'body_fat'
  | 'waist'
  | 'chest'
  | 'arms'
  | 'thighs'
  // Vitals
  | 'blood_pressure'
  | 'resting_heart_rate'
  // Hormones
  | 'testosterone_total'
  | 'testosterone_free'
  | 'estradiol'
  | 'shbg'
  | 'lh'
  | 'fsh'
  // Blood markers
  | 'hematocrit'
  | 'hemoglobin'
  | 'psa'
  | 'glucose'
  | 'hba1c'
  // Lipids
  | 'hdl'
  | 'ldl'
  | 'triglycerides'
  | 'total_cholesterol'
  // Liver/Kidney
  | 'alt'
  | 'ast'
  | 'creatinine'
  | 'egfr'

export type MeasurementUnit =
  | 'lbs'
  | 'kg'
  | 'in'
  | 'cm'
  | 'mmHg'
  | 'ng/dL'
  | '%'
  | 'mg/dL'
  | 'bpm'
  | 'pg/mL'
  | 'nmol/L'
  | 'mIU/mL'

export interface Measurement {
  id: string
  userId: string
  dateTime: string // ISO timestamp
  measurementType: MeasurementType
  value: number
  unit: MeasurementUnit
  secondaryValue?: number // e.g., diastolic BP
  notes?: string
  labName?: string
  testDate?: string // ISO date string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// Backup types
export type BackupType = 'manual' | 'auto'

export interface Backup {
  id: string
  userId: string
  backupType: BackupType
  description?: string
  snapshot: Record<string, unknown> // Complete user data snapshot
  sizeBytes?: number
  createdAt: string
}

export interface BackupMetadata {
  version: string
  createdAt: string
  userId: string
}

export interface BackupSnapshot {
  metadata: BackupMetadata
  medications: Medication[]
  vials: Vial[]
  protocols: Protocol[]
  injections: Injection[]
  reminders: Reminder[]
  symptoms: Symptom[]
  measurements: Measurement[]
}

// AI Context types (for future RAG integration)
export interface AIContextSummary {
  userId: string
  email: string
  activeMedicationsSummary: {
    activeMedicationsCount: number
    activeProtocolsCount: number
    activeVialsCount: number
    medications: Array<{
      name: string
      type: MedicationType
      activeSince: string
    }>
  }
  recentInjectionsSummary: {
    totalCount: number
    lastInjectionDate?: string
    recentInjections: Array<{
      medication: string
      dose: string
      site: InjectionSite
      date: string
    }>
  }
  adherenceSummary: Record<
    string,
    {
      adherencePercent: number
      totalInjections: number
    }
  >
  upcomingRemindersSummary: {
    nextDueDate?: string
    upcomingCount: number
    reminders: Array<{
      medication: string
      dueDate: string
      dueTime?: string
    }>
  }
  measurementsSummary: Record<
    string,
    {
      latestValue: number
      latestDate: string
      trend: MeasurementTrend
    }
  >
  symptomsSummary: Record<
    string,
    {
      avgSeverity: number
      recentEntries: number
    }
  >
  vialsInventorySummary: Array<{
    medication: string
    remainingVolume: number
    totalVolume: number
    percentRemaining: number
    expirationDate?: string
    estimatedDosesRemaining: number
  }>
  contextGeneratedAt: string
}

export interface MeasurementTrend {
  firstValue?: number
  lastValue?: number
  firstDate?: string
  lastDate?: string
  average?: number
  count: number
  change?: number
  changePercent?: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

// Calculator types
export interface DoseCalculation {
  doseValue: number
  doseUnits: DoseUnits
  volumeMl: number
  remainingDoses: number
  concentrationValue: number
  concentrationUnits: ConcentrationUnits
  totalVolume: number
}

export interface VialCalculatorInput {
  concentrationValue: number
  concentrationUnits: ConcentrationUnits
  totalVolume: number
  doseValue: number
  doseUnits: DoseUnits
}

// Analytics types
export interface AdherenceStats {
  protocolId: string
  medicationName: string
  scheduledCount: number
  completedCount: number
  adherencePercent: number
  lastInjectionDate?: string
  nextDueDate?: string
  streak: number // consecutive days/weeks on track
}

export interface InjectionCalendarDay {
  date: string
  injections: Array<{
    id: string
    medicationName: string
    doseValue: number
    doseUnits: DoseUnits
    site: InjectionSite
  }>
  hasReminder: boolean
  isScheduled: boolean
  isCompleted: boolean
}

// White-label configuration types
export interface WhiteLabelConfig {
  id: string
  creatorName: string
  brandingColors: {
    primary?: string
    secondary?: string
    accent?: string
  }
  logoUrl?: string
  referralCode?: string
  appSubtitle?: string
  customDomain?: string
  createdAt: string
  updatedAt: string
}

// Form data types for peptide tracker
export interface MedicationFormData {
  name: string
  type: MedicationType
  units: DoseUnits
  notes?: string
}

export interface VialFormData {
  medicationId: string
  concentrationValue: number
  concentrationUnits: ConcentrationUnits
  totalVolume: number
  expirationDate?: string
  batchNumber?: string
  notes?: string
}

export interface ProtocolFormData {
  medicationId: string
  name: string
  scheduleType: ScheduleType
  frequencyDays?: number
  weeklyDays?: number[]
  customSchedule?: Record<string, unknown>
  cycleLengthWeeks?: number
  offWeeks?: number
  doseValue: number
  doseUnits: DoseUnits
  startDate: string
  endDate?: string
  timeOfDay?: string
  siteRotation?: InjectionSite[]
  notes?: string
}

export interface InjectionFormData {
  protocolId: string
  vialId?: string
  dateTime: string
  doseValue: number
  doseUnits: DoseUnits
  volumeMl?: number
  site: InjectionSite
  notes?: string
  sideEffects?: string
}

export interface SymptomFormData {
  dateTime: string
  symptomType: string
  severity: number
  notes?: string
}

export interface MeasurementFormData {
  dateTime: string
  measurementType: MeasurementType
  value: number
  unit: MeasurementUnit
  secondaryValue?: number
  notes?: string
  labName?: string
  testDate?: string
}
