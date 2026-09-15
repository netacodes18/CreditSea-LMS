"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, CheckSquare, Banknote, HandCoins, BarChart3 } from 'lucide-react';

const MODULES = [
  { key: 'SANCTION', name: 'Sanction Queue', href: '/admin/loans', icon: CheckSquare, accent: '#8b5cf6' },
  { key: 'DISBURSEMENT', name: 'Disbursement', href: '/disbursement/loans', icon: Banknote, accent: '#10b981' },
  { key: 'COLLECTION', name: 'Collection', href: '/collection/dashboard', icon: HandCoins, accent: '#06b6d4' },
  { key: 'SALES', name: 'Sales Dashboard', href: '/sales/dashboard', icon: BarChart3, accent: '#f59e0b' },
] as const;

export default function OperationsLayout({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <OperationsLayoutInner>{children}</OperationsLayoutInner>
    </ProtectedRoute>
  );
}

function OperationsLayoutInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Admin sees every module; each executive role sees only their own.
  const visibleModules = user?.role === 'ADMIN'
    ? MODULES
    : MODULES.filter((m) => m.key === user?.role);

  // Only roles with real access to /admin/* get the cross-module Overview link
  const hasOverview = user?.role === 'ADMIN' || user?.role === 'SANCTION' || user?.role === 'DISBURSEMENT';

  const navItems = [
    ...(hasOverview ? [{ name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard }] : []),
    ...visibleModules.map((m) => ({ name: m.name, href: m.href, icon: m.icon })),
  ];

  const accent = user?.role === 'ADMIN'
    ? '#7c3aed'
    : (MODULES.find((m) => m.key === user?.role)?.accent ?? '#7c3aed');

  return (
    <PortalLayout navItems={navItems} portalName="Operations Portal" accent={accent}>
      {children}
    </PortalLayout>
  );
}
