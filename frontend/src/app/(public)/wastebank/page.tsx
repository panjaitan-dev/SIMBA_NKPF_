'use client'

import React from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import Dashboard from '@/components/wastebank/Dashboard';
import { Toaster } from 'react-hot-toast';

export default function WastebankPage() {
  return (
    <AuthGuard allowedRoles={['nasabah', 'admin', 'admin_klh', 'petugas']}>
      <Dashboard />
      <Toaster position="top-right" reverseOrder={false} />
    </AuthGuard>
  );
}
