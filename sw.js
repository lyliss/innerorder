
const CACHE_NAME = 'innerorder-v3-stable';

// 必须缓存的核心资源清单（包括所有源码文件）
const CORE_ASSETS = [
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './manifest.json',
  './services/storageService.ts',
  './services/dataService.ts',
  './components/Inbox.tsx',
  './components/TaskCard.tsx',
  './components/BreathingModal.tsx',
  './components/DeepWorkMode.tsx',
  './components/ArchiveModal.tsx',
  './components/DataModal.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'
];

// 安装阶段：强制抓取所有核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching core assets');
      // 使用 map 一个个添加，防止其中一个 404 导致全部失败
      return Promise.allSettled(
        CORE_ASSETS.map(url => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

// 激活阶段：清理旧版本
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求：实现真正的离线优先
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // 只处理 GET 请求
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // 1. 如果缓存中有，直接返回（离线秒开的关键）
      if (cachedResponse) {
        // 后台偷偷更新缓存，确保下次打开是最新的
        fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // 2. 如果缓存没有，去联网下载
      return fetch(request).then((networkResponse) => {
        // 检查响应是否有效
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // 动态缓存：把刚下载的 esm.sh 库或其他资源存起来
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // 3. 彻底没网且没缓存：如果是 HTML 请求，可以返回一个备用页面（可选）
        console.error('SW: Fetch failed and no cache available');
      });
    })
  );
});
