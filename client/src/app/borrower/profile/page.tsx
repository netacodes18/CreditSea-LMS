"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

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
    return <div>Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Complete your profile details to evaluate your loan eligibility.</p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-700">
          {success}
        </div>
      )}

      {/* BRE Status Banner */}
      {formData.eligibilityStatus && formData.eligibilityStatus !== 'NOT_EVALUATED' && (
        <div className={`p-4 rounded-md border ${
          formData.eligibilityStatus === 'PASSED' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <h3 className="font-semibold text-lg">
            Eligibility Status: {formData.eligibilityStatus}
          </h3>
          {formData.eligibilityStatus === 'FAILED' && formData.eligibilityReasons && (
            <ul className="mt-2 list-disc pl-5">
              {formData.eligibilityReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          
          <div className="sm:col-span-4">
            <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
            <div className="mt-2">
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="pan" className="block text-sm font-medium leading-6 text-gray-900">PAN Number</label>
            <div className="mt-2">
              <input
                type="text"
                id="pan"
                required
                pattern="^[A-Za-z]{5}[0-9]{4}[A-Za-z]$"
                title="Format: 5 letters, 4 numbers, 1 letter (e.g. ABCDE1234F)"
                value={formData.pan}
                onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 uppercase"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">Date of Birth</label>
            <div className="mt-2">
              <input
                type="date"
                id="dob"
                required
                max={new Date().toISOString().split('T')[0]} // Must be past date
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">Monthly Salary (INR)</label>
            <div className="mt-2">
              <input
                type="number"
                id="salary"
                required
                min="0"
                value={formData.monthlySalaryPaise / 100} // Convert paise to INR for display
                onChange={(e) => setFormData({...formData, monthlySalaryPaise: Number(e.target.value) * 100})}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="employmentMode" className="block text-sm font-medium leading-6 text-gray-900">Employment Mode</label>
            <div className="mt-2">
              <select
                id="employmentMode"
                required
                value={formData.employmentMode}
                onChange={(e) => setFormData({...formData, employmentMode: e.target.value})}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              >
                <option value="SALARIED">Salaried</option>
                <option value="SELF_EMPLOYED">Self Employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between border-t border-gray-900/10 pt-6">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={evaluating || !formData.fullName || formData.eligibilityStatus === 'PASSED'}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            {evaluating ? 'Evaluating...' : 'Check Eligibility'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
