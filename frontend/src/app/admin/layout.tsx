import AuthGuard from '@/components/auth/AuthGuard'

export const metadata = {
  title: 'Admin Panel — SIMBA Indonesia',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['admin', 'admin_klh']}>
      {children}
    </AuthGuard>
  )
}
