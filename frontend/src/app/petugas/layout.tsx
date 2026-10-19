import AuthGuard from '@/components/auth/AuthGuard'

export const metadata = {
  title: 'Loket Petugas — SIMBA Indonesia',
}

export default function PetugasLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['petugas', 'admin']}>
      {children}
    </AuthGuard>
  )
}
