// Service Worker para Gummy Dashboards
const CACHE_NAME = 'gummy-dashboards-v1';

// Lista de arquivos estáticos para armazenar em cache
const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/images/gummy-logo.png',
  // Adicione outros arquivos estáticos importantes aqui
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Força o SW a se tornar ativo
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  // Limpa caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma controle de todos os clientes
  );
});

// Estratégia de cache: Network First com fallback para cache
// Ideal para dashboards que precisam de dados atualizados
self.addEventListener('fetch', (event) => {
  // Não intercepta requisições para APIs ou autenticação
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/auth/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, armazena uma cópia no cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se a rede falhar, tenta buscar do cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Para navegação, retorna a página inicial em caso de falha
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // Se não encontrar no cache, retorna um erro
            return new Response('Não foi possível carregar o recurso. Verifique sua conexão.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Evento para atualizar o cache quando houver nova versão do SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
