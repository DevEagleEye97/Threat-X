# THREATX

> **“Don’t click it. Investigate it.”**

An open-source, evidence-driven Digital Threat Investigation & Public Security Posture platform designed for air-gapped, zero-trust inspection of untrusted URLs, messages, screenshots, emails, and QR codes.

---

## 🛡️ Core Philosophy

```
INPUT  ──▶  EVIDENCE  ──▶  RISK  ──▶  ATTACK PATH  ──▶  ACTION
```

THREATX is **NOT** a generic AI phishing detector, **NOT** a chatbot, and **NOT** a generic vulnerability scanner. It is an evidence-first security investigation platform that answers:

1. **What is this?** — Strict input normalization and deterministic signal extraction.
2. **Why is it suspicious?** — 4-tier structured evidence classification (`OBSERVED`, `DETECTED`, `INFERRED`, `POTENTIAL`).
3. **What attack could this represent?** — MITRE ATT&CK style sequential kill-chain reconstruction.
4. **What could happen next?** — Threat DNA correlation against known scam patterns.
5. **What should I do?** — Tailored incident response playbooks based on user interaction level.
6. **Has my identity already been exposed?** — Privacy-preserving email breach verification and k-anonymity SHA-1 password check.
7. **How does this website present its public posture?** — Passive, defensive Site Check.

---

## ✨ Features

- **Multi-Vector Investigation Console**: Analyze URLs, screenshots, raw messages, phishing emails, and QR codes.
- **Deterministic 0–100 Risk Engine**: Mathematical score calculation based on empirical indicators (entropy, punycode, TLD risk, brand mimicry, and threat intelligence feeds).
- **Multi-Provider Threat Intel**: Parallel querying across Google Safe Browsing, PhishTank, URLhaus, and VirusTotal with mock fallbacks for offline development.
- **Threat DNA & Attack Path Reconstruction**: Visual graph rendering of attack progressions and shared threat signatures.
- **Interactive Incident Playbook**: Dynamic remediation plans based on real user actions (*“I haven't interacted”*, *“I entered my password”*, *“I entered payment info”*, etc.).
- **Passive Site Check**: Non-destructive evaluation of HTTPS/TLS, Security Headers (`HSTS`, `CSP`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), Cookie hygiene, Passive DNS, Certificate Transparency, Technology Exposure, and First vs Third-Party services.
- **Exposure Check**: K-anonymity breach validation without ever storing or transmitting plaintext passwords.
- **Threat Feed**: Editorial scam intelligence publication with categorizations and delivery vectors.
- **Zero AI-Slop Design**: Dark technical surfaces (`#07090D`), refined typography, subtle 2–5% Threat Matrix signal canvas, and zero fake telemetry.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm, pnpm, or yarn

### 2. Installation

```bash
git clone https://github.com/DevEagleEye97/Threat-X.git
cd Threat-X
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# AI Reasoning Provider (OpenRouter or Google Gemini)
OPENROUTER_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here

# Threat Intelligence Feeds (Optional - fallback mock engines active by default)
GOOGLE_SAFE_BROWSING_API_KEY=your_key_here
VIRUSTOTAL_API_KEY=your_key_here
PHISHTANK_API_KEY=your_key_here
```

*(Note: THREATX will run fully with deterministic heuristic engines and mock threat intelligence even without external API keys).*

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the console.

### 5. Running Tests

```bash
npm test
```

---

## 🔒 Security Directives & Architecture

- **SSRF & Egress Defense**: Pre-resolution DNS validation blocking RFC 1918, RFC 3927 (AWS/GCP metadata `169.254.169.254`), loopbacks, and link-local ranges.
- **Dual-Boundary Prompt Injection Defense**: Untrusted external target content is encapsulated in strict boundary tags. Adversarial prompt injections are treated as empirical threat signals.
- **Deterministic Risk Invariant**: Mathematical scoring is decoupled from LLM output. AI acts as an interpreter, not the source of truth.
- **No Client Secrets**: Zero client-side API keys, zero persistent client payload data.
- **Passive & Defensive**: Site Check executes only safe, publicly observable queries. No exploitation, brute-forcing, or destructive scanning.

---

## 📜 License

Licensed under the [MIT License](LICENSE).
