"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

const ROLE_LANDING: Record<string, string> = {
  BORROWER: '/borrower/dashboard',
  ADMIN: '/admin/dashboard',
  SANCTION: '/admin/dashboard',
  DISBURSEMENT: '/admin/dashboard',
  COLLECTION: '/collection/dashboard',
  SALES: '/sales/dashboard',
};

export default function LandingNavActions({ variant = 'nav' }: { variant?: 'nav' | 'hero' }) {
  const { user, loading } = useAuth();
  const dashboardHref = user ? (ROLE_LANDING[user.role] || '/borrower/dashboard') : '/login';

  if (variant === 'hero') {
    if (loading) {
      return <div className="h-12 w-52 rounded-lg bg-[var(--ink)]/5 animate-pulse" />;
    }
    if (user) {
      return (
        <Link href={dashboardHref} className="neo-btn px-6 py-3.5 text-sm">
          <LayoutDashboard className="w-4 h-4" /> Go to your dashboard
        </Link>
      );
    }
    return (
      <>
        <Link href="/register" className="neo-btn px-6 py-3.5 text-sm">
          Explore the platform <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/login" className="text-sm font-bold text-[var(--ink)] group px-4 py-3">
          Sign in to your dashboard
          <span aria-hidden="true" className="group-hover:translate-x-1 inline-block transition-transform ml-1">→</span>
        </Link>
      </>
    );
  }

  if (loading) {
    return <div className="h-10 w-40 rounded-lg bg-[var(--ink)]/5 animate-pulse" />;
  }

  if (user) {
    return (
      <Link href={dashboardHref} className="neo-btn text-sm px-5 py-2.5">
        <LayoutDashboard className="w-4 h-4" /> Go to dashboard
      </Link>
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
