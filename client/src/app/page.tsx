import Link from 'next/link';
import { ShieldCheck, Sliders, Users2, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

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
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient"
            style={{
              backgroundImage: 'linear-gradient(120deg, #a855f7, #ec4899, #6366f1, #06b6d4)',
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-3xl py-32 sm:py-44">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ring-1 ring-violet-200 bg-violet-50 text-violet-700 mb-6 animate-fade-up">
              <Zap className="w-3.5 h-3.5" />
              MERN · Next.js · TypeScript
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl animate-fade-up" style={{ animationDelay: '0.05s' }}>
              Lending, <span className="text-gradient animate-gradient">reimagined.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              From a borrower&apos;s first application to the final repayment — a real-time eligibility
              engine, role-gated operations, and a fully auditable loan lifecycle.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <Link href="/register" className="btn-gradient px-6 py-3 text-sm inline-flex items-center gap-2">
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="text-sm font-semibold text-slate-900 group px-4 py-3">
                Sign in to your dashboard
                <span aria-hidden="true" className="group-hover:translate-x-1 inline-block transition-transform ml-1">→</span>
              </Link>
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
