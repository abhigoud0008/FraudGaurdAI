import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  X,
  Copy,
  Check,
  Download,
  Share2,
  PhoneCall,
  Mail,
  ShieldAlert,
  Send,
  Ticket
} from 'lucide-react';
import { ConcernType, IncidentReportData, SupportTicket, UserCategory } from '../types';
import { generateIncidentSummary, generateSupportTicket } from '../utils/fraudAnalyzer';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScamType?: ConcernType;
  defaultUserCategory?: UserCategory;
  onTicketCreated?: (ticket: SupportTicket) => void;
  onReportGenerated?: (summary: string) => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  defaultScamType = 'SMS Scam',
  defaultUserCategory = 'Working Professional',
  onTicketCreated,
  onReportGenerated,
}) => {
  const [formData, setFormData] = useState<IncidentReportData>({
    name: '',
    scamType: defaultScamType,
    date: new Date().toISOString().split('T')[0],
    description: '',
    estimatedLoss: '',
    userCategory: defaultUserCategory,
    contactEmail: '',
    contactPhone: '',
    evidenceNotes: '',
  });

  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const summary = generateIncidentSummary(formData);
    const ticket = generateSupportTicket(formData);

    setGeneratedSummary(summary);
    setCreatedTicket(ticket);

    if (onReportGenerated) onReportGenerated(summary);
    if (onTicketCreated) onTicketCreated(ticket);
  };

  const handleCopy = () => {
    if (!generatedSummary) return;
    navigator.clipboard.writeText(generatedSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedSummary) return;
    const blob = new Blob([generatedSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FraudGuard-Incident-Report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close Incident Report Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                WORKFLOW 4
              </span>
              <h2 className="text-xl font-bold text-white">Customer Incident Report</h2>
            </div>
            <p className="text-xs text-slate-400">
              Generate standardized incident record ready for submission to bank & cyber law enforcement
            </p>
          </div>
        </div>

        {!generatedSummary ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Complainant Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Incident Scam Type *
                </label>
                <select
                  value={formData.scamType}
                  onChange={(e) => setFormData({ ...formData, scamType: e.target.value as ConcernType })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="SMS Scam">SMS Scam</option>
                  <option value="Email Scam">Email Scam</option>
                  <option value="Phone Call Scam">Phone Call Scam</option>
                  <option value="Investment Scam">Investment Scam</option>
                  <option value="Job Scam">Job Scam</option>
                  <option value="Website Verification">Website Verification</option>
                  <option value="Banking Fraud">Banking Fraud</option>
                  <option value="UPI Fraud">UPI Fraud</option>
                  <option value="Identity Theft">Identity Theft</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date of Occurrence *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimated Financial Loss ($ or ₹) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.estimatedLoss}
                  onChange={(e) => setFormData({ ...formData, estimatedLoss: e.target.value })}
                  placeholder="e.g. $500 or ₹45,000 or $0 (None)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description of Incident & Modus Operandi *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe how the contact was initiated, links clicked, false statements made, or transaction steps..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="victim@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Evidence Notes (URL, phone number, transaction IDs)
                </label>
                <input
                  type="text"
                  value={formData.evidenceNotes}
                  onChange={(e) => setFormData({ ...formData, evidenceNotes: e.target.value })}
                  placeholder="TXN #987654321, caller +1-800-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <FileText className="w-4 h-4" />
              <span>Compile Official Incident Report & Support Ticket</span>
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Created Ticket Pill */}
            {createdTicket && (
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-[10px] text-indigo-300 font-semibold block">SUPPORT TICKET GENERATED</span>
                    <span className="text-sm font-bold text-white font-mono">{createdTicket.ticketId}</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  {createdTicket.priority} Priority
                </span>
              </div>
            )}

            {/* Generated Summary Box */}
            <div className="relative">
              <pre className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-64">
                {generatedSummary}
              </pre>

              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Copy Report"
                  aria-label="Copy Report Summary"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Download TXT"
                  aria-label="Download Report as Text File"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Escalation Options Card */}
            <div className="border border-rose-500/30 bg-rose-950/20 rounded-xl p-4">
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Mandatory Escalation Channels
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="font-bold text-white mb-0.5">Option 1: Cyber Crime Helpline</div>
                  <div className="font-mono text-rose-400 font-bold">1930</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">For immediate bank transaction freeze.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="font-bold text-white mb-0.5">Option 2: FraudGuard Security Team</div>
                  <div className="font-mono text-indigo-400 text-[11px]">support@fraudguard-demo.com</div>
                  <div className="font-mono text-slate-300 text-[11px]">+1-555-123-4567</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setGeneratedSummary(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                File Another Report
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
              >
                Close & Return to Console
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
