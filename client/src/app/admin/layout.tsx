"use client";

import React from 'react';
import OperationsLayout from '@/components/OperationsLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <OperationsLayout allowedRoles={['ADMIN', 'SANCTION', 'DISBURSEMENT']}>
      {children}
    </OperationsLayout>
  );
}
