"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/auth/hooks";
import Header from "../../components/Header";
import AreaCard from "../../components/AreaCard";
import Image from "next/image";
import { getAllAreas, Area as ApiArea, Dashboard as ApiDashboard } from "../../lib/api";

// Interface para Área no frontend, AGORA INCLUI iconFilename
interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
  iconFilename: string; // Nome do arquivo do ícone (ex: 'b2b-icone.png')
  description: string;
  dashboards?: ApiDashboard[];
}

// Mapeamento ATUALIZADO para incluir iconFilename e usar nomes corretos
const areaVisuals: { [key: string]: { color: string; iconFilename: string; description: string } } = {
  default: { color: "#607d8b", iconFilename: "generico-icone.png", description: "Dashboards gerais" },
  b2b: { color: "#607d8b", iconFilename: "b2b-icone.png", description: "Vendas e Desempenho B2B" },
  "comercial interno": { color: "#f48fb1", iconFilename: "generico-icone.png", description: "Vendas, negociações e acompanhamento de desempenho da equipe comercial;" }, // Assumindo genérico por falta de ícone específico no zip
  compras: { color: "#795548", iconFilename: "compras-icone.png", description: "Acompanhamento financeiro da Equipe de Compras;" },
  "cs/monitoramento": { color: "#ff80ab", iconFilename: "cs-icone.png", description: "Dashboard de acompanhamento dos canais de atendimento e suporte ao Cliente;" },
  influencer: { color: "#9c27b0", iconFilename: "influenciador-icone.png", description: "Relatórios que apresentam os dados de desempenho dos influenciadores;" },
  logística: { color: "#e91e63", iconFilename: "logistica-icone.png", description: "Gestão de estoque e indicadores Logísticos;" },
  "operações e controle": { color: "#c2185b", iconFilename: "operacoes-icone.png", description: "Processos organizacionais e operacionais" },
  "performance e vendas": { color: "#4caf50", iconFilename: "performance-icone.png", description: "Relatórios de vendas, Aquisição de mídia e influencer, pedidos e acompanhamento de metas em geral." },
  retenção: { color: "#00bcd4", iconFilename: "retencao-icone.png", description: "Relatórios com Foco em dados de Clientes;" },
  rh: { color: "#ff9800", iconFilename: "rh-icone.png", description: "Relatórios voltados para a Gestão de Pessoas;" },
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
          
          // Processar áreas para incluir dados visuais e iconFilename
          const processedAreas: FrontendArea[] = apiAreas.map(area => {
            const areaNameLower = area.name.toLowerCase();
            const visual = areaVisuals[areaNameLower] || areaVisuals.default;
            return {
              ...area,
              slug: areaNameLower.replace(/\s+/g, "-"),
              color: visual.color, // Usar a cor do mapeamento
              iconFilename: visual.iconFilename, // *** ADICIONADO iconFilename ***
              description: visual.description,
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
            <p className="ml-4 text-pink-700 dark:text-pink-300">Carregando</p> 
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white min-h-screen">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8 text-center pt-8">
          <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">Relatórios e Dashboards</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Selecione uma área para visualizar os dashboards de Power BI específicos e acompanhar os indicadores de
            desempenho.
          </p>
        </div>

        {displayedAreas.length > 0 ? (
          // Ajuste no grid para melhor responsividade e controle de tamanho
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
    </div>
  );
}

