"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../../hooks/auth" // Ajustado para o caminho no projeto target
import Header from "../../components/Header" // Ajustado para o caminho no projeto target
import AreaCard from "../../components/AreaCard" // Importando o novo AreaCard
import Image from "next/image"

// Interface para os dados de uma área
interface Area {
  id: number | string;
  name: string;
  slug: string; // Para URLs amigáveis e consistência na filtragem
  color: string;
  icon: string;
  description: string;
}

// Dados das áreas. Idealmente, viriam do backend ou de uma configuração centralizada.
// O campo 'slug' deve corresponder ao que é armazenado em user.areas se for usado para filtragem.
const allAreasData: Area[] = [
  { id: 1, name: "Logística", slug: "logistica", color: "#e91e63", icon: "🚚", description: "Gestão de entregas e estoque" },
  { id: 2, name: "Marketing", slug: "marketing", color: "#ff4081", icon: "📊", description: "Campanhas e análise de mercado" },
  { id: 3, name: "Operações", slug: "operacoes", color: "#c2185b", icon: "⚙️", description: "Processos e produtividade" },
  { id: 4, name: "CS", slug: "cs", color: "#ff80ab", icon: "🎯", description: "Atendimento ao cliente" },
  { id: 5, name: "Comercial", slug: "comercial", color: "#f48fb1", icon: "💼", description: "Vendas e negociações" },
]

export default function DashboardPage() {
  const { user, loading } = useUser() // Removido isAuthenticated da desestruturação
  const router = useRouter()
  const [displayedAreas, setDisplayedAreas] = useState<Area[]>([])

  useEffect(() => {
    // Se não estiver carregando e não houver usuário, redireciona para o login
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    // Se houver usuário (implica que está autenticado)
    if (user) {
      const userAllowedAreaSlugs = user.areas || []; 
      const filteredAreas = allAreasData.filter(area => 
        user.role === "admin" || userAllowedAreaSlugs.includes(area.slug) || userAllowedAreaSlugs.includes(area.name)
      );
      setDisplayedAreas(filteredAreas)
    }
  }, [user, loading, router])

  // Mostrar tela de carregamento enquanto 'loading' for true ou se, após o carregamento, não houver usuário (indicando falha na autenticação ou usuário não logado)
  if (loading || (!loading && !user)) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <p>Carregando...</p>
      </div>
    )
  }

  // Se chegou aqui, significa que loading é false e user existe
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <Header />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/gummy-logo.png" alt="Gummy Original" width={180} height={60} />
          </div>
          <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">Dashboards Gummy</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Selecione uma área para visualizar os dashboards de Power BI específicos e acompanhar os indicadores de
            desempenho.
          </p>
        </div>

        {displayedAreas.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {displayedAreas.map((area, index) => (
              <AreaCard key={area.id} area={area} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 dark:text-gray-400">Nenhuma área disponível para você no momento.</p>
            {user?.role !== 'admin' && <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Entre em contato com um administrador se você acredita que deveria ter acesso a alguma área.</p>}
          </div>
        )}
      </main>

      <footer className="mt-16 py-8 bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>Gummy Dashboards © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}