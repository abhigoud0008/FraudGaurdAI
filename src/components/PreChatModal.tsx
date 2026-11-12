import React, { useState } from 'react';
import {
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Building2,
  HeartHandshake,
  Users,
  HelpCircle,
  MessageSquareWarning,
  MailWarning,
  PhoneCall,
  TrendingUp,
  FileSearch,
  Globe,
  CreditCard,
  QrCode,
  Fingerprint,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { ConcernType, PreChatData, RiskUrgency, UserCategory } from '../types';

interface PreChatModalProps {
  isOpen: boolean;
  currentData: PreChatData;
  onSave: (data: PreChatData) => void;
  onClose?: () => void;
  canClose?: boolean;
}

const CATEGORIES: { label: UserCategory; icon: React.ReactNode; desc: string }[] = [
  { label: 'Student', icon: <GraduationCap className="w-4 h-4 text-sky-400" />, desc: 'Campus, job search, education grants & scholarships' },
  { label: 'Working Professional', icon: <Briefcase className="w-4 h-4 text-indigo-400" />, desc: 'Salaried accounts, fake HR recruiters & tax notices' },
  { label: 'Business Owner', icon: <Building2 className="w-4 h-4 text-emerald-400" />, desc: 'Invoice tampering, vendor wire fraud & CEO spoofing' },
  { label: 'Senior Citizen', icon: <HeartHandshake className="w-4 h-4 text-amber-400" />, desc: 'Pension portals, tech support & life savings protection' },
  { label: 'Parent', icon: <Users className="w-4 h-4 text-purple-400" />, desc: 'Child safety, family emergencies & gaming micro-transactions' },
  { label: 'Other', icon: <HelpCircle className="w-4 h-4 text-slate-400" />, desc: 'General digital citizen requiring safety verification' },
];

const CONCERNS: { label: ConcernType; icon: React.ReactNode; desc: string }[] = [
  { label: 'SMS Scam', icon: <MessageSquareWarning className="w-4 h-4 text-amber-400" />, desc: 'KYC expiry, electricity cutoff, fake courier links' },
  { label: 'Email Scam', icon: <MailWarning className="w-4 h-4 text-rose-400" />, desc: 'Phishing login pages, urgent security alerts, spoofed sender' },
  { label: 'Phone Call Scam', icon: <PhoneCall className="w-4 h-4 text-red-400" />, desc: 'Police/CBI impersonation, customs parcel, bank manager call' },
  { label: 'Investment Scam', icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, desc: 'High-yield crypto, guaranteed daily returns, WhatsApp groups' },
  { label: 'Job Scam', icon: <FileSearch className="w-4 h-4 text-cyan-400" />, desc: 'Part-time YouTube liking tasks, deposit for offer letter' },
  { label: 'Website Verification', icon: <Globe className="w-4 h-4 text-blue-400" />, desc: 'Check if an e-commerce, banking, or crypto URL is legitimate' },
  { label: 'Banking Fraud', icon: <CreditCard className="w-4 h-4 text-violet-400" />, desc: 'Unauthorized card charges, account freeze threats' },
  { label: 'UPI Fraud', icon: <QrCode className="w-4 h-4 text-pink-400" />, desc: 'QR code scanning to "receive" funds, fake payment screenshots' },
  { label: 'Identity Theft', icon: <Fingerprint className="w-4 h-4 text-orange-400" />, desc: 'Leaked SSN/PAN card, unauthorized loan in your name' },
  { label: 'Other', icon: <AlertCircle className="w-4 h-4 text-slate-400" />, desc: 'Any other suspicious digital solicitation' },
];

const URGENCIES: { label: RiskUrgency; badge: string; color: string; desc: string }[] = [
  {
    label: 'Just Curious',
    badge: 'Proactive Learning',
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    desc: 'You want to verify a message or learn best practices before taking action.',
  },
  {
    label: 'Suspicious Activity',
    badge: 'Active Threat',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    desc: 'You received an alarming message/call and suspect it may be an active scam attempt.',
  },
  {
    label: 'Financial Loss Already Happened',
    badge: 'Emergency Escalation',
    color: 'border-rose-500/50 bg-rose-950/30 text-rose-300',
    desc: 'Money was already deducted or credentials shared. Immediate containment required.',
  },
];

export const PreChatModal: React.FC<PreChatModalProps> = ({
  isOpen,
  currentData,
  onSave,
  onClose,
  canClose = false,
}) => {
  const [category, setCategory] = useState<UserCategory>(currentData.userCategory);
  const [concern, setConcern] = useState<ConcernType>(currentData.concernType);
  const [urgency, setUrgency] = useState<RiskUrgency>(currentData.riskUrgency);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      userCategory: category,
      concernType: concern,
      riskUrgency: urgency,
      completed: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-8">
        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close intake"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Intake & Security Profile</h2>
            <p className="text-xs text-slate-400">
              Personalizing threat assessment algorithms to your specific context
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: User Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              1. Select Your User Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setCategory(cat.label)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 shadow-sm shadow-indigo-500/20'
                        : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="p-1 rounded-lg bg-slate-800/80">{cat.icon}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <span className="text-xs font-semibold text-white">{cat.label}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{cat.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Concern Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              2. What is your primary security concern?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {CONCERNS.map((item) => {
                const isSelected = concern === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setConcern(item.label)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 shadow-sm shadow-cyan-500/20'
                        : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="p-1 rounded-lg bg-slate-800/80">{item.icon}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <span className="text-xs font-medium text-white">{item.label}</span>
                    <span className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Risk Urgency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              3. Current Risk Urgency Level
            </label>
            <div className="space-y-2">
              {URGENCIES.map((u) => {
                const isSelected = urgency === u.label;
                return (
                  <button
                    key={u.label}
                    type="button"
                    onClick={() => setUrgency(u.label)}
                    className={`flex items-start gap-3 p-3 rounded-xl border w-full text-left transition-all ${
                      isSelected
                        ? `${u.color} ring-1 ring-offset-0 ring-indigo-500`
                        : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-white bg-white' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{u.label}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {u.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{u.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-sm text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Confirm Profile & Begin FraudGuard Assistance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
