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
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          <p className="text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const inputClass = "block w-full rounded-xl border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-shadow";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-500 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-2">Complete your profile details to evaluate your loan eligibility.</p>
      </div>

      {error && (
        <div className="card-surface p-4 border-rose-100 bg-rose-50/60 text-rose-700 flex items-start gap-2 animate-scale-in">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="card-surface p-4 border-emerald-100 bg-emerald-50/60 text-emerald-700 flex items-start gap-2 animate-scale-in">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* BRE Status Banner */}
      {formData.eligibilityStatus && formData.eligibilityStatus !== 'NOT_EVALUATED' && (
        <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              Eligibility Status
            </h3>
            <StatusBadge status={formData.eligibilityStatus} />
          </div>
          {formData.eligibilityStatus === 'FAILED' && formData.eligibilityReasons && (
            <ul className="mt-3 space-y-1.5 pl-1">
              {formData.eligibilityReasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSave} className="card-surface p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

          <div className="sm:col-span-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="pan" className="block text-sm font-medium text-slate-700 mb-1.5">PAN Number</label>
            <input
              type="text"
              id="pan"
              required
              pattern="^[A-Za-z]{5}[0-9]{4}[A-Za-z]$"
              title="Format: 5 letters, 4 numbers, 1 letter (e.g. ABCDE1234F)"
              value={formData.pan}
              onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
              className={`${inputClass} uppercase`}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
            <input
              type="date"
              id="dob"
              required
              max={new Date().toISOString().split('T')[0]} // Must be past date
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Salary (INR)</label>
            <input
              type="number"
              id="salary"
              required
              min="0"
              value={formData.monthlySalaryPaise / 100} // Convert paise to INR for display
              onChange={(e) => setFormData({...formData, monthlySalaryPaise: Number(e.target.value) * 100})}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="employmentMode" className="block text-sm font-medium text-slate-700 mb-1.5">Employment Mode</label>
            <select
              id="employmentMode"
              required
              value={formData.employmentMode}
              onChange={(e) => setFormData({...formData, employmentMode: e.target.value})}
              className={inputClass}
            >
              <option value="SALARIED">Salaried</option>
              <option value="SELF_EMPLOYED">Self Employed</option>
              <option value="UNEMPLOYED">Unemployed</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={evaluating || !formData.fullName || formData.eligibilityStatus === 'PASSED'}
            className="w-full sm:w-auto rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            {evaluating && <Loader2 className="w-4 h-4 animate-spin" />}
            {evaluating ? 'Evaluating...' : 'Check Eligibility'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto btn-gradient px-6 py-2.5 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
