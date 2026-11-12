import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SamplePreset {
  title: string;
  category: string;
  preview: string;
  fullText: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    title: 'Bank KYC & Account Block Warning',
    category: 'Banking / SMS Scam',
    preview: 'URGENT: Your bank account will be blocked within 2 hours. Update KYC now...',
    fullText:
      'URGENT: Dear customer, your SBI bank account will be permanently blocked within 2 hours due to unverified PAN card. Kindly click http://bit.ly/sbi-kyc-verify-2026 immediately to update details and share the OTP to prevent account freeze.',
  },
  {
    title: 'Electricity Bill Cutoff Threat',
    category: 'SMS Scam',
    preview: 'Electricity power supply will be disconnected tonight at 9:30 PM...',
    fullText:
      'Dear Consumer, Your electricity bill was not updated. Power will be disconnected tonight at 9:30 PM from the electricity office. Urgently call electricity officer immediately at 9876543210 or install http://tinyurl.com/power-pay-bill.apk to clear dues.',
  },
  {
    title: 'Customs Parcel & Drug Seizure Police Call',
    category: 'Phone Call / Extortion',
    preview: 'Customs Department: A parcel containing illegal narcotics has been seized in your name...',
    fullText:
      'Call transcript from +91-11-23000000 (claiming to be Customs & CBI): "Sir, a parcel addressed to you containing banned narcotics and fake passports was intercepted at Mumbai Airport. A police arrest warrant has been issued. Transfer ₹1,50,000 to our verification escrow account immediately to clear your name or officers will arrest you within 30 minutes."',
  },
  {
    title: 'Part-Time Task Job Scam (YouTube Likes)',
    category: 'Job Scam',
    preview: 'Earn ₹3,000 to ₹8,000 daily just by liking YouTube videos and rating hotels...',
    fullText:
      'Greetings! We have a lucrative part-time work-from-home vacancy. Earn ₹5,000 daily simply by subscribing to YouTube channels and taking screenshots. Instant payment directly to UPI. To unlock advanced VIP tasks, transfer a refundable deposit of ₹2,000 to our supervisor on Telegram @task_manager_india.',
  },
  {
    title: 'Legitimate Google Account Security Notification',
    category: 'Legitimate / Low Risk',
    preview: 'Google Account: A new sign-in was detected on Windows...',
    fullText:
      'Google Security Alert: Your Google Account was just signed into from a new Windows device. If this was you, you don’t need to do anything. If not, check activity at your official account settings: https://myaccount.google.com/notifications. Google will never ask for your password or verification code in an email.',
  },
  {
    title: 'UPI Order Refund QR Code Scam',
    category: 'UPI Fraud',
    preview: 'Refund of ₹2,500 is pending. Scan this QR code and enter UPI PIN to receive...',
    fullText:
      'Customer Care Notification: Dear user, your refund of ₹2,500 is approved for order #88419. Kindly open PhonePe or Google Pay, scan this attached merchant QR code, and enter your 6-digit UPI PIN to receive the refund credit in your bank account.',
  },
];

interface SampleScamPresetsProps {
  onSelect: (text: string) => void;
}

export const SampleScamPresets: React.FC<SampleScamPresetsProps> = ({ onSelect }) => {
  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Instant Test Scenarios & Real-World Samples
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-3">
        Click any real-world phishing sample to inspect how the 10-Factor Forensic Engine evaluates it:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {SAMPLE_PRESETS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(sample.fullText)}
            className="flex flex-col text-left p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {sample.category}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
              {sample.title}
            </span>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {sample.preview}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
