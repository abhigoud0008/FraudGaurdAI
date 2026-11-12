import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Shield,
  PhoneCall,
  Mail,
  ArrowRight,
  Download,
  FileCheck2,
  ListTodo,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface TrustReportViewProps {
  report: AnalysisResult;
  onTriggerAction?: (actionType: 'report' | 'ticket' | 'checklist' | 'plan' | 'escalate') => void;
}

export const TrustReportView: React.FC<TrustReportViewProps> = ({
  report,
  onTriggerAction,
}) => {
  const [showFactors, setShowFactors] = React.useState(false);

  const isFraud = report.riskScore >= 61;
  const isSuspicious = report.riskScore >= 31 && report.riskScore <= 60;
  const isSafe = report.riskScore <= 30;

  const badgeColor = isFraud
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10'
    : isSuspicious
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10'
    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10';

  const scoreBarColor = isFraud
    ? 'bg-rose-500'
    : isSuspicious
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl my-4 text-slate-100">
      {/* Top Banner with Badge */}
      <div className="border-b border-slate-800/80 p-5 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            {isFraud ? (
              <AlertOctagon className="w-6 h-6 text-rose-400 animate-pulse" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            ) : (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">TRUST REPORT</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{report.confidence}</span>
            </div>
            <div className="text-base font-bold text-white mt-0.5">
              Evaluation & Forensic Assessment
            </div>
          </div>
        </div>

        {/* Prominent Badge */}
        <div className={`px-4 py-2 rounded-xl border text-sm font-black tracking-wide shadow-lg flex items-center gap-2 ${badgeColor}`}>
          <span>{report.badge}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Risk Score Gauge & Trust Level */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              RISK SCORE
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                Trust Level: <strong className="text-white">{report.trustLevel}</strong>
              </span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {report.riskScore}<span className="text-xs text-slate-400 font-normal"> / 100</span>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${scoreBarColor}`}
              style={{ width: `${Math.max(5, report.riskScore)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
            <span>0-30: Safe (🟢 Low Risk)</span>
            <span>31-60: Suspicious (🟡 Use Caution)</span>
            <span>61-100: High Risk (🔴 Fraud Alert)</span>
          </div>
        </div>

        {/* SUMMARY */}
        <div>
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            SUMMARY
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 font-medium">
            {report.summary}
          </p>
        </div>

        {/* ANALYSIS */}
        <div>
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
            ANALYSIS
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/30 p-3.5 rounded-xl border border-slate-800/50">
            {report.analysis}
          </p>
        </div>

        {/* KEY FINDINGS */}
        {report.keyFindings && report.keyFindings.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              KEY FINDINGS
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.keyFindings.map((finding, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 10-Factor Scam Analysis Framework breakdown */}
        {report.frameworkPoints && report.frameworkPoints.length > 0 && (
          <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              type="button"
              onClick={() => setShowFactors(!showFactors)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  10-Factor Scam Analysis Framework Breakdown
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  {report.frameworkPoints.filter((f) => f.detected).length} Detected
                </span>
              </div>
              {showFactors ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showFactors && (
              <div className="p-4 border-t border-slate-800 space-y-2 max-h-72 overflow-y-auto">
                {report.frameworkPoints.map((point) => (
                  <div
                    key={point.code}
                    className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                      point.detected
                        ? 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                        : 'border-slate-800/60 bg-slate-900/40 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          Factor {point.code}
                        </span>
                        <span>{point.name}</span>
                        {point.detected && (
                          <span className="text-[10px] font-bold text-rose-400 uppercase ml-1">
                            [{point.severity}]
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] mt-0.5 opacity-90">{point.details}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        point.detected
                          ? 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                          : 'bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      {point.detected ? 'FLAGGED' : 'CLEAR'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RECOMMENDED ACTIONS */}
        {report.recommendedActions && report.recommendedActions.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              RECOMMENDED ACTIONS
            </h3>
            <div className="space-y-2">
              {report.recommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-200 bg-emerald-950/15 border border-emerald-500/20 p-3 rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESCALATION OPTIONS (Required on high risk or loss) */}
        {report.escalationRequired && report.escalationOptions && (
          <div className="border border-rose-500/40 bg-gradient-to-br from-rose-950/30 to-slate-900 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                ESCALATION OPTIONS (Immediate Action Advised)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option 1 */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/30">
                <div className="text-xs font-bold text-white mb-1">
                  {report.escalationOptions.option1.title}
                </div>
                <div className="text-lg font-black text-rose-400 font-mono mb-1">
                  Dial {report.escalationOptions.option1.helpline}
                </div>
                <p className="text-[11px] text-slate-300 mb-2">
                  {report.escalationOptions.option1.description}
                </p>
                <a
                  href={`tel:${report.escalationOptions.option1.helpline}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call 1930 Now</span>
                </a>
              </div>

              {/* Option 2 */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
                <div className="text-xs font-bold text-white mb-1">
                  {report.escalationOptions.option2.title}
                </div>
                <div className="text-xs text-slate-300 space-y-1 mb-2 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{report.escalationOptions.option2.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{report.escalationOptions.option2.phone}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Dedicated incident dispatch team for rapid forensic triage and provider liaison.
                </p>
              </div>
            </div>

            {/* Higher Level Escalation Trigger (Levels 2 to 5) */}
            <div className="mt-3 pt-3 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Higher Level Specialist Escalation
                </span>
                <span className="text-[10px] text-slate-300">
                  Mobilize Level 2 to Level 5 task forces (2 to 5 dedicated fraud and forensic specialists).
                </span>
              </div>
              <button
                type="button"
                onClick={() => onTriggerAction && onTriggerAction('escalate')}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all"
              >
                <span>Escalate Higher Level (2-5 Members)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* NEXT STEP */}
        <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                NEXT STEP
              </span>
              <p className="text-xs text-slate-200 font-medium">{report.nextStep}</p>
            </div>
          </div>

          {/* Action triggers */}
          {onTriggerAction && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onTriggerAction('ticket')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Create Support Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerAction('checklist')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Safety Checklist</span>
              </button>
              <button
                type="button"
                onClick={() => onTriggerAction('plan')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Prevention Plan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
