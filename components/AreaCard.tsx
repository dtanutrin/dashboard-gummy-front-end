"use client";

import Link from "next/link";
import Image from "next/image";
import { Area as ApiArea } from "../lib/api";

interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
  iconFilename: string; // Nome do arquivo do ícone (ex: 'b2b-icone.png')
  description: string;
}

interface AreaCardProps {
  area: FrontendArea;
  index?: number;
}

const AreaCard = ({ area }: AreaCardProps) => {
  const areaLinkSlug = area.slug || area.name.toLowerCase().replace(/\s+/g, "-");
  
  // Atualizado: Usa 'generico-icone.png' como fallback padrão
  const iconPath = area.iconFilename ? `/images/${area.iconFilename}` : '/images/generico-icone.png'; 

  return (
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100 flex flex-col h-full">
      <div
        // Layout horizontal, altura mínima uniforme
        className={`flex-grow overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg flex flex-row items-stretch min-h-[200px]`}
        style={{
          backgroundColor: area.color,
          borderRadius: "12px",
          border: "none",
        }}
      >
        {/* Container do Ícone (Esquerda) - Ajustado para melhor controle de tamanho e proporção */}
        {/* Usar flex-basis ou max-width pode ajudar a controlar a largura em diferentes telas */}
        {/* Adicionado 'relative' para potencial posicionamento interno se necessário */}
        <div className="p-4 md:p-6 flex items-center justify-center w-1/3 md:w-1/4 lg:w-1/5 flex-shrink-0 relative">
          {/* Ajuste no componente Image: 'fill' com 'object-contain' dentro de um container com aspect-ratio ou padding-top pode ajudar a manter proporção */}
          {/* Alternativa: Manter width/height fixos e garantir que o container se ajuste */}
          <Image 
            src={iconPath}
            alt={`Ícone ${area.name}`}
            width={80} // Manter ou ajustar conforme necessário para o design
            height={80} // Manter ou ajustar conforme necessário para o design
            className="object-contain max-w-full max-h-full" // Garante contenção e limita o tamanho máximo
            onError={(e) => { e.currentTarget.src = '/images/generico-icone.png'; }} // Fallback em caso de erro
          />
        </div>

        {/* Container do Conteúdo (Direita) - Ajustado para ocupar o espaço restante */}
        {/* w-2/3 md:w-3/4 lg:w-4/5 para ocupar o espaço restante */}
        <div className="p-4 md:p-6 flex flex-col text-white flex-grow w-2/3 md:w-3/4 lg:w-4/5 md:justify-between">
          <div> 
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{area.name}</h2>
            <p className="opacity-80 text-xs md:text-sm mb-4">{area.description}</p>
          </div>
          
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

