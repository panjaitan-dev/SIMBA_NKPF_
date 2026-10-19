import AuthGuard from '@/components/auth/AuthGuard'

export const metadata = {
  title: 'Portal Nasabah — SIMBA Indonesia',
}

export default function NasabahLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['nasabah', 'admin']}>
      {children}
    </AuthGuard>
  )
}
