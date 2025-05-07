'use client'

import { AuthProvider as CoreAuthProvider } from './hooks'
import { ReactNode } from 'react'

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  return <CoreAuthProvider>{children}</CoreAuthProvider>
}