import React, { useState } from 'react';
import {
  KeyRound,
  ShieldAlert,
  AlertTriangle,
  X,
  CheckSquare,
  Square,
  Lock,
  PhoneCall,
  ShieldCheck,
  Ban,
  ArrowRight
} from 'lucide-react';
import { generateOTPSecurityGuidance } from '../utils/fraudAnalyzer';
import { SecurityChecklistItem } from '../types';

interface OTPSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEscalateNow?: () => void;
}

export const OTPSecurityModal: React.FC<OTPSecurityModalProps> = ({
  isOpen,
  onClose,
  onEscalateNow,
}) => {
  const guidance = React.useMemo(() => generateOTPSecurityGuidance(), []);
  const [items, setItems] = useState<SecurityChecklistItem[]>(guidance.checklist);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = items.filter((i) => i.checked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-rose-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close OTP & Account Security Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                WORKFLOW 3
              </span>
              <h2 className="text-xl font-bold text-white">OTP & Account Security Containment</h2>
            </div>
            <p className="text-xs text-slate-400">
              Immediate containment protocol for compromised credentials and one-time passwords
            </p>
          </div>
        </div>

        {/* 1. WHY THE REQUEST IS DANGEROUS */}
        <div className="mb-5 bg-rose-950/30 border border-rose-500/30 rounded-xl p-4">
          <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            1. Why Any OTP Request Is Extremely Dangerous
          </h3>
          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
            {guidance.dangerExplanation}
          </p>
        </div>

        {/* 2. WHAT SHOULD NEVER BE SHARED */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Ban className="w-4 h-4 text-amber-400" />
            2. Never Disclose These Confidential Credentials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {guidance.neverShareList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-slate-200"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. IMMEDIATE PROTECTION STEPS */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            3. Immediate Protection Protocol
          </h3>
          <div className="space-y-1.5">
            {guidance.immediateSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg text-xs text-slate-200"
              >
                <span className="font-mono font-bold text-emerald-400 shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE SECURITY CHECKLIST */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Emergency Containment Checklist
            </h3>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {completedCount} / {items.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  item.checked
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
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
                  <div className={`text-xs font-bold ${item.checked ? 'line-through opacity-75' : 'text-white'}`}>
                    {item.label}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Escalation trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <a
            href="tel:1930"
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency: Call Cyber Helpline 1930</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
