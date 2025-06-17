"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../auth/hooks";
import Header from "../../../components/Header";
import DashboardCard from "../../../components/DashboardCard";
import { useFavorites } from "../../../hooks/useFavorites";
import { getAllAreas, Area as ApiArea, Dashboard as ApiDashboard } from "../../../lib/api";

// Cores por área (mesmo padrão usado nas outras páginas)
const areaVisuals: { [key: string]: { color: string; description: string } } = {
  default: { color: "#607d8b", description: "Dashboards gerais" },
  b2b: { color: "#607d8b", description: "Vendas e Desempenho B2B" },
  compras: { color: "#795548", description: "Acompanhamento financeiro da Equipe de Compras" },
  "cs/monitoramento": { color: "#ff80ab", description: "Dashboard de acompanhamento dos canais de atendimento e suporte ao Cliente" },
  influencer: { color: "#9c27b0", description: "Relatórios que apresentam os dados de desempenho dos influenciadores" },
  logística: { color: "#e91e63", description: "Gestão de estoque e indicadores Logísticos" },
  "operações e controle": { color: "#c2185b", description: "Processos organizacionais e operacionais" },
  "performance e vendas": { color: "#4caf50", description: "Relatórios de vendas, Aquisição de mídia e influencer, pedidos e acompanhamento de metas em geral" },
  retenção: { color: "#00bcd4", description: "Relatórios com Foco em dados de Clientes" },
  rh: { color: "#ff9800", description: "Relatórios voltados para a Gestão de Pessoas" },
  marketing: { color: "#ff4081", description: "Campanhas e análise de mercado" },
  operações: { color: "#c2185b", description: "Processos e produtividade" },
  cs: { color: "#ff80ab", description: "Atendimento ao cliente" },
  comercialIndividual: { color: "#f48fb1", description: "Vendas e negociações" },
  comercialinterno: { color: "#f48fb1", description: "Vendas, negociações e acompanhamento de desempenho da equipe comercial" },
  financeiro: { color: "#f48fb1", description: "Fluxo de caixa, orçamentos e contas" },
  juridico: { color: "#c2185b", description: "Contratos, conformidade e processos" },
};

export default function FavoritesPage() {
  const { user, loading: userLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { favorites, isLoaded } = useFavorites();

  const [areas, setAreas] = useState<ApiArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteDashboards, setFavoriteDashboards] = useState<Array<{dashboard: ApiDashboard, areaSlug: string, areaColor: string}>>([]);

  // Verificação de autenticação
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, userLoading, router]);

  // Carregar dados das áreas
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        console.log('Carregando áreas...');
        const areasData = await getAllAreas();
        console.log('Áreas carregadas:', areasData);
        setAreas(areasData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar os dados. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Processar favoritos quando áreas e favoritos estiverem carregados
  useEffect(() => {
    if (!isLoaded || favorites.length === 0 || areas.length === 0) {
      setFavoriteDashboards([]);
      return;
    }

    const processedFavorites: Array<{dashboard: ApiDashboard, areaSlug: string, areaColor: string}> = [];

    favorites.forEach(favorite => {
      // Buscar a área - tentar múltiplas estratégias de correspondência
      let area = areas.find(a => {
        const areaSlug = a.name.toLowerCase().replace(/\s+/g, "-");
        return areaSlug === favorite.areaSlug;
      });
      
      // Se não encontrou, tentar busca por nome direto
      if (!area) {
        area = areas.find(a => a.name.toLowerCase() === favorite.areaSlug.toLowerCase());
      }
      
      // Se ainda não encontrou, tentar busca parcial
      if (!area) {
        area = areas.find(a => {
          const areaSlug = a.name.toLowerCase().replace(/\s+/g, "-");
          return areaSlug.includes(favorite.areaSlug.toLowerCase()) || 
                 favorite.areaSlug.toLowerCase().includes(areaSlug);
        });
      }
      
      if (!area) {
        return;
      }

      // Buscar o dashboard na área
      const dashboard = area.dashboards?.find(d => d.id.toString() === favorite.id);
      if (!dashboard) {
        return;
      }

      // Gerar slug da área - usar sempre a cor rosa padrão
      const areaSlug = area.name.toLowerCase().replace(/\s+/g, "-");
      
      processedFavorites.push({
        dashboard,
        areaSlug,
        areaColor: "#ff4081" // Cor rosa padrão para todos os favoritos
      });
    });

    setFavoriteDashboards(processedFavorites);
  }, [favorites, areas, isLoaded]);

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Carregando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho da página */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 mb-4 transition-colors"
          >
            ← Voltar para todas as áreas
          </Link>
          
          <div className="flex items-center mb-4">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center mr-4 text-white text-2xl font-bold"
              style={{ backgroundColor: "#FCE7F3" }}
            >
              <span style={{ filter: 'grayscale(0) brightness(1.2)' }}>⭐</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#ff4081' }}>
                Favoritos
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Seus dashboards favoritos salvos para acesso rápido
              </p>
            </div>
          </div>
        </div>

        {/* Lista de dashboards favoritos */}
        {!isLoaded ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Carregando favoritos...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Clique no coração nos dashboards para adicioná-los aos seus favoritos!
            </p>
            <Link 
              href="/dashboard"
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Explorar Dashboards
            </Link>
          </div>
        ) : favoriteDashboards.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Favoritos não encontrados
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Alguns dashboards favoritos podem ter sido removidos ou não estão mais disponíveis.
            </p>
            <Link 
              href="/dashboard"
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteDashboards.map((item, index) => (
              <DashboardCard
                key={`${item.areaSlug}-${item.dashboard.id}-${index}`}
                dashboard={item.dashboard}
                areaSlug={item.areaSlug}
                areaColor={item.areaColor}
              />
            ))}
          </div>
        )}

        {/* Estatísticas */}
        {favoriteDashboards.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {favoriteDashboards.length} dashboard{favoriteDashboards.length > 1 ? 's' : ''} favorito{favoriteDashboards.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}