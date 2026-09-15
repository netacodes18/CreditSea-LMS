"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, KeyRound, ArrowRight, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', { email, password });
      if (response.data.success) {
        login(response.data.token, response.data.data);
        router.push('/borrower/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16 text-white"
        style={{ background: 'linear-gradient(160deg, var(--ink-950), var(--ink-900) 60%, #4c1d95)' }}>
        <div className="absolute inset-0 mesh-bg opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-600/30 blur-3xl animate-float" />
        <div className="absolute -top-16 -left-10 w-64 h-64 rounded-full bg-pink-500/30 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="relative max-w-md animate-fade-up">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-glow mb-8 animate-gradient"
            style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #db2777, #6366f1)' }}>
            L
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Start your <span className="text-gradient animate-gradient">loan journey</span>
          </h1>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Four quick steps: personal details, an instant eligibility check, a salary slip upload,
            then configure your loan with live simple-interest math.
          </p>
          <div className="mt-10 flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            Free to apply, decisioned instantly
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <h2 className="text-2xl font-extrabold text-slate-900">Create an account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-500">
              Sign in
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
                required
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account…' : (<>Register <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
