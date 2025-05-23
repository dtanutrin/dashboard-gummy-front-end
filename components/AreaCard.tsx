"use client";

import Link from "next/link";
import Image from "next/image";
import { Area as ApiArea } from "../lib/api";

// Interface atualizada para incluir iconFilename
interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
  iconFilename: string; // Garanta que este campo seja passado de page.tsx
  description: string;
}

interface AreaCardProps {
  area: FrontendArea;
  index?: number;
}

const AreaCard = ({ area }: AreaCardProps) => {
  const areaLinkSlug = area.slug || area.name.toLowerCase().replace(/\s+/g, "-");
  
  // Caminho do ícone dinâmico com fallback para o genérico
  const iconPath = area.iconFilename ? `/images/${area.iconFilename}` : '/images/generico-icone.png'; 

  return (
    // Container principal do card
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100 flex flex-col h-full">
      {/* Div interna do card - Layout base é flex-col (mobile), muda para flex-row no desktop (md:) */}
      {/* Removido min-h para deixar a altura ser definida pelo conteúdo, como no mobile, mas pode ser necessário adicionar de volta se o grid não alinhar */}
      <div
        className={`flex-grow overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg flex flex-col md:flex-row items-stretch`}
        style={{
          backgroundColor: area.color,
          borderRadius: "12px",
          border: "none",
        }}
      >
        {/* Container do Ícone - Ajustado para ter proporção mais consistente */}
        {/* No mobile (flex-col), ocupa a parte de cima. No desktop (flex-row), ocupa a esquerda */}
        {/* Usar padding e talvez um aspect-ratio no container interno da imagem pode ajudar */}
        <div className="p-4 flex items-center justify-center md:w-1/3 flex-shrink-0">
          {/* Container interno para controlar tamanho/aspecto da imagem se necessário */}
          <div className="relative w-20 h-20"> {/* Tamanho fixo para o container da imagem */} 
            <Image 
              src={iconPath}
              alt={`Ícone ${area.name}`}
              fill // Usa fill para preencher o container pai (w-20 h-20)
              className="object-contain" // Garante que a imagem caiba sem distorcer
              onError={(e) => { e.currentTarget.src = '/images/generico-icone.png'; }} 
            />
          </div>
        </div>

        {/* Container do Conteúdo - Ocupa o restante do espaço */}
        {/* No mobile (flex-col), fica abaixo do ícone. No desktop (flex-row), fica à direita */}
        {/* Usar flex-grow para ocupar espaço e flex-col para organizar texto/botão internamente */}
        <div className="p-4 flex flex-col text-white flex-grow md:w-2/3 justify-between">
          {/* Agrupador para Título e Descrição */}
          <div> 
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{area.name}</h2>
            {/* Adicionado min-h para descrição garantir espaço mínimo, ajuste se necessário */}
            <p className="opacity-80 text-xs md:text-sm mb-4 min-h-[3em]">{area.description}</p> 
          </div>
          
          {/* Container do Botão - Empurrado para baixo com justify-between no container pai */}
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

