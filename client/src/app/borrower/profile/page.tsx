"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { CheckCircle2, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

interface ProfileData {
  fullName: string;
  pan: string;
  dob: string;
  monthlySalaryPaise: number;
  employmentMode: string;
  eligibilityStatus?: string;
  eligibilityReasons?: string[];
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    fullName: '',
    pan: '',
    dob: '',
    monthlySalaryPaise: 0,
    employmentMode: 'SALARIED'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/borrower/profile');
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setFormData({
          ...data,
          dob: new Date(data.dob).toISOString().split('T')[0] // Format for input[type=date]
        });
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put('/borrower/profile', formData);
      if (res.data.success) {
        setSuccess('Profile saved successfully. Please evaluate your eligibility now.');
        setFormData({
          ...res.data.data,
          dob: new Date(res.data.data.dob).toISOString().split('T')[0]
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/borrower/eligibility/evaluate');
      if (res.data.success) {
        setFormData({
          ...res.data.data,
          dob: new Date(res.data.data.dob).toISOString().split('T')[0]
        });
        if (res.data.data.eligibilityStatus === 'PASSED') {
          setSuccess('Congratulations! You are eligible for a loan.');
        } else {
          setError('Eligibility evaluation failed. Check reasons below.');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to evaluate eligibility');
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl flex items-center justify-center py-24">
        <div className="neo-card flex flex-col items-center gap-3 px-10 py-8">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--ink)]">Loading profile…</p>
        </div>
      </div>
    );
  }

  const inputClass = "block w-full rounded-xl border border-[var(--line)] bg-white py-2.5 px-3.5 text-[var(--ink)] font-medium placeholder-[var(--ink)]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all sm:text-sm";
  const inputShadow = { boxShadow: '0 1px 2px rgba(15,32,51,0.06)' };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[var(--ink)]/50 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-bold text-[var(--ink)] tracking-tight">My Profile</h1>
        <p className="text-[var(--ink)]/60 mt-2 font-medium">Complete your profile details to evaluate your loan eligibility.</p>
      </div>

      {error && (
        <div className="neo-card p-4 flex items-start gap-2 animate-scale-in" style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      {success && (
        <div className="neo-card p-4 flex items-start gap-2 animate-scale-in" style={{ backgroundColor: '#059669', color: 'var(--ink)' }}>
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">{success}</span>
        </div>
      )}

      {/* BRE Status Banner */}
      {formData.eligibilityStatus && formData.eligibilityStatus !== 'NOT_EVALUATED' && (
        <div className="neo-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[var(--ink)] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" style={{ color: '#2563eb' }} />
              Eligibility Status
            </h3>
            <StatusBadge status={formData.eligibilityStatus} />
          </div>
          {formData.eligibilityStatus === 'FAILED' && formData.eligibilityReasons && (
            <ul className="mt-3 space-y-1.5 pl-1">
              {formData.eligibilityReasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-[var(--ink)]/70 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--danger)' }} />
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSave} className="neo-card p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

          <div className="sm:col-span-4">
            <label htmlFor="fullName" className="block text-sm font-bold text-[var(--ink)] mb-1.5">Full Name</label>
            <input
              type="text"
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="pan" className="block text-sm font-bold text-[var(--ink)] mb-1.5">PAN Number</label>
            <input
              type="text"
              id="pan"
              required
              pattern="^[A-Za-z]{5}[0-9]{4}[A-Za-z]$"
              title="Format: 5 letters, 4 numbers, 1 letter (e.g. ABCDE1234F)"
              value={formData.pan}
              onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
              className={`${inputClass} uppercase`}
              style={inputShadow}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="dob" className="block text-sm font-bold text-[var(--ink)] mb-1.5">Date of Birth</label>
            <input
              type="date"
              id="dob"
              required
              max={new Date().toISOString().split('T')[0]} // Must be past date
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="salary" className="block text-sm font-bold text-[var(--ink)] mb-1.5">Monthly Salary (INR)</label>
            <input
              type="number"
              id="salary"
              required
              min="0"
              // stored in paise, shown in rupees
              value={formData.monthlySalaryPaise ? formData.monthlySalaryPaise / 100 : ''}
              onChange={(e) => setFormData({...formData, monthlySalaryPaise: e.target.value === '' ? 0 : Number(e.target.value) * 100})}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="employmentMode" className="block text-sm font-bold text-[var(--ink)] mb-1.5">Employment Mode</label>
            <select
              id="employmentMode"
              required
              value={formData.employmentMode}
              onChange={(e) => setFormData({...formData, employmentMode: e.target.value})}
              className={inputClass}
              style={inputShadow}
            >
              <option value="SALARIED">Salaried</option>
              <option value="SELF_EMPLOYED">Self Employed</option>
              <option value="UNEMPLOYED">Unemployed</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-[var(--line)] pt-6">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={evaluating || !formData.fullName || formData.eligibilityStatus === 'PASSED'}
            className="w-full sm:w-auto neo-btn-ghost px-4 py-2.5 text-sm disabled:opacity-50"
          >
            {evaluating && <Loader2 className="w-4 h-4 animate-spin" />}
            {evaluating ? 'Evaluating...' : 'Check Eligibility'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto neo-btn px-6 py-2.5 text-sm disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
