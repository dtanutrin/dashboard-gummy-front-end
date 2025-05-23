"use client";

import Link from "next/link";
import Image from "next/image";
import { Area as ApiArea } from "../lib/api"; // Assuming this path is correct

interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
  // iconFilename: string; // This might not be needed from API if we derive it from name
  description: string;
}

interface AreaCardProps {
  area: FrontendArea;
  index?: number;
}

// Helper function to get icon filename based on area name
const getIconFilename = (areaName: string): string => {
  const normalizedName = areaName.toLowerCase()
                                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                                .replace(/\s+/g, '-') // Replace spaces with hyphen
                                .replace(/[^a-z0-9-]/g, ''); // Remove other special chars

  // Map normalized names/keywords to icon files
  if (normalizedName.includes('b2b')) return 'b2b-icone.png';
  if (normalizedName.includes('compras')) return 'compras-icone.png';
  if (normalizedName.includes('cs') || normalizedName.includes('monitoramento')) return 'cs-icone.png';
  if (normalizedName.includes('influenciador') || normalizedName.includes('influencer')) return 'influenciador-icone.png';
  if (normalizedName.includes('logistica')) return 'logistica-icone.png';
  if (normalizedName.includes('operacoes') || normalizedName.includes('controle')) return 'operacoes-icone.png';
  if (normalizedName.includes('performance') || normalizedName.includes('vendas')) return 'performance-icone.png';
  if (normalizedName.includes('retencao')) return 'retencao-icone.png';
  if (normalizedName.includes('rh')) return 'rh-icone.png';
  // Add more specific mappings if needed (e.g., for 'comercial-individual', 'comercial-interno')

  return 'generico-icone.png'; // Fallback to generic icon
};

const AreaCard = ({ area }: AreaCardProps) => {
  // Use slug if available, otherwise generate from name
  const areaLinkSlug = area.slug || area.name.toLowerCase().replace(/\s+/g, "-");
  const iconFilename = getIconFilename(area.name);
  const iconPath = `/images/${iconFilename}`;
  const fallbackIconPath = '/images/generico-icone.png';

  return (
    // Container principal do card
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100 flex flex-col h-full">
      {/* Div interna do card: flex-col (mobile), md:flex-row (desktop) */}
      <div
        className={`flex-grow overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg flex flex-col md:flex-row items-stretch`}
        style={{
          backgroundColor: area.color, // Keep the dynamic pink color
          borderRadius: "12px",
          border: "none",
        }}
      >
        {/* Container do Ícone: Centered mobile, fixed width desktop */}
        {/* Added py-4 for vertical padding on mobile */}
        <div className="py-4 md:py-0 md:p-6 flex items-center justify-center md:w-1/3 flex-shrink-0">
          <Image
            src={iconPath}
            alt={`Ícone ${area.name}`}
            width={100} // Increased size
            height={100} // Increased size
            className="object-contain"
            onError={(e) => { e.currentTarget.src = fallbackIconPath; }}
          />
        </div>

        {/* Container do Conteúdo: Full width mobile, 2/3 desktop */}
        {/* Added text-center for mobile, md:text-left for desktop */}
        {/* Removed md:justify-between, added md:py-6 to match icon padding */} 
        <div className="p-4 md:py-6 md:pr-6 flex flex-col text-white flex-grow md:w-2/3 text-center md:text-left">
          {/* Agrupador para Título e Descrição */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{area.name}</h2>
            <p className="opacity-80 text-xs md:text-sm mb-4">{area.description}</p>
          </div>

          {/* Container do Botão: Pushed down mobile, aligned naturally desktop */}
          {/* Added mt-auto to push button down ONLY on mobile (flex-col) */}
          {/* Added self-center md:self-auto for button alignment */} 
          <div className="mt-auto w-full pt-2 md:pt-4 self-center md:self-auto"> {/* Increased md:pt */}
            <Link href={`/dashboard/${encodeURIComponent(area.name)}`}>
              {/* Reduced button width on mobile for centering */}
              <button
                className="px-6 py-1.5 md:w-full md:px-4 md:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-xs md:text-sm font-medium transition-all duration-200"
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

