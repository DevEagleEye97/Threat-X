'use client';

const STEPS = [
  {
    num: '01',
    title: 'Submit suspicious content',
    desc: 'Paste a link, message, email, or upload a screenshot without opening it.',
  },
  {
    num: '02',
    title: 'Extract security indicators',
    desc: 'Deterministic engine breaks down domains, tokens, headers, and linguistic lures.',
  },
  {
    num: '03',
    title: 'Cross-reference threat intel',
    desc: 'Signals evaluated against multi-provider intelligence feeds and heuristics.',
  },
  {
    num: '04',
    title: 'AI evidence correlation',
    desc: 'Gemini synthesizes actor intent and maps techniques to the MITRE ATT&CK matrix.',
  },
  {
    num: '05',
    title: 'Deterministic risk calculation',
    desc: 'Weighted mathematical engine normalizes evidence into a transparent 0–100 score.',
  },
  {
    num: '06',
    title: 'Actionable response playbook',
    desc: 'Receive visual kill-chain attack reconstruction and immediate response guidance.',
  },
];

export function HowItWorksSteps() {
  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pt-6">
      <div className="text-center space-y-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">
          How THREATX Works
        </h3>
        <p className="text-xs text-slate-500">
          Zero-risk air-gapped investigation pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STEPS.map((s) => (
          <div
            key={s.num}
            className="p-3.5 rounded-xl border border-[#1E2738]/80 bg-[#0E131E] space-y-1 text-left"
          >
            <div className="text-indigo-400 font-mono font-bold text-xs">
              {s.num}
            </div>
            <div className="text-xs font-semibold text-slate-200">
              {s.title}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
