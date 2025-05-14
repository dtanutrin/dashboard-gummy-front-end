"use client";

import Link from "next/link";
import { Area as ApiArea, Dashboard as ApiDashboard } from "../lib/api"; // Importando tipos da API

// Interface para Área no frontend, estendendo a da API
interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
  icon: string;
  description: string;
  dashboards?: ApiDashboard[]; // Dashboards agora são parte da interface
}

interface AreaCardProps {
  area: FrontendArea;
  index?: number;
}

const AreaCard = ({ area }: AreaCardProps) => {
  const areaLinkSlug = area.slug || area.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100 flex flex-col h-full">
      <div
        className={`flex-grow overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg flex flex-col`}
        style={{
          backgroundColor: area.color,
          borderRadius: "12px",
          border: "none",
        }}
      >
        <div className="p-6 flex flex-col items-center text-center text-white flex-grow">
          <div className="text-5xl mb-4 mt-4">{area.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{area.name}</h2>
          <p className="opacity-80 text-sm mb-4">{area.description}</p>
          
          {/* Lista de Dashboards dentro do Card */}
          {area.dashboards && area.dashboards.length > 0 ? (
            <div className="w-full mt-2 mb-4 text-left">
              <h3 className="text-md font-semibold mb-2 opacity-90">Dashboards disponíveis:</h3>
              <ul className="space-y-1">
                {area.dashboards.map((dashboard) => (
                  <li key={dashboard.id}>
                    <Link 
                      href={`/dashboard/${areaLinkSlug}/${dashboard.id}`}
                      className="block text-sm hover:underline bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1.5 rounded-md transition-all duration-200"
                    >
                      {dashboard.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm opacity-70 mt-2 mb-4">Nenhum dashboard específico nesta área.</p>
          )}

          {/* Botão genérico para acessar a área (pode ser removido se todos os links são por dashboard) */}
          {/* Ou pode levar para uma página que lista os dashboards se houver muitos */}
          {/* Por enquanto, manteremos um link geral para a área, caso não haja dashboards ou como fallback */}
          <div className="mt-auto w-full pt-4">
            <Link href={`/dashboard/${areaLinkSlug}`} className="block w-full">
                <button
                className="w-full px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm font-medium transition-all duration-200"
                style={{ backdropFilter: "blur(4px)" }}
                >
                Ver Área Principal
                </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AreaCard;

