import { CheckCircle2 } from 'lucide-react';

const CHECKS = [
  ['Eligibility check', 'Passed'],
  ['Salary slip', 'Verified'],
  ['PAN & KYC', 'Matched'],
];

export default function PhonePreview() {
  return (
    <div
      className="rounded-[2rem] bg-[var(--ink)] p-2 w-[230px]"
      style={{ boxShadow: '0 30px 60px -20px rgba(15,32,51,0.5)' }}
    >
      <div className="rounded-[1.6rem] bg-white overflow-hidden aspect-[9/17] relative">
        <div className="absolute top-0 inset-x-0 h-5 flex items-center justify-center">
          <div className="w-16 h-3 bg-[var(--ink)] rounded-full mt-1.5" />
        </div>
        <div className="pt-8 px-3.5 pb-3.5 h-full flex flex-col">
          <p className="text-[9px] font-bold text-[var(--ink)]/45 uppercase tracking-widest">Apply for a loan</p>
          <p className="mt-1 text-base font-bold text-[var(--ink)] leading-tight">
            Get sanctioned<br />in minutes.
          </p>

          <div className="mt-4 rounded-xl p-3.5" style={{ backgroundColor: '#f97316' }}>
            <p className="text-[9px] text-white/80 uppercase tracking-wide font-bold">Loan amount</p>
            <p className="text-xl font-bold text-white mt-0.5">₹2,00,000</p>
            <div className="mt-2.5 h-1.5 rounded-full bg-white/30">
              <div className="h-full w-2/5 rounded-full bg-white" />
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[var(--line)] p-2">
              <p className="text-[8px] text-[var(--ink)]/45 uppercase font-bold">Tenure</p>
              <p className="text-[11px] font-bold text-[var(--ink)] mt-0.5">180 days</p>
            </div>
            <div className="rounded-lg border border-[var(--line)] p-2">
              <p className="text-[8px] text-[var(--ink)]/45 uppercase font-bold">Interest</p>
              <p className="text-[11px] font-bold text-[var(--ink)] mt-0.5">₹11,835</p>
            </div>
          </div>

          <div className="mt-2 rounded-lg bg-[var(--paper)] p-2.5 flex items-center justify-between">
            <span className="text-[8px] text-[var(--ink)]/45 uppercase font-bold tracking-wide">Total repayment</span>
            <span className="text-xs font-bold text-[var(--ink)]">₹2,11,835</span>
          </div>

          <div className="mt-2.5 space-y-1.5">
            {CHECKS.map(([label, state]) => (
              <div key={label} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span className="text-[9px] text-[var(--ink)]/55 flex-1">{label}</span>
                <span className="text-[9px] font-semibold text-emerald-700">{state}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-2.5">
            <div className="rounded-lg py-2 text-center text-[11px] font-bold text-white" style={{ backgroundColor: '#f97316' }}>
              Submit application
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
