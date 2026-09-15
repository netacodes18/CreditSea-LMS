"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const ROLE_LANDING: Record<string, string> = {
  BORROWER: '/borrower/dashboard',
  ADMIN: '/admin/dashboard',
  SANCTION: '/admin/dashboard',
  DISBURSEMENT: '/admin/dashboard',
  COLLECTION: '/collection/dashboard',
  SALES: '/sales/dashboard',
};

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
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16 bg-[var(--ink)] border-r border-[var(--line)]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-10 right-10 neo-chip animate-float" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
          JWT + bcrypt
        </div>
        <div className="absolute bottom-16 left-10 neo-chip animate-float" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)', animationDelay: '0.5s' }}>
          Role-based access
        </div>

        <div className="relative max-w-md animate-fade-up">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[var(--ink)] font-bold text-2xl border border-white/25 mb-8" style={{ backgroundColor: '#f97316' }}>
            L
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight text-white">
            Welcome back to <span style={{ color: '#f97316' }}>LMS</span>
          </h1>
          <p className="mt-6 text-white/70 leading-relaxed font-medium">
            Sign in to continue your application, or step into your operations console — sanction,
            disburse, and collect, all role-gated end to end.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
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
