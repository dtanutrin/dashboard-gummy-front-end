"use client";

import Link from "next/link";
import { Dashboard as ApiDashboard } from "../lib/api";

interface DashboardCardProps {
  dashboard: ApiDashboard;
  areaSlug: string;
  areaColor?: string; // Cor da área para consistência visual
}

const DashboardCard = ({ dashboard, areaSlug, areaColor = "#607d8b" }: DashboardCardProps) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden flex flex-col h-full"
      style={{ borderTop: `4px solid ${areaColor}` }}
    >
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 truncate" title={dashboard.name}>
          {dashboard.name}
        </h3>
        {/* Futuramente, pode-se adicionar uma descrição curta do dashboard aqui */}
        {/* <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
          {dashboard.description || "Descrição do dashboard não disponível."}
        </p> */}
        <div className="mt-auto pt-3">
          <Link href={`/dashboard/${areaSlug}/${dashboard.id}`} className="block w-full">
            <button 
              className="w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150"
              style={{
                backgroundColor: areaColor,
                color: "white",
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Visualizar Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;

