import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Clock,
  PhoneCall,
  Mail,
  AlertOctagon,
  CheckCircle2,
  X,
  Send,
  Building,
  FileText,
  BadgeCheck,
  ChevronRight,
  Shield,
  Radio,
} from 'lucide-react';
import { ActiveEscalation, EscalationTier } from '../types';
import { ESCALATION_TIERS, dispatchEscalation } from '../utils/fraudAnalyzer';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLevel?: 2 | 3 | 4 | 5;
  incidentRef?: string;
  onEscalationDispatched: (escalation: ActiveEscalation) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  defaultLevel = 3,
  incidentRef = 'Current Active Investigation',
  onEscalationDispatched,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<2 | 3 | 4 | 5>(defaultLevel);
  const [notes, setNotes] = useState('');
  const [activeDispatched, setActiveDispatched] = useState<ActiveEscalation | null>(null);

  if (!isOpen) return null;

  const currentTier = ESCALATION_TIERS.find((t) => t.level === selectedLevel) || ESCALATION_TIERS[1];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const escalation = dispatchEscalation(selectedLevel, incidentRef, notes);
    setActiveDispatched(escalation);
    onEscalationDispatched(escalation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-rose-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close Escalation Panel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                MULTI-TIER CRISIS LADDER
              </span>
              <h2 className="text-xl font-bold text-white">Escalate to Higher Incident Level</h2>
            </div>
            <p className="text-xs text-slate-400">
              Mobilize specialized 2 to 5 member multi-disciplinary teams for aggressive fraud containment
            </p>
          </div>
        </div>

        {!activeDispatched ? (
          <form onSubmit={handleDispatch} className="space-y-6">
            {/* Level Selector Tabs: 2 to 5 members */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Select Escalation Level (2 to 5 Specialists)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ESCALATION_TIERS.map((tier) => {
                  const isSelected = selectedLevel === tier.level;
                  return (
                    <button
                      key={tier.level}
                      type="button"
                      onClick={() => setSelectedLevel(tier.level)}
                      className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-950/40 shadow-sm shadow-rose-500/20 ring-1 ring-rose-500'
                          : 'border-slate-800 bg-slate-950/40 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-mono text-xs font-black text-rose-400">
                          LEVEL {tier.level}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                          {tier.memberCount} Members
                        </span>
                      </div>
                      <span className="text-xs font-bold text-white line-clamp-1">{tier.title.split(':')[1]}</span>
                      <span className="text-[10px] font-semibold text-rose-300/90 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{tier.sla}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Level Deep Dive Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{currentTier.title}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700">
                      {currentTier.memberCount} Member Task Force
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{currentTier.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Response SLA</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{currentTier.sla}</span>
                </div>
              </div>

              {/* Assigned 2 to 5 Members Roster */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Assigned {currentTier.memberCount}-Member Specialist Roster (Live Standby):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentTier.members.map((member, idx) => (
                    <div
                      key={member.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs text-white ${member.avatarBg}`}>
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white truncate">{member.name}</span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 shrink-0">
                            {member.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-300 truncate">{member.role}</div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">{member.contactChannel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Protocols triggered by this level */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Automated Tier Actions Upon Dispatch:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentTier.scope.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Incident Context / Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Emergency Notes / Context for the Escalation Team (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify if money was already transferred, account numbers, or fraudulent phone numbers for immediate priority trace..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Submit & Dispatch */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 font-bold text-xs sm:text-sm text-white shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Dispatch Level {selectedLevel} Escalation ({currentTier.memberCount} Members)</span>
              </button>
            </div>
          </form>
        ) : (
          /* Dispatched Confirmation View */
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Escalation Successfully Dispatched!</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-900 text-emerald-200">
                    STATUS: ACTIVE DISPATCH
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                  Your case has been escalated to <strong>Level {activeDispatched.level}</strong>. A dedicated task force of <strong>{activeDispatched.memberCount} specialists</strong> has been alerted with an SLA of <strong>{currentTier.sla}</strong>.
                </p>
                <div className="text-xs font-mono font-bold text-cyan-300 mt-2">
                  Escalation Ref ID: {activeDispatched.escalationId}
                </div>
              </div>
            </div>

            {/* Assigned Member Hotlines */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Mobilized {activeDispatched.memberCount}-Specialist Team:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeDispatched.assignedMembers.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.role}</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Mobilized
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Statutory Numbers */}
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">
                  NATIONAL CYBER CRIME COMMAND
                </span>
                <span className="text-sm font-bold text-white">Dial 1930 for Immediate Financial Quarantine</span>
              </div>
              <a
                href="tel:1930"
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1930</span>
              </a>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveDispatched(null);
                  onClose();
                }}
                className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Close & Return to Chat Console
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
