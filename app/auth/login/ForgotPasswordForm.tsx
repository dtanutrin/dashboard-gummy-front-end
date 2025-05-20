// Caminho: dashboard-gummy-front-end/app/auth/login/ForgotPasswordForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import * as api from '../../../lib/api'

// Definir a interface de props para o componente
interface ForgotPasswordFormProps {
  onCancel?: () => void;
}

// Definir a interface para o objeto de mensagem
interface Message {
  type: string;
  text: string;
}

export default function ForgotPasswordForm({ onCancel = () => {} }: ForgotPasswordFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<Message>({ type: '', text: '' })
  const [resetToken, setResetToken] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: '', text: '' })
    setResetToken('')
    setPreviewUrl('')
    
    try {
      // Usar a função forgotPassword do api.ts que agora retorna PasswordResetResponse
      const response = await api.forgotPassword(email)
      
      // Verificar se a resposta contém token ou previewUrl
      if (response && response.token) {
        setResetToken(response.token)
      }
      
      if (response && response.previewUrl) {
        setPreviewUrl(response.previewUrl)
      }
      
      setMessage({ 
        type: 'success', 
        text: response.message || 'Instruções de recuperação de senha foram enviadas para seu email.' 
      })
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleManualReset = () => {
    if (resetToken) {
      router.push(`/auth/reset-password?token=${resetToken}`)
    }
  }
  
  return (
    <div className="mt-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recuperação de Senha
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Informe seu email para receber instruções de recuperação de senha.
        </p>
      </div>
      
      {message.text && (
        <div className={`rounded-md p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          <p>{message.text}</p>
        </div>
      )}
      
      {/* Exibir token e link de visualização se disponíveis */}
      {resetToken && (
        <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Token de recuperação
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>Use este token para redefinir sua senha:</p>
                <p className="mt-1 font-mono bg-white dark:bg-gray-800 p-2 rounded border border-blue-200 dark:border-blue-700">
                  {resetToken}
                </p>
                <button
                  onClick={handleManualReset}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Usar este token
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {previewUrl && (
        <div className="rounded-md bg-purple-50 p-4 dark:bg-purple-900">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Visualizar email de teste
              </h3>
              <div className="mt-2 text-sm text-purple-700 dark:text-purple-300">
                <p>Este é um email de teste. Clique no link abaixo para visualizá-lo:</p>
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-purple-600 dark:text-purple-400 hover:underline break-all"
                >
                  {previewUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-pink-600 hover:text-pink-500"
          >
            Voltar ao login
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
          </button>
        </div>
      </form>
    </div>
  )
}
