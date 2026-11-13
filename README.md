# FraudGuard AI

**Intelligent Fraud Prevention & Cybersecurity Assistant**

FraudGuard AI is a full-stack cybersecurity and fraud prevention web application designed to protect individuals, families, and businesses from scams, phishing attempts, fraudulent investments, malicious links, identity theft, banking/UPI fraud, and OTP compromise.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and an **Express + Node.js** backend powered by a deterministic **10-Factor Forensic Scam Analysis Engine** and optional **Google GenAI (`@google/genai`)** server-side evaluation.

---

## Key Features

### 1. Pre-Chat Security Intake
Collects user context prior to triage to tailor risk thresholds and containment recommendations:
- **User Category**: Student, Working Professional, Business Owner, Senior Citizen, Parent, Other
- **Primary Concern**: SMS Scam, Email Scam, Phone Call Scam, Investment Scam, Job Scam, Website Verification, Banking Fraud, UPI Fraud, Identity Theft, Other
- **Risk Urgency**: Just Curious, Suspicious Activity, Financial Loss Already Happened

*(Tip: Append `?autostart=1` to the URL to skip the intake modal and jump directly into the console.)*

### 2. Instant 10-Factor Scam Analysis Framework
Evaluates pasted SMS messages, phishing emails, URLs, investment offers, and call transcripts in **under 300ms** across 10 forensic dimensions:
- **A.** Urgency & artificial time pressure
- **B.** Threat & coercive language
- **C.** Personal data / PII requests (SSN, PAN, Aadhaar, passport)
- **D.** OTP, PIN, & 2FA credential harvesting
- **E.** Abnormal payment requests (crypto, gift cards, advance fees, UPI PIN)
- **F.** Unknown or suspicious links & shortened URLs
- **G.** Unusual rewards, lotteries, or prize baiting
- **H.** Institutional or brand impersonation
- **I.** Grammar and linguistic inconsistencies
- **J.** Unrealistic or guaranteed profit promises

Outputs standardized **Trust Reports** with:
- Risk Score (`0–100`) & Confidence Level
- Risk Badges:
  - `🟢 LOW RISK` (`0–30` — Safe)
  - `🟡 USE CAUTION` (`31–60` — Suspicious)
  - `🔴 FRAUD ALERT` (`61–100` — High Risk)
- Structured sections: **Summary**, **Analysis**, **Key Findings**, **10-Factor Breakdown**, **Recommended Actions**, **Escalation Options**, and **Next Step**.

### 3. Four Guided Security Workflows
- **Workflow 1 — Should I Trust This?**: Instant analysis of suspicious messages, links, or transcripts with real-world test presets.
- **Workflow 2 — Investment Opportunity Verification**: Evaluates company name, claimed returns, investment amount, website, and contact channel against Ponzi and advance-fee fraud markers.
- **Workflow 3 — OTP & Account Security**: Explains credential compromise risks, lists secrets that must never be shared, and provides an interactive containment checklist.
- **Workflow 4 — Customer Incident Report**: Captures incident details and compiles a downloadable/copyable **Official Incident Report Summary** alongside a tracked **Support Ticket**.

### 4. Multi-Tier Specialist Escalation Ladder (Levels 2–5)
Allows users to escalate critical or active-loss incidents to multi-disciplinary response teams of **2 to 5 specialists**:
- **Level 2 (2 Members)**: Dual Specialist Rapid Triage (`< 15 Minutes` SLA)
- **Level 3 (3 Members)**: Tri-Core Threat Containment (`< 8 Minutes` SLA)
- **Level 4 (4 Members)**: Quad Task Force & Statutory Action (`< 3 Minutes` SLA)
- **Level 5 (5 Members)**: Executive Crisis Council & Inter-Bank Red Alert (`< 60s Dispatch` SLA)

Also surfaces direct escalation channels:
- **Option 1**: National Cyber Crime Helpline — **1930**
- **Option 2**: FraudGuard Security Team (`support@fraudguard-demo.com` / `+1-555-123-4567`)

### 5. Action & Prevention Hub
- **Personalized Safety Checklist**: Dynamic defense items tailored to user profile and concern type with live completion scoring.
- **5-Phase Prevention Plan**: Actionable timeline covering Immediate Containment (`0–2 hrs`), Day 1 Remediation & Reporting, and Ongoing Hygiene.
- **Support Ticket Tracker**: View and manage generated incident cases and priorities.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Node.js, Express 4, `tsx`, `@google/genai`
- **Testing**: Node.js built-in test runner (`node:test` + `node:assert/strict`) executed via `tsx`

---

## Project Structure

```text
├── index.html                        # HTML entry point & metadata
├── metadata.json                     # App manifest metadata
├── package.json                      # Dependencies & npm scripts
├── server.ts                         # Express backend + Vite dev middleware + API routes
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite + Tailwind configuration
├── .env.example                      # Environment variable template
└── src/
    ├── App.tsx                       # Main application shell & state orchestration
    ├── index.css                     # Tailwind CSS v4 entry
    ├── main.tsx                      # React root mount
    ├── types/
    │   └── index.ts                  # Shared TypeScript interfaces
    ├── utils/
    │   ├── fraudAnalyzer.ts          # 10-Factor forensic engine, workflows & escalation logic
    │   └── fraudAnalyzer.test.ts     # Unit tests for core analysis & escalation logic
    └── components/
        ├── ActionCenter.tsx          # Checklists, prevention plan, tickets & escalation matrix
        ├── EscalationModal.tsx       # Levels 2–5 multi-member escalation dispatcher
        ├── Header.tsx                # Navigation bar, profile badge & 1930 helpline link
        ├── IncidentReportModal.tsx   # Workflow 4 incident report & ticket generator
        ├── InvestmentVerifierModal.tsx # Workflow 2 investment risk evaluator
        ├── OTPSecurityModal.tsx      # Workflow 3 OTP lockdown & containment guide
        ├── PreChatModal.tsx          # Pre-chat user category, concern & urgency intake
        ├── SampleScamPresets.tsx     # One-click real-world phishing test scenarios
        └── TrustReportView.tsx       # Structured Trust Report renderer
```

---

## Getting Started

### Prerequisites
- **Node.js** `v20+` (or `v22+` recommended)
- **npm** (or `bun`)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/fraudguard-ai.git
cd fraudguard-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and set your configuration values:
```bash
cp .env.example .env
```

Available variables:
- `GEMINI_API_KEY` *(Optional)*: Enables optional server-side deep analysis via `@google/genai` on `/api/analyze`. The app operates out-of-the-box with its deterministic sub-second forensic engine even without an external API key.
- `PORT` *(Optional)*: Server port (defaults to `3000`).

### 4. Run in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build & Run in Production
```bash
npm run build
NODE_ENV=production npm start
```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express + Vite development server on port `3000` |
| `npm run build` | Compiles the React frontend into `dist/` via Vite |
| `npm start` | Runs `server.ts` using `tsx` |
| `npm test` | Runs unit tests in `src/**/*.test.ts` via `tsx --test` |
| `npm run lint` | Runs TypeScript type-checking (`tsc --noEmit`) |

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns service health and configuration status |
| `POST` | `/api/analyze` | Evaluates suspicious text using the 10-Factor forensic engine (and optional `deepAnalysis` via Gemini) |
| `GET` | `/api/escalation-tiers` | Returns Level 2–5 escalation tier definitions and specialist rosters |
| `POST` | `/api/escalate` | Dispatches an escalation request for Levels `2` through `5` |

---

## Running Tests

Verify the core fraud analysis, investment verification, report generation, and multi-tier escalation logic:

```bash
npm test
```

Run TypeScript static checks:

```bash
npm run lint
```

---

## Disclaimer

FraudGuard AI provides automated risk indicators, educational cybersecurity guidance, and structured incident reporting tools. It does not constitute formal legal advice or law enforcement action. In the event of active financial fraud or unauthorized account access, immediately contact your bank and dial your national cyber crime helpline (e.g., **1930**).

---

## License

Apache-2.0
