"use client";

import Link from "next/link";
import { Area as ApiArea } from "../lib/api"; // Importando tipos da API

// Interface para Área no frontend, estendendo a da API
interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
  icon: string;
  description: string;
  // dashboards?: ApiDashboard[]; // Removido - dashboards não serão listados aqui
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
          <p className="opacity-80 text-sm mb-4 flex-grow">{area.description}</p>
          
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

