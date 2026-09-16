"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import AuthAside from '@/components/AuthAside';
import { ROLE_LANDING } from '@/lib/roles';

// Seeded accounts (server/src/seed.ts) so reviewers can test every role's access in one click
const DEMO_PASSWORD = 'password123';
const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@example.com', color: 'var(--ink)' },
  { role: 'Borrower', email: 'borrower@example.com', color: 'var(--mod-borrower)' },
  { role: 'Sales', email: 'sales@example.com', color: 'var(--mod-sales)' },
  { role: 'Sanction', email: 'sanction@example.com', color: 'var(--mod-sanction)' },
  { role: 'Disbursement', email: 'disbursement@example.com', color: 'var(--mod-disbursement)' },
  { role: 'Collection', email: 'collection@example.com', color: 'var(--mod-collection)' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoEmail, setDemoEmail] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const signIn = async (loginEmail: string, loginPassword: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      if (response.data.success) {
        login(response.data.token, response.data.data);
        const role = response.data.data.role;
        router.push(ROLE_LANDING[role] || '/borrower/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      setDemoEmail(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };

  const handleDemo = (demo: string) => {
    // Fill the form so it's visible which credentials were used, then sign in
    setEmail(demo);
    setPassword(DEMO_PASSWORD);
    setDemoEmail(demo);
    signIn(demo, DEMO_PASSWORD);
  };

  return (
    <div className="min-h-screen flex bg-[var(--paper)]">
      <AuthAside mode="login" />

      {/* Form panel */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-16">
        <Link
          href="/"
          className="absolute top-5 left-5 sm:top-6 sm:left-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <div className="w-full max-w-sm animate-fade-up">
          <h2 className="text-3xl font-bold text-[var(--ink)] tracking-tight">Sign in</h2>
          <p className="mt-2 text-sm text-[var(--ink)]/60 font-medium">
            Or{' '}
            <Link href="/register" className="font-bold text-[var(--ink)] underline decoration-2 decoration-[#f97316] underline-offset-4">
              register a new borrower account
            </Link>
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--ink)]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-white rounded-xl border border-[var(--line)] pl-10 pr-3 py-3 text-sm text-[var(--ink)] placeholder-[var(--ink)]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all"
                style={{ boxShadow: '0 1px 2px rgba(15,32,51,0.06)' }}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--ink)]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full bg-white rounded-xl border border-[var(--line)] pl-10 pr-3 py-3 text-sm text-[var(--ink)] placeholder-[var(--ink)]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all"
                style={{ boxShadow: '0 1px 2px rgba(15,32,51,0.06)' }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-white bg-[var(--danger)] font-bold p-3 rounded-xl border border-[var(--line)]" style={{ boxShadow: '0 1px 2px rgba(15,32,51,0.06)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="neo-btn w-full py-3.5 text-sm disabled:opacity-60"
            >
              {loading && !demoEmail ? 'Signing in…' : (<>Sign in <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          {/* One-click demo logins, one per role */}
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-[var(--line)]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ink)]/45">
                Test accounts
              </span>
              <span className="h-px flex-1 bg-[var(--line)]" />
            </div>
            <p className="mt-2 text-center text-xs text-[var(--ink)]/50">
              One click fills the credentials and signs in · password <span className="font-mono">{DEMO_PASSWORD}</span>
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((demo) => {
                const isThis = loading && demoEmail === demo.email;
                return (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => handleDemo(demo.email)}
                    disabled={loading}
                    title={`Sign in as ${demo.email}`}
                    className="group flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-left text-sm font-semibold text-[var(--ink)] transition-all hover:border-[var(--ink)]/30 hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
                    style={{ boxShadow: '0 1px 2px rgba(15,32,51,0.06)' }}
                  >
                    {isThis ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" style={{ color: demo.color }} />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: demo.color }} />
                    )}
                    <span className="truncate">Test {demo.role}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
