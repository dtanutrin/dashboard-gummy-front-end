"use client"

import { useEffect, useState } from "react"

// Hook para obter o usuário atual e o token
export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null) // Adicionado estado para o token
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("[auth.ts] useUser useEffect - Iniciando busca de dados do localStorage");
    try {
      const userData = localStorage.getItem("user")
      const tokenData = localStorage.getItem("token") // Buscar o token do localStorage
      
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

  // Adicionado para logar mudanças no token e usuário que serão retornados
  useEffect(() => {
    console.log("[auth.ts] useUser - Estado atualizado - User:", user, "Token:", token, "Loading:", loading);
  }, [user, token, loading]);

  return { user, token, loading } // Retornar o token também
}

// Hook para verificar se o usuário tem acesso a uma área específica
export function useHasAccess(area: string) {
  const { user, loading } = useUser() // useUser agora também retorna token, mas não é usado aqui diretamente

  if (loading) return false
  if (!user) return false

  // Admin tem acesso a todas as áreas
  if (user.role === "admin") return true

  // Verificar se o usuário tem acesso à área específica
  // Ajustar conforme a estrutura real do objeto user.areas
  return Array.isArray(user.areas) && user.areas.includes(area)
}

// Função para fazer logout
export function logout(router: any) {
  console.log("[auth.ts] logout - Removendo user e token do localStorage");
  localStorage.removeItem("user")
  localStorage.removeItem("token") // Remover o token no logout também
  // Idealmente, o estado do useUser deveria ser resetado aqui também, 
  // mas como é um hook, o componente que o usa será re-renderizado e o useEffect buscará do localStorage (que estará vazio)
  router.push("/auth/login")
}

