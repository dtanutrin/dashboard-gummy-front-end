"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../../hooks/auth"
import Header from "../../components/Header"
import Link from "next/link"
import Image from "next/image"

// Dados simulados das áreas com cores atualizadas para rosa
const areas = [
  { id: 1, name: "Logística", color: "#e91e63", icon: "🚚", description: "Gestão de entregas e estoque" },
  { id: 2, name: "Marketing", color: "#ff4081", icon: "📊", description: "Campanhas e análise de mercado" },
  { id: 3, name: "Operações", color: "#c2185b", icon: "⚙️", description: "Processos e produtividade" },
  { id: 4, name: "CS", color: "#ff80ab", icon: "🎯", description: "Atendimento ao cliente" },
  { id: 5, name: "Comercial", color: "#f48fb1", icon: "💼", description: "Vendas e negociações" },
]

// Componente de cartão de área com animação
const AreaCard = ({ area , index }) => {
  const areaClass = `area-card-${area.name.toLowerCase()}`

  return (
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100">
      <Link href={`/dashboard/${area.name.toLowerCase()}`} className="block">
        <div
          className={`h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${areaClass} rounded-lg`}
          style={{
            backgroundColor: area.color,
            borderRadius: "12px",
            border: "none",
          }}
        >
          <div className="p-6 flex flex-col items-center text-center">
            <div className="text-5xl mb-4 mt-4">{area.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{area.name}</h2>
            <p className="opacity-80 text-sm">{area.description}</p>
            <div className="mt-4 w-1/3 h-1 bg-white bg-opacity-30 rounded-full"></div>
            <button
              className="mt-6 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm font-medium transition-all duration-200"
              style={{ backdropFilter: "blur(4px)" }}
            >
              Acessar Dashboard
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function Dashboard() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [userAreas, setUserAreas] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      // Filtrar áreas que o usuário tem acesso
      const filteredAreas = areas.filter((area) => user.role === "admin" || (user.areas && Array.isArray(user.areas) && user.areas.includes(area.name)))
      setUserAreas(filteredAreas)
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {userAreas.map((area, index) => (
            <AreaCard key={area.id} area={area} index={index} />
          ))}
        </div>
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
