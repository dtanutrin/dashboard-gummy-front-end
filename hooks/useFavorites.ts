import { useState, useEffect } from 'react';

export interface FavoriteDashboard {
  id: string;
  name: string;
  areaSlug: string;
  addedAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteDashboard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar favoritos do localStorage na inicialização
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('dashboard-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setIsLoaded(true);
    }
  }, []);

  // Salvar favoritos no localStorage sempre que a lista mudar (mas só depois de carregar)
  useEffect(() => {
    if (!isLoaded) return; // Não salva até que os dados sejam carregados
    
    try {
      localStorage.setItem('dashboard-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (dashboardId: string, dashboardName: string, areaSlug: string) => {
    setFavorites(prev => {
      const existingIndex = prev.findIndex(fav => fav.id === dashboardId);
      
      if (existingIndex >= 0) {
        // Remove dos favoritos
        return prev.filter(fav => fav.id !== dashboardId);
      } else {
        // Adiciona aos favoritos
        const newFavorite: FavoriteDashboard = {
          id: dashboardId,
          name: dashboardName,
          areaSlug,
          addedAt: new Date().toISOString()
        };
        return [...prev, newFavorite];
      }
    });
  };

  const isFavorite = (dashboardId: string): boolean => {
    return favorites.some(fav => fav.id === dashboardId);
  };

  const removeFavorite = (dashboardId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== dashboardId));
  };
  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    clearFavorites,
    isLoaded
  };
};