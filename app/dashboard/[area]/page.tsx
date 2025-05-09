"use client"

import { use } from 'react'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../../../hooks/auth" // Removido useHasAccess
import Header from "../../../components/Header"
import Link from "next/link"
import { decodeUrlParam } from "../../../lib/utils"

// Interface para um dashboard individual (para melhor tipagem)
interface Dashboard {
  id: number;
  name: string;
  description: string;
  embedUrl: string;
  icon: string;
  tags: string[];
}

// Tipagem para dashboardsByArea
interface DashboardsByAreaType {
  [key: string]: Dashboard[];
}

// Dados simulados dos dashboards por área
const dashboardsByArea: DashboardsByAreaType = {
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
  ],
}

// Cores por área
const areaColors: { [key: string]: string } = {
  logística: "#e91e63",
  marketing: "#ff4081",
  operações: "#c2185b",
  cs: "#ff80ab",
  comercial: "#f48fb1",
}

// Ícones por área
const areaIcons: { [key: string]: string } = {
  logística: "🚚",
  marketing: "📊",
  operações: "⚙️",
  cs: "🎯",
  comercial: "💼",
}

interface DashboardCardProps {
  dashboard: Dashboard;
  areaColor: string;
  decodedArea: string;
  index: number; // index não estava sendo usado, mas mantido se necessário para animações futuras
}

const DashboardCard: React.FC<DashboardCardProps> = ({ dashboard, areaColor, decodedArea }) => {
  return (
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100">
      <div className="h-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 rounded-lg bg-white">
        <div className="h-2" style={{ backgroundColor: areaColor }}></div>
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="text-2xl">{dashboard.icon}</div>
            {/* Ícone de placeholder mantido */}
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
              {/* Ícone SVG mantido */}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AreaDashboards({ params }: { params: Promise<{ area: string }> }) {
  const { area } = use(params)
  const decodedArea = decodeUrlParam(area)
  const areaName = decodedArea.charAt(0).toUpperCase() + decodedArea.slice(1)

  const { user, loading } = useUser()
  const router = useRouter()
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [currentUserHasAccess, setCurrentUserHasAccess] = useState(false);

  const areaColor = areaColors[decodedArea.toLowerCase()] || "#e91e63"
  const areaIcon = areaIcons[decodedArea.toLowerCase()] || "📊"

  useEffect(() => {
    if (loading) return; // Aguarda o carregamento do usuário

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Lógica de verificação de acesso movida para cá e corrigida
    let calculatedAccess = false;
    const isAdmin = user.role && user.role.toLowerCase() === "admin";
    const userAreasArray = Array.isArray(user.areas) ? user.areas : [];
    
    // decodedArea é o slug (ex: "logistica"). areaName é capitalizado (ex: "Logística")
    // A verificação deve ser consistente com o que user.areas pode conter (slugs ou nomes)
    if (isAdmin || userAreasArray.includes(decodedArea) || userAreasArray.includes(areaName)) {
      calculatedAccess = true;
    }
    
    setCurrentUserHasAccess(calculatedAccess);

    if (calculatedAccess) {
      const areaSpecificDashboards = dashboardsByArea[decodedArea.toLowerCase()] || [];
      setDashboards(areaSpecificDashboards);
    } else {
      router.push("/dashboard"); // Redireciona se não tiver acesso
    }
  }, [user, loading, decodedArea, areaName, router]);

  if (loading || !user) { // Mostra carregamento se loading ou se user ainda não definido
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Se o usuário existe mas não tem acesso, o useEffect já deve ter redirecionado.
  // Mas como uma segurança adicional, ou para evitar renderização momentânea:
  if (!currentUserHasAccess) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
            <p>Verificando acesso ou redirecionando...</p>
        </div>
    ); 
  }

  // Se chegou aqui, o usuário está carregado e tem acesso
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
              {/* Ícone SVG Voltar mantido */}
              <span>Voltar</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div
              className="flex items-center justify-center h-12 w-12 rounded-full mr-4 text-2xl"
              style={{ backgroundColor: `${areaColor}20` }}
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

        {dashboards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboards.map((dashboard, index) => (
                <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                areaColor={areaColor}
                decodedArea={decodedArea}
                index={index}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-10">
                <p className="text-xl text-gray-500 dark:text-gray-400">Nenhum dashboard disponível para esta área ou você não tem acesso.</p>
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