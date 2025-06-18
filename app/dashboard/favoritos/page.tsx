"use client";

import { useFavorites } from "../../../hooks/useFavorites";
import Link from "next/link";
import { useUser } from "../../../hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FavoritosPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { user, loading } = useUser();
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="text-pink-600 hover:text-pink-700 mb-4 inline-block font-medium transition-colors"
        >
          ← Voltar ao Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Meus Favoritos
        </h1>
        <p className="text-gray-600">
          {favorites.length === 0 
            ? "Você ainda não tem dashboards favoritos." 
            : `Você tem ${favorites.length} dashboard${favorites.length > 1 ? 's' : ''} favorito${favorites.length > 1 ? 's' : ''}.`
          }
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum favorito ainda
          </h2>
          <p className="text-gray-500 mb-6">
            Clique no ícone de coração nos dashboards para adicioná-los aos seus favoritos.
          </p>
          <Link 
            href="/dashboard" 
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Explorar Dashboards
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div 
              key={favorite.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-pink-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex-1">
                  {favorite.name}
                </h3>
                <button
                  onClick={() => removeFavorite(favorite.id)}
                  className="text-pink-500 hover:text-pink-700 ml-2 text-xl transition-colors"
                  title="Remover dos favoritos"
                >
                  ♥
                </button>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                  {favorite.areaSlug}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                Adicionado em: {new Date(favorite.addedAt).toLocaleDateString('pt-BR')}
              </div>
              
              <Link 
                href={`/dashboard/${encodeURIComponent(favorite.areaSlug)}`}
                className="block w-full bg-pink-600 text-white text-center py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                Acessar Dashboard
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}