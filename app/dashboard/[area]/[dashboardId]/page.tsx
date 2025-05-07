"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser, useHasAccess } from "../../../../hooks/auth"
import Header from "../../../../components/Header"
import Link from "next/link"
import { PowerBIEmbed } from "../../../../lib/powerbi"
import { decodeUrlParam } from "../../../../lib/utils"

interface Dashboard {
  id: number
  name: string
  description: string
  url: string
}

// Dados simulados dos dashboards por área
const dashboardsByArea = {
  logística: [
    {
      id: 1,
      name: "Desempenho de Entregas",
      description: "Análise de tempo de entrega e eficiência",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMDRiMDQ3Y2ItNjNmOS00NDI5LTg0YzItYzI0MWJjZDgyNjY5IiwidCI6Ijk5NTRmYTFjLThhN2UtNGExZC1iNWYzLTg3NDlhNGU1ZjkyYiJ9"
    },
    {
      id: 2,
      name: "Gestão de Estoque",
      description: "Monitoramento de níveis de estoque e rotatividade",
      url: "https://app.powerbi.com/view?r=123457"
    },
    {
      id: 3,
      name: "Rotas de Distribuição",
      description: "Análise de rotas e custos de transporte",
      url: "https://app.powerbi.com/view?r=123458"
    }
  ],
  marketing: [
    {
      id: 4,
      name: "Desempenho de Campanhas",
      description: "Análise de ROI e conversão de campanhas",
      url: "https://app.powerbi.com/view?r=123459"
    },
    {
      id: 5,
      name: "Engajamento nas Redes Sociais",
      description: "Métricas de alcance e interação",
      url: "https://app.powerbi.com/view?r=123460"
    }
  ],
  operações: [
    {
      id: 6,
      name: "Eficiência Operacional",
      description: "Indicadores de produtividade e eficiência",
      url: "https://app.powerbi.com/view?r=123461"
    },
    { 
      id: 7, 
      name: "Controle de Qualidade", 
      description: "Métricas de qualidade e conformidade", 
      url: "https://app.powerbi.com/view?r=123462" 
    }
  ],
  cs: [
    { 
      id: 8, 
      name: "Satisfação do Cliente", 
      description: "NPS e métricas de satisfação", 
      url: "https://app.powerbi.com/view?r=123463" 
    },
    { 
      id: 9, 
      name: "Tempo de Resolução", 
      description: "Análise de tempo de atendimento", 
      url: "https://app.powerbi.com/view?r=123464" 
    }
  ],
  comercial: [
    { 
      id: 10, 
      name: "Pipeline de Vendas", 
      description: "Análise de funil de vendas e conversão", 
      url: "https://app.powerbi.com/view?r=123465" 
    },
    { 
      id: 11, 
      name: "Desempenho de Vendedores", 
      description: "Métricas por vendedor e região", 
      url: "https://app.powerbi.com/view?r=123466" 
    }
  ]
}

// Cores por área atualizadas para tons de rosa
const areaColors = {
  logística: "#e91e63",
  marketing: "#ff4081",
  operações: "#c2185b",
  cs: "#ff80ab",
  comercial: "#f48fb1"
}

// Função para encontrar um dashboard pelo ID
function findDashboardById(area: string, id: number): Dashboard | undefined {
  const dashboards = dashboardsByArea[area.toLowerCase() as keyof typeof dashboardsByArea] || []
  return dashboards.find((dashboard) => dashboard.id === id)
}

export default function ViewDashboard({ params }: { params: { area: string; dashboardId: string } }) {
  // Acesso seguro aos parâmetros
  const decodedArea = decodeUrlParam(params?.area || '')
  const dashboardId = Number.parseInt(params?.dashboardId || '0')
  const areaName = decodedArea.charAt(0).toUpperCase() + decodedArea.slice(1)

  const { user, loading } = useUser()
  const router = useRouter()
  const hasAccess = useHasAccess(areaName)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const areaColor = areaColors[decodedArea.toLowerCase() as keyof typeof areaColors] || "#e91e63"

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (!hasAccess) {
        router.push("/dashboard")
        return
      }

      if (isNaN(dashboardId)) {
        router.push(`/dashboard/${decodedArea}`)
        return
      }

      // Obter dashboard pelo ID
      const foundDashboard = findDashboardById(decodedArea, dashboardId)
      if (foundDashboard) {
        setDashboard(foundDashboard)
      } else {
        router.push(`/dashboard/${decodedArea}`)
      }
    }
  }, [user, loading, hasAccess, decodedArea, dashboardId, router])

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-6">
            <Link
              href={`/dashboard/${decodedArea}`}
              className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 mr-4 transition-colors"
            >
              ← Voltar
            </Link>
            <h1 className="text-2xl font-semibold dark:text-white" style={{ color: areaColor }}>
              {dashboard.name}
            </h1>
          </div>

          <div
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all hover:shadow-lg"
            style={{ borderTop: `4px solid ${areaColor}` }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300">{dashboard.description}</p>
            </div>
            <div className="w-full min-h-[500px]">
              <PowerBIEmbed 
                reportId={dashboard.url} 
                title={dashboard.name}
                className="w-full h-full min-h-[500px]"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}