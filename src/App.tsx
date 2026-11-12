/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Send,
  Sparkles,
  PhoneCall,
  Mail,
  AlertTriangle,
  CheckCircle,
  FileText,
  KeyRound,
  TrendingUp,
  ListTodo,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import {
  ActiveEscalation,
  AnalysisResult,
  ChatMessage,
  ConcernType,
  EscalationMember,
  IncidentReportData,
  InvestmentData,
  InvestmentResult,
  PreChatData,
  SupportTicket,
  UserCategory,
} from './types';
import { analyzeScamText } from './utils/fraudAnalyzer';
import { Header } from './components/Header';
import { PreChatModal } from './components/PreChatModal';
import { TrustReportView } from './components/TrustReportView';
import { InvestmentVerifierModal } from './components/InvestmentVerifierModal';
import { OTPSecurityModal } from './components/OTPSecurityModal';
import { IncidentReportModal } from './components/IncidentReportModal';
import { ActionCenter } from './components/ActionCenter';
import { SampleScamPresets } from './components/SampleScamPresets';
import { EscalationModal } from './components/EscalationModal';

export default function App() {
  // Check for ?autostart=1 in URL parameters
  const [autostart] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('autostart') === '1';
    }
    return false;
  });

  // Pre-chat intake state
  const [preChat, setPreChat] = useState<PreChatData>({
    userCategory: 'Working Professional',
    concernType: 'SMS Scam',
    riskUrgency: 'Suspicious Activity',
    completed: autostart,
  });

  const [isIntakeOpen, setIsIntakeOpen] = useState(!autostart);
  const [isInvestmentOpen, setIsInvestmentOpen] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [escalationLevel, setEscalationLevel] = useState<2 | 3 | 4 | 5>(3);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'chat' | 'hub'>('chat');

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello, I am FraudGuard AI, your specialized cybersecurity and fraud defense analyst.

I am here to protect you from scams, phishing communications, fraudulent investment schemes, suspicious links, identity theft, and unauthorized OTP or bank access requests.

You can paste any SMS, email, suspicious website URL, caller transcript, or investment offer below for immediate 10-Factor forensic evaluation.`,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Tickets stored in state
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      ticketId: 'TICK-482910',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      priority: 'Emergency',
      scamType: 'Banking Fraud',
      userCategory: 'Working Professional',
      summary: 'Preventive inquiry regarding unauthorized OTP prompt on payroll card.',
      status: 'Investigating',
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // Handle pre-chat submission
  const handleSaveIntake = (data: PreChatData) => {
    setPreChat(data);
    setIsIntakeOpen(false);

    // Provide contextual greeting tailored to selected category & concern
    const profileGreeting: ChatMessage = {
      id: `profile-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Understood. I have tuned our threat analysis parameters for a **${data.userCategory}** investigating a **${data.concernType}** with urgency level: **${data.riskUrgency}**.

${
  data.riskUrgency === 'Financial Loss Already Happened'
    ? '⚠️ **URGENT NOTICE**: Since financial loss or account compromise has already occurred, please dial the National Cyber Crime Helpline **1930** immediately to request an urgent inter-bank transaction freeze. Then use Workflow 4 below to generate your official incident report.'
    : 'Whenever you are ready, paste the suspicious message, URL, or caller dialogue below.'
}`,
    };
    setMessages((prev) => [...prev, profileGreeting]);
  };

  // Perform Analysis - Ultra Fast Response (< 300ms)
  const handleAnalyze = async (textToAnalyze?: string) => {
    const rawText = (textToAnalyze ?? inputText).trim();
    if (!rawText || isAnalyzing) return;

    // Check if input mentions OTP or banking credentials
    const mentionsOTP = /(otp|one[- ]time[- ]password|verification code|security pin|cvv|bank account|atm pin)/i.test(rawText);

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: rawText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAnalyzing(true);

    try {
      // 1. Instantaneous local forensic evaluation (< 5ms execution)
      const instantResult = analyzeScamText(rawText, preChat);

      // Brief 200ms scan indicator so user experiences active forensic scan, then instant rendering
      await new Promise((resolve) => setTimeout(resolve, 200));

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysisResult: instantResult,
      };

      setMessages((prev) => [...prev, botMsg]);

      // If mentions OTP, prompt OTP security guidance automatically
      if (mentionsOTP && !instantResult.insufficientInfo) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `otp-tip-${Date.now()}`,
              sender: 'assistant',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: `🚨 **Critical Credential Alert**: Your query mentions sensitive credentials (OTP / Passwords / Banking details). Remember that bank officials and customer safety staff NEVER request your OTP or UPI PIN under any circumstance. Open the **OTP & Account Security** workflow anytime to review our emergency containment protocol.`,
            },
          ]);
        }, 400);
      }
    } catch (err) {
      const fallbackResult = analyzeScamText(rawText, preChat);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          analysisResult: fallbackResult,
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetSession = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Consultation session refreshed. You are currently configured as a **${preChat.userCategory}** investigating **${preChat.concernType}**. How may I assist your fraud prevention today?`,
      },
    ]);
  };

  const handleTriggerAction = (actionType: 'report' | 'ticket' | 'checklist' | 'plan' | 'escalate') => {
    if (actionType === 'report' || actionType === 'ticket') {
      setIsIncidentOpen(true);
    } else if (actionType === 'checklist' || actionType === 'plan') {
      setActiveTab('hub');
    } else if (actionType === 'escalate') {
      setEscalationLevel(3);
      setIsEscalationOpen(true);
    }
  };

  const handleEscalationDispatched = (escalation: ActiveEscalation) => {
    const escMsg: ChatMessage = {
      id: `esc-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `🚨 **INCIDENT ESCALATION DISPATCHED (LEVEL ${escalation.level})**

**Escalation Reference ID**: \`${escalation.escalationId}\`
**Tier**: **${escalation.tierTitle}**
**Task Force Mobilized**: **${escalation.memberCount} Dedicated Specialists**

**Assigned Specialists**:
${escalation.assignedMembers.map((m: EscalationMember, idx: number) => `${idx + 1}. **${m.name}** — ${m.role} (${m.department}) [${m.contactChannel}]`).join('\n')}

**Emergency Escalation Status**: **ACTIVE DISPATCH**
**Emergency Statutory Hotline**: Dial **1930** immediately if money was deducted.`,
      activeEscalation: escalation,
    };
    setMessages((prev) => [...prev, escMsg]);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header with status and quick helpline */}
      <Header
        preChat={preChat}
        onOpenIntake={() => setIsIntakeOpen(true)}
        onResetSession={handleResetSession}
        onOpenEscalation={() => {
          setEscalationLevel(3);
          setIsEscalationOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Intelligent Assistant & Trust Shield</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'hub'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <ListTodo className="w-4 h-4 text-emerald-400" />
              <span>Action & Prevention Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {tickets.length} Cases
              </span>
            </button>
          </div>

          {/* Quick Workflows trigger toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('message-input');
                el?.focus();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Workflow 1: Should I Trust This?</span>
            </button>
            <button
              type="button"
              onClick={() => setIsInvestmentOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Workflow 2: Investment Verifier</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOTPOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-rose-400" />
              <span>Workflow 3: OTP Security</span>
            </button>
            <button
              type="button"
              onClick={() => setIsIncidentOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Workflow 4: Incident Report</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEscalationLevel(3);
                setIsEscalationOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-600/70 text-xs font-bold text-rose-300 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Escalate (Levels 2–5)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CONVERSATIONAL & FORENSIC CONSOLE */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col gap-6">
            {/* Real-World Preset Scenarios */}
            <SampleScamPresets onSelect={(sampleText) => handleAnalyze(sampleText)} />

            {/* Conversation Feed */}
            <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 min-h-[420px] max-h-[680px] overflow-y-auto">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                        isUser
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 border border-slate-700 text-cyan-400'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`max-w-2xl sm:max-w-3xl rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white px-4 py-3 rounded-tr-none'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-200 p-4 rounded-tl-none w-full'
                      }`}
                    >
                      {msg.text && (
                        <div className="whitespace-pre-wrap space-y-2">
                          {msg.text}
                        </div>
                      )}

                      {/* Render Forensic Trust Report */}
                      {msg.analysisResult && (
                        <TrustReportView
                          report={msg.analysisResult}
                          onTriggerAction={handleTriggerAction}
                        />
                      )}

                      <div
                        className={`text-[10px] mt-2 font-mono ${
                          isUser ? 'text-indigo-200 text-right' : 'text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isAnalyzing && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 shrink-0 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 text-slate-300 p-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Executing 10-Factor Scam Analysis Framework & Forensic Checks...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAnalyze();
              }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-xl focus-within:border-indigo-500 transition-colors"
            >
              <div className="flex flex-col gap-2">
                <textarea
                  id="message-input"
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAnalyze();
                    }
                  }}
                  placeholder="Paste suspicious SMS, phishing email, website link, investment promise, or caller transcript (Press Enter to evaluate)..."
                  className="w-full bg-transparent border-0 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none px-2 py-1"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 px-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      10-Factor Heuristics Engine Active
                    </span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Confidence-Weighted Scoring</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOTPOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      title="Quick OTP Alert"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-rose-400" />
                      <span className="hidden sm:inline">OTP Risk</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isAnalyzing || !inputText.trim()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs sm:text-sm text-white flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Evaluate Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: ACTION & PREVENTION HUB */}
        {activeTab === 'hub' && (
          <ActionCenter
            preChat={preChat}
            tickets={tickets}
            onOpenReportModal={() => setIsIncidentOpen(true)}
            onOpenOTPModal={() => setIsOTPOpen(true)}
            onOpenInvestmentModal={() => setIsInvestmentOpen(true)}
            onOpenEscalation={(lvl) => {
              if (lvl) setEscalationLevel(lvl);
              setIsEscalationOpen(true);
            }}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Pre-chat intake wizard */}
      <PreChatModal
        isOpen={isIntakeOpen}
        currentData={preChat}
        onSave={handleSaveIntake}
        onClose={() => setIsIntakeOpen(false)}
        canClose={preChat.completed}
      />

      {/* 2. Investment Verifier Modal (Workflow 2) */}
      <InvestmentVerifierModal
        isOpen={isInvestmentOpen}
        onClose={() => setIsInvestmentOpen(false)}
        onSendToChat={(result, data) => {
          const invMsg: ChatMessage = {
            id: `inv-${Date.now()}`,
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `### Investment Opportunity Forensic Audit: ${data.companyName}

- **Claimed Returns**: ${data.claimedReturns}
- **Proposed Capital**: ${data.investmentAmount || 'Not specified'}
- **Platform URL**: ${data.website || 'Direct / Messaging app'}
- **Contact Details**: ${data.contactInfo || 'Private individual'}

**Risk Rating**: **${result.riskRating}** (${result.badge})
**Forensic Explanation**: ${result.explanation}

**Safety Guidance**:
${result.safetyRecommendation.map((r) => `• ${r}`).join('\n')}`,
          };
          setMessages((prev) => [...prev, invMsg]);
          setActiveTab('chat');
        }}
      />

      {/* 3. OTP & Account Security Modal (Workflow 3) */}
      <OTPSecurityModal
        isOpen={isOTPOpen}
        onClose={() => setIsOTPOpen(false)}
        onEscalateNow={() => setIsIncidentOpen(true)}
      />

      {/* 4. Incident Report Modal (Workflow 4) */}
      <IncidentReportModal
        isOpen={isIncidentOpen}
        onClose={() => setIsIncidentOpen(false)}
        defaultScamType={preChat.concernType}
        defaultUserCategory={preChat.userCategory}
        onTicketCreated={(newTicket) => {
          setTickets((prev) => [newTicket, ...prev]);
        }}
        onReportGenerated={(summary) => {
          const repMsg: ChatMessage = {
            id: `rep-${Date.now()}`,
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `### Incident Report Summary Compiled

The formal incident report has been generated and filed in your case hub.

\`\`\`
${summary}
\`\`\`

**Escalation Options**:
1. Cyber Crime Helpline: **1930** (Dial immediately for inter-bank transaction freeze)
2. FraudGuard Security Team: **support@fraudguard-demo.com** / **+1-555-123-4567**`,
          };
          setMessages((prev) => [...prev, repMsg]);
          setActiveTab('chat');
        }}
      />

      {/* 5. Multi-Tier Escalation Modal (Levels 2 to 5 with 2 to 5 Member Teams) */}
      <EscalationModal
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        defaultLevel={escalationLevel}
        onEscalationDispatched={handleEscalationDispatched}
      />
    </div>
  );
}
