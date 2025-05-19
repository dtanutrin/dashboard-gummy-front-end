'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../auth/hooks'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Se o usuário não estiver autenticado, redireciona para o login
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com logo */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <div className="flex-shrink-0">
            <Link href="/dashboard">
              <img
                className="h-10 w-auto"
                src="/gummy-logo.svg"
                alt="Gummy"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Negado
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Você não possui as permissões necessárias para acessar essa área.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Voltar para o Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
