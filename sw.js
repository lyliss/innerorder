
const CACHE_NAME = 'innerorder-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'
];

// 安装阶段：预缓存核心骨架
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 拦截请求：核心离线逻辑
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求或数据 URI
  if (event.request.method !== 'GET' || event.request.url.startsWith('data:')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 如果缓存中有，直接返回
      if (cachedResponse) {
        // 异步更新：在后台偷偷去网上拿一份新的存起来
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {}); // 没网就算了
        
        return cachedResponse;
      }

      // 如果缓存中没有，去网上拿，拿完存进缓存
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !event.request.url.includes('esm.sh')) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
