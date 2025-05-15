"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('Service Worker registrado com sucesso:', registration))
        .catch((error) => console.error('Erro ao registrar Service Worker:', error));
    } else {
      console.log('Service Worker não é suportado neste navegador.');
    }
  }, []);

  return null; // Este componente não renderiza nada visualmente
}

