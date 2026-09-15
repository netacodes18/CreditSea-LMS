import Link from 'next/link';
import { ShieldCheck, Sliders, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import LandingNavActions from '@/components/LandingNavActions';

const STEPS = [
  { n: '01', title: 'Sign Up & Login', desc: 'Secure JWT auth with hashed passwords.' },
  { n: '02', title: 'Personal Details', desc: 'A server-side Business Rule Engine checks eligibility instantly.' },
  { n: '03', title: 'Upload Salary Slip', desc: 'PDF/JPG/PNG, verified and linked to your application.' },
  { n: '04', title: 'Configure & Apply', desc: 'Pick amount & tenure, watch live simple-interest math.' },
];

const MODULES = [
  { name: 'Sales', color: '#f97316', desc: 'Track leads before they apply.' },
  { name: 'Sanction', color: '#d97706', desc: 'Approve or reject applied loans.' },
  { name: 'Disbursement', color: '#059669', desc: 'Release funds, move loans live.' },
  { name: 'Collection', color: '#0891b2', desc: 'Record UTR-verified repayments.' },
];

export default function Home() {
  return (
    <div className="bg-[var(--paper)] min-h-screen overflow-x-hidden">
      <header className="relative z-50">
        <nav className="flex items-center justify-between p-6 lg:px-10 max-w-7xl mx-auto" aria-label="Global">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--ink)] font-bold border border-[var(--line)]" style={{ backgroundColor: '#f97316' }}>
              L
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--ink)]">LMS</span>
          </Link>
          <LandingNavActions />
        </nav>
      </header>

      {/* Hero */}
      <div className="relative isolate">
        <div
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="mx-auto max-w-3xl px-6 pt-12 text-center relative">
          <div className="inline-flex items-center gap-1.5 neo-chip animate-fade-up" style={{ backgroundColor: '#fff' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" /> Loan management, simplified
          </div>
          <h1
            className="mt-6 text-5xl sm:text-6xl font-bold tracking-tight text-[var(--ink)] leading-[1.05] animate-fade-up"
            style={{ animationDelay: '0.05s' }}
          >
            We handle every loan,{' '}
            <span style={{ color: '#f97316' }}>application to repayment.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--ink)]/70 font-medium animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Borrowers apply in minutes with an instant eligibility check. Your team sanctions,
            disburses, and collects — all from one role-gated, fully auditable console.
          </p>
          <div className="mt-9 flex items-center justify-center gap-x-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <LandingNavActions variant="hero" />
          </div>
        </div>

        {/* floating micro-badges */}
        <div className="hidden sm:block absolute left-[8%] top-[18%] neo-chip animate-float" style={{ backgroundColor: '#fff' }}>
          Borrower
        </div>
        <div className="hidden sm:block absolute right-[10%] top-[24%] neo-chip animate-float" style={{ backgroundColor: '#fff', animationDelay: '0.6s' }}>
          Sanction
        </div>

        {/* device + stat card composition */}
        <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-16">
          <div className="relative mx-auto w-[280px] sm:w-[300px]">
            <div className="hidden md:block absolute -left-48 top-8 animate-float">
              <StatCard label="Approval Rate" value="94%" delta="+6.2%" accent="#059669" />
            </div>
            <div className="hidden md:block absolute -right-52 top-0 animate-float" style={{ animationDelay: '1s' }}>
              <StatCard label="Avg. Disbursal" value="1.8 days" delta="-32%" accent="#2563eb" down />
            </div>
            <div className="hidden lg:flex absolute -right-28 bottom-10 items-center gap-1.5 neo-chip animate-float" style={{ backgroundColor: '#0f2033', color: '#f97316', animationDelay: '1.6s' }}>
              <TrendingUp className="w-3.5 h-3.5" /> 12% p.a.
            </div>

            {/* phone frame */}
            <div className="relative rounded-[2.25rem] bg-[var(--ink)] p-2.5 animate-float" style={{ boxShadow: '0 30px 60px -20px rgba(15,32,51,0.45)', animationDelay: '0.3s' }}>
              <div className="rounded-[1.75rem] bg-white overflow-hidden aspect-[9/17] relative">
                <div className="absolute top-0 inset-x-0 h-6 flex items-center justify-center">
                  <div className="w-20 h-4 bg-[var(--ink)] rounded-full mt-1.5" />
                </div>
                <div className="pt-9 px-4 pb-4 h-full flex flex-col">
                  <p className="text-[10px] font-bold text-[var(--ink)]/50 uppercase tracking-widest">Apply for a Loan</p>
                  <p className="mt-1 text-lg font-bold text-[var(--ink)] leading-tight">Get sanctioned<br />in minutes.</p>

                  <div className="mt-5 rounded-xl p-4 border border-[var(--line)]" style={{ backgroundColor: '#f97316' }}>
                    <p className="text-[10px] text-[var(--ink)]/70 uppercase tracking-wide font-bold">Loan Amount</p>
                    <p className="text-2xl font-bold text-[var(--ink)] mt-0.5">₹2,00,000</p>
                    <div className="mt-3 h-2 rounded-full bg-white border border-[var(--ink)]">
                      <div className="h-full w-2/5 rounded-full bg-[var(--ink)]" />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-[var(--line)] p-2.5">
                      <p className="text-[9px] text-[var(--ink)]/50 uppercase font-bold">Tenure</p>
                      <p className="text-xs font-bold text-[var(--ink)] mt-0.5">180 days</p>
                    </div>
                    <div className="rounded-xl border border-[var(--line)] p-2.5">
                      <p className="text-[9px] text-[var(--ink)]/50 uppercase font-bold">Interest</p>
                      <p className="text-xs font-bold text-[var(--ink)] mt-0.5">₹11,835</p>
                    </div>
                  </div>

                  <div className="mt-2.5 rounded-xl bg-[var(--paper)] p-3 flex items-center justify-between">
                    <span className="text-[9px] text-[var(--ink)]/50 uppercase font-bold tracking-wide">Total repayment</span>
                    <span className="text-sm font-bold text-[var(--ink)]">₹2,11,835</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {[
                      ['Eligibility check', 'Passed'],
                      ['Salary slip', 'Verified'],
                      ['PAN & KYC', 'Matched'],
                    ].map(([label, state]) => (
                      <div key={label} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="text-[10px] text-[var(--ink)]/60 flex-1">{label}</span>
                        <span className="text-[10px] font-semibold text-emerald-700">{state}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 rounded-full">
                    <div className="rounded-full py-2.5 text-center text-xs font-bold text-white" style={{ backgroundColor: '#f97316' }}>
                      Submit Application
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrower journey */}
      <div className="mx-auto max-w-6xl px-6 pb-28 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--ink)]/50">Borrower Journey</p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--ink)] tracking-tight">Four steps to a decision</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="neo-card p-6 relative overflow-hidden group hover:-translate-y-1  transition-all duration-200">
              <span className="text-5xl font-bold text-[var(--ink)]/10 absolute top-3 right-4">{s.n}</span>
              <p className="relative font-bold text-[var(--ink)] mb-1.5">{s.title}</p>
              <p className="relative text-sm text-[var(--ink)]/60 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ops modules */}
      <div className="relative py-28 bg-[var(--ink)] border-y-[3px] border-[var(--ink)]">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#f97316' }}>Operations Dashboard</p>
            <h2 className="mt-2 text-3xl font-bold text-white tracking-tight">One console, four teams, zero overlap</h2>
            <p className="mt-3 text-white/60 max-w-xl mx-auto font-medium">Each role sees only their module. Admin sees everything. Enforced on the server, not just hidden in the UI.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => (
              <div key={m.name} className="rounded-2xl p-6 border border-white/25/15 hover:border-white hover:-translate-y-1 transition-all duration-200" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-[var(--ink)] border-2 border-white" style={{ backgroundColor: m.color }}>
                  {m.name.charAt(0)}
                </div>
                <p className="font-bold text-white">{m.name}</p>
                <p className="text-sm text-white/50 mt-1 font-medium">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <TrustItem icon={ShieldCheck} title="RBAC everywhere" desc="Every route checked server-side. 403, not a hidden button." />
          <TrustItem icon={Sliders} title="Live BRE" desc="Age, salary, PAN, employment — validated the instant you apply." />
          <TrustItem icon={CheckCircle2} title="Auditable lifecycle" desc="APPLIED → SANCTIONED → DISBURSED → CLOSED, fully tracked." />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, accent, down = false }: { label: string; value: string; delta: string; accent: string; down?: boolean }) {
  const Icon = down ? TrendingDown : TrendingUp;
  return (
    <div className="neo-card-sm px-4 py-3 w-40">
      <p className="text-[10px] text-[var(--ink)]/50 uppercase tracking-wide font-bold">{label}</p>
      <p className="text-lg font-bold text-[var(--ink)] mt-0.5">{value}</p>
      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border border-[var(--ink)]" style={{ backgroundColor: accent, color: '#fff' }}>
        <Icon className="w-3 h-3" /> {delta}
      </div>
    </div>
  );
}

function TrustItem({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-[var(--line)]" style={{ backgroundColor: '#f97316' }}>
        <Icon className="w-5 h-5 text-[var(--ink)]" />
      </div>
      <div>
        <p className="font-bold text-[var(--ink)]">{title}</p>
        <p className="text-sm text-[var(--ink)]/60 mt-1 font-medium">{desc}</p>
      </div>
    </div>
  );
}
