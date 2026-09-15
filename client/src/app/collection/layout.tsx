"use client";

import React from 'react';
import OperationsLayout from '@/components/OperationsLayout';

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <OperationsLayout allowedRoles={['ADMIN', 'COLLECTION']}>
      {children}
    </OperationsLayout>
  );
}
