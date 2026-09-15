"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard } from 'lucide-react';

const ROLE_LANDING: Record<string, string> = {
  BORROWER: '/borrower/dashboard',
  ADMIN: '/admin/dashboard',
  SANCTION: '/admin/dashboard',
  DISBURSEMENT: '/admin/dashboard',
  COLLECTION: '/collection/dashboard',
  SALES: '/sales/dashboard',
};

export default function LandingNavActions() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-10 w-40 rounded-lg bg-[var(--ink)]/5 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-[var(--ink)]/60">
          Signed in as <span className="font-semibold text-[var(--ink)]">{user.email.split('@')[0]}</span>
        </span>
        <Link href={ROLE_LANDING[user.role] || '/borrower/dashboard'} className="neo-btn text-sm px-5 py-2.5">
          <LayoutDashboard className="w-4 h-4" /> Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="text-sm font-semibold text-[var(--ink)] px-4 py-2 rounded-lg hover:bg-[var(--ink)]/5 transition-colors">
        Log in
      </Link>
      <Link href="/register" className="neo-btn text-sm px-5 py-2.5">
        Sign up
      </Link>
    </div>
  );
}
