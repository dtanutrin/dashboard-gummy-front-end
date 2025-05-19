'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../auth/hooks'
import * as api from '../../lib/api'

// Definição de tipos para evitar erros de TypeScript
interface ProfileData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Message {
  type: string;
  text: string;
}

export default function UserProfilePage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
  })
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [profileMessage, setProfileMessage] = useState<Message>({ type: '', text: '' })
  const [passwordMessage, setPasswordMessage] = useState<Message>({ type: '', text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setProfileMessage({ type: '', text: '' })
    
    try {
      if (!user?.id) throw new Error('ID do usuário não encontrado')
      
      // Usando asserção de tipo para evitar erro de TypeScript
      await api.updateUser(user.id, {
        name: profileData.name,
      } as api.UserUpdatePayload)
      
      await refreshUser()
      setProfileMessage({ 
        type: 'success', 
        text: 'Informações do perfil atualizadas com sucesso!' 
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      setProfileMessage({ 
        type: 'error', 
        text: 'Erro ao atualizar o perfil. Por favor, tente novamente.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setPasswordMessage({ type: '', text: '' })
    
    // Validação de senha
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ 
        type: 'error', 
        text: 'As senhas não coincidem. Por favor, verifique e tente novamente.' 
      })
      setIsSubmitting(false)
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ 
        type: 'error', 
        text: 'A nova senha deve ter pelo menos 6 caracteres.' 
      })
      setIsSubmitting(false)
      return
    }
    
    try {
      if (!user?.id) throw new Error('ID do usuário não encontrado')
      
      // Chamada para API de atualização de senha
      await api.updateUserPassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      
      setPasswordMessage({ 
        type: 'success', 
        text: 'Senha atualizada com sucesso!' 
      })
    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      setPasswordMessage({ 
        type: 'error', 
        text: 'Erro ao atualizar a senha. Verifique se a senha atual está correta.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com logo e navegação */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/dashboard">
              <img
                className="h-10 w-auto"
                src="/gummy-logo.svg"
                alt="Gummy"
              />
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <Link href="/user-profile" className="text-pink-600 font-medium">
              Meu Perfil
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Meu Perfil
            </h1>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Informações do Perfil
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Atualize suas informações pessoais.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {profileMessage.text && (
                <div className={`p-4 rounded-md ${
                  profileMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {profileMessage.text}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profileData.email}
                    disabled
                    className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md cursor-not-allowed"
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  O email não pode ser alterado.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Atualizar Senha
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Garanta que sua conta esteja usando uma senha longa e segura.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {passwordMessage.text && (
                <div className={`p-4 rounded-md ${
                  passwordMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {passwordMessage.text}
                </div>
              )}
              
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Senha Atual
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nova Senha
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Nova Senha
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Atualizando...' : 'Atualizar Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
