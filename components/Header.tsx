// Caminho: dashboard-gummy-front-end/components/Header.tsx
"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../app/auth/hooks"; // Corrigido para useAuth
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const { user, loading, logout } = useAuth() // Corrigido para usar logout do useAuth
  const router = useRouter()

  const handleLogout = () => {
    logout() // Chama o logout do contexto
  }

  if (loading) return null

  return (
    <header className="bg-white shadow-md dark:bg-gray-800 dark:border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Image src="/images/v2_marca_dta_gummy.png" alt="DTA / Gummy Original" width={120} height={40} />
              </Link>
            </div>
          </div>

          {user && (
            <div className="flex items-center">
              <div className="hidden md:flex items-center mr-4">
                <div className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium dark:bg-pink-900 dark:text-pink-200">
                  {user.role === "Admin" ? "Administrador" : user.role === "manager" ? "Gerente" : "Usuário"} {/* Corrigido para "Admin" */}
                </div>
              </div>

              {user.role === "Admin" && (
                <div className="mr-4">
                  <Link href="/admin">
                    {/* AJUSTE BOTÃO MOBILE v5: Substituído SVG por Imagem, adicionado p-2 */}
                    <button className="flex items-center justify-center border border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200 p-2 sm:px-3 sm:py-2 rounded-md"> {/* Adicionado p-2 para consistência de altura mobile */}
                      <Image src="/images/config.png" alt="Gerenciamento" width={24} height={24} className="flex-shrink-0" /> {/* Substituído SVG por Imagem 24x24 (w-6 h-6) */}
                      <span className="hidden sm:inline sm:ml-2">Gerenciamento</span>
                    </button>
                  </Link>
                </div>
              )}
              
              {/* Botão de perfil para todos os usuários - Modificado para aparecer para todos */}
              <div className="mr-4">
                <Link href="/user-profile">
                  {/* AJUSTE BOTÃO MOBILE v5: Adicionado p-2 */}
                  <button className="flex items-center justify-center border border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200 p-2 sm:px-3 sm:py-2 rounded-md"> {/* Adicionado p-2 para consistência de altura mobile */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="hidden sm:inline sm:ml-2">Usuário</span>
                  </button>
                </Link>
              </div>

              <div className="relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mr-2">
                    {user && user.name ? user.name.substring(0, 1).toUpperCase() : user.email ? user.email.substring(0,1).toUpperCase() : "U"} {/* Adicionado fallback para email e "U" */}
                  </div>
                  <button
                    className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

