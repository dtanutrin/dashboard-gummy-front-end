// Caminho: dashboard-gummy-front-end/app/auth/reset-password/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import * as api from '../../../lib/api'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    // Validação de senha
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem. Por favor, verifique e tente novamente.')
      setIsSubmitting(false)
      return
    }
    
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.')
      setIsSubmitting(false)
      return
    }
    
    if (!token) {
      setError('Token de redefinição não encontrado. Por favor, solicite um novo link de redefinição de senha.')
      setIsSubmitting(false)
      return
    }
    
    try {
      await api.resetPassword(token, newPassword)
      setSuccess(true)
      
      // Redirecionar para a página de login após 3 segundos
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err: any) {
      console.error('Erro ao redefinir senha:', err)
      setError(err.message || 'Erro ao redefinir senha. O token pode ser inválido ou ter expirado.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <Image src="/images/v2_marca_dta_gummy.png" alt="Gummy Original" width={200} height={80} className="mb-4" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Relatórios e Dashboards</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Redefinir sua senha
          </p>
        </div>
        
        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Senha redefinida com sucesso! Você será redirecionado para a página de login.
                </p>
              </div>
            </div>
          </div>
         ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
             )}
            
            {!token && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">
                      Token não encontrado. Por favor, verifique o link ou solicite um novo.
                    </p>
                  </div>
                </div>
              </div>
             )}
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nova Senha
              </label>
              <div className="mt-1">
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSubmitting || !token}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Nova Senha
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting || !token}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-pink-600 hover:text-pink-500"
              >
                Voltar ao login
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !token}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
