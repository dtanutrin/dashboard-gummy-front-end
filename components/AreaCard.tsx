"use client"

import Link from "next/link"

// Definindo a interface para as props do AreaCard
interface AreaCardProps {
  area: {
    id: number | string; // ID pode ser número ou string dependendo da fonte de dados
    name: string;
    color: string;
    icon: string;
    description: string;
    // Adicionar mais campos se necessário, ex: slug para URL
    slug?: string; // Para URLs amigáveis, ex: 'logistica'
  };
  // index não é usado no componente original, mas pode ser útil para animações ou chaves
  index?: number; 
}

// Componente de cartão de área com animação e tipagem
const AreaCard = ({ area }: AreaCardProps) => {
  // Usar area.slug se disponível para o link, caso contrário, area.name.toLowerCase()
  const areaLink = area.slug || area.name.toLowerCase();

  return (
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100">
      <Link href={`/dashboard/${areaLink}`} className="block">
        <div
          className={`h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg`}
          style={{
            backgroundColor: area.color,
            borderRadius: "12px",
            border: "none",
          }}
        >
          <div className="p-6 flex flex-col items-center text-center text-white">
            <div className="text-5xl mb-4 mt-4">{area.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{area.name}</h2>
            <p className="opacity-80 text-sm">{area.description}</p>
            <div className="mt-4 w-1/3 h-1 bg-white bg-opacity-30 rounded-full"></div>
            <button
              className="mt-6 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm font-medium transition-all duration-200"
              style={{ backdropFilter: "blur(4px)" }}
            >
              Acessar Dashboard
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default AreaCard;
