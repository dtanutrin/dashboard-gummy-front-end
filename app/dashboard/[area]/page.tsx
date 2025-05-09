"use client"

import { use } from 'react'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser, useHasAccess } from "../../../hooks/auth"
import Header from "../../../components/Header"
import Link from "next/link"
import { decodeUrlParam } from "../../../lib/utils"

// Definindo tipos para maior clareza e segurança
interface DashboardItem {
  id: number;
  name: string;
  description: string;
  embedUrl: string;
  icon: string;
  tags: string[];
}

interface DashboardsByArea {
  [key: string]: DashboardItem[];
}

interface AreaColors {
  [key: string]: string;
}

interface AreaIcons {
  [key: string]: string;
}

// Dados simulados dos dashboards por área
const dashboardsByArea: DashboardsByArea = {
  logística: [
    {
      id: 1,
      name: "Desempenho de Entregas",
      description: "Análise de tempo de entrega e eficiência (Dashboard Real)",
      embedUrl: "https://app.powerbi.com/view?r=eyJrIjoiMDRiMDQ3Y2ItNjNmOS00NDI5LTg0YzItYzI0MWJjZDgyNjY5IiwidCI6Ijk5NTRmYTFjLThhN2UtNGExZC1iNWYzLTg3NDlhNGU1ZjkyYiJ9",
      icon: "🚚",
      tags: ["Entregas", "KPIs", "Real"],
    },
    {
      id: 2,
      name: "Gestão de Estoque",
      description: "Monitoramento de níveis de estoque e rotatividade",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123457&autoAuth=true",
      icon: "📦",
      tags: ["Estoque", "Inventário"],
    },
    {
      id: 3,
      name: "Rotas de Distribuição",
      description: "Análise de rotas e custos de transporte",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123458&autoAuth=true",
      icon: "🗺️",
      tags: ["Rotas", "Custos"],
    },
  ],
  marketing: [
    {
      id: 4,
      name: "Desempenho de Campanhas",
      description: "Análise de ROI e conversão de campanhas",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123459&autoAuth=true",
      icon: "📊",
      tags: ["ROI", "Campanhas"],
    },
    {
      id: 5,
      name: "Engajamento nas Redes Sociais",
      description: "Métricas de alcance e interação",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123460&autoAuth=true",
      icon: "📱",
      tags: ["Social", "Engajamento"],
    },
  ],
  operações: [
    {
      id: 6,
      name: "Eficiência Operacional",
      description: "Indicadores de produtividade e eficiência",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123461&autoAuth=true",
      icon: "⚙️",
      tags: ["Produtividade", "Eficiência"],
    },
    {
      id: 7,
      name: "Controle de Qualidade",
      description: "Métricas de qualidade e conformidade",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123462&autoAuth=true",
      icon: "✓",
      tags: ["Qualidade", "Conformidade"],
    },
  ],
  cs: [
    {
      id: 8,
      name: "Satisfação do Cliente",
      description: "NPS e métricas de satisfação",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123463&autoAuth=true",
      icon: "😊",
      tags: ["NPS", "Satisfação"],
    },
    {
      id: 9,
      name: "Tempo de Resolução",
      description: "Análise de tempo de atendimento",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123464&autoAuth=true",
      icon: "⏱️",
      tags: ["Atendimento", "SLA"],
    },
  ],
  comercial: [
    {
      id: 10,
      name: "Pipeline de Vendas",
      description: "Análise de funil de vendas e conversão",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123465&autoAuth=true",
      icon: "📈",
      tags: ["Vendas", "Funil"],
    },
    {
      id: 11,
      name: "Desempenho de Vendedores",
      description: "Métricas por vendedor e região",
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=123466&autoAuth=true",
      icon: "👥",
      tags: ["Vendedores", "Regiões"],
    },
  ],
}

const areaColors: AreaColors = {
  logística: "#e91e63",
  marketing: "#ff4081",
  operações: "#c2185b",
  cs: "#ff80ab",
  comercial: "#f48fb1",
}

const areaIcons: AreaIcons = {
  logística: "🚚",
  marketing: "📊",
  operações: "⚙️",
  cs: "🎯",
  comercial: "💼",
}

interface DashboardCardProps {
  dashboard: DashboardItem;
  areaColor: string;
  decodedArea: string;
  index: number; // index não é usado no componente, mas mantido se necessário para outros fins
}

const DashboardCard = ({ dashboard, areaColor, decodedArea }: DashboardCardProps) => {
  return (
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100">
      <div className="h-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 rounded-lg bg-white">
        <div className="h-2" style={{ backgroundColor: areaColor }}></div>
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="text-2xl">{dashboard.icon}</div>
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <h3 className="text-xl mt-2 dark:text-white font-bold">{dashboard.name}</h3>
        </div>
        <div className="px-4 py-2">
          <p className="text-gray-600 dark:text-gray-300 text-sm">{dashboard.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {dashboard.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 dark:bg-pink-900 dark:text-pink-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 pt-0">
          <Link href={`/dashboard/${decodedArea}/${dashboard.id}`} className="w-full">
            <button
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-white font-medium"
              style={{ backgroundColor: areaColor, borderColor: areaColor }}
            >
              Visualizar Dashboard
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface AreaDashboardsProps {
  params: { area: string };
}

export default function AreaDashboards({ params }: AreaDashboardsProps) {
  // Removido o use(params) pois params já é síncrono aqui
  const decodedArea = decodeUrlParam(params.area)
  const areaName = decodedArea.charAt(0).toUpperCase() + decodedArea.slice(1)

  const { user, loading } = useUser()
  const router = useRouter()
  // A área para useHasAccess deve ser a 'areaName' capitalizada, como 'Logística', 'Marketing', etc.
  // Se as permissões no backend/usuário estiverem como 'logistica', 'marketing', então use 'decodedArea'
  const hasAccess = useHasAccess(areaName) // Ou useHasAccess(decodedArea) dependendo da configuração de permissões
  
  const [dashboards, setDashboards] = useState<DashboardItem[]>([])
  
  // Garantir que a chave exista antes de acessar ou fornecer um fallback
  const lowerDecodedArea = decodedArea.toLowerCase();
  const areaColor = areaColors[lowerDecodedArea] || "#e91e63" 
  const areaIcon = areaIcons[lowerDecodedArea] || "📊"

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (!hasAccess) {
        // Considerar redirecionar para uma página de não autorizado ou mostrar mensagem
        router.push("/dashboard") 
        return
      }
      // Garantir que a chave exista antes de acessar ou fornecer um fallback
      const areaDashboards = dashboardsByArea[lowerDecodedArea] || []
      setDashboards(areaDashboards)
    }
  }, [user, loading, hasAccess, lowerDecodedArea, router]) // Adicionado lowerDecodedArea às dependências

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!user || !hasAccess) {
    // Se o usuário não estiver logado ou não tiver acesso, não renderiza nada ou mostra mensagem de acesso negado.
    // O redirecionamento já é tratado no useEffect.
    // Pode ser útil ter uma tela de "Acesso Negado" aqui em vez de retornar null.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl text-gray-700 dark:text-gray-300">Verificando acesso...</p>
      </div>
    ); 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center mb-2">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4 transition-colors"
            >
              <svg
                className="h-5 w-5 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Voltar</span>
            </Link>
          </div>

          <div className="flex items-center">
            <div
              className="flex items-center justify-center h-12 w-12 rounded-full mr-4 text-2xl"
              style={{ backgroundColor: `${areaColor}20` }} // Adicionado sufixo para transparência se desejado, ou manter como está
            >
              {areaIcon}
            </div>
            <div>
              <h1 className="text-3xl font-bold dark:text-white" style={{ color: areaColor }}>
                Dashboards de {areaName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Selecione um dashboard para visualizar os dados detalhados
              </p>
            </div>
          </div>
        </div>

        {dashboards.length === 0 && !loading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 dark:text-gray-300">Nenhum dashboard encontrado para esta área ou você não tem acesso.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dashboards.map((dashboard, index) => (
            <DashboardCard
              key={dashboard.id}
              dashboard={dashboard}
              areaColor={areaColor}
              decodedArea={decodedArea} // decodedArea é string
              index={index}
            />
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
