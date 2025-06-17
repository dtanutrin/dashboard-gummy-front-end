"use client";

import Link from "next/link";
import { Dashboard as ApiDashboard } from "../lib/api";
import { useState, useRef, useEffect } from "react";
import { useFavorites } from "../hooks/useFavorites";

interface DashboardCardProps {
  dashboard: ApiDashboard;
  areaSlug: string;
  areaColor?: string; 
}

const DashboardCard = ({ dashboard, areaSlug, areaColor = "#607d8b" }: DashboardCardProps) => {
  const encodedAreaSlug = encodeURIComponent(areaSlug);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  // Convertendo dashboard.id (number) para string
  const dashboardIsFavorite = isHydrated ? isFavorite(dashboard.id.toString()) : false;
  
  // Verificar se o componente foi hidratado
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Função para fechar o modal quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current && 
        !modalRef.current.contains(event.target as Node) && 
        iconRef.current && 
        !iconRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
        setIsExpanded(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
      // Adiciona classe ao body para prevenir scroll quando o modal estiver aberto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  // Função para expandir o modal
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Função para lidar com o clique no ícone
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(!showModal);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Convertendo dashboard.id para string
    toggleFavorite(dashboard.id.toString(), dashboard.name, areaSlug);
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden flex flex-col"
        style={{ 
          borderTop: `4px solid ${areaColor}`,
          height: '220px' // Altura reduzida de 280px para 220px
        }}
      >
        <div className="p-5 flex flex-col flex-grow relative">
          {/* Ícones no topo à direita */}
          <div className="flex justify-end items-center space-x-2 mb-2">
            {/* Botão de Favorito */}
            <button
              onClick={handleFavoriteClick}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-500 hover:scale-110 relative overflow-hidden ${
                dashboardIsFavorite 
                  ? 'bg-pink-100' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-pink-50 dark:hover:bg-pink-900 text-gray-600 dark:text-gray-300'
              }`}
              title={dashboardIsFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {/* Círculo de preenchimento animado */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-700 ease-out ${
                  dashboardIsFavorite 
                    ? 'bg-pink-200 scale-100 opacity-100' 
                    : 'bg-pink-200 scale-0 opacity-0'
                }`}
                style={{
                  transformOrigin: 'center'
                }}
              />
              
              {/* Coração com z-index maior para ficar por cima */}
              <span className={`relative z-10 transition-all duration-300 ${
                dashboardIsFavorite ? 'text-lg scale-110' : 'text-sm'
              }`}>
                {dashboardIsFavorite ? '🩷' : '🤍'}
              </span>
            </button>
            
            {/* Botão de Informação */}
            {dashboard.information && (
              <div className="relative">
                <div 
                  ref={iconRef}
                  className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-pink-600 transition-colors"
                  onClick={handleIconClick}
                >
                  i
                </div>
              </div>
            )}
          </div>
          
          {/* Título centralizado verticalmente no meio do card */}
          <div className="flex-grow flex items-center justify-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center px-4" title={dashboard.name}>
              {dashboard.name}
            </h3>
          </div>
          
          {/* Botão no final */}
          <div className="mt-auto pt-3">
            <Link href={`/dashboard/${encodedAreaSlug}/${dashboard.id}`} className="block w-full">
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
      
      {/* Modal centralizado na tela */}
      {showModal && dashboard.information && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div 
            ref={modalRef}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-lg mx-auto transform transition-all duration-300 ${isExpanded ? 'w-full max-w-3xl' : 'w-full max-w-md'}`}
            style={{
              borderTop: `4px solid ${areaColor}`,
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {dashboard.name} - Informações
              </h3>
              <div className="flex space-x-2">
                <button 
                  onClick={toggleExpand}
                  className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded transition-colors"
                  title={isExpanded ? "Reduzir" : "Expandir"}
                >
                  {isExpanded ? "↓" : "↑"}
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-sm bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800 p-2 rounded transition-colors"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="mt-2 text-base text-gray-700 dark:text-gray-300">
              {dashboard.information}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardCard;
