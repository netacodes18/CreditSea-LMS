"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { Home, UserCircle, FilePlus2, Files, FileText, CreditCard } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/borrower/dashboard', icon: Home },
  { name: 'My Profile', href: '/borrower/profile', icon: UserCircle },
  { name: 'Apply for Loan', href: '/borrower/apply', icon: FilePlus2 },
  { name: 'My Applications', href: '/borrower/applications', icon: Files },
  { name: 'Documents', href: '/borrower/documents', icon: FileText },
  { name: 'Payments', href: '/borrower/payments', icon: CreditCard },
];

export default function BorrowerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['BORROWER']}>
      <PortalLayout navItems={navItems} portalName="Borrower Portal">
        {children}
      </PortalLayout>
    </ProtectedRoute>
  );
}
