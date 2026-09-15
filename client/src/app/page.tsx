import Link from 'next/link';
import { ShieldCheck, Sliders, Users2, ArrowRight, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

const STEPS = [
  { n: '01', title: 'Sign Up & Login', desc: 'Secure JWT auth with hashed passwords.' },
  { n: '02', title: 'Personal Details', desc: 'A server-side Business Rule Engine checks eligibility instantly.' },
  { n: '03', title: 'Upload Salary Slip', desc: 'PDF/JPG/PNG, verified and linked to your application.' },
  { n: '04', title: 'Configure & Apply', desc: 'Pick amount & tenure, watch live simple-interest math.' },
];

const MODULES = [
  { name: 'Sales', color: '#f59e0b', desc: 'Track leads before they apply.' },
  { name: 'Sanction', color: '#8b5cf6', desc: 'Approve or reject applied loans.' },
  { name: 'Disbursement', color: '#10b981', desc: 'Release funds, move loans live.' },
  { name: 'Collection', color: '#06b6d4', desc: 'Record UTR-verified repayments.' },
];

export default function Home() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-10" aria-label="Global">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold shadow-glow animate-gradient"
              style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #db2777, #6366f1)' }}
            >
              L
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">LMS</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-slate-700 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white btn-gradient px-5 py-2.5">
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative isolate overflow-hidden pt-14">
        {/* pastel mesh backdrop */}
        <div
          className="absolute inset-0 -z-20"
          style={{ background: 'linear-gradient(160deg, #eef4ff 0%, #eef0ff 30%, #f3ecff 60%, #eee6fd 100%)' }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-80"
          style={{
            backgroundImage:
              'radial-gradient(at 15% 15%, rgba(56,189,248,0.35) 0px, transparent 45%), radial-gradient(at 85% 10%, rgba(167,139,250,0.35) 0px, transparent 45%), radial-gradient(at 90% 80%, rgba(129,140,248,0.3) 0px, transparent 45%), radial-gradient(at 10% 85%, rgba(56,189,248,0.25) 0px, transparent 45%)',
          }}
        />

        <div className="mx-auto max-w-3xl px-6 pt-16 text-center relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-900/5 shadow-sm animate-fade-up">
            Loan Management, simplified
          </div>
          <h1
            className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] animate-fade-up"
            style={{ animationDelay: '0.05s' }}
          >
We handle every loan, application to repayment.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Borrowers apply in minutes with an instant eligibility check. Your team sanctions,
            disburses, and collects — all from one role-gated, fully auditable console.
          </p>
          <div className="mt-9 flex items-center justify-center gap-x-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <Link
              href="/register"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white inline-flex items-center gap-2 shadow-[0_10px_30px_-8px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 transition-transform"
              style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #6366f1, #8b5cf6)' }}
            >
              Explore the platform <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="text-sm font-semibold text-slate-900 group px-4 py-3">
              Sign in to your dashboard
              <span aria-hidden="true" className="group-hover:translate-x-1 inline-block transition-transform ml-1">→</span>
            </Link>
          </div>
        </div>

        {/* floating micro-badges */}
        <FloatingPill className="hidden sm:flex left-[8%] top-[16%]" delay="0s">Borrower</FloatingPill>
        <FloatingPill className="hidden sm:flex right-[10%] top-[22%]" delay="0.6s">Sanction</FloatingPill>

        {/* device + stat card composition */}
        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-16">
          <div className="relative mx-auto w-[280px] sm:w-[300px]">
            {/* floating stat cards */}
            <div className="hidden md:block absolute -left-44 top-10 animate-float">
              <StatCard label="Approval Rate" value="94%" delta="+6.2%" accent="#10b981" />
            </div>
            <div className="hidden md:block absolute -right-48 top-2 animate-float" style={{ animationDelay: '1s' }}>
              <StatCard label="Avg. Disbursal" value="1.8 days" delta="-32%" accent="#6366f1" down />
            </div>
            <div className="hidden lg:flex absolute -right-24 bottom-8 items-center gap-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 shadow-lg animate-float" style={{ animationDelay: '1.6s' }}>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> 12% p.a.
            </div>

            {/* phone frame */}
            <div className="relative rounded-[2.5rem] bg-slate-900 p-2.5 shadow-2xl rotate-[-3deg] animate-float" style={{ animationDelay: '0.3s' }}>
              <div className="rounded-[2rem] bg-white overflow-hidden aspect-[9/18.5] relative">
                <div className="absolute top-0 inset-x-0 h-6 flex items-center justify-center">
                  <div className="w-20 h-4 bg-slate-900 rounded-full mt-1.5" />
                </div>
                <div className="pt-9 px-4 pb-4 h-full flex flex-col">
                  <p className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">Apply for a Loan</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 leading-tight">Get sanctioned<br />in minutes.</p>

                  <div className="mt-5 rounded-2xl p-4 text-white" style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
                    <p className="text-[10px] opacity-80 uppercase tracking-wide">Loan Amount</p>
                    <p className="text-2xl font-extrabold mt-0.5">₹2,00,000</p>
                    <div className="mt-3 h-1.5 rounded-full bg-white/25">
                      <div className="h-full w-2/5 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <p className="text-[9px] text-slate-400 uppercase">Tenure</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">180 days</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <p className="text-[9px] text-slate-400 uppercase">Interest</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">₹11,835</p>
                    </div>
                  </div>

                  <div className="mt-auto rounded-full py-2.5 text-center text-xs font-bold text-white" style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #6366f1)' }}>
                    Submit Application
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
          <p className="text-xs font-semibold tracking-widest uppercase text-violet-500">Borrower Journey</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">Four steps to a decision</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card-surface p-6 relative overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300">
              <span className="text-5xl font-black text-slate-100 absolute top-3 right-4 group-hover:text-violet-100 transition-colors">{s.n}</span>
              <p className="relative font-bold text-slate-900 mb-1.5">{s.title}</p>
              <p className="relative text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ops modules */}
      <div className="relative py-28 mesh-bg">
        <div className="absolute inset-0 bg-white/90" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-pink-500">Operations Dashboard</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">One console, four teams, zero overlap</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">Each role sees only their module. Admin sees everything. Enforced on the server, not just hidden in the UI.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => (
              <div key={m.name} className="glass-panel rounded-2xl p-6 hover:-translate-y-1.5 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white shadow-md" style={{ backgroundColor: m.color }}>
                  <Users2 className="w-5 h-5" />
                </div>
                <p className="font-bold text-slate-900">{m.name}</p>
                <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
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

function FloatingPill({ children, className = '', delay = '0s' }: { children: React.ReactNode; className?: string; delay?: string }) {
  return (
    <div
      className={`absolute z-10 items-center gap-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold pl-2.5 pr-3 py-1.5 shadow-lg animate-float ${className}`}
      style={{ animationDelay: delay }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      {children}
      <span className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 rotate-45" />
    </div>
  );
}

function StatCard({ label, value, delta, accent, down = false }: { label: string; value: string; delta: string; accent: string; down?: boolean }) {
  const Icon = down ? TrendingDown : TrendingUp;
  return (
    <div className="glass-panel rounded-2xl px-4 py-3 w-40 shadow-xl">
      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-extrabold text-slate-900 mt-0.5">{value}</p>
      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${accent}1a`, color: accent }}>
        <Icon className="w-3 h-3" /> {delta}
      </div>
    </div>
  );
}

function TrustItem({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
