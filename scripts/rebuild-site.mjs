import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = path.join(process.env.TEMP || 'C:/Users/User/AppData/Local/Temp', 'kolyaski-pages-seo');
const legalDir = path.join(process.env.TEMP || 'C:/Users/User/AppData/Local/Temp', 'kolyaski-pages-seo-docx-text');

const read = (p) => fs.readFileSync(p, 'utf8');
const write = (p, s) => fs.mkdirSync(path.dirname(p), { recursive: true }) || fs.writeFileSync(p, s, 'utf8');
const style = (html) => (html.match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1];
const body = (html) => (html.match(/<body[^>]*>([\s\S]*?)<\/body>/) || ['', ''])[1].replace(/<script>[\s\S]*?<\/script>\s*/g, '');

const additions = [
  { id: 51, name: 'Fox 3 Complete', brand: 'Bugaboo', type: 'transformer', condition: 'likenew', price: 68900, newPrice: 149000, color: 'Чёрный', year: 2023, desc: 'Трансформер 3-в-1 в состоянии как новое. Полный комплект с люлькой и прогулочным блоком, подходит с рождения, доступна рассрочка.' },
  { id: 52, name: 'Xplory X', brand: 'Stokke', type: 'transformer', condition: 'excellent', price: 54500, newPrice: 119000, color: 'Бежевый', year: 2022, desc: 'Премиальная коляска Stokke с высокой посадкой. Отличное состояние, комплект с люлькой, аккуратное домашнее хранение.' },
  { id: 53, name: 'Priam 4 Lux', brand: 'Cybex', type: 'transformer', condition: 'likenew', price: 42000, newPrice: 89000, color: 'Серый', year: 2023, desc: 'Cybex Priam 4 Lux в состоянии как новое. Стильная модульная коляска 2-в-1, хит каталога, доступна рассрочка.' },
  { id: 54, name: 'Vista V2', brand: 'UPPAbaby', type: 'transformer', condition: 'good', price: 38500, newPrice: 95000, color: 'Синий', year: 2022, desc: 'UPPAbaby Vista V2 2-в-1. Хорошее состояние, вместительная корзина, люлька в комплекте, подходит для города и поездок.' },
  { id: 55, name: 'Versatrax', brand: 'Joie', type: 'transformer', condition: 'excellent', price: 14900, newPrice: 32000, color: 'Чёрный', year: 2023, desc: 'Joie Versatrax 2-в-1 в отличном состоянии. Практичная коляска для ежедневных прогулок, доступна рассрочка.' },
  { id: 56, name: 'Bee 6', brand: 'Bugaboo', type: 'stroller', condition: 'likenew', price: 39000, newPrice: 79000, color: 'Серый', year: 2022, desc: 'Bugaboo Bee 6 — лёгкая городская прогулочная коляска. Состояние как новое, манёвренная и компактная.' },
  { id: 57, name: 'Aptica XT', brand: 'Inglesina', type: 'transformer', condition: 'excellent', price: 28000, newPrice: 65000, color: 'Бежевый', year: 2021, desc: 'Inglesina Aptica XT 3-в-1 в отличном состоянии. Полный комплект с люлькой для новорождённого.' },
  { id: 58, name: 'Balios S Lux', brand: 'Cybex', type: 'transformer', condition: 'likenew', price: 32000, newPrice: 68000, color: 'Чёрный', year: 2023, desc: 'Cybex Balios S Lux 2-в-1. Состояние как новое, люлька в комплекте, доступна рассрочка.' },
  { id: 59, name: 'Quest', brand: 'Maclaren', type: 'stroller', condition: 'good', price: 9500, newPrice: 22000, color: 'Красный', year: 2022, desc: 'Maclaren Quest — лёгкая прогулочная коляска для города и поездок. Хорошее состояние.' },
  { id: 60, name: 'Trailz', brand: 'Stokke', type: 'sport', condition: 'excellent', price: 35000, newPrice: 75000, color: 'Чёрный', year: 2022, desc: 'Stokke Trailz для активных прогулок и неровных дорог. Отличное состояние, доступна рассрочка.' },
  { id: 61, name: 'Cruz V2', brand: 'UPPAbaby', type: 'stroller', condition: 'likenew', price: 29000, newPrice: 62000, color: 'Серый', year: 2023, desc: 'UPPAbaby Cruz V2 — лёгкая городская прогулочная коляска. Состояние как новое, доступна рассрочка.' },
  { id: 62, name: 'Litetrax 4', brand: 'Joie', type: 'stroller', condition: 'good', price: 8900, newPrice: 19000, color: 'Синий', year: 2022, desc: 'Joie Litetrax 4 — доступная прогулочная коляска в хорошем состоянии. Компактно складывается и подходит для ежедневных прогулок.' }
];

let productsJs = read(path.join(root, 'js/products.js'));
if (!productsJs.includes('Fox 3 Complete')) {
  const addText = additions.map((x) => JSON.stringify(x).replace(/"/g, "'").replace(/'/g, "'")).join(',\n  ');
  productsJs = productsJs.replace('\n];', `,\n  ${additions.map((x) => {
    const parts = [`id: ${x.id}`, `name: "${x.name}"`, `brand: "${x.brand}"`, `type: "${x.type}"`, `condition: "${x.condition}"`, `price: ${x.price}`, `newPrice: ${x.newPrice}`, `color: "${x.color}"`, `year: ${x.year}`, `desc: "${x.desc}"`];
    return `{ ${parts.join(', ')} }`;
  }).join(',\n  ')}\n];`);
  write(path.join(root, 'js/products.js'), productsJs);
}

write(path.join(root, 'js/cart.js'), `const CART_KEY = 'bukolyasochka_cart';
window.WHATSAPP_NUMBER = window.WHATSAPP_NUMBER || '79000000000';
const Cart = {
  items: [],
  init() {
    this.ensureDrawer();
    try { this.items = JSON.parse(localStorage.getItem(CART_KEY) || '[]') || []; } catch (e) { this.items = []; }
    this.render();
    this.bindEvents();
  },
  ensureDrawer() {
    if (!document.getElementById('cartDrawer')) {
      document.body.insertAdjacentHTML('beforeend', \`<div class="cart-overlay" id="cartOverlay"></div><aside class="cart-drawer" id="cartDrawer" aria-label="Корзина"><div class="cart-drawer-head"><strong>Корзина</strong><button id="cartClose" aria-label="Закрыть">×</button></div><div class="cart-empty" id="cartEmpty">Корзина пуста<br><a href="\${pageUrl('catalog.html')}">Перейти в каталог</a></div><div class="cart-items" id="cartItems"></div><div class="cart-drawer-footer" id="cartFooter"><div class="cart-total"><span>Итого</span><strong id="cartTotal">0 ₽</strong></div><button id="checkoutBtn">Оформить через WhatsApp</button></div></aside>\`);
    }
  },
  save() { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); },
  add(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    if (!this.items.some(i => i.id === productId)) this.items.push({ id: productId, name: product.name, price: product.price, img: product.img });
    this.save(); this.render(); this.open();
  },
  remove(productId) { this.items = this.items.filter(i => i.id !== productId); this.save(); this.render(); },
  total() { return this.items.reduce((sum, i) => sum + i.price, 0); },
  render() {
    document.querySelectorAll('#cartCount,.cart-dot,.cart-badge,[data-cart-count]').forEach(el => {
      el.textContent = this.items.length;
      el.style.display = this.items.length ? 'flex' : 'none';
    });
    const itemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');
    if (!itemsEl) return;
    if (!this.items.length) {
      itemsEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
    } else {
      if (emptyEl) emptyEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'block';
      itemsEl.innerHTML = this.items.map(item => \`<div class="cart-item" data-id="\${item.id}"><img src="\${item.img}" alt="\${escAttr(item.name)}" onerror="fixProductImg(this,'\${escAttr(item.name)}')"><div><p>\${item.name}</p><strong>\${formatPrice(item.price)}</strong></div><button data-id="\${item.id}" aria-label="Удалить">×</button></div>\`).join('');
      itemsEl.querySelectorAll('button[data-id]').forEach(btn => btn.addEventListener('click', () => this.remove(Number(btn.dataset.id))));
    }
    if (totalEl) totalEl.textContent = formatPrice(this.total());
  },
  open() {
    document.getElementById('cartDrawer')?.classList.add('active');
    document.getElementById('cartOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  close() {
    document.getElementById('cartDrawer')?.classList.remove('active');
    document.getElementById('cartOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
  },
  checkout() {
    if (!this.items.length) return;
    const lines = this.items.map(i => \`• \${i.name} — \${formatPrice(i.price)}\`).join('\\n');
    window.open(\`https://wa.me/\${window.WHATSAPP_NUMBER}?text=\${encodeURIComponent(\`Здравствуйте! Хочу купить:\\n\${lines}\\nИтого: \${formatPrice(this.total())}\`)}\`, '_blank', 'noopener');
  },
  bindEvents() {
    document.getElementById('cartClose')?.addEventListener('click', () => this.close());
    document.getElementById('cartOverlay')?.addEventListener('click', () => this.close());
    document.getElementById('checkoutBtn')?.addEventListener('click', () => this.checkout());
    document.querySelectorAll('#cartToggle,[data-cart-open]').forEach(btn => btn.addEventListener('click', () => this.open()));
  }
};
document.addEventListener('DOMContentLoaded', () => Cart.init());
window.Cart = Cart;
`);

write(path.join(root, 'js/main.js'), `window.WHATSAPP_NUMBER = window.WHATSAPP_NUMBER || '79000000000';
function pageUrl(path) { return ((window.SITE_BASE || '/bu-kolyasochka/') + path.replace(/^\\//, '')); }
function escAttr(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;'); }
function formatPrice(n) { return Number(n).toLocaleString('ru-RU') + ' ₽'; }
function getConditionLabel(c) { return CONDITIONS[c] || c; }
function getTypeLabel(t) { return TYPES[t] || t; }
function installment(price, months = 12) { return Math.round(price / months).toLocaleString('ru-RU'); }
function discount(product) { return product.newPrice ? Math.round((1 - product.price / product.newPrice) * 100) : 0; }
function strollerIcon() { return '<svg viewBox="0 0 80 70"><path d="M10 50 Q14 28 28 24 L38 22 Q42 6 58 6 Q70 6 70 22 L70 32 Q76 34 76 42 L76 50 Z" stroke-width="1.2"/><circle cx="22" cy="56" r="8"/><circle cx="58" cy="56" r="8"/></svg>'; }
function condBadge(c) { return '<span class="pbadge ' + (c === 'likenew' ? 'pbadge-green' : c === 'excellent' ? 'pbadge-sand' : 'pbadge-gray') + '">' + getConditionLabel(c) + '</span>'; }
function productCard(product, index = 0) {
  return '<article class="product-card" style="animation-delay:' + (index * 0.04) + 's"><a href="' + pageUrl('product.html?id=' + product.id) + '" class="product-link"><div class="product-thumb">' + strollerIcon() + '<img src="' + product.img + '" alt="' + escAttr(product.name) + '" onerror="fixProductImg(this,\\'' + escAttr(product.name) + '\\')"><div class="product-badges">' + condBadge(product.condition) + (discount(product) ? '<span class="pbadge pbadge-red">−' + discount(product) + '%</span>' : '') + '</div></div><div class="product-body"><div class="product-brand">' + product.brand + '</div><div class="product-name">' + product.name + '</div><div class="product-meta">' + product.year + ' · ' + product.color + ' · ' + getTypeLabel(product.type) + '</div></div></a><div class="product-foot"><div><span class="product-price">' + formatPrice(product.price) + '</span>' + (product.newPrice ? '<span class="product-price-old">' + formatPrice(product.newPrice) + '</span>' : '') + '<span class="prod-installment">от ' + installment(product.price) + ' ₽/мес</span></div><button class="btn-add add-to-cart-btn" data-id="' + product.id + '" aria-label="В корзину"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div></article>';
}
function bindAddToCart(root = document) {
  root.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); Cart.add(Number(btn.dataset.id)); });
  });
}
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}
function initHome() {
  const featured = document.getElementById('featuredGrid');
  if (!featured) return;
  const newest = [...PRODUCTS].sort((a, b) => b.id - a.id).slice(0, 8);
  featured.innerHTML = newest.map((p, i) => productCard(p, i)).join('');
  bindAddToCart(featured);
  const count = document.querySelector('[data-products-count]');
  if (count) count.textContent = PRODUCTS.length + '+';
}
function initProductPage() {
  const mount = document.getElementById('productMount');
  if (!mount) return;
  const id = Number(new URLSearchParams(location.search).get('id')) || 51;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  document.title = product.name + ' — КолясочкиPRO';
  const waText = encodeURIComponent('Здравствуйте! Интересует ' + product.name + ' за ' + formatPrice(product.price));
  mount.innerHTML = '<nav class="breadcrumb"><a href="' + pageUrl('index.html') + '">Главная</a><span>›</span><a href="' + pageUrl('catalog.html') + '">Каталог</a><span>›</span><span>' + product.name + '</span></nav><article class="product-detail-card"><div class="detail-gallery"><div class="detail-main-img">' + strollerIcon() + '<img src="' + product.img + '" alt="' + escAttr(product.name) + '" onerror="fixProductImg(this,\\'' + escAttr(product.name) + '\\')"><div class="product-badges">' + condBadge(product.condition) + '<span class="pbadge pbadge-sand">Премиум</span></div></div><div class="detail-thumbs"><span>Фото 1</span><span>Фото 2</span><span>Фото 3</span><span>Фото 4</span><span>Видео</span></div></div><div class="detail-info"><p class="product-brand">' + product.brand + '</p><h1 class="detail-title">' + product.name + '</h1><p class="detail-subtitle">' + getTypeLabel(product.type) + ' · ' + product.year + ' · ' + product.color + '</p><div class="condition-block"><strong>Состояние: ' + getConditionLabel(product.condition).toLowerCase() + '</strong><span>' + product.desc + '</span></div><div class="detail-price"><span>' + formatPrice(product.price) + '</span>' + (product.newPrice ? '<del>' + formatPrice(product.newPrice) + '</del><em>−' + discount(product) + '%</em>' : '') + '</div><p class="installment-note">или <strong>' + installment(product.price) + ' ₽/мес</strong> при рассрочке на 12 месяцев</p><div class="specs-grid"><div><small>Тип</small><b>' + getTypeLabel(product.type) + '</b></div><div><small>Год</small><b>' + product.year + '</b></div><div><small>Цвет</small><b>' + product.color + '</b></div><div><small>Бренд</small><b>' + product.brand + '</b></div></div><div class="cta-block"><button class="btn-primary add-to-cart-btn" data-id="' + product.id + '">В корзину</button><a class="btn-secondary" href="https://wa.me/' + window.WHATSAPP_NUMBER + '?text=' + waText + '" target="_blank" rel="noopener">Купить в WhatsApp</a></div><div class="trust-strip"><span>Проверено магазином</span><span>Возврат 14 дней</span><span>Доставка по РФ</span></div></div></article><section class="related-block"><h2>Похожие товары</h2><div class="products-grid">' + PRODUCTS.filter(p => p.type === product.type && p.id !== product.id).slice(0, 4).map(productCard).join('') + '</div></section>';
  bindAddToCart(mount);
}
document.addEventListener('DOMContentLoaded', () => { initReveal(); initHome(); initProductPage(); bindAddToCart(); });
`);

write(path.join(root, 'css/assistant.css'), `:root{--assistant-border:rgba(28,26,22,.12)}.assistant-widget{position:fixed;right:22px;bottom:22px;z-index:1700}.assistant-fab{display:grid;gap:2px;min-width:112px;padding:13px 16px;border:0;border-radius:999px;background:linear-gradient(135deg,#2d5a3d,#c8a96e);color:#fff;box-shadow:0 18px 48px rgba(45,90,61,.22);cursor:pointer}.assistant-fab span{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}.assistant-fab strong{font-size:14px}.assistant-panel{position:absolute;right:0;bottom:68px;width:min(420px,calc(100vw - 32px));max-height:min(680px,calc(100vh - 120px));display:none;grid-template-rows:auto auto minmax(180px,1fr) auto;overflow:hidden;border:1px solid var(--assistant-border);border-radius:18px;background:#1f1d19;box-shadow:0 24px 70px rgba(0,0,0,.28)}.assistant-widget.active .assistant-panel{display:grid}.assistant-head{display:flex;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.1)}.assistant-head p{color:#c8a96e;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}.assistant-head strong{color:#fff;font-size:15px}.assistant-close{width:34px;height:34px;border:1px solid rgba(255,255,255,.16);border-radius:50%;background:transparent;color:#fff;font-size:20px;cursor:pointer}.assistant-quick{display:flex;gap:8px;padding:12px 16px;overflow-x:auto;border-bottom:1px solid rgba(255,255,255,.1)}.assistant-quick button{flex-shrink:0;color:#fff;font-size:11px;font-weight:600;padding:8px 10px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.06);cursor:pointer}.assistant-messages{overflow-y:auto;padding:16px;display:grid;align-content:start;gap:12px}.assistant-message{max-width:92%;padding:12px 14px;border-radius:18px;font-size:14px;line-height:1.6}.assistant-message--bot{color:#e7dfd2;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1)}.assistant-message--user{justify-self:end;color:#1c1a16;background:#c8a96e}.assistant-results{display:grid;gap:8px;margin-top:12px}.assistant-result{display:grid;grid-template-columns:52px 1fr;gap:10px;align-items:center;padding:8px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(0,0,0,.18);color:inherit;text-decoration:none}.assistant-result img{width:52px;height:52px;object-fit:cover;border-radius:12px;background:#efe5d7}.assistant-result strong{display:block;color:#fff;font-size:13px}.assistant-result small{color:#b9b0a3;font-size:11px}.assistant-form{display:grid;grid-template-columns:1fr auto;gap:8px;padding:14px;border-top:1px solid rgba(255,255,255,.1)}.assistant-form input{min-width:0;color:#fff;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:12px 14px;outline:none}.assistant-form button{color:#1c1a16;font-size:11px;font-weight:700;padding:0 16px;border:0;border-radius:999px;background:#c8a96e;cursor:pointer}.cart-overlay{position:fixed;inset:0;z-index:1600;background:rgba(28,26,22,.42);opacity:0;pointer-events:none;transition:.2s}.cart-overlay.active{opacity:1;pointer-events:auto}.cart-drawer{position:fixed;right:0;top:0;bottom:0;z-index:1601;width:min(390px,92vw);background:#fff;color:#1c1a16;transform:translateX(100%);transition:.28s;display:flex;flex-direction:column;box-shadow:-24px 0 70px rgba(0,0,0,.18)}.cart-drawer.active{transform:translateX(0)}.cart-drawer-head{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid var(--assistant-border)}.cart-drawer-head button{width:34px;height:34px;border-radius:50%;border:1px solid var(--assistant-border);background:transparent;font-size:20px;cursor:pointer}.cart-empty{padding:32px 20px;color:#8a847a;line-height:1.8}.cart-empty a{color:#2d5a3d}.cart-items{padding:8px 20px;overflow:auto;flex:1}.cart-item{display:grid;grid-template-columns:62px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid rgba(28,26,22,.08)}.cart-item img{width:62px;height:62px;object-fit:cover;border-radius:12px;background:#f5f0e8}.cart-item p{font-size:13px;margin:0 0 4px}.cart-item strong{font-size:13px}.cart-item button{border:0;background:transparent;font-size:20px;color:#8a847a;cursor:pointer}.cart-drawer-footer{padding:18px 20px;border-top:1px solid var(--assistant-border)}.cart-total{display:flex;justify-content:space-between;margin-bottom:14px}.cart-drawer-footer button{width:100%;padding:14px;border:0;border-radius:999px;background:#2d5a3d;color:#fff;font-weight:700;cursor:pointer}@media(max-width:560px){.assistant-widget{right:12px;bottom:12px}.assistant-panel{width:calc(100vw - 24px)}}`);

function pageShell(title, desc, styleText, bodyHtml, page, extraScript = '') {
  return `<!DOCTYPE html>\n<html lang="ru">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${title}</title>\n<meta name="description" content="${desc}">\n<script src="/bu-kolyasochka/js/site.js"></script>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">\n<style>${styleText}\n.product-thumb img,.prod-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.product-link,.prod-thumb{color:inherit;text-decoration:none}.pbadge-gray,.pg{background:#ede7d9;color:#4a4640}.prod-installment{display:block;font-size:10px;color:var(--green);margin-top:2px}\n</style>\n<link rel="stylesheet" href="/bu-kolyasochka/css/assistant.css">\n</head>\n<body data-page="${page}">\n${bodyHtml}\n<script src="/bu-kolyasochka/js/products.js"></script>\n<script src="/bu-kolyasochka/js/cart.js"></script>\n<script src="/bu-kolyasochka/js/main.js"></script>\n${extraScript}\n<script src="/bu-kolyasochka/js/assistant.js"></script>\n</body>\n</html>`;
}

let homeBody = body(read(path.join(tmp, 'stroller-homepage.html')));
homeBody = homeBody.replace('<a href="#" class="logo">Коляска<span>PRO</span></a>', '<a href="index.html" class="logo">Колясочки<span>PRO</span></a>');
homeBody = homeBody.replaceAll('href="#catalog"', 'href="catalog.html"').replaceAll('href="#how"', 'href="index.html#how"');
homeBody = homeBody.replace('85+', '<span data-products-count>62+</span>');
homeBody = homeBody.replaceAll('href="#" class="section-link">Все категории', 'href="catalog.html" class="section-link">Все категории');
homeBody = homeBody.replaceAll('href="#" class="section-link">Смотреть все', 'href="catalog.html" class="section-link">Смотреть все');
homeBody = homeBody.replace(/<section class="featured reveal">[\s\S]*?<\/section>/, '<section class="featured reveal"><div class="container"><div class="section-header"><h2 class="section-title">Свежие <em>поступления</em></h2><a href="catalog.html" class="section-link">Смотреть все <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></div><div id="featuredGrid" class="products-grid"></div></div></section>');
homeBody = homeBody.replaceAll('<li><a href="#">Прогулочные</a></li>', '<li><a href="catalog.html?type=stroller">Прогулочные</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Для новорождённых</a></li>', '<li><a href="catalog.html?type=transformer">Для новорождённых</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Трансформеры</a></li>', '<li><a href="catalog.html?type=transformer">Трансформеры</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Премиум</a></li>', '<li><a href="catalog.html?brand=Bugaboo">Премиум</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Для двойни</a></li>', '<li><a href="catalog.html?type=twin">Для двойни</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Как купить</a></li>', '<li><a href="checkout.html">Как купить</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Рассрочка</a></li>', '<li><a href="payment.html">Рассрочка</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Доставка</a></li>', '<li><a href="delivery.html">Доставка</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Возврат</a></li>', '<li><a href="delivery.html#returns">Возврат</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">О нас</a></li>', '<li><a href="index.html#contact">О нас</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Контакты</a></li>', '<li><a href="index.html#contact">Контакты</a></li>');
homeBody = homeBody.replaceAll('<li><a href="#">Оферта</a></li>', '<li><a href="oferta.html">Оферта</a></li>');
write(path.join(root, 'index.html'), pageShell('КолясочкиPRO — б/у коляски премиум-класса', 'Б/у коляски ведущих мировых брендов в отличном состоянии. Проверка, рассрочка, доставка по России и ИИ-подбор по каталогу.', style(read(path.join(tmp, 'stroller-homepage.html'))), homeBody, 'home'));

let catBody = body(read(path.join(tmp, 'stroller-catalog.html')));
catBody = catBody.replace('<a href="stroller-homepage.html" class="logo">Коляска<span>PRO</span></a>', '<a href="index.html" class="logo">Колясочки<span>PRO</span></a>');
catBody = catBody.replace(/<li><a href="#" class="active">Каталог<\/a><\/li>[\s\S]*?<li><a href="#">Контакты<\/a><\/li>/, '<li><a href="catalog.html" class="active">Каталог</a></li><li><a href="delivery.html">Доставка</a></li><li><a href="payment.html">Оплата</a></li><li><a href="index.html#contact">Контакты</a></li>');
catBody = catBody.replace('id="activeFilters">\n    <div class="filter-tag" onclick="removeFilter(this,\'Как новое\')">Как новое <span class="remove">×</span></div>\n    <div class="filter-tag" onclick="removeFilter(this,\'Bugaboo\')">Bugaboo <span class="remove">×</span></div>\n    <div class="filter-tag clear-all" onclick="clearAllFilters()">Сбросить все</div>\n  </div>', 'id="activeFilters"></div>');
catBody = catBody.replaceAll('stroller-homepage.html', 'index.html');
const catScript = `<script>let currentPage=1,currentView='grid',PER_PAGE=12,filtered=[...PRODUCTS];
function typeLong(p){return p.type==='transformer'?(p.name.includes('3')||p.name.includes('Complete')?'Трансформер 3-в-1':'Трансформер 2-в-1'):getTypeLabel(p.type)}
function renderCard(p,idx){const d=discount(p),delay=(idx%PER_PAGE)*.04;return '<article class="prod-card" style="animation-delay:'+delay+'s"><a href="'+pageUrl('product.html?id='+p.id)+'" class="prod-thumb" style="background:#e8e4db">'+strollerIcon()+'<img src="'+p.img+'" alt="'+escAttr(p.name)+'" onerror="fixProductImg(this,\\''+escAttr(p.name)+'\\')"><div class="prod-badges">'+condBadge(p.condition)+(d?'<span class="pbadge pr">−'+d+'%</span>':'')+'</div></a><div class="prod-body"><div class="prod-brand">'+p.brand+'</div><div class="prod-name">'+p.name+'</div><div class="prod-meta">'+p.year+' · '+p.color+' · '+typeLong(p)+'</div><div class="prod-tags"><span class="ptag">рассрочка</span>'+(p.type==='transformer'?'<span class="ptag">с люлькой</span>':'')+'</div></div><div class="prod-foot"><div><span class="prod-price">'+formatPrice(p.price)+'</span>'+(p.newPrice?'<span class="prod-price-old">'+formatPrice(p.newPrice)+'</span>':'')+'<span class="prod-installment">от '+installment(p.price)+' ₽/мес</span></div><button class="btn-cart add-to-cart-btn" data-id="'+p.id+'" aria-label="В корзину"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div></article>'}
function applyFilters(){const min=Number(document.getElementById('priceMin')?.value||0),max=Number(document.getElementById('priceMax')?.value||999999);filtered=PRODUCTS.filter(p=>p.price>=min&&p.price<=max);currentPage=1;renderGrid()}
function renderGrid(){const grid=document.getElementById('productsGrid'),total=filtered.length,totalPages=Math.max(1,Math.ceil(total/PER_PAGE));if(currentPage>totalPages)currentPage=totalPages;const start=(currentPage-1)*PER_PAGE,slice=filtered.slice(start,start+PER_PAGE);grid.innerHTML=slice.map(renderCard).join('')||'<div class="empty-state"><div class="empty-title">Ничего не найдено</div><p class="empty-sub">Попробуйте изменить фильтры.</p></div>';document.getElementById('totalCount').textContent=total+' '+(total===1?'позиция':total<5?'позиции':'позиций');document.getElementById('pageInfo').textContent=total?'Показано '+(start+1)+'–'+Math.min(start+PER_PAGE,total)+' из '+total:'';bindAddToCart(grid);renderPagination(totalPages)}
function renderPagination(totalPages){const nav=document.getElementById('pagination'),prev=nav.querySelector('.page-btn.arrow:first-child'),next=nav.querySelector('.page-btn.arrow:last-child');nav.querySelectorAll('.page-btn:not(.arrow),.page-dots').forEach(e=>e.remove());let lastDots=false;for(let i=1;i<=totalPages;i++){if(i===1||i===totalPages||(i>=currentPage-1&&i<=currentPage+1)){const b=document.createElement('button');b.className='page-btn'+(i===currentPage?' active':'');b.textContent=i;b.onclick=()=>goPage(i);nav.insertBefore(b,next);lastDots=false}else if(!lastDots){const s=document.createElement('span');s.className='page-dots';s.textContent='…';nav.insertBefore(s,next);lastDots=true}}prev.disabled=currentPage===1;next.disabled=currentPage===totalPages}
function goPage(p){const total=Math.ceil(filtered.length/PER_PAGE);if(p<1||p>total)return;currentPage=p;renderGrid();scrollTo({top:0,behavior:'smooth'})}
function setView(v){currentView=v;document.getElementById('productsGrid').classList.toggle('list-view',v==='list');document.getElementById('gridBtn')?.classList.toggle('active',v==='grid');document.getElementById('listBtn')?.classList.toggle('active',v==='list');renderGrid()}
function handleSort(sel){const v=sel.value;filtered.sort((a,b)=>v==='price-asc'?a.price-b.price:v==='price-desc'?b.price-a.price:v==='discount'?discount(b)-discount(a):v==='popular'?a.id-b.id:b.year-a.year||b.id-a.id);currentPage=1;renderGrid()}
function toggleGroup(id){document.getElementById(id)?.classList.toggle('open')}
function toggleOpt(el){el.classList.toggle('checked')}
function setPrice(min,max){document.getElementById('priceMin').value=min;document.getElementById('priceMax').value=max;document.querySelectorAll('.price-preset').forEach(b=>b.classList.remove('active'));if(event?.target)event.target.classList.add('active');applyFilters()}
function clearAllFilters(){document.getElementById('priceMin').value=0;document.getElementById('priceMax').value=150000;document.querySelectorAll('.filter-opt.checked,.swatch.active,.price-preset.active').forEach(el=>el.classList.remove('checked','active'));filtered=[...PRODUCTS];currentPage=1;renderGrid()}
function openDrawer(){document.getElementById('drawerBody').innerHTML=document.getElementById('sidebar').innerHTML;document.getElementById('drawer').classList.add('open');document.getElementById('drawerOverlay').classList.add('open');document.body.style.overflow='hidden'}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('drawerOverlay').classList.remove('open');document.body.style.overflow=''}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('priceMin')?.addEventListener('change',applyFilters);document.getElementById('priceMax')?.addEventListener('change',applyFilters);renderGrid()});</script>`;
write(path.join(root, 'catalog.html'), pageShell('Каталог колясок б/у — КолясочкиPRO', 'Каталог б/у колясок премиум-брендов: 62 товара, проверка, рассрочка, доставка.', style(read(path.join(tmp, 'stroller-catalog.html'))), catBody, 'catalog', catScript));

const cardStyle = style(read(path.join(tmp, 'stroller-card.html')));
const productExtraCss = 'body{padding:0 16px 60px}.top-nav{max-width:1080px;margin:0 auto 18px;padding:18px 0;display:flex;justify-content:space-between;align-items:center}.top-nav a{text-decoration:none;color:var(--ink2);font-size:13px}.top-nav .logo{font-family:\'Cormorant Garamond\',serif;font-size:22px;color:var(--ink)}.product-detail-card{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;display:grid;grid-template-columns:1fr 1fr}.detail-gallery{background:#f0ede6}.detail-main-img{position:relative;aspect-ratio:1;display:flex;align-items:center;justify-content:center;overflow:hidden}.detail-main-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.detail-main-img svg{width:110px;height:110px;opacity:.18}.detail-thumbs{display:flex;gap:6px;padding:12px 16px;border-top:1px solid var(--border)}.detail-thumbs span{width:58px;height:52px;border-radius:8px;background:var(--border);font-size:11px;color:var(--ink3);display:grid;place-items:center}.detail-info{padding:36px 40px}.detail-title{font-family:\'Cormorant Garamond\',serif;font-size:clamp(34px,4vw,52px);font-weight:500;line-height:1.05;margin:6px 0}.detail-subtitle{font-size:13px;color:var(--ink3);margin-bottom:18px}.detail-price{display:flex;align-items:baseline;gap:12px;margin:22px 0}.detail-price span{font-size:32px;font-weight:600}.detail-price del{color:var(--ink3)}.detail-price em{font-style:normal;color:var(--warn);background:var(--warn-light);border-radius:20px;padding:3px 10px;font-size:12px}.specs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.specs-grid div{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px}.specs-grid small{display:block;color:var(--ink3);font-size:11px;margin-bottom:4px}.cta-block{display:grid;gap:10px}.cta-block a{text-align:center;text-decoration:none}.related-block{margin-top:28px}.related-block h2{font-family:\'Cormorant Garamond\',serif;font-size:30px;margin-bottom:16px}.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}.product-card{background:#fff;border:1px solid var(--border);border-radius:14px;overflow:hidden}.product-thumb{aspect-ratio:4/3;position:relative;background:#f0ede6;display:grid;place-items:center}.product-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.product-thumb svg{width:64px;height:64px;opacity:.18}.product-body,.product-foot{padding:12px 14px}.product-foot{border-top:1px solid var(--border);display:flex;justify-content:space-between;gap:10px}.btn-add{width:34px;height:34px;border-radius:50%;background:var(--ink);border:0;display:grid;place-items:center;cursor:pointer}.btn-add svg{width:15px;height:15px;stroke:#fff;fill:none;stroke-width:2}.product-link{text-decoration:none;color:inherit}.pbadge{font-size:10px;font-weight:600;padding:4px 10px;border-radius:20px}.pbadge-green{background:var(--accent-light);color:var(--accent-text)}.pbadge-sand{background:var(--gold-light);color:#7a5a10}.pbadge-gray{background:#eee;color:var(--ink2)}.pbadge-red{background:var(--warn-light);color:var(--warn)}@media(max-width:760px){.product-detail-card{grid-template-columns:1fr}.detail-info{padding:26px 22px}}';
const productHtml = '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Карточка товара — КолясочкиPRO</title><meta name="description" content="Карточка проверенной б/у коляски: состояние, цена, рассрочка, доставка по РФ."><script src="/bu-kolyasochka/js/site.js"></script><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Manrope:wght@400;500;600&family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"><style>' + cardStyle + productExtraCss + '</style><link rel="stylesheet" href="/bu-kolyasochka/css/assistant.css"></head><body data-page="product"><div class="top-nav"><a class="logo" href="index.html">Колясочки<span style="color:#2d6a4f">PRO</span></a><div><a href="catalog.html">Каталог</a> · <a href="delivery.html">Доставка</a> · <button data-cart-open style="border:0;background:transparent;color:var(--ink2);cursor:pointer">Корзина <span data-cart-count></span></button></div></div><div class="page-wrap" id="productMount"></div><script src="/bu-kolyasochka/js/products.js"></script><script src="/bu-kolyasochka/js/cart.js"></script><script src="/bu-kolyasochka/js/main.js"></script><script src="/bu-kolyasochka/js/assistant.js"></script></body></html>';
write(path.join(root, 'product.html'), productHtml);

for (const [srcName, outName, page] of [
  ['stroller-payment.html', 'payment.html', 'payment'],
  ['stroller-delivery.html', 'delivery.html', 'delivery'],
  ['stroller-checkout.html', 'checkout.html', 'checkout']
]) {
  let html = read(path.join(tmp, srcName));
  html = html.replaceAll('stroller-homepage.html', 'index.html').replaceAll('stroller-catalog.html', 'catalog.html').replaceAll('Коляска<span>PRO</span>', 'Колясочки<span>PRO</span>');
  html = html.replace('<head>', '<head>\n<script src="/bu-kolyasochka/js/site.js"></script>');
  html = html.replace('</head>', '<link rel="stylesheet" href="/bu-kolyasochka/css/assistant.css">\n</head>');
  html = html.replace('<body>', `<body data-page="${page}">`);
  html = html.replace('</body>', '<script src="/bu-kolyasochka/js/products.js"></script>\n<script src="/bu-kolyasochka/js/cart.js"></script>\n<script src="/bu-kolyasochka/js/main.js"></script>\n<script src="/bu-kolyasochka/js/assistant.js"></script>\n</body>');
  write(path.join(root, outName), html);
}

function legalPage(title, text) {
  const paras = text.split(/\r?\n/).filter(Boolean).map((line) => `<p>${line.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</p>`).join('');
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><script src="/bu-kolyasochka/js/site.js"></script><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"><style>body{margin:0;background:#f5f0e8;color:#1c1a16;font-family:'DM Sans',sans-serif}main{max-width:900px;margin:0 auto;padding:36px 20px 80px}a{color:#2d5a3d}h1{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:500}p{line-height:1.7;margin:0 0 10px;background:rgba(255,255,255,.45);padding:10px 14px;border-radius:10px}</style></head><body><main><a href="index.html">← На главную</a><h1>${title}</h1>${paras}</main></body></html>`;
}
const legal = read(path.join(legalDir, 'legal-docs.txt'));
const oferta = legal.split('Документ 2 из 3')[0];
const privacy = ('Документ 2 из 3' + legal.split('Документ 2 из 3')[1]).split('Документ 3 из 3')[0];
const returns = 'Документ 3 из 3' + legal.split('Документ 3 из 3')[1];
write(path.join(root, 'oferta.html'), legalPage('Публичная оферта', oferta));
write(path.join(root, 'privacy.html'), legalPage('Политика конфиденциальности', privacy));
write(path.join(root, 'returns.html'), legalPage('Политика возврата и обмена', returns));

const urls = ['index.html','catalog.html','product.html','delivery.html','payment.html','checkout.html','oferta.html','privacy.html','returns.html','kak-vybrat.html','compare.html'];
write(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>https://valerabeus.github.io/bu-kolyasochka/${u}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log('Rebuild complete');
