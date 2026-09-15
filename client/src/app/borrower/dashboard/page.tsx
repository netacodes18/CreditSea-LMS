import Link from 'next/link';
import { UserCircle2, FileStack, FilePlus2, Wallet, ArrowRight } from 'lucide-react';

const QUICK_LINKS = [
  { name: 'My Profile', href: '/borrower/profile', icon: UserCircle2, desc: 'Complete your details & check eligibility' },
  { name: 'Apply for a Loan', href: '/borrower/apply', icon: FilePlus2, desc: 'Configure amount & tenure' },
  { name: 'My Applications', href: '/borrower/applications', icon: FileStack, desc: 'Track application status' },
  { name: 'Payments', href: '/borrower/payments', icon: Wallet, desc: 'View history & pay EMIs' },
];

export default function BorrowerDashboard() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[var(--ink)]/50 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-bold text-[var(--ink)] tracking-tight">Dashboard</h1>
        <p className="mt-2 text-[var(--ink)]/60 font-medium">Welcome to your LMS dashboard. Complete your profile to check loan eligibility and get started.</p>
      </div>

      <div className="neo-card p-8">
        <h2 className="text-xl font-bold text-[var(--ink)]">Ready when you are</h2>
        <p className="mt-2 text-[var(--ink)]/70 max-w-xl font-medium">
          Head over to <span className="font-bold">My Profile</span> to complete your details and check your loan eligibility, then apply in a few clicks.
        </p>
        <Link
          href="/borrower/profile"
          className="neo-btn px-6 py-3 text-sm inline-flex items-center gap-2 mt-6"
        >
          Complete Profile <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div>
        <h2 className="text-sm font-bold text-[var(--ink)]/50 uppercase tracking-widest mb-3">Quick links</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((m) => (
            <Link
              key={m.name}
              href={m.href as any}
              className="neo-card p-5 group hover:-translate-y-1  transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white border border-[var(--line)]"
                style={{ backgroundColor: '#2563eb' }}
              >
                <m.icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-[var(--ink)]">{m.name}</p>
              <p className="text-xs text-[var(--ink)]/60 mt-1 font-medium">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
