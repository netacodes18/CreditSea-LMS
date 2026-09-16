"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, CheckSquare, Banknote, HandCoins, BarChart3 } from 'lucide-react';

const MODULES = [
  { key: 'SANCTION', name: 'Sanction Queue', href: '/sanction/loans', icon: CheckSquare, accent: '#d97706' },
  { key: 'DISBURSEMENT', name: 'Disbursement', href: '/disbursement/loans', icon: Banknote, accent: '#059669' },
  { key: 'COLLECTION', name: 'Collection', href: '/collection/dashboard', icon: HandCoins, accent: '#0891b2' },
  { key: 'SALES', name: 'Sales Dashboard', href: '/sales/dashboard', icon: BarChart3, accent: '#f97316' },
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

  // admin sees every module, others see only their own
  const visibleModules = user?.role === 'ADMIN'
    ? MODULES
    : MODULES.filter((m) => m.key === user?.role);

  // overview link per role
  const hasOverview = user?.role === 'ADMIN' || user?.role === 'SANCTION' || user?.role === 'DISBURSEMENT';
  const overviewHref =
    user?.role === 'SANCTION' ? '/sanction/dashboard'
    : user?.role === 'DISBURSEMENT' ? '/disbursement/dashboard'
    : '/admin/dashboard';

  const navItems = [
    ...(hasOverview ? [{ name: 'Overview', href: overviewHref, icon: LayoutDashboard }] : []),
    ...visibleModules.map((m) => ({ name: m.name, href: m.href, icon: m.icon })),
  ];

  const accent = user?.role === 'ADMIN'
    ? '#f97316'
    : (MODULES.find((m) => m.key === user?.role)?.accent ?? '#f97316');

  return (
    <PortalLayout navItems={navItems} portalName="Operations Portal" accent={accent}>
      {children}
    </PortalLayout>
  );
}
