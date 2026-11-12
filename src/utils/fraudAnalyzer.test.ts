import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeScamText,
  getBadge,
  getTrustLevel,
  verifyInvestment,
  generateOTPSecurityGuidance,
  generateIncidentSummary,
  generateSupportTicket,
  generatePersonalizedChecklist,
  generatePreventionPlan,
} from './fraudAnalyzer';

test('getBadge and getTrustLevel return correct boundaries', () => {
  assert.equal(getTrustLevel(20), 'Safe');
  assert.equal(getBadge(20), '🟢 LOW RISK');

  assert.equal(getTrustLevel(30), 'Safe');
  assert.equal(getBadge(30), '🟢 LOW RISK');

  assert.equal(getTrustLevel(45), 'Suspicious');
  assert.equal(getBadge(45), '🟡 USE CAUTION');

  assert.equal(getTrustLevel(60), 'Suspicious');
  assert.equal(getBadge(60), '🟡 USE CAUTION');

  assert.equal(getTrustLevel(61), 'High Risk');
  assert.equal(getBadge(61), '🔴 FRAUD ALERT');

  assert.equal(getTrustLevel(95), 'High Risk');
  assert.equal(getBadge(95), '🔴 FRAUD ALERT');
});

test('analyzeScamText catches insufficient information', () => {
  const result = analyzeScamText('hi');
  assert.equal(result.insufficientInfo, true);
  assert.match(result.analysis, /I do not have enough information to make a reliable assessment/);
});

test('analyzeScamText detects high risk banking phishing SMS with OTP & urgency', () => {
  const phishingSMS = 'URGENT: Your SBI account will be blocked within 2 hours. Click http://bit.ly/sbi-kyc-verify to update PAN card and share OTP immediately.';
  const result = analyzeScamText(phishingSMS, { userCategory: 'Working Professional', concernType: 'SMS Scam', riskUrgency: 'Suspicious Activity' });

  assert.ok(result.riskScore >= 61, `Score was ${result.riskScore}, expected >= 61`);
  assert.equal(result.trustLevel, 'High Risk');
  assert.equal(result.badge, '🔴 FRAUD ALERT');
  assert.equal(result.escalationRequired, true);
  assert.ok(result.escalationOptions !== undefined);
  assert.equal(result.escalationOptions?.option1.helpline, '1930');
  assert.equal(result.escalationOptions?.option2.email, 'support@fraudguard-demo.com');

  // Check 10-factor points
  const urgencyPoint = result.frameworkPoints.find((p) => p.code === 'A');
  const threatPoint = result.frameworkPoints.find((p) => p.code === 'B');
  const otpPoint = result.frameworkPoints.find((p) => p.code === 'D');
  const linkPoint = result.frameworkPoints.find((p) => p.code === 'F');

  assert.equal(urgencyPoint?.detected, true);
  assert.equal(threatPoint?.detected, true);
  assert.equal(otpPoint?.detected, true);
  assert.equal(linkPoint?.detected, true);
});

test('analyzeScamText evaluates benign message as safe', () => {
  const benignMessage = 'Hi Team, the project review meeting has been scheduled for tomorrow morning at 10 AM in Conference Room B.';
  const result = analyzeScamText(benignMessage);

  assert.ok(result.riskScore <= 30, `Score was ${result.riskScore}, expected <= 30`);
  assert.equal(result.trustLevel, 'Safe');
  assert.equal(result.badge, '🟢 LOW RISK');
  assert.equal(result.escalationRequired, false);
});

test('verifyInvestment detects Ponzi characteristics', () => {
  const result = verifyInvestment({
    companyName: 'CryptoGain Arbitrage Club',
    claimedReturns: 'Guaranteed 50% profit monthly with zero risk',
    investmentAmount: '$5,000',
    website: 'https://t.me/cryptorichgroup',
    contactInfo: 'WhatsApp only +44-789012345',
  });

  assert.ok(result.riskScore >= 61);
  assert.equal(result.badge, '🔴 FRAUD ALERT');
  assert.equal(result.unrealisticProfit, true);
  assert.equal(result.guaranteedReturns, true);
  assert.equal(result.missingTransparency, true);
  assert.ok(result.safetyRecommendation.length > 0);
});

test('generateOTPSecurityGuidance returns complete checklist and warnings', () => {
  const guidance = generateOTPSecurityGuidance();
  assert.ok(guidance.dangerExplanation.length > 20);
  assert.ok(guidance.neverShareList.length >= 4);
  assert.ok(guidance.immediateSteps.length >= 3);
  assert.ok(guidance.checklist.length >= 4);
});

test('generateIncidentSummary formats ready-to-submit official summary', () => {
  const summary = generateIncidentSummary({
    id: 'FG-INC-999888',
    name: 'Jane Doe',
    scamType: 'UPI Fraud',
    date: '2026-11-12',
    description: 'Fake seller asked to scan QR code to receive refund for order #12345, resulting in unauthorized debit of $250.',
    estimatedLoss: '$250.00',
    userCategory: 'Working Professional',
  });

  assert.match(summary, /FRAUDGUARD AI - OFFICIAL INCIDENT REPORT SUMMARY/);
  assert.match(summary, /Jane Doe/);
  assert.match(summary, /UPI Fraud/);
  assert.match(summary, /\$250\.00/);
  assert.match(summary, /1930/);
  assert.match(summary, /support@fraudguard-demo\.com/);
});

test('generateSupportTicket creates structured ticket', () => {
  const ticket = generateSupportTicket({
    name: 'John Smith',
    scamType: 'Banking Fraud',
    date: '2026-11-12',
    description: 'Unauthorized wire transfer initiated after phishing email.',
    estimatedLoss: '$1,200',
  });

  assert.ok(ticket.ticketId.startsWith('TICK-'));
  assert.equal(ticket.priority, 'Emergency');
  assert.equal(ticket.status, 'Open');
});

test('generatePersonalizedChecklist adds custom recommendations for Senior Citizens and UPI Fraud', () => {
  const checklist = generatePersonalizedChecklist('Senior Citizen', 'UPI Fraud');
  const hasSenior = checklist.some((c) => c.id === 'chk-senior');
  const hasUPI = checklist.some((c) => c.id === 'chk-upi');

  assert.equal(hasSenior, true);
  assert.equal(hasUPI, true);
});

test('generatePreventionPlan outputs sequential phases with timelines', () => {
  const plan = generatePreventionPlan('Working Professional', 'Email Scam');
  assert.equal(plan.length, 5);
  assert.equal(plan[0].stepNumber, 1);
  assert.equal(plan[0].phase, 'Containment');
  assert.equal(plan[4].phase, 'Hardening');
});

test('analyzeScamText provides instant sub-second response (< 50ms)', () => {
  const start = performance.now();
  const res = analyzeScamText('URGENT: Your bank account is suspended. Click link http://scam.xyz to share OTP.');
  const elapsed = performance.now() - start;

  assert.ok(elapsed < 50, `Analysis took ${elapsed}ms, should be < 50ms`);
  assert.equal(res.badge, '🔴 FRAUD ALERT');
});

test('escalation tiers support 2 to 5 members levels with accurate member rosters', async () => {
  const { ESCALATION_TIERS, getEscalationTier, dispatchEscalation } = await import('./fraudAnalyzer');

  assert.equal(ESCALATION_TIERS.length, 4);

  // Level 2 -> 2 members
  const tier2 = getEscalationTier(2);
  assert.equal(tier2.level, 2);
  assert.equal(tier2.memberCount, 2);
  assert.equal(tier2.members.length, 2);

  // Level 3 -> 3 members
  const tier3 = getEscalationTier(3);
  assert.equal(tier3.level, 3);
  assert.equal(tier3.memberCount, 3);
  assert.equal(tier3.members.length, 3);

  // Level 4 -> 4 members
  const tier4 = getEscalationTier(4);
  assert.equal(tier4.level, 4);
  assert.equal(tier4.memberCount, 4);
  assert.equal(tier4.members.length, 4);

  // Level 5 -> 5 members
  const tier5 = getEscalationTier(5);
  assert.equal(tier5.level, 5);
  assert.equal(tier5.memberCount, 5);
  assert.equal(tier5.members.length, 5);

  // Dispatch Level 4
  const dispatched = dispatchEscalation(4, 'INC-991188', 'Urgent unauthorized bank withdrawal');
  assert.ok(dispatched.escalationId.startsWith('ESC-L4-'));
  assert.equal(dispatched.level, 4);
  assert.equal(dispatched.memberCount, 4);
  assert.equal(dispatched.status, 'Dispatched');
  assert.equal(dispatched.assignedMembers.length, 4);
});
