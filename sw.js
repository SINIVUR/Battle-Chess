// 배틀체스 서비스워커: 같은 출처 GET만 처리. 페이지는 네트워크 우선(항상 최신), 실패 시 캐시.
// 업데이트 확인용 요청(?_=타임스탬프)은 건드리지 않고, 캐시에는 정해진 파일만 한 칸씩 보관한다.
const C='bc-pwa-v2';
const SHELL=['./','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const KEY=r=>{const u=new URL(r.url);if(r.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/'))return new Request(new URL('./',self.registration.scope).href);return r};
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||u.searchParams.has('_'))return;
 const k=KEY(r);
 e.respondWith(fetch(r).then(res=>{if(res&&res.ok&&res.type==='basic'){const cp=res.clone();caches.open(C).then(c=>c.put(k,cp)).catch(()=>{})}return res}).catch(()=>caches.match(k).then(m=>m||caches.match(new Request(new URL('./',self.registration.scope).href)))));
});
