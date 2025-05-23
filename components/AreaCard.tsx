"use client";

import Link from "next/link";
import Image from "next/image";
import { Area as ApiArea } from "../lib/api";

interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
  iconFilename: string;
  description: string;
}

interface AreaCardProps {
  area: FrontendArea;
  index?: number;
}

const AreaCard = ({ area }: AreaCardProps) => {
  const areaLinkSlug = area.slug || area.name.toLowerCase().replace(/\s+/g, "-");
  const iconPath = area.iconFilename ? `/images/${area.iconFilename}` : '/images/logo.b2b.png';

  return (
    // Container principal do card, mantendo h-full para grid layout
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100 flex flex-col h-full">
      {/* Div interna do card, aplicando layout flex e altura mínima */}
      <div
        // Layout base: flex-row (horizontal), items-stretch (igualar altura interna), min-h (altura uniforme)
        className={`flex-grow overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg flex flex-row items-stretch min-h-[200px]`}
        style={{
          backgroundColor: area.color,
          borderRadius: "12px",
          border: "none",
        }}
      >
        {/* Container do Ícone (Esquerda) - Mantém largura fixa e centraliza o ícone */}
        <div className="p-4 md:p-6 flex items-center justify-center w-1/3 flex-shrink-0">
          <Image 
            src={iconPath}
            alt={`Ícone ${area.name}`}
            width={80} 
            height={80} 
            className="object-contain" 
            onError={(e) => { e.currentTarget.src = '/images/logo.b2b.png'; }}
          />
        </div>

        {/* Container do Conteúdo (Direita) - Ajustes específicos para desktop (md:) */}
        {/* Layout base: flex-col. Desktop (md:): justify-between para alinhar título/descrição no topo e botão no fundo */}
        <div className="p-4 md:p-6 flex flex-col text-white flex-grow w-2/3 md:justify-between">
          {/* Agrupador para Título e Descrição */}
          <div> 
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{area.name}</h2>
            <p className="opacity-80 text-xs md:text-sm mb-4">{area.description}</p>
          </div>
          
          {/* Container do Botão - mt-auto no mobile para empurrar para baixo, removido no desktop pois justify-between cuida disso */}
          <div className="mt-auto md:mt-0 w-full pt-2 md:pt-0">
            <Link href={`/dashboard/${encodeURIComponent(area.name)}`}>
                <button
                className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-xs md:text-sm font-medium transition-all duration-200"
                style={{ backdropFilter: "blur(4px)" }}
                >
                Acessar Área
                </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaCard;

