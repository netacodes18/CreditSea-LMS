"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { LayoutDashboard, CheckSquare, Banknote, HandCoins, BarChart3, Users } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Sanction Queue', href: '/admin/loans', icon: CheckSquare },
  { name: 'Disbursement', href: '/disbursement/loans', icon: Banknote },
  { name: 'Collection', href: '/collection/dashboard', icon: HandCoins },
  { name: 'Sales Dashboard', href: '/sales/dashboard', icon: BarChart3 },
  { name: 'Manage Users', href: '/admin/users', icon: Users },
];

export default function OperationsLayout({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <PortalLayout navItems={navItems} portalName="Operations Portal">
        {children}
      </PortalLayout>
    </ProtectedRoute>
  );
}
