"use client";

import React from 'react';
import OperationsLayout from '@/components/OperationsLayout';

export default function DisbursementLayout({ children }: { children: React.ReactNode }) {
  return (
    <OperationsLayout allowedRoles={['ADMIN', 'DISBURSEMENT']}>
      {children}
    </OperationsLayout>
  );
}
