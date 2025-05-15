"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../app/auth/hooks";
import Header from "../../../components/Header";
import DashboardCard from "../../../components/DashboardCard"; // Novo componente
import { getAllAreas, Area as ApiArea, Dashboard as ApiDashboard } from "../../../lib/api"; // Corrigido: getAllAreas importado diretamente
import { decodeUrlParam } from "../../../lib/utils";
import Image from "next/image";

// Cores por área (pode ser movido para um config ou vir da API de Areas futuramente)
const areaVisuals: { [key: string]: { color: string; icon: string; description: string } } = {
  default: { color: "#607d8b", icon: "📁", description: "Dashboards gerais" },
  b2b: { color: "#607d8b", icon: "📈", description: "Vendas e Desempenho B2B" },
  "comercial interno": { color: "#f48fb1", icon: "💼", description: "Vendas, negociações e acompanhamento de desempenho da equipe comercial;" },
  compras: { color: "#795548", icon: "🛒", description: "Acompanhamento financeiro da Equipe de Compras;" },
  "cs/monitoramento": { color: "#ff80ab", icon: "🎯", description: "Dashboard de acompanhamento dos canais de atendimento e suporte ao Cliente;" },
  influencer: { color: "#9c27b0", icon: "⭐", description: "Relatórios que apresentam os dados de desempenho dos influenciadores;" },
  logística: { color: "#e91e63", icon: "🚚", description: "Gestão de estoque e indicadores Logísticos;" },
  "operações e controle": { color: "#c2185b", icon: "⚙️", description: "Processos organizacionais e operacionais" },
  "performance e vendas": { color: "#4caf50", icon: "💹", description: "Relatórios de vendas, Aquisição de mídia e influencer, pedidos e acompanhamento de metas em geral." },
  retenção: { color: "#00bcd4", icon: "🔄", description: "Relatórios com Foco em dados de Clientes;" },
  rh: { color: "#ff9800", icon: "👥", description: "Relatórios voltados para a Gestão de Pessoas;" },
  // Mantendo os antigos para referência caso o nome da área não bata com os novos
  marketing: { color: "#ff4081", icon: "📊", description: "Campanhas e análise de mercado" }, 
  operações: { color: "#c2185b", icon: "⚙️", description: "Processos e produtividade" }, 
  cs: { color: "#ff80ab", icon: "🎯", description: "Atendimento ao cliente" }, 
  comercial: { color: "#f48fb1", icon: "💼", description: "Vendas e negociações" },
};

export default function AreaDashboardsPage({ params: paramsPromise }: { params: Promise<{ area: string }> }) {
  const params = use(paramsPromise);
  const decodedAreaSlug = decodeUrlParam(params?.area || 
"");

  const { user, loading: userLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [areaData, setAreaData] = useState<ApiArea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const visual = areaVisuals[decodedAreaSlug.toLowerCase()] || areaVisuals.default;
  const areaColor = visual.color;
  const areaDisplayName = decodedAreaSlug.charAt(0).toUpperCase() + decodedAreaSlug.slice(1);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && user && decodedAreaSlug) {
      const fetchAreaData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const allAreas = await getAllAreas(); // Corrigido: Chamada direta da função importada
          const currentArea = allAreas.find(a => a.name.toLowerCase().replace(/\s+/g, "-") === decodedAreaSlug);
          
          if (!currentArea) {
            setError("Área não encontrada ou você não tem acesso.");
            setAreaData(null);
          } else {
            const userHasAccessToThisArea = user.role === "Admin" || user.areas?.some(ua => ua.id === currentArea.id);
            if (!userHasAccessToThisArea) {
                setError("Acesso negado a esta área.");
                setAreaData(null);
            } else {
                setAreaData(currentArea);
            }
          }
        } catch (err) {
          console.error("Erro ao buscar dados da área:", err);
          setError("Erro ao carregar dados da área.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAreaData();
    }
  }, [user, userLoading, isAuthenticated, decodedAreaSlug, router]);

  if (userLoading || isLoading) {
    return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Container principal para centralizar todo o conteúdo do loader */}
      <div className="flex flex-col items-center">
        
        {/* 1. Imagem da Gummy */}
        <Image
          src="/images/GUMMY-smile.png"
          alt="Carregando Gummy"
          width={180} // Ajuste o tamanho conforme desejar
          height={180} // Ajuste o tamanho conforme desejar
          className="mb-4" // Adiciona uma margem inferior à imagem
        />

        {/* 2. Container para o spinner e o texto, para alinhá-los horizontalmente */}
        <div className="flex items-center">
          {/* Spinner rosa (círculo giratório) */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          
          {/* Texto de carregamento */}
          <p className="ml-4 text-pink-700 dark:text-pink-300">Carregando área...</p> 
          {/* Adicionei dark:text-pink-300 para melhor visualização no modo escuro, ajuste conforme seu tema */}
        </div>

      </div>
    </div>

      
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <Link href="/dashboard" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
            Voltar para todas as áreas
          </Link>
        </main>
      </div>
    );
  }

  if (!areaData) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-gray-500 dark:text-gray-400">Área não encontrada ou acesso negado.</p>
           <Link href="/dashboard" className="mt-4 inline-block px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
            Voltar para todas as áreas
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors">
            ← Voltar para todas as áreas
          </Link>
          <h1 className="text-3xl font-bold mt-2 mb-3" style={{ color: areaColor }}>
            {visual.icon} {areaData.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            {visual.description}
          </p>
        </div>

        {areaData.dashboards && areaData.dashboards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areaData.dashboards.map(dashboard => (
              <DashboardCard 
                key={dashboard.id} 
                dashboard={dashboard} 
                areaSlug={decodedAreaSlug} 
                areaColor={areaColor} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 dark:text-gray-400">Nenhum dashboard disponível nesta área no momento.</p>
            {user?.role === "Admin" && (
                 <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Você pode adicionar dashboards a esta área no painel de administração.
                 </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

