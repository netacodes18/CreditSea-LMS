import Link from 'next/link';
import { CheckCircle2, Circle, TrendingUp, Clock, UserPlus, ShieldCheck, FileText, Wallet } from 'lucide-react';

const PIPELINE = [
  { label: 'Applied', done: true },
  { label: 'Sanctioned', done: true },
  { label: 'Disbursed', done: true },
  { label: 'Closed', done: false },
];

const JOURNEY = [
  { icon: UserPlus, title: 'Create your account', desc: 'Takes under a minute.' },
  { icon: ShieldCheck, title: 'Instant eligibility check', desc: 'Age, income, PAN and employment.' },
  { icon: FileText, title: 'Upload your salary slip', desc: 'PDF, JPG or PNG up to 5 MB.' },
  { icon: Wallet, title: 'Pick amount & tenure', desc: 'See your repayment before you apply.' },
];

export default function AuthAside({ mode }: { mode: 'login' | 'register' }) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center px-14 py-12 bg-[var(--ink)]">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div
        className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full opacity-[0.12] blur-3xl"
        style={{ backgroundColor: '#f97316' }}
      />

      <div className="relative w-full max-w-md mx-auto animate-fade-up">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-7 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#f97316' }}
        >
          L
        </Link>

        {mode === 'login' ? (
          <>
            <h1 className="text-4xl font-bold tracking-tight leading-tight text-white">
              Welcome back to <span style={{ color: '#f97316' }}>LMS</span>
            </h1>
            <p className="mt-4 text-white/60 leading-relaxed">
              Pick up where you left off — track an application, or step into your operations
              console to sanction, disburse and collect.
            </p>

            {/* Loan status preview */}
            <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">Loan</p>
                  <p className="text-sm font-semibold text-white mt-0.5 font-mono">LN-4821</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                  Disbursed
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">Amount</p>
                  <p className="text-2xl font-bold text-white mt-0.5">₹2,00,000</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">Tenure</p>
                  <p className="text-sm font-semibold text-white mt-1">180 days</p>
                </div>
              </div>

              {/* Lifecycle pipeline */}
              <div className="mt-6 flex items-center">
                {PIPELINE.map((step, i) => (
                  <div key={step.label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      {step.done ? (
                        <CheckCircle2 className="w-4 h-4" style={{ color: '#f97316' }} />
                      ) : (
                        <Circle className="w-4 h-4 text-white/25" />
                      )}
                      <span className={`text-[9px] whitespace-nowrap ${step.done ? 'text-white/70' : 'text-white/30'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < PIPELINE.length - 1 && (
                      <div
                        className="flex-1 h-px mx-1 mb-4"
                        style={{ backgroundColor: PIPELINE[i + 1].done ? '#f97316' : 'rgba(255,255,255,0.15)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mini stats */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <TrendingUp className="w-4 h-4 mb-2" style={{ color: '#f97316' }} />
                <p className="text-lg font-bold text-white">94%</p>
                <p className="text-[11px] text-white/45">Approval rate</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <Clock className="w-4 h-4 mb-2" style={{ color: '#f97316' }} />
                <p className="text-lg font-bold text-white">1.8 days</p>
                <p className="text-[11px] text-white/45">Avg. disbursal</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight leading-tight text-white">
              Start your <span style={{ color: '#f97316' }}>loan journey</span>
            </h1>
            <p className="mt-4 text-white/60 leading-relaxed">
              Four short steps from sign-up to a sanctioned loan — with the interest math shown
              to you before you commit.
            </p>

            <div className="mt-9 space-y-3">
              {JOURNEY.map((step, i) => (
                <div
                  key={step.title}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}
                  >
                    <step.icon className="w-[18px] h-[18px]" style={{ color: '#f97316' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      <span className="text-white/35 mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                      {step.title}
                    </p>
                    <p className="text-[12px] text-white/45 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
