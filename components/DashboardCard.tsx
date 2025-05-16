"use client";

import Link from "next/link";
import { Dashboard as ApiDashboard } from "../lib/api";
import { useState, useRef, useEffect } from "react";

interface DashboardCardProps {
  dashboard: ApiDashboard;
  areaSlug: string; // Espera-se que este seja o nome da área, ex: "CS/Monitoramento"
  areaColor?: string; 
}

const DashboardCard = ({ dashboard, areaSlug, areaColor = "#607d8b" }: DashboardCardProps) => {
  // Codifica o areaSlug para ser usado na URL, tratando caracteres especiais como '/'
  const encodedAreaSlug = encodeURIComponent(areaSlug);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Função para fechar o tooltip quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) && 
        iconRef.current && 
        !iconRef.current.contains(event.target as Node) && 
        !isFixed
      ) {
        setShowTooltip(false);
        setIsExpanded(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip, isFixed]);

  // Função para alternar o estado fixo do tooltip
  const toggleFixed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFixed(!isFixed);
  };

  // Função para expandir o tooltip
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Função para lidar com o hover no ícone
  const handleIconHover = () => {
    if (!isFixed) {
      setShowTooltip(true);
    }
  };

  // Função para lidar com o clique no ícone
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden flex flex-col h-full relative"
      style={{ borderTop: `4px solid ${areaColor}` }}
    >
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white truncate" title={dashboard.name}>
            {dashboard.name}
          </h3>
          {dashboard.information && (
            <div className="relative ml-2">
              <div 
                ref={iconRef}
                className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                onMouseEnter={handleIconHover}
                onClick={handleIconClick}
              >
                i
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto pt-3">
          {/* Usa o encodedAreaSlug na URL */}
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
      
      {/* Tooltip renderizado fora do card, no final do DOM */}
      {showTooltip && dashboard.information && (
        <div 
          ref={tooltipRef}
          className={`fixed z-50 ${isExpanded ? 'w-96 max-h-96' : 'w-72 max-h-60'} overflow-y-auto bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600`}
          style={{
            top: iconRef.current ? iconRef.current.getBoundingClientRect().top - 10 : 0,
            left: containerRef.current ? containerRef.current.getBoundingClientRect().right + 15 : 0,
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => !isFixed && setShowTooltip(false)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-base">Informações</span>
            <div className="flex space-x-2">
              <button 
                onClick={toggleExpand}
                className="text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 p-1.5 rounded"
                title={isExpanded ? "Reduzir" : "Expandir"}
              >
                {isExpanded ? "↓" : "↑"}
              </button>
              <button 
                onClick={toggleFixed}
                className={`text-xs ${isFixed ? 'bg-pink-200 dark:bg-pink-800' : 'bg-gray-200 dark:bg-gray-600'} hover:bg-gray-300 dark:hover:bg-gray-500 p-1.5 rounded`}
                title={isFixed ? "Desafixar" : "Fixar"}
              >
                {isFixed ? "📌" : "📍"}
              </button>
            </div>
          </div>
          <div className="mt-2 text-base">
            {dashboard.information}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
