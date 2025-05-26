"use client";

import Link from "next/link";
import Image from "next/image";
import { Area as ApiArea } from "../lib/api"; // Assuming this path is correct

interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
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
                                .replace(/\s+/g, ' ') // Keep spaces for matching keywords
                                .replace(/[^a-z0-9\s]/g, ''); // Remove special chars except space

  // Map keywords to icon files - Adjust keywords as needed
  if (normalizedName.includes('b2b')) return 'logo.b2b.png';
  if (normalizedName.includes('compras')) return 'compras-icone.png';
  if (normalizedName.includes('cs') || normalizedName.includes('monitoramento')) return 'cs-icone.png';
  if (normalizedName.includes('influenciador') || normalizedName.includes('influencer')) return 'influenciador-icone.png';
  if (normalizedName.includes('logistica')) return 'logistica-icone.png';
  if (normalizedName.includes('operacoes') || normalizedName.includes('controle')) return 'operacoes-icone.png';
  // Match 'performance e vendas' or just 'performance'
  if (normalizedName.includes('performance')) return 'performance-icone.png'; 
  if (normalizedName.includes('retencao')) return 'retencao-icone.png';
  if (normalizedName.includes('rh')) return 'rh-icone.png';
  if (normalizedName.includes('financeiro')) return 'financeiro-icone.png';
  if (normalizedName.includes('comercialinterno')) return 'comercial-interno-icone.png';
  if (normalizedName.includes('comercial')) return 'comercial-interno-icone.png';
  if (normalizedName.includes('juridico')) return 'juridico-icone.png';


  return 'generico-icone.png'; // Fallback to generic icon
};

const AreaCard = ({ area }: AreaCardProps) => {
  const areaLinkSlug = area.slug || area.name.toLowerCase().replace(/\s+/g, "-");
  const iconFilename = getIconFilename(area.name);
  const iconPath = `/images/${iconFilename}`;
  const fallbackIconPath = '/images/generico-icone.png';

  return (
    // Container principal do card
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100 flex flex-col h-full">
      {/* Div interna do card: SEMPRE flex-row, items-stretch para altura igual */}
      <div
        className={`flex-grow overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg flex flex-row items-stretch min-h-[160px] md:min-h-[180px]`} // Ajuste min-height se necessário
        style={{
          backgroundColor: area.color, // Mantém a cor rosa dinâmica
          borderRadius: "12px",
          border: "none",
        }}
      >
        {/* Container do Ícone: Largura fixa (aprox 1/3), centralizado */}
        <div className="p-4 sm:p-5 flex items-center justify-center w-[30%] flex-shrink-0"> {/* Ajuste a largura (w-[30%]) e padding (p-4 sm:p-5) conforme necessário */}
          <Image
            src={iconPath}
            alt={`Ícone ${area.name}`}
            width={80} // Ajuste o tamanho do ícone
            height={80} // Ajuste o tamanho do ícone
            className="object-contain max-w-full max-h-full" // Garante que o ícone não ultrapasse o container
            onError={(e) => { e.currentTarget.src = fallbackIconPath; }}
          />
        </div>

        {/* Container do Conteúdo: Ocupa o restante, layout vertical, justificado entre topo e base */}
        <div className="p-4 sm:p-5 flex flex-col text-white flex-grow w-[70%] justify-between text-left"> {/* Ajuste a largura (w-[70%]) e padding */}
          {/* Agrupador para Título e Descrição (ocupa espaço necessário) */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1">{area.name}</h2> {/* Ajuste tamanho da fonte */}
            <p className="opacity-80 text-xs sm:text-sm mb-2 sm:mb-3">{area.description}</p> {/* Ajuste tamanho da fonte e margem */}
          </div>

          {/* Container do Botão (alinhado à base devido ao justify-between pai) */}
          <div className="w-full pt-2"> {/* Padding superior para separar do texto */}
            <Link href={`/dashboard/${encodeURIComponent(area.name)}`}>
              <button
                className="w-full px-4 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-xs sm:text-sm font-medium transition-all duration-200" // Padding e tamanho de fonte consistentes
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

