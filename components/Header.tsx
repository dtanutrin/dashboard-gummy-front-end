"use client"
import { useRouter } from "next/navigation"
import { useUser, logout } from "../hooks/auth"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const { user, loading } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout(router)
  }

  if (loading) return null

  return (
    <header className="bg-white shadow-md dark:bg-gray-800 dark:border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Image src="/images/gummy-logo.png" alt="Gummy Original" width={120} height={40} className="mr-2" />
                <span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent font-bold text-xl ml-2">
                  Dashboards
                </span>
              </Link>
            </div>
          </div>

          {user && (
            <div className="flex items-center">
              <div className="hidden md:flex items-center mr-4">
                <div className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium dark:bg-pink-900 dark:text-pink-200">
                  {user.role === "admin" ? "Administrador" : user.role === "manager" ? "Gerente" : "Usuário"}
                </div>
              </div>

              {user.role === "admin" && (
                <div className="mr-4">
                  <Link href="/admin">
                    <button className="flex items-center gap-2 border border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200 px-3 py-2 rounded-md">
                      <span className="hidden sm:inline">Administração</span>
                    </button>
                  </Link>
                </div>
              )}

              <div className="relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mr-2">
                    {user.name.substring(0, 1).toUpperCase()}
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
