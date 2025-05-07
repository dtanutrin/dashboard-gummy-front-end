"use client"

import { useEffect, useState } from "react"

// Hook para obter o usuário atual
export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, loading }
}

// Hook para verificar se o usuário tem acesso a uma área específica
export function useHasAccess(area: string) {
  const { user, loading } = useUser()

  if (loading) return false
  if (!user) return false

  // Admin tem acesso a todas as áreas
  if (user.role === "admin") return true

  // Verificar se o usuário tem acesso à área específica
  return user.areas.includes(area)
}

// Função para fazer logout
export function logout(router: any) {
  localStorage.removeItem("user")
  router.push("/auth/login")
}
