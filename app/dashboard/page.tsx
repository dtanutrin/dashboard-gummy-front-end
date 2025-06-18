"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/auth/hooks";
import Header from "../../components/Header";
import AreaCard from "../../components/AreaCard";
import FavoritesCard from "../../components/FavoritesCard";
import Image from "next/image";
import { getAllAreas, Area as ApiArea, Dashboard as ApiDashboard } from "../../lib/api";


// Interface para Área no frontend, pode incluir dados de exibição como cor/ícone
interface FrontendArea extends ApiArea {
  slug: string; // Mantido para compatibilidade com lógica existente, se necessário
  color: string; // Será definido no frontend
  icon: string; // Será definido no frontend
  description: string; // Será definido no frontend
  dashboards?: ApiDashboard[]; // Para armazenar dashboards da API
}

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
  marketing: { color: "#ff4081", icon: "📊", description: "Campanhas e análise de mercado" }, 
  operações: { color: "#c2185b", icon: "⚙️", description: "Processos e produtividade" }, 
  cs: { color: "#ff80ab", icon: "🎯", description: "Atendimento ao cliente" }, 
  "comercial individual": { color: "#f48fb1", icon: "💼", description: "Vendas e negociações"},
  "jurídico":{ color: "#f48fb1", icon: "⚖️", description: "Contratos, conformidade e processos."},
  "financeiro":{ color: "#f48fb1", icon: "💰", description: "Fluxo de caixa, orçamentos e contas."},
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
          // 1. Buscar todas as áreas da API
          const apiAreas = await getAllAreas();
          
          // 2. Para cada área, buscar seus dashboards (ou modificar backend para incluir dashboards na rota de áreas)
          // Por simplicidade agora, vamos assumir que o backend em /api/areas já retorna dashboards associados
          // ou que temos uma rota /api/areas/:id/dashboards.
          // Se não, precisaremos de outra chamada ou ajuste no backend.
          // Vamos simular que `apiAreas` já pode conter `dashboards` ou que faremos chamadas adicionais.

          const processedAreas: FrontendArea[] = apiAreas.map(area => {
            const visual = areaVisuals[area.name.toLowerCase()] || areaVisuals.default;
            return {
              ...area,
              slug: area.name.toLowerCase().replace(/\s+/g, "-"), // Gerar slug a partir do nome
              color: "#ff4081", // Cor padronizada para Marketing
              icon: visual.icon,
              description: visual.description, // Adicionar descrição mockada ou buscar da API se disponível
              // dashboards: area.dashboards || [] // Se o backend já incluir dashboards
            };
          });

          // Lógica de filtragem de áreas baseada no perfil do usuário
          let filteredAreas: FrontendArea[];
          if (user.role === "Admin") { // CORRIGIDO: "Admin" com maiúscula
            filteredAreas = processedAreas;
          } else {
            // Filtrar baseado nas áreas que o usuário tem acesso
            // Conforme o backend, user.areas é um array de objetos Area
            const userAllowedAreaIds = user.areas?.map((area: any) => area.id) || [];
            if (userAllowedAreaIds.length > 0) {
              filteredAreas = processedAreas.filter(area => userAllowedAreaIds.includes(area.id));
            } else {
              filteredAreas = [];
            }
          }

          setDisplayedAreas(filteredAreas);

          if (filteredAreas.length === 0 && !loading) {
            setDebugUserInfo(`Debug Info: User Role: ${user.role}, User Areas: ${JSON.stringify(user.areas)}`);
          } else {
            setDebugUserInfo("");
          }

        } catch (error) {
          console.error("Erro ao buscar áreas ou dashboards:", error);
          // Tratar erro, talvez mostrar uma mensagem para o usuário
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
          <p className="ml-4 text-pink-700 dark:text-pink-300">Carregando</p> 
          {/* Adicionei dark:text-pink-300 para melhor visualização no modo escuro, ajuste conforme seu tema */}
        </div>

      </div>
    </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card de Favoritos sempre primeiro */}
            <FavoritesCard />
            
            {/* Cards das Áreas */}
            {displayedAreas.map((area, index) => (
              <AreaCard key={area.id} area={area} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 dark:text-gray-400">Nenhuma área disponível para você no momento.</p>
            {user && user.role !== "Admin" && ( // CORRIGIDO: "Admin" com maiúscula
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

