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
                    ##BOTÃO MOBILE: Adicionado w-8 h-8 e resetado em sm:, SVG com flex-shrink-0 
                    <button className="flex items-center justify-center border border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 flex-shrink-0"> {/* Mantido w-5 h-5, adicionado flex-shrink-0 */}
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.903c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.184-.582.496-.646.87l-.212 1.282c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313.686-.646.87-.074-.04-.147.083-.22-.127a6.501 6.501 0 01-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.903c.007-.378-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.184.582-.496.646-.87l.212-1.282z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="hidden sm:inline sm:ml-2">Gerenciamento</span>
                    </button>
                  </Link>
                </div>
              )}
              
              {/* Botão de perfil para todos os usuários - Modificado para aparecer para todos */}
              <div className="mr-4">
                <Link href="/user-profile">
                  {/* AJUSTE BOTÃO MOBILE: Adicionado w-8 h-8 e resetado em sm:, SVG com flex-shrink-0 */}
                  <button className="flex items-center justify-center border border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 flex-shrink-0"> {/* Mantido w-5 h-5, adicionado flex-shrink-0 */}
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

