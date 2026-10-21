import React from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import Dashboard from '@/components/wastebank/Dashboard';

// Allowed roles: nasabah (regular user), admin, admin_klh, petugas
export default function WastebankPage() {
  return (
    <AuthGuard allowedRoles={['nasabah', 'admin', 'admin_klh', 'petugas']}>
      <Dashboard />
    </AuthGuard>
  );
}
