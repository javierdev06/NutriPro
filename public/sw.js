const NOMBRE_CACHE = 'nutripro-cache-v2';

const ARCHIVOS_A_CACHEAR = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/base.css',
  '/css/components.css',
  '/css/dashboard.css',
  '/css/calendario.css',
  '/js/db.js',
  '/js/calculos.js',
  '/js/datos-semilla.js',
  '/js/utils.js',
  '/js/api.js',
  '/js/notificaciones.js',
  '/js/pages/dashboard.js',
  '/js/pages/perfil.js',
  '/js/pages/objetivos.js',
  '/js/pages/alimentos.js',
  '/js/pages/recetas.js',
  '/js/pages/calendario.js',
  '/js/pages/inventario.js',
  '/js/pages/compras.js',
  '/js/pages/peso.js',
  '/js/pages/recordatorios.js',
  '/js/vendor/chart.js',
  '/pages/perfil.html',
  '/pages/objetivos.html',
  '/pages/alimentos.html',
  '/pages/recetas.html',
  '/pages/calendario.html',
  '/pages/inventario.html',
  '/pages/compras.html',
  '/pages/peso.html',
  '/pages/recordatorios.html',
  '/assets/icons/icono-192.png',
  '/assets/icons/icono-512.png'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(NOMBRE_CACHE).then((cache) => cache.addAll(ARCHIVOS_A_CACHEAR))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== NOMBRE_CACHE)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});

// Estrategia: cache primero, red como respaldo (para actualizar la cache si hay conexion)
self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respuestaCache) => {
      if (respuestaCache) return respuestaCache;

      return fetch(evento.request)
        .then((respuestaRed) => {
          return caches.open(NOMBRE_CACHE).then((cache) => {
            cache.put(evento.request, respuestaRed.clone());
            return respuestaRed;
          });
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});