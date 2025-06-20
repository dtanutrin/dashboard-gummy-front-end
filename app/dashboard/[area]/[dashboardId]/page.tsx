"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../app/auth/hooks";
import Header from "../../../../components/Header";
import Link from "next/link";
import { PowerBIEmbed } from "../../../../lib/powerbi";
import { decodeUrlParam } from "../../../../lib/utils";
import { getDashboardById, trackDashboardAccess, Dashboard as ApiDashboard } from "../../../../lib/api";
import Image from "next/image";

// Objeto areaVisuals não é mais necessário para cores, mas pode ser mantido para ícones/descrições futuras.
const areaVisuals: { [key: string]: { color: string; icon: string; description: string } } = {
  default: { color: "#607d8b", icon: "📁", description: "Dashboards gerais" },
  "b2b": { color: "#607d8b", icon: "📈", description: "Vendas e Desempenho B2B" },
  "compras": { color: "#795548", icon: "🛒", description: "Acompanhamento financeiro da Equipe de Compras;" },
  "cs/monitoramento": { color: "#ff80ab", icon: "🎯", description: "Dashboard de acompanhamento dos canais de atendimento e suporte ao Cliente;" },
  "influencer": { color: "#9c27b0", icon: "⭐", description: "Relatórios que apresentam os dados de desempenho dos influenciadores;" },
  "logística": { color: "#e91e63", icon: "🚚", description: "Gestão de estoque e indicadores Logísticos;" },
  "operações e controle": { color: "#c2185b", icon: "⚙️", description: "Processos organizacionais e operacionais" },
  "performance e vendas": { color: "#4caf50", icon: "💹", description: "Relatórios de vendas, Aquisição de mídia e influencer, pedidos e acompanhamento de metas em geral." },
  "retenção": { color: "#00bcd4", icon: "🔄", description: "Relatórios com Foco em dados de Clientes;" },
  "rh": { color: "#ff9800", icon: "👥", description: "Relatórios voltados para a Gestão de Pessoas;" },
  "marketing": { color: "#ff4081", icon: "📊", description: "Campanhas e análise de mercado" }, 
  "operações": { color: "#c2185b", icon: "⚙️", description: "Processos e produtividade" }, 
  "comercialinterno":{ color: "#f48fb1", icon: "💼", description: "Vendas, negociações e acompanhamento de desempenho da equipe comercial"},
  "cs": { color: "#ff80ab", icon: "🎯", description: "Atendimento ao cliente" }, 
  "juridico": { color: "#ff80ab", icon: "🎯", description: "Contratos, conformidade e processos." }, 
  "comercialIndividual": { color: "#607d8b", icon: "📈", description: "Vendas e negociações" },
  "financeiro":{ color: "#f48fb1", icon: "💼", description: "Fluxo de caixa, orçamentos e contas"},
};


export default function ViewDashboardPage({ params: paramsPromise }: { params: Promise<{ area: string; dashboardId: string }> }) {
  const params = use(paramsPromise);

  const decodedAreaSlug = decodeUrlParam(params?.area || ""); 
  const dashboardId = Number.parseInt(params?.dashboardId || '0');
  
  const areaDisplayName = decodedAreaSlug
    .split('/')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('/');
    
  // Cor rosa fixa para a borda
  const fixedPinkBorderColor = "#db2777"; // Cor correspondente a text-pink-600

  const { user, loading: userLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<ApiDashboard | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessTracked, setAccessTracked] = useState(false);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && user) {
      if (isNaN(dashboardId) || dashboardId === 0) {
        setError("ID de dashboard inválido.");
        setIsLoadingDashboard(false);
        return;
      }

      const userHasAreaAccess = 
        user.role?.toLowerCase() === 'admin' || 
        user.areas?.some(area => area.name.toLowerCase() === decodedAreaSlug.toLowerCase());
      
      if (!userHasAreaAccess && !userLoading) {
        setError("Acesso negado a esta área ou dashboard.");
        setIsLoadingDashboard(false);
        return;
      }

      const fetchDashboardData = async () => {
        setIsLoadingDashboard(true);
        setError(null);
        try {
          const fetchedDashboard = await getDashboardById(dashboardId);
          setDashboard(fetchedDashboard);
          
          // Rastrear acesso apenas uma vez quando o dashboard é carregado
          if (!accessTracked) {
            try {
              await trackDashboardAccess(dashboardId);
              setAccessTracked(true);
              console.log('Acesso direto ao dashboard registrado');
            } catch (trackError) {
              console.error('Erro ao rastrear acesso direto:', trackError);
              // Não impede o carregamento do dashboard
            }
          }
        } catch (err) {
          console.error("Erro ao buscar dashboard:", err);
          setError("Dashboard não encontrado ou erro ao carregar.");
        } finally {
          setIsLoadingDashboard(false);
        }
      };

      fetchDashboardData();
    }
  }, [user, userLoading, isAuthenticated, dashboardId, decodedAreaSlug, router, params, accessTracked]);

  if (userLoading || isLoadingDashboard) {
    return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="flex flex-col items-center">
        <Image
          src="/images/GUMMY-smile.png"
          alt="Carregando Gummy"
          width={180}
          height={180}
          className="mb-4"
        />
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          <p className="ml-4 text-pink-700 dark:text-pink-300">Carregando Dashboard</p> 
        </div>
      </div>
    </div>
    );
  }

  const encodedAreaForLink = encodeURIComponent(decodedAreaSlug);

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">Erro</h1>
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
            <Link href={`/dashboard/${encodedAreaForLink}`} className="mt-4 inline-block text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-200">
              Voltar para a área de {areaDisplayName}
            </Link>
            <br/>
            <Link href="/dashboard" className="mt-2 inline-block text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-200">
              Voltar para todos os dashboards
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  if (!dashboard) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
             <p className="ml-4 text-red-700 dark:text-red-400">Dashboard não encontrado.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 dark:bg-gray-900">
      <Header />
      
      {/* Botão flutuante para voltar - responsivo */}
      <Link
        href={`/dashboard/${encodedAreaForLink}`}
        className="fixed top-16 sm:top-20 left-2 sm:left-4 z-50 bg-pink-600 hover:bg-pink-700 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 group"
        title={`Voltar para ${areaDisplayName}`}
      >
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Área principal do dashboard - otimizada para mobile e desktop */}
      <main className="flex-grow w-full h-full flex justify-center">
        <div className="w-full max-w-[1400px] px-2 sm:px-4 lg:px-6 h-full">
          <div
            className="bg-white dark:bg-gray-800 shadow-lg w-full h-full relative rounded-none sm:rounded-lg overflow-hidden"
            style={{ 
              borderTop: `3px solid ${fixedPinkBorderColor}`,
              minHeight: 'calc(100vh - 70px)', // Otimizado para mobile
              marginTop: '6px' // Menor espaçamento no mobile
            }} 
          >
            <PowerBIEmbed 
              reportId={dashboard.url} 
              title={dashboard.name}
              className="absolute inset-0 w-full h-full"
            />
          </div> 
        </div>
      </main>
    </div>
  );
}

