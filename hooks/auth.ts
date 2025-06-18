"use client"

import { useEffect, useState } from "react"

// Hook para obter o usuário atual e o token
export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("[auth.ts] useUser useEffect - Iniciando busca de dados do localStorage");
    try {
      const userData = localStorage.getItem("user")
      const tokenData = localStorage.getItem("token") // CORRIGIDO: usar "token"
      
      if (userData) {
        console.log("[auth.ts] useUser useEffect - userData encontrado:", userData);
        setUser(JSON.parse(userData))
      } else {
        console.log("[auth.ts] useUser useEffect - userData não encontrado no localStorage.");
      }

      if (tokenData) {
        console.log("[auth.ts] useUser useEffect - tokenData encontrado:", tokenData);
        setToken(tokenData)
      } else {
        console.log("[auth.ts] useUser useEffect - tokenData não encontrado no localStorage.");
      }

    } catch (error) {
      console.error("[auth.ts] useUser useEffect - Erro ao obter dados do localStorage:", error)
    } finally {
      setLoading(false)
      console.log("[auth.ts] useUser useEffect - Finalizada busca, loading: false");
    }
  }, [])

  useEffect(() => {
    console.log("[auth.ts] useUser - Estado atualizado - User:", user, "Token:", token, "Loading:", loading);
  }, [user, token, loading]);

  return { user, token, loading }
}

// Hook para verificar se o usuário tem acesso a uma área específica
export function useHasAccess(area: string) {
  const { user, loading } = useUser()

  if (loading) return false
  if (!user) return false

  // Admin tem acesso a todas as áreas
  if (user.role === "Admin") return true // CORRIGIDO: "Admin" com maiúscula

  // Verificar se o usuário tem acesso à área específica
  // Conforme o backend, user.areas deve ser um array de objetos Area
  return Array.isArray(user.areas) && user.areas.some((userArea: any) => 
    userArea.name.toLowerCase() === area.toLowerCase()
  )
}

// Função para fazer logout
export function logout(router: any) {
  console.log("[auth.ts] logout - Removendo user e token do localStorage");
  localStorage.removeItem("user")
  localStorage.removeItem("token") // CORRIGIDO: usar "token"
  router.push("/auth/login")
}

