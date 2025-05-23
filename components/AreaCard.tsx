"use client";

import Link from "next/link";
import Image from "next/image"; // Importar o componente Image do Next.js
import { Area as ApiArea } from "../lib/api"; // Importando tipos da API

// Interface para Área no frontend, estendendo a da API
interface FrontendArea extends ApiArea {
  slug: string;
  color: string;
  // icon: string; // O ícone agora é padrão, remover ou comentar
  description: string;
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
        className={`flex-grow overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg flex flex-row items-stretch`}
        style={{
          backgroundColor: area.color,
          borderRadius: "12px",
          border: "none",
        }}
      >
        {/* Container do Ícone (Esquerda) */}
        <div className="p-4 md:p-6 flex items-center justify-center w-1/3 flex-shrink-0">
          <Image 
            src="/images/logo.b2b.png" // Caminho para o ícone padrão
            alt={`Ícone ${area.name}`} // Alt text dinâmico ou padrão
            width={80} // Largura do ícone (ajustar conforme necessário)
            height={80} // Altura do ícone (ajustar conforme necessário)
            className="object-contain" // Garante que a imagem se ajuste sem distorcer
          />
        </div>

        {/* Container do Conteúdo (Direita) */}
        <div className="p-4 md:p-6 flex flex-col text-white flex-grow w-2/3">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{area.name}</h2>
          <p className="opacity-80 text-xs md:text-sm mb-4 flex-grow">{area.description}</p>
          
          <div className="mt-auto w-full pt-2 md:pt-4">
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

