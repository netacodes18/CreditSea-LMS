"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import AuthAside from '@/components/AuthAside';
import { ROLE_LANDING } from '@/lib/roles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        login(response.data.token, response.data.data);
        const role = response.data.data.role;
        router.push(ROLE_LANDING[role] || '/borrower/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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
              {loading ? 'Signing in…' : (<>Sign in <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
