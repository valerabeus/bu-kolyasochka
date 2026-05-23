const WHATSAPP_NUMBER = '79000000000';
const PAGE_SIZE = 12;
const FEATURED_IDS = [49, 2, 3];

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

function getConditionLabel(c) { return CONDITIONS[c] || c; }
function getConditionBadge(c) { return getConditionLabel(c).toUpperCase(); }
function getTypeLabel(t) { return TYPES[t] || t; }

function getParams() {
  return new URLSearchParams(window.location.search);
}

function pluralize(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

function buildProductCard(product) {
  const discount = product.newPrice
    ? Math.round((1 - product.price / product.newPrice) * 100)
    : null;

  return `
    <article class="product-card" data-id="${product.id}">
      <a href="product.html?id=${product.id}" class="product-card-link">
        <div class="product-card-img-wrap">
          <img src="${product.img}" alt="${product.name}" class="product-card-img" loading="lazy">
          ${discount ? `<span class="product-card-badge">−${discount}%</span>` : ''}
          <span class="product-card-condition">${getConditionBadge(product.condition)}</span>
          <div class="product-card-overlay">
            <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">В корзину</button>
          </div>
        </div>
        <div class="product-card-info">
          <p class="product-card-brand">${product.brand.toUpperCase()}</p>
          <h3 class="product-card-name">${product.name}</h3>
          <div class="product-card-prices">
            <span class="product-card-price">${formatPrice(product.price)}</span>
            ${product.newPrice ? `<span class="product-card-old">${formatPrice(product.newPrice)}</span>` : ''}
          </div>
        </div>
      </a>
    </article>
  `
}

function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  const hide = () => {
    if (!loader.isConnected) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 400);
  };

  // Не ждём все внешние картинки — иначе экран может висеть бесконечно
  if (document.readyState === 'complete') {
    hide();
  } else {
    document.addEventListener('DOMContentLoaded', hide, { once: true });
    setTimeout(hide, 1500);
  }
}

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const burger = document.getElementById('burgerBtn');
  const closeBtn = document.getElementById('mobileMenuClose');
  if (!menu) return;

  const open = () => {
    menu.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    menu.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  burger?.addEventListener('click', open);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  menu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

function initBottomNav() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;

  const page = document.body.dataset.page || '';
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  nav.innerHTML = `
    <div class="bottom-nav-inner">
      <a href="index.html" class="bottom-nav-item${page === 'home' ? ' active' : ''}">
        <span>🏠</span><span>Главная</span>
      </a>
      <a href="catalog.html" class="bottom-nav-item${page === 'catalog' ? ' active' : ''}">
        <span>📋</span><span>Каталог</span>
      </a>
      <a href="${waUrl}" class="bottom-nav-item" target="_blank" rel="noopener">
        <span>💬</span><span>WhatsApp</span>
      </a>
      <button type="button" class="bottom-nav-item" id="bottomCartBtn" style="position:relative">
        <span>🛒</span><span>Корзина</span>
        <span class="nav-cart-count" id="bottomCartCount"></span>
      </button>
    </div>
  `;

  document.getElementById('bottomCartBtn')?.addEventListener('click', () => Cart.open());
  document.getElementById('mobileCartToggle')?.addEventListener('click', () => Cart.open());
}

function updateBottomCartCount(count) {
  const el = document.getElementById('bottomCartCount');
  if (!el) return;
  if (count > 0) {
    el.textContent = count;
    el.style.display = 'flex';
  } else {
    el.style.display = 'none';
  }
}

function initIndexPage() {
  if (!document.getElementById('featuredGrid')) return;

  const counts = { transformer: 0, stroller: 0, twin: 0, sport: 0 };
  PRODUCTS.forEach(p => { if (counts[p.type] !== undefined) counts[p.type]++; });

  const setCount = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val + ' ' + pluralize(val, 'позиция', 'позиции', 'позиций');
  };
  setCount('countTransformer', counts.transformer);
  setCount('countStroller', counts.stroller);
  setCount('countTwin', counts.twin);
  setCount('countSport', counts.sport);

  const featured = FEATURED_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const grid = document.getElementById('featuredGrid');
  grid.innerHTML = featured.map(buildProductCard).join('');
  bindAddToCart(grid);
}

let catalogState = { type: '', condition: '', sort: 'default', page: 1 };

function syncFilterButtons() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
  btn.classList.toggle('active', catalogState[filter] === value);
  });
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = catalogState.sort;
}

function applyFilter(filter, value) {
  catalogState[filter] = value;
  catalogState.page = 1;
  syncFilterButtons();
  renderCatalog();
}

function initMobileFilters() {
  const typeContainer = document.getElementById('mobileTypeFilters');
  const condContainer = document.getElementById('mobileConditionFilters');
  if (!typeContainer || !condContainer) return;

  const typeOptions = [
    ['', 'Все'], ['transformer', 'Трансформеры'], ['stroller', 'Прогулочные'],
    ['twin', 'Для двойни'], ['sport', 'Спортивные']
  ];
  const condOptions = [
    ['', 'Все'], ['likenew', 'Как новая'], ['excellent', 'Отличное'], ['good', 'Хорошее']
  ];

  typeContainer.innerHTML = typeOptions.map(([val, label]) =>
    `<button class="filter-btn${catalogState.type === val ? ' active' : ''}" data-filter="type" data-value="${val}">${label}</button>`
  ).join('');

  condContainer.innerHTML = condOptions.map(([val, label]) =>
    `<button class="filter-btn${catalogState.condition === val ? ' active' : ''}" data-filter="condition" data-value="${val}">${label}</button>`
  ).join('');

  typeContainer.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => applyFilter('type', btn.dataset.value));
  });
  condContainer.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => applyFilter('condition', btn.dataset.value));
  });
}

function initCatalogPage() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  const params = getParams();
  if (params.get('type')) catalogState.type = params.get('type');
  if (params.get('condition')) catalogState.condition = params.get('condition');
  syncFilterButtons();

  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter, btn.dataset.value));
  });

  document.getElementById('sortSelect')?.addEventListener('change', e => {
    catalogState.sort = e.target.value;
    catalogState.page = 1;
    renderCatalog();
  });

  const resetFn = () => {
    catalogState = { type: '', condition: '', sort: 'default', page: 1 };
    syncFilterButtons();
    initMobileFilters();
    renderCatalog();
  };
  document.getElementById('emptyReset')?.addEventListener('click', resetFn);

  document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    catalogState.page++;
    renderCatalog(true);
  });

  initMobileFilters();
  renderCatalog();
}

function getFilteredProducts() {
  let list = [...PRODUCTS];
  if (catalogState.type) list = list.filter(p => p.type === catalogState.type);
  if (catalogState.condition) list = list.filter(p => p.condition === catalogState.condition);
  if (catalogState.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (catalogState.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  return list;
}

function renderCatalog(append = false) {
  const grid = document.getElementById('catalogGrid');
  const emptyEl = document.getElementById('catalogEmpty');
  const loadMoreWrapper = document.getElementById('loadMoreWrapper');
  const subtitle = document.getElementById('catalogSubtitle');

  const all = getFilteredProducts();
  const total = all.length;
  const shown = catalogState.page * PAGE_SIZE;
  const slice = all.slice(append ? (catalogState.page - 1) * PAGE_SIZE : 0, shown);

  if (subtitle) {
    subtitle.textContent = `${total} ${pluralize(total, 'коляска', 'коляски', 'колясок')}`;
  }

  if (total === 0) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  if (append) {
    grid.insertAdjacentHTML('beforeend', slice.map(buildProductCard).join(''));
  } else {
    grid.innerHTML = slice.map(buildProductCard).join('');
  }

  bindAddToCart(grid);
  initMobileFilters();

  if (loadMoreWrapper) {
    loadMoreWrapper.style.display = shown < total ? 'flex' : 'none';
  }
}

function getProductThumbs(product) {
  return [product.img, product.img, product.img, product.img];
}

function initProductPage() {
  const layout = document.getElementById('productLayout');
  if (!layout) return;

  const id = Number(getParams().get('id'));
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    layout.innerHTML = '<p style="padding:4rem 0;text-align:center;color:var(--gray)">Коляска не найдена. <a href="catalog.html" style="color:var(--gold)">Вернуться в каталог</a></p>';
    return;
  }

  document.title = `${product.name} — Б/У Колясочка`;
  const breadEl = document.getElementById('breadcrumbCurrent');
  if (breadEl) breadEl.textContent = product.name;
  const mobileTitle = document.getElementById('mobileProductTitle');
  if (mobileTitle) mobileTitle.textContent = product.name;

  const waText = encodeURIComponent(`Здравствуйте! Интересует: ${product.name} за ${formatPrice(product.price)}`);
  const discount = product.newPrice ? Math.round((1 - product.price / product.newPrice) * 100) : null;
  const thumbs = getProductThumbs(product);

  layout.innerHTML = `
    <div class="product-gallery">
      <div class="product-main-img">
        <img src="${product.img}" alt="${product.name}" id="mainProductImg">
      </div>
      <div class="product-thumbs">
        ${thumbs.map((src, i) => `
          <button type="button" class="product-thumb${i === 0 ? ' active' : ''}" data-src="${src}" aria-label="Фото ${i + 1}">
            <img src="${src}" alt="">
          </button>
        `).join('')}
      </div>
    </div>
    <div class="product-details">
      <div class="product-brand">${product.brand.toUpperCase()}</div>
      <h1 class="product-name">${product.name}</h1>
      <div class="product-price-block">
        <span class="product-price">${formatPrice(product.price)}</span>
        ${product.newPrice ? `<span class="product-price-old">${formatPrice(product.newPrice)}</span>` : ''}
        ${discount ? `<span class="product-discount">−${discount}%</span>` : ''}
      </div>
      <div class="product-meta">
        <div class="product-meta-row">
          <span class="product-meta-label">Состояние</span>
          <span class="product-meta-value product-condition">${getConditionLabel(product.condition)}</span>
        </div>
        <div class="product-meta-row">
          <span class="product-meta-label">Тип</span>
          <span class="product-meta-value">${getTypeLabel(product.type)}</span>
        </div>
        <div class="product-meta-row">
          <span class="product-meta-label">Цвет</span>
          <span class="product-meta-value">${product.color}</span>
        </div>
        <div class="product-meta-row">
          <span class="product-meta-label">Год</span>
          <span class="product-meta-value">${product.year}</span>
        </div>
      </div>
      <p class="product-desc">${product.desc}</p>
      <div class="product-actions">
        <button class="btn btn-primary btn-lg add-to-cart-btn" data-id="${product.id}">В корзину</button>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waText}" class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener">Купить в WhatsApp</a>
      </div>
      <div class="product-guarantees">
        <div class="guarantee-item"><span class="guarantee-icon">✓</span><span>Проверено перед продажей</span></div>
        <div class="guarantee-item"><span class="guarantee-icon">✓</span><span>Честное описание состояния</span></div>
        <div class="guarantee-item"><span class="guarantee-icon">✓</span><span>Быстрый ответ в WhatsApp</span></div>
      </div>
    </div>
  `;

  layout.querySelectorAll('.product-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      layout.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const mainImg = document.getElementById('mainProductImg');
      if (mainImg) mainImg.src = thumb.dataset.src;
    });
  });

  bindAddToCart(layout);

  const related = PRODUCTS.filter(p => p.type === product.type && p.id !== product.id).slice(0, 3);
  if (related.length > 0) {
    const relatedSection = document.getElementById('relatedSection');
    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedSection && relatedGrid) {
      relatedGrid.innerHTML = related.map(buildProductCard).join('');
      relatedSection.style.display = 'block';
      bindAddToCart(relatedGrid);
    }
  }
}

function bindAddToCart(container) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      Cart.add(Number(btn.dataset.id));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initMobileMenu();
  initBottomNav();
  initIndexPage();
  initCatalogPage();
  initProductPage();
});

window.updateBottomCartCount = updateBottomCartCount;
