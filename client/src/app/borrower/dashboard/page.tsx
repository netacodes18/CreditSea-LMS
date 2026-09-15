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
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-500 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="mt-2 text-slate-500">Welcome to your LMS dashboard. Complete your profile to check loan eligibility and get started.</p>
      </div>

      <div className="card-surface relative overflow-hidden p-8 mesh-bg">
        <div className="absolute inset-0 bg-white/85" />
        <div className="relative">
          <h2 className="text-xl font-bold text-slate-900">Ready when you are</h2>
          <p className="mt-2 text-slate-600 max-w-xl">
            Head over to <span className="font-semibold text-indigo-600">My Profile</span> to complete your details and check your loan eligibility, then apply in a few clicks.
          </p>
          <Link
            href="/borrower/profile"
            className="btn-gradient px-6 py-3 text-sm inline-flex items-center gap-2 mt-6"
          >
            Complete Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick links</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((m) => (
            <Link
              key={m.name}
              href={m.href as any}
              className="card-surface p-5 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity bg-indigo-500" />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white shadow-md bg-indigo-500">
                <m.icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-900">{m.name}</p>
              <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
