// Caminho: dashboard-gummy-front-end/app/user-profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../auth/hooks'
import { toast, Toaster } from 'react-hot-toast'
import * as api from '../../lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation';


interface User {
  name?: string;
  email?: string;
  role?: string;
}

interface ProfileData {
  name: string;
  currentPassword?: string;
  newPassword?: string;
}

export default function UserProfilePage() {
  const { user, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Limpar mensagem de sucesso anterior
    setSuccessMessage('')
    
    // Validar senhas
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const data: ProfileData = {
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      }
      
      // Se apenas o nome foi alterado
      if (!currentPassword && !newPassword) {
        await api.updateUserProfile(data)
        toast.success('Perfil atualizado com sucesso!')
        setSuccessMessage('Seu perfil foi atualizado com sucesso!')
      } 
      // Se a senha também foi alterada
      else if (currentPassword && newPassword) {
        await api.updateUserProfile(data)
        toast.success('Senha alterada com sucesso!')
        setSuccessMessage('Sua senha foi alterada com sucesso!')
        
        // Limpar campos de senha
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
      // Se apenas um dos campos de senha foi preenchido
      else {
        toast.error('Para alterar a senha, preencha tanto a senha atual quanto a nova senha')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao atualizar perfil')
      }
      setSuccessMessage('')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center p-8">Carregando...</div>
  
  if (!user) return <div className="flex justify-center p-8">Não autorizado</div>

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Componente Toaster para exibir notificações */}
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
   <button
  onClick={() => window.history.back()}
  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
>
  Voltar
</button>
      </div>
      
      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form onSubmit={handleUpdateProfile}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                O email não pode ser alterado
              </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Alterar Senha</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Preencha os campos abaixo apenas se desejar alterar sua senha
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
