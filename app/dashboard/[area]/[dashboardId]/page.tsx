"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../app/auth/hooks"; // Alterado para useAuth
import Header from "../../../../components/Header";
import Link from "next/link";
import { PowerBIEmbed } from "../../../../lib/powerbi";
import { decodeUrlParam } from "../../../../lib/utils";
import { getDashboardById, Dashboard as ApiDashboard, Area as ApiArea } from "../../../../lib/api"; // Importando getDashboardById e tipos

// Cores por área (pode ser movido para um config ou vir da API de Areas futuramente)
const areaVisuals: { [key: string]: { color: string; icon: string; description: string } } = {
  default: { color: "#607d8b", icon: "📁", description: "Dashboards gerais" },
  logística: { color: "#e91e63", icon: "🚚", description: "Gestão de entregas e estoque" },
  marketing: { color: "#ff4081", icon: "📊", description: "Campanhas e análise de mercado" },
  operações: { color: "#c2185b", icon: "⚙️", description: "Processos e produtividade" },
  cs: { color: "#ff80ab", icon: "🎯", description: "Atendimento ao cliente" },
  comercial: { color: "#f48fb1", icon: "💼", description: "Vendas e negociações" },
  // Adicione mais áreas e seus visuais conforme necessário
};

export default function ViewDashboardPage({ params: paramsPromise }: { params: Promise<{ area: string; dashboardId: string }> }) {
  const params = use(paramsPromise);

  const decodedAreaSlug = decodeUrlParam(params?.area || '');
  const dashboardId = Number.parseInt(params?.dashboardId || '0');
  
  // O nome da área para exibição e cor pode vir de um contexto global de áreas ou ser inferido
  // Por enquanto, vamos inferir do slug para manter a cor do card consistente.
  const areaDisplayName = decodedAreaSlug.charAt(0).toUpperCase() + decodedAreaSlug.slice(1);
  const visual = areaVisuals[decodedAreaSlug.toLowerCase()] || areaVisuals.default;
  const areaColor = visual.color;

  const { user, loading: userLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  // const hasAccess = useHasAccess(areaDisplayName); // A lógica de useHasAccess pode precisar ser revista para usar IDs ou dados da API
  const [dashboard, setDashboard] = useState<ApiDashboard | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && user) {
      if (isNaN(dashboardId) || dashboardId === 0) {
        setError("ID de dashboard inválido.");
        setIsLoadingDashboard(false);
        // router.push(`/dashboard/${decodedAreaSlug}`); // Redireciona para a página da área
        return;
      }

      // Lógica de verificação de acesso à área (simplificada)
      // Idealmente, o backend deveria validar se o usuário tem acesso a este dashboard específico
      // ou se a área do dashboard está entre as áreas permitidas do usuário.
      const userHasAreaAccess = user.role?.toLowerCase() === 'admin' || user.areas?.some(area => area.name.toLowerCase().replace(/\s+/g, "-") === decodedAreaSlug);
      
      if (!userHasAreaAccess && !userLoading) {
        // console.warn(`Usuário ${user.email} sem acesso à área ${decodedAreaSlug}. Redirecionando.`);
        // setError("Você não tem acesso a esta área.");
        // setIsLoadingDashboard(false);
        router.push("/dashboard"); // Redireciona para a página principal de dashboards
        return;
      }

      const fetchDashboardData = async () => {
        setIsLoadingDashboard(true);
        setError(null);
        try {
          const fetchedDashboard = await getDashboardById(dashboardId);
          setDashboard(fetchedDashboard);
        } catch (err) {
          console.error("Erro ao buscar dashboard:", err);
          setError("Dashboard não encontrado ou erro ao carregar.");
        } finally {
          setIsLoadingDashboard(false);
        }
      };

      fetchDashboardData();
    }
  }, [user, userLoading, isAuthenticated, dashboardId, decodedAreaSlug, router, params]);

  if (userLoading || isLoadingDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <p className="ml-4 text-pink-700">Carregando Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">Erro</h1>
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
            <Link href={`/dashboard/${decodedAreaSlug}`} className="mt-4 inline-block text-pink-600 hover:text-pink-800">
              Voltar para a área de {areaDisplayName}
            </Link>
            <br/>
            <Link href="/dashboard" className="mt-2 inline-block text-pink-600 hover:text-pink-800">
              Voltar para todos os dashboards
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  if (!dashboard) {
    // Este caso pode ser coberto pelo erro, mas é uma salvaguarda
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
             <p className="ml-4 text-red-700">Dashboard não encontrado.</p>
        </div>
    );
  }

  return (
    <div className="bg-pink-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full flex flex-col">
        <div className="px-4 py-6 sm:px-0 flex flex-col flex-grow">
          <div className="flex items-center mb-6">
            <Link
              href={`/dashboard/${decodedAreaSlug}`}
              className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 mr-4 transition-colors"
            >
              ← Voltar para {areaDisplayName}
            </Link>
            <h1 className="text-2xl font-semibold dark:text-white" style={{ color: areaColor }}>
              {dashboard.name}
            </h1>
          </div>

          <div
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all hover:shadow-lg flex-grow flex flex-col"
            style={{ borderTop: `4px solid ${areaColor}` }}
          >
            <div className="w-full h-full flex-grow">
              <PowerBIEmbed 
                reportId={dashboard.url} 
                title={dashboard.name}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

