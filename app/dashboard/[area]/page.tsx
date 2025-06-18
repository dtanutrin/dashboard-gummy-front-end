"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../app/auth/hooks";
import Header from "../../../components/Header";
import DashboardCard from "../../../components/DashboardCard";
import { 
  getAllAreas,
  Area, 
  Dashboard, 
  getUserDashboardAccess, 
  UserDashboardAccess
} from "../../../lib/api";
import { decodeUrlParam, getIconFilename } from "../../../lib/utils";
import Image from "next/image";

// Cores por área
const areaVisuals: { [key: string]: { color: string; description: string } } = {
  default: { color: "#607d8b", description: "Dashboards gerais" },
  b2b: { color: "#607d8b", description: "Vendas e Desempenho B2B" },
  compras: { color: "#795548", description: "Acompanhamento financeiro da Equipe de Compras;" },
  "cs/monitoramento": { color: "#ff80ab", description: "Dashboard de acompanhamento dos canais de atendimento e suporte ao Cliente;" },
  influencer: { color: "#9c27b0", description: "Relatórios que apresentam os dados de desempenho dos influenciadores;" },
  logística: { color: "#e91e63", description: "Gestão de estoque e indicadores Logísticos;" },
  "operações e controle": { color: "#c2185b", description: "Processos organizacionais e operacionais" },
  "performance e vendas": { color: "#4caf50", description: "Relatórios de vendas, Aquisição de mídia e influencer, pedidos e acompanhamento de metas em geral." },
  retenção: { color: "#00bcd4", description: "Relatórios com Foco em dados de Clientes;" },
  rh: { color: "#ff9800", description: "Relatórios voltados para a Gestão de Pessoas;" },
  marketing: { color: "#ff4081", description: "Campanhas e análise de mercado" }, 
  operações: { color: "#c2185b", description: "Processos e produtividade" }, 
  cs: { color: "#ff80ab", description: "Atendimento ao cliente" }, 
  "comercialIndividual": { color: "#f48fb1", description: "Vendas e negociações"},
  "comercialinterno": { color: "#f48fb1", description: "Vendas, negociações e acompanhamento de desempenho da equipe comercial" },
  "financeiro": {color: "#f48fb1", description: "Fluxo de caixa, orçamentos e contas." },
  "juridico": {color: "#c2185b", description: "Contratos, conformidade e processos."},
};

export default function AreaDashboardsPage({ params: paramsPromise }: { params: Promise<{ area: string }> }) {
  const params = use(paramsPromise);
  const decodedAreaSlug = decodeUrlParam(params?.area || "");  

  const router = useRouter();
  const { user, loading: userLoading, isAuthenticated } = useAuth(); // CORRIGIDO: Desestruturação correta

  const [areaData, setAreaData] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Visuals são usados apenas para descrição agora
  const visual = areaVisuals[decodedAreaSlug.toLowerCase()] || areaVisuals.default;

  // Definindo o nome do arquivo do ícone e fallback
  const iconFilename = areaData ? getIconFilename(areaData.name) : getIconFilename("default");
  const iconPath = `/images/${iconFilename}`;
  const fallbackIconPath = '/images/generico-icone.png';

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
          const allAreas = await getAllAreas();
          const currentArea = allAreas.find(a => a.name.toLowerCase() === decodedAreaSlug.toLowerCase());

          if (!currentArea) {
            setError("Área não encontrada ou você não tem acesso.");
            setAreaData(null);
          } else {
            // Verificar acesso à área
            const userHasAccessToThisArea = user.role === "Admin" || user.areas?.some((ua: any) => ua.id === currentArea.id);
            if (!userHasAccessToThisArea) {
              setError("Acesso negado a esta área.");
              setAreaData(null);
            } else {
              // Se for Admin, mostra todos os dashboards
              if (user.role === "Admin") {
                setAreaData(currentArea);
              } else {
                // Para usuários comuns, o backend já filtrou os dashboards
                // Não precisamos fazer verificação adicional de permissões
                setAreaData(currentArea);
              }
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
            <p className="ml-4 text-pink-700 dark:text-pink-300">Carregando área...</p>
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
          <div className="flex items-center mt-2 mb-3">
            <div className="bg-pink-500 rounded p-1 mr-3 inline-flex items-center justify-center w-8 h-8">
              <Image
                src={iconPath}
                alt={`Ícone ${areaData.name}`}
                width={24}
                height={24}
                className="object-contain filter brightness-0 invert"
                onError={(e) => { e.currentTarget.src = fallbackIconPath; }}
              />
            </div>
            <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {areaData.name}
            </h1>
          </div>
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
                areaColor={"#ff4081"} 
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