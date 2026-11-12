import {
  ActiveEscalation,
  AnalysisResult,
  BadgeType,
  EscalationMember,
  EscalationTier,
  FrameworkPoint,
  IncidentReportData,
  InvestmentData,
  InvestmentResult,
  PreChatData,
  PreventionPlanStep,
  SecurityChecklistItem,
  SupportTicket,
  TrustLevel,
} from '../types';

export function getBadge(riskScore: number): BadgeType {
  if (riskScore <= 30) return '🟢 LOW RISK';
  if (riskScore <= 60) return '🟡 USE CAUTION';
  return '🔴 FRAUD ALERT';
}

export function getTrustLevel(riskScore: number): TrustLevel {
  if (riskScore <= 30) return 'Safe';
  if (riskScore <= 60) return 'Suspicious';
  return 'High Risk';
}

export function analyzeScamText(
  rawInput: string,
  preChat?: Partial<PreChatData>
): AnalysisResult {
  const text = (rawInput || '').trim();

  // Knowledge limitation: check if text is too vague or empty
  if (text.length < 8 || text.split(/\s+/).length < 2) {
    return {
      riskScore: 20,
      trustLevel: 'Safe',
      badge: '🟢 LOW RISK',
      confidence: 'Preliminary',
      summary: 'Insufficient details provided for a comprehensive security evaluation.',
      analysis: 'I do not have enough information to make a reliable assessment. Please provide additional details such as the full message, email header, URL, or caller dialogue.',
      keyFindings: ['Incomplete message or query provided.'],
      warningSigns: [],
      recommendedActions: [
        'Provide the complete text, sender address, or URL for analysis.',
        'Never click on any unverified link in the meantime.',
        'Do not share any OTP, passwords, or personal credentials.'
      ],
      escalationRequired: false,
      nextStep: 'Please share the full content or context of the suspicious communication.',
      frameworkPoints: [],
      insufficientInfo: true,
    };
  }

  const lower = text.toLowerCase();

  // 10-Factor Scam Analysis Framework:
  // A. Urgency
  const urgencyMatches = lower.match(/(urgent|immediately|within \d+ (hour|min|day)|immediate action|act now|expires in|limited time|last chance|instant)/i);
  // B. Threat language
  const threatMatches = lower.match(/(blocked|suspended|terminate|arrest|police|legal action|court|penalt|fine|freeze|disconnected|cut off|deactivated)/i);
  // C. Personal data requests
  const personalDataMatches = lower.match(/(pan card|aadhaar|ssn|social security|id proof|date of birth|mother's maiden|passport number|national id)/i);
  // D. OTP requests
  const otpMatches = lower.match(/(otp|one[- ]time[- ]password|verification code|security pin|auth code|share the 6[- ]digit|forward the code|read back the code)/i);
  // E. Payment requests
  const paymentMatches = lower.match(/(gift card|cryptocurrency|bitcoin|usdt|wire transfer|processing fee|advance fee|security deposit|refundable fee|pay tm|send money to claim|upi pin)/i);
  // F. Unknown links
  const urlMatches = lower.match(/(http:\/\/|https:\/\/|bit\.ly|tinyurl|t\.me|wa\.me|\.xyz|\.top|\.click|\.site|\.ru|\.vip|apk|\.online|ngrok)/i);
  // G. Unusual rewards
  const rewardsMatches = lower.match(/(congratulations|you have won|lottery|cash prize|lucky draw|free gift|iphone|reward points expire|jackpot|claim ₹|claim \$)/i);
  // H. Impersonation attempts
  const impersonationMatches = lower.match(/(income tax|irs|cbi|police department|state bank|sbi|hdfc|icici|rbi|customs department|fedex|dhl|amazon customer service|netflix support|electricity board)/i);
  // I. Grammar & language inconsistencies
  const grammarMatches = lower.match(/(dear customer kindly|do the needful|urgently revert back|respected sir\/madam|plz pay|update ur kyc)/i);
  // J. Unrealistic promises
  const unrealisticMatches = lower.match(/(guaranteed (return|profit)|double your money|100% risk[- ]free|100% daily|zero risk|earn 50000 daily|guaranteed job)/i);

  let score = 5; // Base baseline
  const framework: FrameworkPoint[] = [
    {
      code: 'A',
      name: 'Urgency',
      detected: !!urgencyMatches,
      severity: urgencyMatches ? 'high' : 'low',
      details: urgencyMatches ? `Artificial time pressure detected ("${urgencyMatches[0]}"). Fraudsters use panic to prevent rational verification.` : 'No artificial time pressure detected.',
    },
    {
      code: 'B',
      name: 'Threat language',
      detected: !!threatMatches,
      severity: threatMatches ? 'high' : 'low',
      details: threatMatches ? `Coercive or punitive threats detected ("${threatMatches[0]}"). Legitimate authorities rarely issue immediate punitive threats via unauthenticated channels.` : 'No punitive threats detected.',
    },
    {
      code: 'C',
      name: 'Personal data requests',
      detected: !!personalDataMatches,
      severity: personalDataMatches ? 'critical' : 'low',
      details: personalDataMatches ? `Direct solicitation of confidential identity attributes ("${personalDataMatches[0]}").` : 'No direct solicitation of sensitive identity keys found.',
    },
    {
      code: 'D',
      name: 'OTP requests',
      detected: !!otpMatches,
      severity: otpMatches ? 'critical' : 'low',
      details: otpMatches ? `Direct request for One-Time Password / Security PIN. OTPs are private two-factor authentication tokens that legitimate employees NEVER ask you to disclose.` : 'No OTP or 2FA solicitation detected.',
    },
    {
      code: 'E',
      name: 'Payment requests',
      detected: !!paymentMatches,
      severity: paymentMatches ? 'high' : 'low',
      details: paymentMatches ? `Unconventional or pressurized payment method requested ("${paymentMatches[0]}").` : 'No abnormal payment methods requested.',
    },
    {
      code: 'F',
      name: 'Unknown links',
      detected: !!urlMatches,
      severity: urlMatches ? 'high' : 'low',
      details: urlMatches ? `Suspicious URL, URL shortener, or non-standard top-level domain detected ("${urlMatches[0]}"). High risk of credential harvesting or malware deployment.` : 'No unverified external links identified.',
    },
    {
      code: 'G',
      name: 'Unusual rewards',
      detected: !!rewardsMatches,
      severity: rewardsMatches ? 'high' : 'low',
      details: rewardsMatches ? `Baiting tactic offering unsolicited rewards, prizes, or expired points ("${rewardsMatches[0]}").` : 'No baiting or unprompted rewards found.',
    },
    {
      code: 'H',
      name: 'Impersonation attempts',
      detected: !!impersonationMatches,
      severity: impersonationMatches ? 'high' : 'low',
      details: impersonationMatches ? `Potential spoofing or impersonation of known institution ("${impersonationMatches[0]}").` : 'No recognizable institutional spoofing markers detected.',
    },
    {
      code: 'I',
      name: 'Grammar and language inconsistencies',
      detected: !!grammarMatches,
      severity: grammarMatches ? 'medium' : 'low',
      details: grammarMatches ? 'Non-standard syntax, uncharacteristic phrasing, or aggressive informal tone detected.' : 'Tone appears consistent with standard communications.',
    },
    {
      code: 'J',
      name: 'Unrealistic promises',
      detected: !!unrealisticMatches,
      severity: unrealisticMatches ? 'critical' : 'low',
      details: unrealisticMatches ? `Promises of risk-free, guaranteed, or abnormally high returns ("${unrealisticMatches[0]}"). Violates standard financial principles.` : 'No unrealistic guarantees detected.',
    },
  ];

  // Calculate score based on detections
  if (framework[0].detected) score += 15; // Urgency
  if (framework[1].detected) score += 18; // Threats
  if (framework[2].detected) score += 18; // Personal data
  if (framework[3].detected) score += 28; // OTP (Critical)
  if (framework[4].detected) score += 18; // Payment requests
  if (framework[5].detected) score += 20; // Unknown links
  if (framework[6].detected) score += 16; // Rewards
  if (framework[7].detected) score += 14; // Impersonation
  if (framework[8].detected) score += 10; // Grammar
  if (framework[9].detected) score += 22; // Unrealistic

  // Context urgency boosts
  if (preChat?.riskUrgency === 'Financial Loss Already Happened') {
    score = Math.max(score, 75);
  }

  score = Math.min(100, Math.max(0, score));

  const trustLevel = getTrustLevel(score);
  const badge = getBadge(score);

  const detectedPoints = framework.filter((f) => f.detected);
  const warningSigns = detectedPoints.map((p) => `${p.name}: ${p.details}`);

  // Build structured summary and analysis
  const summary =
    score >= 61
      ? `High-risk fraudulent communication displaying ${detectedPoints.length} hallmark scam indicators.`
      : score >= 31
      ? `Suspicious communication requiring heightened caution due to potential social engineering elements.`
      : `Communication displays low risk indicators, but standard cyber hygiene should be maintained.`;

  const analysis =
    score >= 61
      ? `Our forensic analysis identified multiple predatory social engineering patterns. The communication leverages psychological leverage (urgency, panic, or greed) to compel immediate action before you can verify its authenticity through official channels. No legitimate bank, telecom provider, government agency, or reputable enterprise will demand OTPs, immediate crypto/gift card transfers, or threaten immediate arrest/account closure via unauthenticated SMS or messaging apps.`
      : score >= 31
      ? `The communication exhibits ambiguous or mildly coercive patterns that warrant close examination. While it may simulate a legitimate update, caution is necessary until origin identity is independently corroborated.`
      : `The text does not show obvious automated scam patterns, deceptive links, or credential extortion attempts. However, always exercise care when interacting with unprompted solicitations.`;

  const keyFindings: string[] = [];
  if (framework[3].detected) keyFindings.push('Critical OTP / 2FA credential harvesting attempt.');
  if (framework[5].detected) keyFindings.push('Unverified link pointing to potential phishing or malicious payload.');
  if (framework[0].detected || framework[1].detected) keyFindings.push('Coercive psychological pressure (threats of disconnection or artificial urgency).');
  if (framework[7].detected) keyFindings.push('Suspected brand or official institution impersonation.');
  if (framework[9].detected || framework[6].detected) keyFindings.push('Unrealistic financial incentives or unverified prize claims.');
  if (keyFindings.length === 0) keyFindings.push('No critical phishing vectors flagged in current text sample.');

  const recommendedActions: string[] = [];
  if (framework[3].detected) {
    recommendedActions.push('NEVER share your OTP, password, or UPI PIN with anyone, including bank representatives.');
  }
  if (framework[5].detected) {
    recommendedActions.push('Do NOT click the link. If clicked, do not enter any login credentials, card numbers, or PINs.');
  }
  if (score >= 61) {
    recommendedActions.push('Block and report the sender number/email address inside your messaging client.');
    recommendedActions.push('Verify directly with the official entity by navigating to their official website manually, never using links in the message.');
  } else {
    recommendedActions.push('Verify the sender address against official contact records before taking any action.');
    recommendedActions.push('Keep multi-factor authentication (MFA) enabled on all personal and financial accounts.');
  }

  const escalationRequired = score >= 61 || preChat?.riskUrgency === 'Financial Loss Already Happened';

  const escalationOptions = escalationRequired
    ? {
        option1: {
          title: 'Option 1: Cyber Crime Helpline',
          helpline: '1930',
          description: 'Official National Cyber Crime Reporting Portal & Helpline (Dial 1930 immediately to freeze financial transactions).',
        },
        option2: {
          title: 'Option 2: FraudGuard Security Team',
          email: 'support@fraudguard-demo.com',
          phone: '+1-555-123-4567',
        },
      }
    : undefined;

  const nextStep =
    score >= 61
      ? 'Generate a comprehensive Fraud Incident Report or launch the OTP & Account Security containment workflow immediately.'
      : score >= 31
      ? 'Perform an Investment Verification or check domain legitimacy before engaging further.'
      : 'You can generate a personalized safety checklist for your profile to maintain ongoing defense.';

  return {
    riskScore: score,
    trustLevel,
    badge,
    confidence: text.length > 40 ? 'High Confidence' : 'Moderate Confidence',
    summary,
    analysis,
    keyFindings,
    warningSigns,
    recommendedActions,
    escalationRequired,
    escalationOptions,
    nextStep,
    frameworkPoints: framework,
  };
}

export function verifyInvestment(data: InvestmentData): InvestmentResult {
  const returns = (data.claimedReturns || '').toLowerCase();
  const company = (data.companyName || '').trim();
  const website = (data.website || '').toLowerCase();
  const contact = (data.contactInfo || '').trim();

  const unrealisticProfit =
    /([0-9]{1,3}%\s*(profit|return|gain|interest)?\s*(monthly|daily|weekly|per day|per month)?|double in|triple in|100%|200%|500%|guaranteed return|10x|5x|unrealistic|sky[- ]high)/i.test(returns) ||
    /50%|100%|200%|double|triple|guaranteed/i.test(returns);
  const guaranteedReturns = /(guaranteed|assured|risk[- ]free|fixed profit|zero risk|no loss)/i.test(returns);
  const highPressureTactics = /(limited slots|today only|instant join|hurry|exclusive club|secret algorithm)/i.test(returns + ' ' + company);
  const missingTransparency = !website || website.includes('t.me') || website.includes('wa.me') || !contact || /whatsapp|telegram/i.test(contact);

  let score = 20;
  if (unrealisticProfit) score += 35;
  if (guaranteedReturns) score += 30;
  if (highPressureTactics) score += 15;
  if (missingTransparency) score += 20;

  score = Math.min(100, score);
  const badge = getBadge(score);

  let riskRating: InvestmentResult['riskRating'] = 'Safe';
  if (score > 80) riskRating = 'Critical / Ponzi Indicator';
  else if (score > 60) riskRating = 'High Risk';
  else if (score > 35) riskRating = 'Moderate Risk';

  const explanation =
    score > 60
      ? `This investment proposal exhibits severe hallmarks of a Ponzi or advance-fee investment fraud. Legitimate regulated financial markets never guarantee fixed returns above prevailing central bank benchmark rates without risk. Solicitations directing investors to Telegram/WhatsApp groups or unregulated portals are typical vectors for capital expropriation.`
      : score > 35
      ? `While the proposal may not be an overt scam, promises of high returns without explicit regulatory registration (e.g., SEC, SEBI, FCA) represent substantial capital risk.`
      : `The investment parameters do not immediately trigger standard high-yield fraud alerts, but all investments carry market risk and should be verified via official regulatory registries.`;

  const safetyRecommendation = [
    'Verify if the entity is officially registered and licensed with statutory financial regulators (e.g. SEC, SEBI, FCA, FINRA).',
    'Never transfer funds via cryptocurrency, gift cards, or personal bank accounts/UPI IDs to individual brokers.',
    'Remember: If an investment sounds too good to be true, with zero downside risk, it is almost certainly fraudulent.',
    'Demand an audited prospectus and check whether the platform permits transparent, unfettered capital withdrawals.'
  ];

  return {
    riskRating,
    riskScore: score,
    badge,
    confidence: 'High Confidence',
    explanation,
    unrealisticProfit,
    guaranteedReturns,
    highPressureTactics,
    missingTransparency,
    safetyRecommendation,
    nextStep: 'Generate an Investment Fraud Prevention Plan or submit an Incident Report if funds were already remitted.',
  };
}

export function generateOTPSecurityGuidance(): {
  dangerExplanation: string;
  neverShareList: string[];
  immediateSteps: string[];
  checklist: SecurityChecklistItem[];
} {
  return {
    dangerExplanation:
      'One-Time Passwords (OTPs) and Security PINs are dynamic second-factor authentication secrets designed strictly for your eyes only. Sharing an OTP gives the attacker instant authorization to bypass password protection, drain bank funds, authorize credit card transactions, or take over your digital identity. Legitimate bank staff, support personnel, and security agents will NEVER ask for your OTP under any pretext.',
    neverShareList: [
      'Bank transaction OTPs / SMS verification codes',
      'UPI PINs or ATM PINs (Entering a PIN ALWAYS deducts money, never receives money)',
      'Password reset codes sent to your phone or email',
      'Card CVV (3 or 4-digit code on the back of your card)',
      'Net banking passwords or remote access software session IDs (e.g. AnyDesk, TeamViewer)'
    ],
    immediateSteps: [
      'If you already shared an OTP: Contact your bank immediately to block the affected card/account.',
      'Change your net banking passwords, email credentials, and app locks from an uncompromised device.',
      'Check recent transaction statements for unauthorized debits or pending approvals.',
      'Dial 1930 (National Cyber Crime Helpline) if monetary loss has occurred.'
    ],
    checklist: [
      {
        id: 'otp-1',
        label: 'Block Compromised Cards & Net Banking Access',
        detail: 'Log in via official banking app or call your bank hotline to freeze debit/credit cards immediately.',
        checked: false,
        category: 'Immediate Containment',
      },
      {
        id: 'otp-2',
        label: 'Change Passwords & Invalidate Existing Sessions',
        detail: 'Update your primary email, banking portal, and UPI app security credentials.',
        checked: false,
        category: 'Credentials & Accounts',
      },
      {
        id: 'otp-3',
        label: 'Enable Biometric / Authenticator App 2FA',
        detail: 'Switch from SMS-based OTP to TOTP apps (Google Authenticator) where supported to prevent SIM swapping.',
        checked: false,
        category: 'Credentials & Accounts',
      },
      {
        id: 'otp-4',
        label: 'Report to Cyber Crime Helpline (1930)',
        detail: 'Notify authorities within the golden hour to maximize chances of bank transaction freezes.',
        checked: false,
        category: 'Reporting & Evidence',
      },
    ],
  };
}

export function generateIncidentSummary(data: IncidentReportData): string {
  const timestamp = data.date || new Date().toISOString().split('T')[0];
  const reportId = data.id || `FG-INC-${Math.floor(100000 + Math.random() * 900000)}`;

  return `=====================================================
FRAUDGUARD AI - OFFICIAL INCIDENT REPORT SUMMARY
=====================================================
Report ID       : ${reportId}
Generated Date  : ${new Date().toLocaleDateString()}
Status          : ${data.status || 'Ready for Submission'}
-----------------------------------------------------
VICTIM INFORMATION
-----------------------------------------------------
Complainant Name : ${data.name || 'Anonymous Complainant'}
User Category    : ${data.userCategory || 'Individual'}
Contact Email    : ${data.contactEmail || 'N/A'}
Contact Phone    : ${data.contactPhone || 'N/A'}

-----------------------------------------------------
INCIDENT SPECIFICATIONS
-----------------------------------------------------
Scam Type        : ${data.scamType}
Incident Date    : ${timestamp}
Estimated Loss   : ${data.estimatedLoss || '$0.00 / Pending Calculation'}

-----------------------------------------------------
INCIDENT DESCRIPTION & MODUS OPERANDI
-----------------------------------------------------
${data.description || 'No detailed narrative provided.'}

${data.evidenceNotes ? `Evidence Notes:\n${data.evidenceNotes}\n` : ''}
-----------------------------------------------------
RECOMMENDED DISPATCH & ESCALATION
-----------------------------------------------------
• Option 1: National Cyber Crime Helpline (Dial 1930 / cybercrime.gov.in)
• Option 2: FraudGuard Security Team (support@fraudguard-demo.com / +1-555-123-4567)
• Local Bank Fraud Management Division

CONFIDENTIALITY NOTICE:
This summary was generated by FraudGuard AI to assist victim incident reporting. It constitutes an evidence record for financial institutions and statutory law enforcement agencies.
=====================================================`;
}

export function generateSupportTicket(data: IncidentReportData): SupportTicket {
  const ticketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
  const hasLoss = !!data.estimatedLoss && data.estimatedLoss !== '$0' && data.estimatedLoss !== '0';
  const priority = hasLoss ? 'Emergency' : 'High';

  return {
    ticketId,
    createdAt: new Date().toISOString(),
    priority,
    scamType: data.scamType,
    userCategory: data.userCategory || 'Working Professional',
    summary: `${data.scamType} incident involving ${data.name || 'user'}. Estimated financial impact: ${data.estimatedLoss || 'None specified'}.`,
    status: 'Open',
  };
}

export function generatePersonalizedChecklist(category: string, concern: string): SecurityChecklistItem[] {
  const baseItems: SecurityChecklistItem[] = [
    {
      id: 'chk-1',
      label: 'Verify Official Communication Channels',
      detail: 'Never rely on contact details sent via SMS, WhatsApp, or unsolicited emails. Always cross-check on the official organization portal.',
      checked: false,
      category: 'Immediate Containment',
    },
    {
      id: 'chk-2',
      label: 'Inspect Sender Domain & SSL Certificates',
      detail: 'Verify exact domain spellings (watch for homoglyphs like rnlcrosoft vs microsoft or fake subdomains).',
      checked: false,
      category: 'Credentials & Accounts',
    },
    {
      id: 'chk-3',
      label: 'Enforce Strong, Unique Passwords',
      detail: 'Ensure that no two critical accounts (banking, primary email, social) share identical passwords.',
      checked: false,
      category: 'Credentials & Accounts',
    },
    {
      id: 'chk-4',
      label: 'Secure UPI & Payment App Limits',
      detail: 'Set daily transaction caps in your mobile banking application to minimize exposure.',
      checked: false,
      category: 'Immediate Containment',
    },
  ];

  if (category === 'Senior Citizen') {
    baseItems.push({
      id: 'chk-senior',
      label: 'Appoint a Trusted Family Co-Pilot',
      detail: 'Before making any unprompted fund transfer or identity disclosure, review it with a designated family member.',
      checked: false,
      category: 'Immediate Containment',
    });
  }

  if (category === 'Business Owner') {
    baseItems.push({
      id: 'chk-biz',
      label: 'Dual-Approval for Outbound Wire Transfers',
      detail: 'Establish a strict secondary voice verification policy for vendor bank account modification requests (BEC defense).',
      checked: false,
      category: 'Immediate Containment',
    });
  }

  if (concern === 'UPI Fraud' || concern === 'Banking Fraud') {
    baseItems.push({
      id: 'chk-upi',
      label: 'Understand UPI Mechanics',
      detail: 'Remember: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money. Entering a PIN always withdraws funds.',
      checked: false,
      category: 'Immediate Containment',
    });
  }

  if (concern === 'Job Scam') {
    baseItems.push({
      id: 'chk-job',
      label: 'Zero Advance Fee Policy for Employment',
      detail: 'Legitimate employers never demand application fees, security deposits for laptops, or task-based deposits on Telegram.',
      checked: false,
      category: 'Immediate Containment',
    });
  }

  return baseItems;
}

export function generatePreventionPlan(category: string, concern: string): PreventionPlanStep[] {
  return [
    {
      stepNumber: 1,
      phase: 'Containment',
      title: 'Halt Suspicious Interactions Immediately',
      instruction: 'Do not respond, click further links, or negotiate with the suspected scammer. Document screenshots with timestamps.',
      urgency: 'Immediate (0-2 hrs)',
    },
    {
      stepNumber: 2,
      phase: 'Containment',
      title: 'Isolate & Lock Targeted Financial Accounts',
      instruction: 'Contact your bank hotline or use the mobile app to disable net banking transactions, debit cards, and international payment toggles.',
      urgency: 'Immediate (0-2 hrs)',
    },
    {
      stepNumber: 3,
      phase: 'Remediation',
      title: 'Credential Overhaul & Session Revocation',
      instruction: 'Reset master email and financial portal credentials. Log out of all active sessions from your account security dashboard.',
      urgency: 'Day 1',
    },
    {
      stepNumber: 4,
      phase: 'Reporting',
      title: 'Formal Crime Reporting & Support Escalation',
      instruction: 'Submit the generated Incident Report to the Cyber Crime Helpline (1930) and FraudGuard Security Team (support@fraudguard-demo.com).',
      urgency: 'Day 1',
    },
    {
      stepNumber: 5,
      phase: 'Hardening',
      title: 'Permanent Defensive Hygiene Routine',
      instruction: `Implement tailored protections for ${category} facing ${concern}: Enable SIM lock with your telecom provider, activate app biometric locks, and set transaction alerts.`,
      urgency: 'Ongoing Hygiene',
    },
  ];
}

// Multi-Tier Escalation Levels (Levels 2 to 5 with 2 to 5 Member Teams)
export const POOL_MEMBERS: Record<string, EscalationMember> = {
  investigator: {
    id: 'm-investigator',
    name: 'David Vance',
    role: 'Senior Incident Investigator',
    badge: 'Lead Investigator',
    department: 'Threat Operations',
    contactChannel: 'secure-ops@fraudguard-demo.com',
    avatarBg: 'bg-indigo-600',
  },
  forensics: {
    id: 'm-forensics',
    name: 'Elena Rostova',
    role: 'Digital Forensics & Reverse Engineer',
    badge: 'Malware/Phish Forensics',
    department: 'Digital Forensics Unit',
    contactChannel: 'forensics@fraudguard-demo.com',
    avatarBg: 'bg-cyan-600',
  },
  bankLiaison: {
    id: 'm-bank',
    name: 'Priya Nair',
    role: 'Inter-Bank Fraud Desk Liaison',
    badge: 'Banking Hotline Lead',
    department: 'Financial Recovery Operations',
    contactChannel: 'banking-liaison@fraudguard-demo.com',
    avatarBg: 'bg-emerald-600',
  },
  cyberNodal: {
    id: 'm-nodal',
    name: 'Inspector Rajiv Sharma',
    role: 'Cyber Crime 1930 Liaison Officer',
    badge: 'LE Liaison Nodal',
    department: 'Statutory Law Enforcement Cell',
    contactChannel: 'nodal-1930@cybercrime.gov.in',
    avatarBg: 'bg-rose-600',
  },
  ciso: {
    id: 'm-ciso',
    name: 'Dr. Marcus Reed',
    role: 'Chief Information Security Officer (CISO)',
    badge: 'Executive Command',
    department: 'Executive Crisis Board',
    contactChannel: 'ciso-emergency@fraudguard-demo.com',
    avatarBg: 'bg-purple-600',
  },
};

export const ESCALATION_TIERS: EscalationTier[] = [
  {
    level: 2,
    title: 'Level 2: Dual Specialist Rapid Triage',
    memberCount: 2,
    badge: 'Tier 2 Response',
    sla: '< 15 Minutes Response',
    description: 'Direct assignment of a Senior Incident Investigator and Digital Forensics Analyst for evidence capture and communication tracing.',
    scope: [
      'Forensic review of sender headers and phishing payloads',
      'Direct callback to victim within 15 minutes',
      'Preliminary fraud dossier preparation for local branch'
    ],
    members: [POOL_MEMBERS.investigator, POOL_MEMBERS.forensics],
  },
  {
    level: 3,
    title: 'Level 3: Tri-Core Threat Containment',
    memberCount: 3,
    badge: 'Tier 3 Containment',
    sla: '< 8 Minutes Response',
    description: 'Mobilizes Senior Investigator, Forensics Lead, and Dedicated Inter-Bank Liaison for immediate fund halt and transaction quarantine.',
    scope: [
      'Direct notification to issuing and beneficiary bank fraud desks',
      'Emergency telecom SIM-swap freeze verification',
      'Priority card and net-banking invalidation coordination'
    ],
    members: [POOL_MEMBERS.investigator, POOL_MEMBERS.forensics, POOL_MEMBERS.bankLiaison],
  },
  {
    level: 4,
    title: 'Level 4: Quad Task Force & Statutory Action',
    memberCount: 4,
    badge: 'Tier 4 Task Force',
    sla: '< 3 Minutes Response',
    description: 'Deploys a 4-member rapid task force including a Cyber Crime 1930 statutory liaison for immediate FIR drafting and inter-bank freezing.',
    scope: [
      'Automated dispatch to National Cyber Crime Reporting Portal (1930)',
      'Immediate payment gateway and merchant settlement freeze petition',
      'Comprehensive cyber forensic audit with cryptographic chain of custody',
      'Drafting of formal statutory complaint dossier'
    ],
    members: [
      POOL_MEMBERS.investigator,
      POOL_MEMBERS.forensics,
      POOL_MEMBERS.bankLiaison,
      POOL_MEMBERS.cyberNodal,
    ],
  },
  {
    level: 5,
    title: 'Level 5: Executive Crisis Council & Inter-Bank Red Alert',
    memberCount: 5,
    badge: 'Tier 5 Red Alert',
    sla: 'Immediate Hot-line (< 60s Dispatch)',
    description: 'Supreme 5-member incident command led by CISO, National Cyber 1930 Senior Nodal, and Bank Recovery Directors for major or catastrophic financial exposures.',
    scope: [
      'National Inter-Bank Red Alert to quarantine multi-hop UPI/crypto conduits',
      'Executive coordination with FIU and statutory financial intelligence desks',
      'Dedicated 24/7 incident war-room bridge with complainant',
      'Legal preservation orders served to hosting providers and telecos',
      'Full legal restitution and recovery advisory'
    ],
    members: [
      POOL_MEMBERS.ciso,
      POOL_MEMBERS.cyberNodal,
      POOL_MEMBERS.bankLiaison,
      POOL_MEMBERS.forensics,
      POOL_MEMBERS.investigator,
    ],
  },
];

export function getEscalationTier(level: 2 | 3 | 4 | 5): EscalationTier {
  const found = ESCALATION_TIERS.find((t) => t.level === level);
  return found || ESCALATION_TIERS[0];
}

export function dispatchEscalation(
  level: 2 | 3 | 4 | 5,
  incidentRef: string,
  notes?: string
): ActiveEscalation {
  const tier = getEscalationTier(level);
  const escalationId = `ESC-L${level}-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    escalationId,
    level,
    tierTitle: tier.title,
    memberCount: tier.memberCount,
    dispatchedAt: new Date().toISOString(),
    status: 'Dispatched',
    incidentRef: incidentRef || 'Active Consultation',
    assignedMembers: tier.members,
    notes: notes || `Direct emergency escalation requested by user at Level ${level} with ${tier.memberCount} specialists mobilized.`,
  };
}

