"use client";

import React from 'react';
import OperationsLayout from '@/components/OperationsLayout';

export default function SanctionLayout({ children }: { children: React.ReactNode }) {
  return (
    <OperationsLayout allowedRoles={['ADMIN', 'SANCTION']}>
      {children}
    </OperationsLayout>
  );
}
