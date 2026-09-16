"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { ROLE_LANDING } from '@/lib/roles';

export default function LandingNavActions({ variant = 'nav', hasToken = true }: { variant?: 'nav' | 'hero'; hasToken?: boolean }) {
  const { user: verifiedUser, loading, cachedUser } = useAuth();
  // While /auth/me is pending (slow on a cold Render start), show the last known user instead of a skeleton
  const user = verifiedUser ?? (loading ? cachedUser : null);

  const isEffectivelyLoading = hasToken && loading && !user;
  const dashboardHref = user ? (ROLE_LANDING[user.role] || '/borrower/dashboard') : '/login';

  if (variant === 'hero') {
    if (isEffectivelyLoading) {
      return <div className="h-12 w-52 rounded-lg bg-[var(--ink)]/5 animate-pulse" />;
    }
    if (user) {
      return (
        <Link href={dashboardHref} className="neo-btn px-7 py-3.5 text-sm w-full sm:w-auto">
          <LayoutDashboard className="w-4 h-4" /> Go to your dashboard
        </Link>
      );
    }
    return (
      <>
        <Link href="/register" className="neo-btn px-7 py-3.5 text-sm w-full sm:w-auto">
          Start your application <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/login" className="neo-btn-ghost px-7 py-3.5 text-sm w-full sm:w-auto">
          Sign in
        </Link>
      </>
    );
  }

  if (isEffectivelyLoading) {
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
