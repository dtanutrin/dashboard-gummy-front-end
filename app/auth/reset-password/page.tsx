// Caminho: dashboard-gummy-front-end/app/auth/reset-password/page.tsx
'use client'

import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
