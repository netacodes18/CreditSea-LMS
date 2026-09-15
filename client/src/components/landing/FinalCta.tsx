"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, KeyRound, LayoutDashboard, FilePlus2 } from 'lucide-react';

const ROLE_LANDING: Record<string, string> = {
  BORROWER: '/borrower/dashboard',
  ADMIN: '/admin/dashboard',
  SANCTION: '/admin/dashboard',
  DISBURSEMENT: '/admin/dashboard',
  COLLECTION: '/collection/dashboard',
  SALES: '/sales/dashboard',
};

export default function FinalCta() {
  const { user, loading } = useAuth();
  const isBorrower = user?.role === 'BORROWER';
  const dashboardHref = user ? (ROLE_LANDING[user.role] || '/borrower/dashboard') : '/login';

  const copy = user
    ? {
        chip: 'You are signed in',
        title: isBorrower ? 'Pick up where you left off' : 'Your console is ready',
        sub: isBorrower
          ? 'Head back to your portal to complete your details, apply for a loan or track an existing application.'
          : 'Jump back into your dashboard to review the loans waiting on your team.',
      }
    : {
        chip: 'Free to apply',
        title: 'Check your eligibility in under a minute',
        sub: 'Create an account, complete your details and see exactly what you would repay — before you commit to anything.',
      };

  return (
    <div className="neo-card px-8 py-12 sm:px-14 sm:py-16 text-center relative overflow-hidden">
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[260px] rounded-full opacity-[0.10] blur-3xl"
        style={{ backgroundColor: '#f97316' }}
      />
      <div className="relative">
        <div className="inline-flex items-center gap-2 neo-chip bg-[var(--paper)]">
          <KeyRound className="w-3 h-3" style={{ color: '#f97316' }} />
          {copy.chip}
        </div>
        <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight max-w-xl mx-auto">
          {copy.title}
        </h2>
        <p className="mt-4 text-[var(--ink)]/60 max-w-lg mx-auto leading-relaxed">{copy.sub}</p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {loading ? (
            <div className="h-12 w-52 rounded-lg bg-[var(--ink)]/5 animate-pulse" />
          ) : user ? (
            <>
              <Link href={dashboardHref} className="neo-btn px-7 py-3.5 text-sm w-full sm:w-auto">
                <LayoutDashboard className="w-4 h-4" /> Go to your dashboard
              </Link>
              {isBorrower && (
                <Link href="/borrower/apply" className="neo-btn-ghost px-7 py-3.5 text-sm w-full sm:w-auto">
                  <FilePlus2 className="w-4 h-4" /> Apply for a loan
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/register" className="neo-btn px-7 py-3.5 text-sm w-full sm:w-auto">
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="neo-btn-ghost px-7 py-3.5 text-sm w-full sm:w-auto">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
