export type UserCategory =
  | 'Student'
  | 'Working Professional'
  | 'Business Owner'
  | 'Senior Citizen'
  | 'Parent'
  | 'Other';

export type ConcernType =
  | 'SMS Scam'
  | 'Email Scam'
  | 'Phone Call Scam'
  | 'Investment Scam'
  | 'Job Scam'
  | 'Website Verification'
  | 'Banking Fraud'
  | 'UPI Fraud'
  | 'Identity Theft'
  | 'Other';

export type RiskUrgency =
  | 'Just Curious'
  | 'Suspicious Activity'
  | 'Financial Loss Already Happened';

export interface PreChatData {
  userCategory: UserCategory;
  concernType: ConcernType;
  riskUrgency: RiskUrgency;
  completed: boolean;
}

export type TrustLevel = 'Safe' | 'Suspicious' | 'High Risk';
export type BadgeType = '🟢 LOW RISK' | '🟡 USE CAUTION' | '🔴 FRAUD ALERT';

export interface FrameworkPoint {
  code: string;
  name: string;
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

export interface AnalysisResult {
  riskScore: number; // 0 - 100
  trustLevel: TrustLevel;
  badge: BadgeType;
  confidence: 'High Confidence' | 'Moderate Confidence' | 'Preliminary';
  summary: string;
  analysis: string;
  keyFindings: string[];
  warningSigns: string[];
  recommendedActions: string[];
  escalationRequired: boolean;
  escalationOptions?: {
    option1: {
      title: string;
      helpline: string;
      description: string;
    };
    option2: {
      title: string;
      email: string;
      phone: string;
    };
  };
  nextStep: string;
  frameworkPoints: FrameworkPoint[];
  insufficientInfo?: boolean;
}

export interface InvestmentData {
  companyName: string;
  claimedReturns: string;
  investmentAmount: string;
  website: string;
  contactInfo: string;
}

export interface InvestmentResult {
  riskRating: 'Safe' | 'Moderate Risk' | 'High Risk' | 'Critical / Ponzi Indicator';
  riskScore: number;
  badge: BadgeType;
  confidence: string;
  explanation: string;
  unrealisticProfit: boolean;
  guaranteedReturns: boolean;
  highPressureTactics: boolean;
  missingTransparency: boolean;
  safetyRecommendation: string[];
  nextStep: string;
}

export interface IncidentReportData {
  id?: string;
  name: string;
  scamType: ConcernType;
  date: string;
  description: string;
  estimatedLoss: string;
  userCategory?: UserCategory;
  contactEmail?: string;
  contactPhone?: string;
  evidenceNotes?: string;
  status?: 'Draft' | 'Submitted' | 'Under Review';
}

export interface SupportTicket {
  ticketId: string;
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  scamType: string;
  userCategory: string;
  summary: string;
  status: 'Open' | 'Investigating' | 'Resolved';
}

export interface SecurityChecklistItem {
  id: string;
  label: string;
  detail: string;
  checked: boolean;
  category: 'Immediate Containment' | 'Credentials & Accounts' | 'Reporting & Evidence';
}

export interface PreventionPlanStep {
  stepNumber: number;
  phase: string;
  title: string;
  instruction: string;
  urgency: 'Immediate (0-2 hrs)' | 'Day 1' | 'Ongoing Hygiene';
}

export interface EscalationMember {
  id: string;
  name: string;
  role: string;
  badge: string;
  department: string;
  contactChannel: string;
  avatarBg: string;
}

export interface EscalationTier {
  level: 2 | 3 | 4 | 5;
  title: string;
  memberCount: number;
  badge: string;
  sla: string;
  description: string;
  scope: string[];
  members: EscalationMember[];
}

export interface ActiveEscalation {
  escalationId: string;
  level: 2 | 3 | 4 | 5;
  tierTitle: string;
  memberCount: number;
  dispatchedAt: string;
  status: 'Dispatched' | 'Acknowledged' | 'Active Investigation' | 'Resolved';
  incidentRef: string;
  assignedMembers: EscalationMember[];
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  analysisResult?: AnalysisResult;
  investmentResult?: InvestmentResult;
  incidentReport?: IncidentReportData;
  supportTicket?: SupportTicket;
  activeEscalation?: ActiveEscalation;
  actionType?: 'trust_report' | 'investment_verification' | 'otp_security' | 'incident_report' | 'checklist' | 'prevention_plan' | 'escalation';
}
