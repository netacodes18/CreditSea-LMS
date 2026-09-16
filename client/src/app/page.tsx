import {
  ShieldCheck, Sliders, CheckCircle2, Calculator, Lock, Users2, Receipt,
  FileCheck2, Zap, ScrollText, Fingerprint,
} from 'lucide-react';
import LandingNavActions from '@/components/LandingNavActions';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import DashboardPreview from '@/components/landing/DashboardPreview';
import PhonePreview from '@/components/landing/PhonePreview';
import FinalCta from '@/components/landing/FinalCta';

const MODULES = [
  { name: 'Sales', color: '#f97316', desc: 'Track registered leads before they apply.' },
  { name: 'Sanction', color: '#d97706', desc: 'Review applied loans, approve or reject with a reason.' },
  { name: 'Disbursement', color: '#2563eb', desc: 'Release funds against sanctioned loans.' },
  { name: 'Collection', color: '#059669', desc: 'Record UTR-verified repayments until closure.' },
];

const STEPS = [
  { n: '01', title: 'Create your account', desc: 'Sign up as a borrower. Passwords are hashed and sessions run on httpOnly cookies.' },
  { n: '02', title: 'Pass the eligibility check', desc: 'A server-side rule engine checks age, monthly income, PAN format and employment mode.' },
  { n: '03', title: 'Upload your salary slip', desc: 'PDF, JPG or PNG up to 5 MB, validated and linked to your application.' },
  { n: '04', title: 'Configure and apply', desc: 'Choose amount and tenure, see the exact interest and total repayment, then submit.' },
];

const BENEFITS = [
  { icon: Zap, title: 'Decisions in seconds, not days', desc: 'Eligibility runs on the server the moment details are submitted — no manual pre-screening queue.' },
  { icon: ScrollText, title: 'Every transition is accounted for', desc: 'A loan can only move APPLIED → SANCTIONED → DISBURSED → CLOSED, and only by the role that owns that stage.' },
  { icon: Receipt, title: 'Repayments that reconcile', desc: 'Each payment carries a unique UTR, balances update atomically, and loans close themselves on the final rupee.' },
];

const SECURITY = [
  { icon: Lock, title: 'Hashed credentials', desc: 'Passwords stored with bcrypt; tokens issued as httpOnly cookies, not readable by scripts.' },
  { icon: ShieldCheck, title: 'Server-enforced RBAC', desc: 'Every route re-checks the role. Unauthorized calls get a 403 even if the UI is bypassed.' },
  { icon: Fingerprint, title: 'Duplicate-proof payments', desc: 'UTR numbers are unique at the database level, so the same transfer cannot be recorded twice.' },
  { icon: FileCheck2, title: 'Validated uploads', desc: 'Salary slips are restricted by MIME type and capped at 5 MB before they ever reach storage.' },
];

import { cookies } from 'next/headers';

export default function Home() {
  const cookieStore = cookies();
  const hasToken = cookieStore.has('token');

  return (
    <div className="bg-[var(--paper)] min-h-screen overflow-x-hidden">
      <SiteHeader hasToken={hasToken} />

      {/* ---------- Hero ---------- */}
      <section className="relative isolate pt-10 sm:pt-16 pb-20 sm:pb-28">
        <div
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, #000 55%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, #000 55%, transparent 100%)',
          }}
        />
        <div
          className="absolute -z-10 left-1/2 -translate-x-1/2 top-0 w-[900px] h-[420px] rounded-full opacity-[0.07] blur-3xl"
          style={{ backgroundColor: '#f97316' }}
        />

        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 neo-chip bg-white animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#f97316' }} />
            Loan management, end to end
          </div>

          <h1
            className="mt-6 text-[2.6rem] leading-[1.08] sm:text-6xl sm:leading-[1.05] font-bold tracking-tight text-[var(--ink)] animate-fade-up"
            style={{ animationDelay: '0.05s' }}
          >
            We handle every loan,{' '}
            <span style={{ color: '#f97316' }}>application to repayment.</span>
          </h1>

          <p
            className="mt-5 sm:mt-6 text-base sm:text-lg leading-relaxed text-[var(--ink)]/65 max-w-xl mx-auto animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Borrowers apply in minutes with an instant eligibility check. Your team sanctions,
            disburses and collects — from one role-gated, fully auditable console.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: '0.15s' }}
          >
            <LandingNavActions variant="hero" hasToken={hasToken} />
          </div>

          <p className="mt-6 text-xs text-[var(--ink)]/45 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            ₹50,000 – ₹5,00,000 · 30 – 365 days · fixed 12% p.a. simple interest
          </p>
        </div>

        {/* Product preview composition */}
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8 mt-14 sm:mt-20">
          <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <DashboardPreview />
          </div>
          <div
            className="hidden lg:block absolute -right-2 -bottom-16 animate-float"
            style={{ animationDelay: '0.4s' }}
          >
            <PhonePreview />
          </div>
        </div>
      </section>

      {/* ---------- Capability bar ---------- */}
      <section className="border-y border-[var(--line)] bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            ['4 lifecycle stages', 'Applied to closed'],
            ['6 roles', 'Admin + 5 team roles'],
            ['12% p.a.', 'Fixed simple interest'],
            ['100% server-checked', 'Every protected route'],
          ].map(([value, label]) => (
            <div key={value}>
              <p className="text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight">{value}</p>
              <p className="text-xs sm:text-sm text-[var(--ink)]/50 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Product / modules (bento) ---------- */}
      <section id="product" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="The operations console"
            title="One console, four teams, zero overlap"
            sub="Each executive role sees only their own module. Admin sees everything. Enforced on the server, not just hidden in the UI."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {/* Feature highlight */}
            <div className="neo-card p-7 lg:row-span-2 flex flex-col">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(249,115,22,0.12)' }}>
                <Calculator className="w-5 h-5" style={{ color: '#f97316' }} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[var(--ink)] tracking-tight">Transparent loan maths</h3>
              <p className="mt-2 text-sm text-[var(--ink)]/60 leading-relaxed">
                Interest is simple, fixed and visible before submission — no surprise figures after approval.
              </p>

              <div className="mt-6 rounded-xl border border-[var(--line)] overflow-hidden">
                {[
                  ['Principal', '₹2,00,000'],
                  ['Tenure', '180 days'],
                  ['Interest @ 12% p.a.', '₹11,835'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)] last:border-0">
                    <span className="text-xs text-[var(--ink)]/55">{k}</span>
                    <span className="text-xs font-semibold text-[var(--ink)]">{v}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--paper)]">
                  <span className="text-xs font-bold uppercase tracking-wide text-[var(--ink)]/55">Total repayment</span>
                  <span className="text-base font-bold" style={{ color: '#f97316' }}>₹2,11,835</span>
                </div>
              </div>

              <p className="mt-4 text-[11px] font-mono text-[var(--ink)]/40">
                SI = (P × R × T) / (365 × 100)
              </p>
            </div>

            {/* Module cards */}
            {MODULES.map((m) => (
              <div
                key={m.name}
                className="neo-card p-6 group hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.name.charAt(0)}
                  </span>
                  <h3 className="font-bold text-[var(--ink)]">{m.name}</h3>
                </div>
                <p className="mt-3 text-sm text-[var(--ink)]/60 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28 bg-white border-y border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps to a decision"
            sub="The borrower journey, from sign-up to a loan you can track."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
            <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-[var(--line)]" aria-hidden />
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold relative z-10 bg-[var(--ink)]"
                >
                  {s.n}
                </div>
                <h3 className="mt-5 font-bold text-[var(--ink)]">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--ink)]/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Benefits ---------- */}
      <section id="benefits" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why LMS"
              title="Built around the lifecycle, not around forms"
              sub="Most of the work in lending is what happens after the application. This is designed for that part."
            />
            <div className="mt-8 space-y-6">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(249,115,22,0.12)' }}
                  >
                    <b.icon className="w-[18px] h-[18px]" style={{ color: '#f97316' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--ink)]">{b.title}</h3>
                    <p className="mt-1 text-sm text-[var(--ink)]/60 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lifecycle visual */}
          <div className="neo-card p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/45">Loan lifecycle</p>
            <div className="mt-6 space-y-1">
              {[
                { stage: 'APPLIED', owner: 'Borrower submits', color: '#d97706', done: true },
                { stage: 'SANCTIONED', owner: 'Sanction team approves', color: '#2563eb', done: true },
                { stage: 'DISBURSED', owner: 'Disbursement releases funds', color: '#0891b2', done: true },
                { stage: 'CLOSED', owner: 'Auto-closes on final payment', color: '#059669', done: false },
              ].map((s, i, arr) => (
                <div key={s.stage} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: s.done ? s.color : 'transparent', border: `2px solid ${s.color}` }}
                    />
                    {i < arr.length - 1 && <span className="w-px flex-1 my-1" style={{ backgroundColor: 'var(--line)' }} />}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-bold tracking-tight" style={{ color: s.color }}>{s.stage}</p>
                    <p className="text-xs text-[var(--ink)]/55 mt-0.5">{s.owner}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-5 border-t border-[var(--line)] flex items-start gap-2.5">
              <Users2 className="w-4 h-4 text-[var(--ink)]/40 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[var(--ink)]/55 leading-relaxed">
                A rejected application stops at sanction with a recorded reason — it never silently disappears.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Security / trust ---------- */}
      <section id="security" className="scroll-mt-20 py-20 sm:py-28 bg-[var(--ink)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#f97316' }}>Built-in safeguards</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              The rules are enforced where they matter
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Access control, validation and money movement are handled on the server — the interface is
              a convenience, never the last line of defence.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl p-6 border border-white/10 bg-white/[0.04] hover:border-white/25 transition-colors duration-200"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}
                >
                  <s.icon className="w-[18px] h-[18px]" style={{ color: '#f97316' }} />
                </div>
                <h3 className="font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* BRE rules */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4" style={{ color: '#f97316' }} />
              <p className="text-sm font-bold text-white">What the eligibility engine checks</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Age', '23 to 50 years'],
                ['Monthly income', '₹25,000 or above'],
                ['PAN', 'Valid ABCDE1234F format'],
                ['Employment', 'Salaried or self-employed'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">{k}</p>
                    <p className="text-xs text-white/50 mt-0.5">{v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FinalCta />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SectionHeading({
  eyebrow, title, sub, align = 'center',
}: { eyebrow: string; title: string; sub?: string; align?: 'center' | 'left' }) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'text-center max-w-2xl mx-auto' : ''}>
      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#f97316' }}>{eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">{title}</h2>
      {sub && <p className="mt-4 text-[var(--ink)]/60 leading-relaxed">{sub}</p>}
    </div>
  );
}
