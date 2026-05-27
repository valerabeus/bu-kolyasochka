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
  const d = discount(product);
  const badge = product.condition === 'likenew' ? 'pb-green' : d ? 'pb-red' : 'pb-orange';
  const badgeText = d ? '−' + d + '%' : getConditionLabel(product.condition);
  return '<article class="pcard reveal" style="animation-delay:' + (index * 0.04) + 's"><a href="' + pageUrl('product.html?id=' + product.id) + '" class="pcard-link"><div class="pcard-img">' + strollerIcon() + '<img src="' + product.img + '" alt="' + escAttr(product.name) + '" onerror="fixProductImg(this,\'' + escAttr(product.name) + '\')"><span class="p-badge ' + badge + '">' + badgeText + '</span></div><div class="pcard-body"><div class="p-brand">' + product.brand + '</div><div class="p-name">' + product.name + '</div><div class="p-cond">' + getConditionLabel(product.condition) + '</div></a><div class="pcard-foot"><div><div class="p-price">' + formatPrice(product.price) + '</div>' + (product.newPrice ? '<div class="p-old">' + formatPrice(product.newPrice) + '</div>' : '') + '</div><button class="add-btn add-to-cart-btn" data-id="' + product.id + '" aria-label="В корзину">+</button></div></article>';
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
function countLabel(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return n + ' товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return n + ' товара';
  return n + ' товаров';
}
function initCategoryCounts() {
  document.querySelectorAll('[data-cat-type]').forEach(el => {
    const type = el.getAttribute('data-cat-type');
    const n = PRODUCTS.filter(p => p.type === type).length;
    el.textContent = countLabel(n);
  });
  document.querySelectorAll('[data-cat-price="budget"]').forEach(el => {
    const n = PRODUCTS.filter(p => p.price <= 15000).length;
    el.textContent = countLabel(n);
  });
}
function initHome() {
  const featured = document.getElementById('featuredGrid');
  if (!featured) return;
  const newest = [...PRODUCTS].sort((a, b) => b.id - a.id).slice(0, 8);
  featured.innerHTML = newest.map((p, i) => productCard(p, i)).join('');
  bindAddToCart(featured);
  initReveal();
  initCategoryCounts();
  const count = document.querySelector('[data-products-count]');
  if (count) count.textContent = PRODUCTS.length + '+';
}
function initProductPage() {
  const mount = document.getElementById('productMount');
  if (!mount) return;
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  document.title = product.name + ' — КрохаКруг';
  const d = discount(product);
  const waText = encodeURIComponent('Здравствуйте! Интересует ' + product.name + ' за ' + formatPrice(product.price));
  const related = PRODUCTS.filter(p => p.type === product.type && p.id !== product.id).slice(0, 4).map((p, i) => productCard(p, i)).join('');
  mount.innerHTML = '<div class="breadcrumb"><a href="' + pageUrl('index.html') + '">Главная</a><s>›</s><a href="' + pageUrl('catalog.html') + '">Каталог</a><s>›</s><span>' + product.name + '</span></div><div class="product-grid"><div class="gallery"><div class="gallery-main">' + strollerIcon() + '<img src="' + product.img + '" alt="' + escAttr(product.name) + '" onerror="fixProductImg(this,\'' + escAttr(product.name) + '\')"></div></div><div class="prod-info"><div class="prod-badges"><span class="prod-badge pb-green">' + getConditionLabel(product.condition) + '</span>' + (d ? '<span class="prod-badge pb-red">−' + d + '%</span>' : '') + '</div><div class="prod-brand">' + product.brand + '</div><h1 class="prod-name">' + product.name + '</h1><div class="prod-type">' + getTypeLabel(product.type) + ' · ' + product.year + ' · ' + product.color + '</div><div class="prod-cond">Состояние: ' + getConditionLabel(product.condition) + '</div><div class="price-block"><div class="price-row"><span class="price-now">' + formatPrice(product.price) + '</span>' + (product.newPrice ? '<span class="price-old">' + formatPrice(product.newPrice) + '</span><span class="price-save">−' + d + '%</span>' : '') + '</div><div class="price-monthly">или <b>' + installment(product.price) + ' ₽/мес</b> в рассрочку на 12 месяцев</div></div><div class="cta-block"><button class="btn-cart add-to-cart-btn" data-id="' + product.id + '">В корзину</button><a class="btn-buy" href="https://wa.me/' + window.WHATSAPP_NUMBER + '?text=' + waText + '" target="_blank" rel="noopener">Купить в WhatsApp</a></div><div class="guarantees"><div class="guar"><div class="guar-icon">🛡️</div><div class="guar-text"><b>12-точечная проверка</b>Шасси, ткань, колёса, тормоза</div></div><div class="guar"><div class="guar-icon">↩️</div><div class="guar-text"><b>Возврат 14 дней</b>Без вопросов</div></div><div class="guar"><div class="guar-icon">📦</div><div class="guar-text"><b>Доставка 2–7 дней</b>По всей России</div></div></div><p style="font-size:.88rem;color:var(--mid);line-height:1.75">' + product.desc + '</p></div></div><div class="related"><h2>Похожие товары</h2><div class="rel-grid products">' + related + '</div></div>';
  bindAddToCart(mount);
}
document.addEventListener('DOMContentLoaded', () => { initReveal(); initHome(); initProductPage(); bindAddToCart(); });
