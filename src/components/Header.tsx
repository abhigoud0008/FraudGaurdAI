import React from 'react';
import { ShieldCheck, AlertTriangle, PhoneCall, UserCheck, RefreshCw } from 'lucide-react';
import { PreChatData } from '../types';

interface HeaderProps {
  preChat: PreChatData;
  onOpenIntake: () => void;
  onResetSession: () => void;
  onOpenEscalation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  preChat,
  onOpenIntake,
  onResetSession,
  onOpenEscalation,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">FraudGuard AI</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                ACTIVE SHIELD
              </span>
            </div>
            <p className="text-xs text-slate-400">Intelligent Cybersecurity & Fraud Defense Analyst</p>
          </div>
        </div>

        {/* User Context & Emergency Helpline & Escalation */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* User category pill button */}
          <button
            onClick={onOpenIntake}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 transition-colors"
            title="Update User Profile & Concern"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline text-slate-400">Profile:</span>
            <span className="text-white font-semibold">{preChat.userCategory}</span>
            <span className="text-slate-500">|</span>
            <span className="text-indigo-300">{preChat.concernType}</span>
          </button>

          {/* Escalate Level (2-5) button */}
          <button
            onClick={onOpenEscalation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/70 text-rose-200 text-xs font-bold shadow-md shadow-rose-950/50 transition-all"
            title="Escalate to Levels 2 to 5 (2-5 Member Specialists)"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Escalate (Levels 2–5)</span>
          </button>

          {/* Emergency Helpline Direct dial / badge */}
          <a
            href="tel:1930"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900/80 border border-rose-700/60 text-rose-300 text-xs font-semibold shadow-sm transition-colors"
            title="National Cyber Crime Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Helpline:</span> <strong>1930</strong>
          </a>

          {/* Reset session button */}
          <button
            onClick={onResetSession}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Reset consultation and start fresh"
            aria-label="Reset consultation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
