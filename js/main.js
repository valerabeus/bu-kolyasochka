window.WHATSAPP_NUMBER = window.WHATSAPP_NUMBER || '79000000000';
function pageUrl(path) { return ((window.SITE_BASE || '/bu-kolyasochka/') + path.replace(/^\//, '')); }
function escAttr(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;'); }
function formatPrice(n) { return Number(n).toLocaleString('ru-RU') + ' ₽'; }
function getConditionLabel(c) { return CONDITIONS[c] || c; }
function getTypeLabel(t) { return TYPES[t] || t; }
function installment(price, months = 12) { return Math.round(price / months).toLocaleString('ru-RU'); }
function discount(product) { return product.newPrice ? Math.round((1 - product.price / product.newPrice) * 100) : 0; }
function strollerIcon() { return '<svg viewBox="0 0 80 70"><path d="M10 50 Q14 28 28 24 L38 22 Q42 6 58 6 Q70 6 70 22 L70 32 Q76 34 76 42 L76 50 Z" stroke-width="1.2"/><circle cx="22" cy="56" r="8"/><circle cx="58" cy="56" r="8"/></svg>'; }
function condBadge(c) { return '<span class="pbadge ' + (c === 'likenew' ? 'pbadge-green' : c === 'excellent' ? 'pbadge-sand' : 'pbadge-gray') + '">' + getConditionLabel(c) + '</span>'; }
function productCard(product, index = 0) {
  return '<article class="product-card" style="animation-delay:' + (index * 0.04) + 's"><a href="' + pageUrl('product.html?id=' + product.id) + '" class="product-link"><div class="product-thumb">' + strollerIcon() + '<img src="' + product.img + '" alt="' + escAttr(product.name) + '" onerror="fixProductImg(this,\'' + escAttr(product.name) + '\')"><div class="product-badges">' + condBadge(product.condition) + (discount(product) ? '<span class="pbadge pbadge-red">−' + discount(product) + '%</span>' : '') + '</div></div><div class="product-body"><div class="product-brand">' + product.brand + '</div><div class="product-name">' + product.name + '</div><div class="product-meta">' + product.year + ' · ' + product.color + ' · ' + getTypeLabel(product.type) + '</div></div></a><div class="product-foot"><div><span class="product-price">' + formatPrice(product.price) + '</span>' + (product.newPrice ? '<span class="product-price-old">' + formatPrice(product.newPrice) + '</span>' : '') + '<span class="prod-installment">от ' + installment(product.price) + ' ₽/мес</span></div><button class="btn-add add-to-cart-btn" data-id="' + product.id + '" aria-label="В корзину"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div></article>';
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
  mount.innerHTML = '<nav class="breadcrumb"><a href="' + pageUrl('index.html') + '">Главная</a><span>›</span><a href="' + pageUrl('catalog.html') + '">Каталог</a><span>›</span><span>' + product.name + '</span></nav><article class="product-detail-card"><div class="detail-gallery"><div class="detail-main-img">' + strollerIcon() + '<img src="' + product.img + '" alt="' + escAttr(product.name) + '" onerror="fixProductImg(this,\'' + escAttr(product.name) + '\')"><div class="product-badges">' + condBadge(product.condition) + '<span class="pbadge pbadge-sand">Премиум</span></div></div><div class="detail-thumbs"><span>Фото 1</span><span>Фото 2</span><span>Фото 3</span><span>Фото 4</span><span>Видео</span></div></div><div class="detail-info"><p class="product-brand">' + product.brand + '</p><h1 class="detail-title">' + product.name + '</h1><p class="detail-subtitle">' + getTypeLabel(product.type) + ' · ' + product.year + ' · ' + product.color + '</p><div class="condition-block"><strong>Состояние: ' + getConditionLabel(product.condition).toLowerCase() + '</strong><span>' + product.desc + '</span></div><div class="detail-price"><span>' + formatPrice(product.price) + '</span>' + (product.newPrice ? '<del>' + formatPrice(product.newPrice) + '</del><em>−' + discount(product) + '%</em>' : '') + '</div><p class="installment-note">или <strong>' + installment(product.price) + ' ₽/мес</strong> при рассрочке на 12 месяцев</p><div class="specs-grid"><div><small>Тип</small><b>' + getTypeLabel(product.type) + '</b></div><div><small>Год</small><b>' + product.year + '</b></div><div><small>Цвет</small><b>' + product.color + '</b></div><div><small>Бренд</small><b>' + product.brand + '</b></div></div><div class="cta-block"><button class="btn-primary add-to-cart-btn" data-id="' + product.id + '">В корзину</button><a class="btn-secondary" href="https://wa.me/' + window.WHATSAPP_NUMBER + '?text=' + waText + '" target="_blank" rel="noopener">Купить в WhatsApp</a></div><div class="trust-strip"><span>Проверено магазином</span><span>Возврат 14 дней</span><span>Доставка по РФ</span></div></div></article><section class="related-block"><h2>Похожие товары</h2><div class="products-grid">' + PRODUCTS.filter(p => p.type === product.type && p.id !== product.id).slice(0, 4).map(productCard).join('') + '</div></section>';
  bindAddToCart(mount);
}
document.addEventListener('DOMContentLoaded', () => { initReveal(); initHome(); initProductPage(); bindAddToCart(); });
