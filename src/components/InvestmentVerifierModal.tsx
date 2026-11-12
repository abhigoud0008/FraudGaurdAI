import React, { useState } from 'react';
import {
  TrendingUp,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  X,
  ShieldCheck,
  Building,
  DollarSign,
  Percent,
  Globe,
  Phone,
  FileCheck2,
} from 'lucide-react';
import { InvestmentData, InvestmentResult } from '../types';
import { verifyInvestment } from '../utils/fraudAnalyzer';

interface InvestmentVerifierProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (result: InvestmentResult, data: InvestmentData) => void;
}

export const InvestmentVerifierModal: React.FC<InvestmentVerifierProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [formData, setFormData] = useState<InvestmentData>({
    companyName: '',
    claimedReturns: '',
    investmentAmount: '',
    website: '',
    contactInfo: '',
  });

  const [result, setResult] = useState<InvestmentResult | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evaluation = verifyInvestment(formData);
    setResult(evaluation);
  };

  const handleApplyPreset = (preset: InvestmentData) => {
    setFormData(preset);
    const evaluation = verifyInvestment(preset);
    setResult(evaluation);
  };

  const handlePostToConsole = () => {
    if (result && onSendToChat) {
      onSendToChat(result, formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close Investment Verifier"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                WORKFLOW 2
              </span>
              <h2 className="text-xl font-bold text-white">Investment Opportunity Verification</h2>
            </div>
            <p className="text-xs text-slate-400">
              Cross-examine promised returns against Ponzi markers and regulatory standards
            </p>
          </div>
        </div>

        {/* Quick presets for testing */}
        <div className="mb-6 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Load Quick Test Cases:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleApplyPreset({
                  companyName: 'Apex Capital Quantum Yield',
                  claimedReturns: 'Guaranteed 40% monthly returns risk-free',
                  investmentAmount: '$2,500',
                  website: 'https://t.me/apexquantum_vip',
                  contactInfo: 'WhatsApp +44-7911-123456 (Admin Only)',
                })
              }
              className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300"
            >
              🚩 High Yield Telegram Scam
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset({
                  companyName: 'Vanguard Total Stock Market Index (VTSAX)',
                  claimedReturns: 'Historical market average ~8-10% annually with market risk',
                  investmentAmount: '$3,000',
                  website: 'https://investor.vanguard.com',
                  contactInfo: 'Official registered hotline 1-800-662-7447',
                })
              }
              className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300"
            >
              ✅ Legitimate Registered Index Fund
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                1. Company / Scheme Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Apex High Growth Trust"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
                2. Claimed / Promised Returns
              </label>
              <input
                type="text"
                required
                value={formData.claimedReturns}
                onChange={(e) => setFormData({ ...formData, claimedReturns: e.target.value })}
                placeholder="e.g. Guaranteed 30% monthly / double in 15 days"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                3. Proposed Investment Amount
              </label>
              <input
                type="text"
                value={formData.investmentAmount}
                onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                placeholder="e.g. $1,000 or ₹50,000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                4. Website or Platform URL
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="e.g. https://apex-invest.club or telegram link"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              5. Contact Information Provided
            </label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              placeholder="e.g. WhatsApp only, Telegram admin @crypto_guru, or registered address"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Analyze Investment Proposal</span>
          </button>
        </form>

        {/* Evaluation Output */}
        {result && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  INVESTMENT RISK RATING
                </span>
                <span className="text-lg font-black text-white">{result.riskRating}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl border text-xs font-black tracking-wide bg-slate-900">
                {result.badge}
              </div>
            </div>

            {/* Red Flag Indicators checklist */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${result.unrealisticProfit ? 'border-rose-500/40 bg-rose-950/20 text-rose-300' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                <span>Unrealistic Profit Promises</span>
                <span>{result.unrealisticProfit ? '⚠️ YES' : '✅ NO'}</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${result.guaranteedReturns ? 'border-rose-500/40 bg-rose-950/20 text-rose-300' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                <span>Guaranteed Returns Claim</span>
                <span>{result.guaranteedReturns ? '⚠️ YES' : '✅ NO'}</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${result.highPressureTactics ? 'border-rose-500/40 bg-rose-950/20 text-rose-300' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                <span>High-Pressure Tactics</span>
                <span>{result.highPressureTactics ? '⚠️ YES' : '✅ NO'}</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${result.missingTransparency ? 'border-rose-500/40 bg-rose-950/20 text-rose-300' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                <span>Missing Regulated Contact</span>
                <span>{result.missingTransparency ? '⚠️ YES' : '✅ NO'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                EXPLANATION
              </h4>
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {result.explanation}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                SAFETY RECOMMENDATIONS
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.safetyRecommendation.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {onSendToChat && (
              <button
                type="button"
                onClick={handlePostToConsole}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Attach to Active FraudGuard Chat Console</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
