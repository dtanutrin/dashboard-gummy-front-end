import { useState } from "react";
import Link from "next/link";
import { useFavorites } from "../hooks/useFavorites";

const FavoritesCard = () => {
  const { favorites } = useFavorites();

  return (
    <div className="opacity-100 transform translate-y-0 transition-all duration-300 delay-100 flex flex-col h-full">
      <div
        className="flex-grow overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg flex flex-row items-stretch min-h-[160px] md:min-h-[180px]"
        style={{
          backgroundColor: "#ff4081",
          borderRadius: "12px",
          border: "none",
        }}
      >
        {/* Container do Ícone */}
        <div className="p-4 sm:p-5 flex items-center justify-center w-[30%] flex-shrink-0">
          <div className="text-6xl text-white opacity-80">⭐</div>
        </div>

        {/* Container do Conteúdo */}
        <div className="p-4 sm:p-5 flex flex-col text-white flex-grow w-[70%] justify-between text-left">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1">
              Favoritos ({favorites.length})
            </h2>
            <p className="opacity-80 text-xs sm:text-sm mb-2 sm:mb-3">
              {favorites.length === 0 
                ? "Você ainda não tem dashboards favoritos. Clique no coração nos dashboards para adicioná-los aqui!"
                : "Seus dashboards favoritos salvos para acesso rápido."
              }
            </p>
          </div>

          <div className="w-full pt-2">
            <Link href="/dashboard/favoritos" className="block w-full">
              <button
                className="w-full px-4 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-xs sm:text-sm font-medium transition-all duration-200"
                style={{ backdropFilter: "blur(4px)" }}
              >
                {favorites.length === 0 ? "Ver Favoritos" : `Ver todos (${favorites.length})`}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesCard;