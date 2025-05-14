// Caminho do arquivo: /home/ubuntu/dashboard-gummy-front-end/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/auth/hooks"; // Corrigido para o caminho correto de useAuth
import Header from "../../components/Header";
import AreaCard from "../../components/AreaCard";
import Image from "next/image";
import { getAllAreas, Area as ApiArea, Dashboard as ApiDashboard } from "../../lib/api"; // Importando funções da API e tipos

// Interface para Área no frontend, pode incluir dados de exibição como cor/ícone
interface FrontendArea extends ApiArea {
  slug: string; // Mantido para compatibilidade com lógica existente, se necessário
  color: string; // Será definido no frontend
  icon: string; // Será definido no frontend
  description: string; // Será definido no frontend
  dashboards?: ApiDashboard[]; // Para armazenar dashboards da API
}

// Mapeamento de cores e ícones para áreas (pode ser expandido ou movido para um config)
const areaVisuals: { [key: string]: { color: string; icon: string; description: string } } = {
  default: { color: "#607d8b", icon: "📁", description: "Dashboards gerais" }, // Cor e ícone padrão
  logística: { color: "#e91e63", icon: "🚚", description: "Gestão de entregas e estoque" },
  marketing: { color: "#ff4081", icon: "📊", description: "Campanhas e análise de mercado" },
  operações: { color: "#c2185b", icon: "⚙️", description: "Processos e produtividade" },
  cs: { color: "#ff80ab", icon: "🎯", description: "Atendimento ao cliente" },
  comercial: { color: "#f48fb1", icon: "💼", description: "Vendas e negociações" },
  // Adicione mais áreas e seus visuais conforme necessário
};

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth(); 
  const router = useRouter();
  const [displayedAreas, setDisplayedAreas] = useState<FrontendArea[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);
  const [debugUserInfo, setDebugUserInfo] = useState<string>("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && user) {
      const fetchAreasAndDashboards = async () => {
        setIsLoadingAreas(true);
        try {
          const apiAreas = await getAllAreas();
          
          const processedAreas: FrontendArea[] = apiAreas.map(area => {
            const visual = areaVisuals[area.name.toLowerCase()] || areaVisuals.default;
            return {
              ...area,
              slug: area.name.toLowerCase().replace(/\s+/g, "-"), 
              color: visual.color,
              icon: visual.icon,
              description: visual.description, 
              dashboards: area.dashboards || [] // Garante que dashboards seja um array
            };
          });

          let filteredAreas: FrontendArea[];
          if (user.role?.toLowerCase() === "admin") {
            filteredAreas = processedAreas;
          } else {
            const userAllowedAreaIds = user.areas?.map(a => a.id) || [];
            if (userAllowedAreaIds.length > 0) {
                 filteredAreas = processedAreas.filter(area => userAllowedAreaIds.includes(area.id));
            } else {
                filteredAreas = [];
            }
          }

          setDisplayedAreas(filteredAreas);

          if (filteredAreas.length === 0 && !loading) {
            setDebugUserInfo(`Debug Info: User Role: ${user.role}, User Allowed Area IDs: ${JSON.stringify(user.areas?.map(a=>a.id))}`);
          } else {
            setDebugUserInfo("");
          }

        } catch (error) {
          console.error("Erro ao buscar áreas ou dashboards:", error);
          setDebugUserInfo("Erro ao carregar dados das áreas.");
        } finally {
          setIsLoadingAreas(false);
        }
      };

      fetchAreasAndDashboards();
    }
  }, [user, loading, isAuthenticated, router]);

  if (loading || isLoadingAreas || (!loading && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <p className="ml-4 text-pink-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <Header />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/gummy-logo.png" alt="Gummy Original" width={180} height={60} priority />
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
            {user && user.role?.toLowerCase() !== "admin" && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Entre em contato com um administrador se você acredita que deveria ter acesso a alguma área.
              </p>
            )}
            {debugUserInfo && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-red-500 dark:text-red-400 font-semibold">Informação de Debug:</p>
                <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {debugUserInfo}
                </pre>
              </div>
            )}
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
  );
}

