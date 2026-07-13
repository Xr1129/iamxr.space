const CACHE_NAME = "xr-space-v1";

// Assets to pre-cache (editor app shell)
const PRE_CACHE = ["/", "/blog", "/login", "/editor", "/manifest.json"];

// Install: pre-cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    })
  );
  self.clients.claim();
});

// Fetch: URL-based strategy routing
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API calls: network-only
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Editor & login pages: network-first (stale while revalidate for assets)
  if (
    url.pathname.startsWith("/editor") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/_next/")
  ) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Blog & public pages: network-first (always fresh content)
  event.respondWith(networkFirst(event.request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // Cache successful GET responses
    if (request.method === "GET" && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}
