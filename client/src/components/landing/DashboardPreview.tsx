import StatusBadge from '@/components/StatusBadge';
import { LayoutDashboard, FileStack, Banknote, Receipt, FileText, TrendingUp, Wallet } from 'lucide-react';

const NAV = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Loans', icon: FileStack },
  { name: 'Applications', icon: FileText },
  { name: 'Payments', icon: Receipt },
  { name: 'Documents', icon: Banknote },
];

const KPIS = [
  { icon: FileStack, label: 'Active loans', value: '128', accent: '#f97316' },
  { icon: TrendingUp, label: 'In review', value: '14', accent: '#d97706' },
  { icon: Banknote, label: 'Approved', value: '31', accent: '#2563eb' },
  { icon: Wallet, label: 'Total value', value: '₹2.46 Cr', accent: '#059669' },
];

const ROWS = [
  { id: 'LN-4821', email: 'a.sharma@example.com', amount: '₹2,00,000', status: 'DISBURSED' },
  { id: 'LN-4820', email: 'r.iyer@example.com', amount: '₹1,25,000', status: 'SANCTIONED' },
  { id: 'LN-4818', email: 'm.khan@example.com', amount: '₹75,000', status: 'APPLIED' },
  { id: 'LN-4815', email: 's.patel@example.com', amount: '₹3,40,000', status: 'CLOSED' },
];

export default function DashboardPreview() {
  return (
    <div className="neo-card overflow-hidden" style={{ boxShadow: '0 40px 80px -32px rgba(15,32,51,0.45)' }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-1 rounded-md bg-white border border-[var(--line)] text-[11px] text-[var(--ink)]/45 font-mono">
            lms.app/dashboard
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* App body */}
      <div className="flex bg-white min-h-[320px]">
        {/* Sidebar */}
        <div className="hidden sm:flex w-44 flex-col bg-[var(--ink)] py-4 px-3 gap-1">
          <div className="flex items-center gap-2 px-2 pb-4 mb-2 border-b border-white/10">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[11px] font-bold" style={{ backgroundColor: '#f97316' }}>
              L
            </div>
            <span className="text-white text-xs font-bold">LMS</span>
          </div>
          {NAV.map((n) => (
            <div
              key={n.name}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-[11px] font-semibold ${
                n.active ? 'text-white' : 'text-white/45'
              }`}
              style={n.active ? { backgroundColor: '#f97316' } : undefined}
            >
              <n.icon className="w-3.5 h-3.5" />
              {n.name}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/40">Loan portfolio</p>
          <h3 className="text-lg font-bold text-[var(--ink)] tracking-tight">Dashboard</h3>

          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {KPIS.map((k) => (
              <div key={k.label} className="rounded-lg border border-[var(--line)] p-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center mb-2" style={{ backgroundColor: `${k.accent}1a` }}>
                  <k.icon className="w-3.5 h-3.5" style={{ color: k.accent }} />
                </div>
                <p className="text-base font-bold text-[var(--ink)] leading-none">{k.value}</p>
                <p className="text-[10px] text-[var(--ink)]/50 mt-1.5">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[var(--line)] overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--line)] bg-[var(--paper)]">
              <p className="text-[11px] font-bold text-[var(--ink)]">Recent loan activity</p>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {ROWS.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="text-[11px] font-mono text-[var(--ink)]/45 w-16 flex-shrink-0">{r.id}</span>
                  <span className="text-[11px] text-[var(--ink)]/70 flex-1 truncate hidden sm:block">{r.email}</span>
                  <span className="text-[11px] font-bold text-[var(--ink)] w-20 text-right flex-shrink-0">{r.amount}</span>
                  <div className="flex-shrink-0 scale-90 origin-right">
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
