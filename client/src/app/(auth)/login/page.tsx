"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen flex bg-white">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16 text-white"
        style={{ background: 'linear-gradient(160deg, var(--ink-950), var(--ink-900) 60%, #2e1065)' }}>
        <div className="absolute inset-0 mesh-bg opacity-60" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-fuchsia-600/30 blur-3xl animate-float" />
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-indigo-500/30 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="relative max-w-md animate-fade-up">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-glow mb-8 animate-gradient"
            style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #db2777, #6366f1)' }}>
            L
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Welcome back to <span className="text-gradient animate-gradient">LMS</span>
          </h1>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Sign in to continue your application, or step into your operations console — sanction,
            disburse, and collect, all role-gated end to end.
          </p>
          <div className="mt-10 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Secured with JWT + bcrypt
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Or{' '}
            <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-500">
              register a new borrower account
            </Link>
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-60"
            >
              {loading ? 'Signing in…' : (<>Sign in <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
