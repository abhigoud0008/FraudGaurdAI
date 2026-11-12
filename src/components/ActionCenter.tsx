import React, { useState } from 'react';
import {
  FileText,
  Ticket,
  ListTodo,
  ShieldCheck,
  CheckCircle2,
  Square,
  CheckSquare,
  Clock,
  AlertTriangle,
  ArrowRight,
  Download,
  Copy,
  Check,
  Users,
  AlertOctagon,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import {
  IncidentReportData,
  PreChatData,
  PreventionPlanStep,
  SecurityChecklistItem,
  SupportTicket,
} from '../types';
import {
  ESCALATION_TIERS,
  generatePersonalizedChecklist,
  generatePreventionPlan,
} from '../utils/fraudAnalyzer';

interface ActionCenterProps {
  preChat: PreChatData;
  tickets: SupportTicket[];
  onOpenReportModal: () => void;
  onOpenOTPModal: () => void;
  onOpenInvestmentModal: () => void;
  onOpenEscalation: (level?: 2 | 3 | 4 | 5) => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  preChat,
  tickets,
  onOpenReportModal,
  onOpenOTPModal,
  onOpenInvestmentModal,
  onOpenEscalation,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'plan' | 'tickets' | 'escalation'>('checklist');
  const [checklist, setChecklist] = useState<SecurityChecklistItem[]>(() =>
    generatePersonalizedChecklist(preChat.userCategory, preChat.concernType)
  );
  const [plan] = useState<PreventionPlanStep[]>(() =>
    generatePreventionPlan(preChat.userCategory, preChat.concernType)
  );

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter((c) => c.checked).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100">
      {/* Header with 4 Action triggers */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>FraudGuard Action & Defense Hub</span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized prevention blueprints, support cases, and emergency containment
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Action 1: Fraud Report</span>
            </button>
            <button
              type="button"
              onClick={onOpenOTPModal}
              className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-xs font-semibold text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Action 2: OTP Lockdown</span>
            </button>
            <button
              type="button"
              onClick={onOpenInvestmentModal}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Verify Scheme</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Action 3: Safety Checklist ({completedCount}/{checklist.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('plan')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'plan'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Action 4: Prevention Plan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'tickets'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Support Tickets ({tickets.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('escalation')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'escalation'
                ? 'bg-rose-950 text-rose-300 border border-rose-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Escalation Ladder (Levels 2–5)</span>
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* TAB 1: PERSONALIZED SAFETY CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>
                Tailored for: <strong className="text-white">{preChat.userCategory}</strong> • Concern: <strong className="text-white">{preChat.concernType}</strong>
              </span>
              <span className="font-mono text-indigo-400 font-bold">
                {Math.round((completedCount / checklist.length) * 100)}% Defense Score
              </span>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklist(item.id)}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    item.checked
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                      : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${item.checked ? 'line-through opacity-75' : 'text-white'}`}>
                        {item.label}
                      </span>
                      <span className="text-[9px] font-semibold px-2 py-0.2 rounded bg-slate-800 text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PREVENTION PLAN */}
        {activeTab === 'plan' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-2">
              Step-by-step phased cyber defense plan to mitigate loss and eliminate recurrence:
            </p>

            <div className="relative border-l-2 border-indigo-500/30 pl-4 ml-2 space-y-4">
              {plan.map((step) => (
                <div key={step.stepNumber} className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-white">
                        Phase {step.stepNumber}: {step.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {step.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUPPORT TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-3">
            {tickets.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Ticket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No support cases or incident tickets logged yet.</p>
                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
                >
                  File First Incident Case
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tickets.map((t) => (
                  <div
                    key={t.ticketId}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">{t.ticketId}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs font-semibold text-white">{t.scamType}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{t.summary}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                        Logged on: {new Date(t.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.priority === 'Emergency'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MULTI-TIER ESCALATION LADDER (LEVELS 2 TO 5) */}
        {activeTab === 'escalation' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Multi-Tier Specialist Escalation Matrix (2 to 5 Members)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select and mobilize senior forensic specialists, bank recovery liaisons, and statutory nodal officers
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Emergency Statutory Hotline:</span>
                <a
                  href="tel:1930"
                  className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>1930</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {ESCALATION_TIERS.map((tier) => (
                <div
                  key={tier.level}
                  className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                        LEVEL {tier.level} ({tier.memberCount} MEMBERS)
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{tier.sla}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{tier.title.split(':')[1]}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{tier.description}</p>

                    {/* Member Avatars */}
                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Assigned {tier.memberCount}-Member Task Force:
                      </span>
                      <div className="space-y-1.5">
                        {tier.members.map((m) => (
                          <div
                            key={m.id}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded text-[10px] font-bold text-white flex items-center justify-center ${m.avatarBg}`}>
                                {m.name.charAt(0)}
                              </span>
                              <div>
                                <span className="font-semibold text-white">{m.name}</span>
                                <span className="text-slate-400 text-[10px] block">{m.role}</span>
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-mono">
                              {m.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenEscalation(tier.level)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 font-bold text-xs text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Dispatch Level {tier.level} ({tier.memberCount} Specialists)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
