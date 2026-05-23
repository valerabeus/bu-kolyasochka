window.WHATSAPP_NUMBER = window.WHATSAPP_NUMBER || '79000000000';
const WHATSAPP_NUMBER = window.WHATSAPP_NUMBER;
const PAGE_SIZE = 24;
const FEATURED_IDS = [49, 2, 3];

const SORT_OPTIONS = [
  ['newest', 'Новинки'],
  ['price-asc', 'Цена ↑'],
  ['price-desc', 'Цена ↓'],
  ['name-asc', 'По названию'],
  ['brand-asc', 'По бренду'],
  ['discount-desc', 'Скидка ↓'],
  ['condition-desc', 'Состояние']
];

const CONDITION_ORDER = { likenew: 0, excellent: 1, good: 2 };

const TYPE_FILTER_LABELS = {
  transformer: 'Трансформеры',
  stroller: 'Прогулочные',
  twin: 'Для двойни',
  sport: 'Спортивные'
};

function pageUrl(path) {
  const base = window.SITE_BASE || '/bu-kolyasochka/';
  return base + path.replace(/^\//, '');
}

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

function getConditionLabel(c) { return CONDITIONS[c] || c; }
function getConditionBadge(c) { return getConditionLabel(c).toUpperCase(); }
function getTypeLabel(t) { return TYPES[t] || t; }

function navIcon(name) {
  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 11.2 12 4.5l7.5 6.7v7.3a1.5 1.5 0 0 1-1.5 1.5h-3.5v-5.3h-5V20H6a1.5 1.5 0 0 1-1.5-1.5v-7.3Z"/></svg>',
    catalog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14M5 12h14M5 18.5h14"/><path d="M4.5 4h15v16h-15z"/></svg>',
    guide: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.8h8.2A3.8 3.8 0 0 1 18 8.6v10.6H7.8A2.8 2.8 0 0 1 5 16.4V5.8a1 1 0 0 1 1-1Z"/><path d="M9 9h5M9 13h6"/></svg>',
    bot: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8.5h8a3 3 0 0 1 3 3v3.8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-3.8a3 3 0 0 1 3-3Z"/><path d="M12 8.5V5M9.3 13h.1M14.6 13h.1M9.5 16h5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.4V7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v5.7a2.5 2.5 0 0 1-2.5 2.5H9.2L5 18.4Z"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 8h11.2l-.8 10H7.2L6.4 8Z"/><path d="M8 8a4 4 0 0 1 8 0"/></svg>'
  };
  return `<span class="bottom-nav-icon">${icons[name] || ''}</span>`;
}

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

function sortProducts(list, sortKey) {
  const arr = [...list];
  switch (sortKey) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    case 'brand-asc':
      return arr.sort((a, b) => {
        const cmp = a.brand.localeCompare(b.brand, 'ru');
        return cmp !== 0 ? cmp : a.name.localeCompare(b.name, 'ru');
      });
    case 'discount-desc':
      return arr.sort((a, b) => {
        const da = a.newPrice ? 1 - a.price / a.newPrice : 0;
        const db = b.newPrice ? 1 - b.price / b.newPrice : 0;
        return db - da;
      });
    case 'condition-desc':
      return arr.sort((a, b) =>
        (CONDITION_ORDER[a.condition] ?? 9) - (CONDITION_ORDER[b.condition] ?? 9)
      );
    case 'newest':
    default:
      return arr.sort((a, b) => b.year - a.year || b.id - a.id);
  }
}

function buildProductCard(product, animIndex) {
  const discount = product.newPrice
    ? Math.round((1 - product.price / product.newPrice) * 100)
    : null;
  const animDelay = animIndex != null ? ` style="animation-delay:${Math.min(animIndex, 11) * 45}ms"` : '';
  const typeLabel = getTypeLabel(product.type);

  return `
    <article class="product-card catalog-card-in"${animDelay} data-id="${product.id}">
      <a href="${pageUrl('product.html?id=' + product.id)}" class="product-card-link">
        <div class="product-card-img-wrap">
          <img src="${product.img}" alt="${product.name}" class="product-card-img" loading="lazy" onerror="fixProductImg(this,'${escAttr(product.name)}')">
          <span class="product-card-type">${typeLabel}</span>
          ${discount ? `<span class="product-card-badge">−${discount}%</span>` : ''}
          <span class="product-card-condition">${getConditionBadge(product.condition)}</span>
          <div class="product-card-overlay">
            <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">В корзину</button>
            <button class="btn btn-ghost btn-sm compare-toggle-btn" data-compare-id="${product.id}">Сравнить</button>
          </div>
        </div>
        <div class="product-card-info">
          <p class="product-card-brand">${product.brand.toUpperCase()}</p>
          <h3 class="product-card-name">${product.name}</h3>
          <div class="product-card-meta">
            <span>${getTypeLabel(product.type)}</span>
            <span>${product.year}</span>
            <span>${product.color}</span>
          </div>
          <div class="product-card-prices">
            <span class="product-card-price">${formatPrice(product.price)}</span>
            ${product.newPrice ? `<span class="product-card-old">${formatPrice(product.newPrice)}</span>` : ''}
          </div>
        </div>
      </a>
    </article>
  `
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
      <a href="${pageUrl('index.html')}" class="bottom-nav-item${page === 'home' ? ' active' : ''}">
        ${navIcon('home')}<span>Главная</span>
      </a>
      <a href="${pageUrl('catalog.html')}" class="bottom-nav-item${page === 'catalog' ? ' active' : ''}">
        ${navIcon('catalog')}<span>Каталог</span>
      </a>
      <a href="${pageUrl('kak-vybrat.html')}" class="bottom-nav-item${page === 'guide' ? ' active' : ''}">
        ${navIcon('guide')}<span>Как выбрать</span>
      </a>
      <button type="button" class="bottom-nav-item" id="bottomAssistantBtn">
        ${navIcon('bot')}<span>Подбор</span>
      </button>
      <button type="button" class="bottom-nav-item" id="bottomCartBtn" style="position:relative">
        ${navIcon('cart')}<span>Корзина</span>
        <span class="nav-cart-count" id="bottomCartCount"></span>
      </button>
    </div>
  `;

  document.getElementById('bottomCartBtn')?.addEventListener('click', () => Cart.open());
  document.getElementById('bottomAssistantBtn')?.addEventListener('click', () => {
    if (window.CatalogAssistant) window.CatalogAssistant.open();
    else window.open(waUrl, '_blank', 'noopener');
  });
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
  grid.innerHTML = featured.map((p, i) => buildProductCard(p, i)).join('');
  bindAddToCart(grid);
  bindCompareButtons(grid);
}

let catalogState = { type: '', condition: '', sort: 'newest', page: 1 };

function syncCatalogUrl() {
  const params = new URLSearchParams();
  if (catalogState.type) params.set('type', catalogState.type);
  if (catalogState.condition) params.set('condition', catalogState.condition);
  if (catalogState.sort && catalogState.sort !== 'newest') params.set('sort', catalogState.sort);
  const qs = params.toString();
  const url = window.location.pathname + (qs ? '?' + qs : '');
  history.replaceState(null, '', url);
}

function syncFilterButtons() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    btn.classList.toggle('active', catalogState[filter] === value);
  });
  document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.classList.toggle('active', catalogState.sort === btn.dataset.sort);
  });
}

function applyFilter(filter, value) {
  catalogState[filter] = value;
  catalogState.page = 1;
  syncFilterButtons();
  syncFilterChips();
  syncCatalogUrl();
  renderCatalog();
}

function applySort(sortKey) {
  catalogState.sort = sortKey;
  catalogState.page = 1;
  syncFilterButtons();
  syncCatalogUrl();
  renderCatalog();
}

function syncFilterChips() {
  const container = document.getElementById('catalogActiveFilters');
  if (!container) return;

  const chips = [];
  if (catalogState.type) {
    chips.push({
      key: 'type',
      label: TYPE_FILTER_LABELS[catalogState.type] || catalogState.type
    });
  }
  if (catalogState.condition) {
    chips.push({
      key: 'condition',
      label: CONDITIONS[catalogState.condition] || catalogState.condition
    });
  }

  if (chips.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = chips.map(chip => `
    <button type="button" class="catalog-chip" data-clear-filter="${chip.key}">
      ${chip.label} <span aria-hidden="true">✕</span>
    </button>
  `).join('') + `
    <button type="button" class="catalog-chip catalog-chip--reset" data-clear-all>Сбросить всё</button>
  `;

  container.querySelectorAll('[data-clear-filter]').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.clearFilter, ''));
  });
  container.querySelector('[data-clear-all]')?.addEventListener('click', resetCatalogFilters);
}

function resetCatalogFilters() {
  catalogState = { type: '', condition: '', sort: catalogState.sort || 'newest', page: 1 };
  syncFilterButtons();
  syncFilterChips();
  syncCatalogUrl();
  initMobileFilters();
  renderCatalog();
}

function renderSortPills(container) {
  if (!container) return;
  container.innerHTML = SORT_OPTIONS.map(([key, label]) =>
    `<button type="button" class="sort-pill${catalogState.sort === key ? ' active' : ''}" data-sort="${key}">${label}</button>`
  ).join('');
  container.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => applySort(btn.dataset.sort));
  });
}

function initSortPills() {
  renderSortPills(document.getElementById('sortPills'));
  renderSortPills(document.getElementById('mobileSortFilters'));
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
  const sortParam = params.get('sort');
  if (sortParam && SORT_OPTIONS.some(([key]) => key === sortParam)) {
    catalogState.sort = sortParam;
  }

  document.querySelectorAll('.filter-bar [data-filter]').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter, btn.dataset.value));
  });

  document.getElementById('emptyReset')?.addEventListener('click', () => {
    catalogState = { type: '', condition: '', sort: 'newest', page: 1 };
    syncFilterButtons();
    syncFilterChips();
    syncCatalogUrl();
    initMobileFilters();
    initSortPills();
    renderCatalog();
  });

  document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    catalogState.page++;
    renderCatalog(true);
  });

  initSortPills();
  initMobileFilters();
  syncFilterButtons();
  syncFilterChips();
  renderCatalog();
}

function getFilteredProducts() {
  let list = [...PRODUCTS];
  if (catalogState.type) list = list.filter(p => p.type === catalogState.type);
  if (catalogState.condition) list = list.filter(p => p.condition === catalogState.condition);
  return sortProducts(list, catalogState.sort);
}

function renderCatalog(append = false) {
  const grid = document.getElementById('catalogGrid');
  const emptyEl = document.getElementById('catalogEmpty');
  const loadMoreWrapper = document.getElementById('loadMoreWrapper');
  const subtitle = document.getElementById('catalogSubtitle');
  const shownCount = document.getElementById('catalogShownCount');

  const all = getFilteredProducts();
  const total = all.length;
  const shownMax = catalogState.page * PAGE_SIZE;
  const start = append ? (catalogState.page - 1) * PAGE_SIZE : 0;
  const slice = all.slice(start, shownMax);
  const displayed = Math.min(shownMax, total);

  if (subtitle) {
    subtitle.textContent = `${total} ${pluralize(total, 'коляска', 'коляски', 'колясок')}`;
  }

  if (shownCount) {
    shownCount.textContent = total === 0
      ? ''
      : `Показано ${displayed} из ${total}`;
  }

  if (total === 0) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';
    syncFilterChips();
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  const cardsHtml = slice.map((p, i) => buildProductCard(p, append ? i : start + i)).join('');

  if (append) {
    grid.insertAdjacentHTML('beforeend', cardsHtml);
  } else {
    grid.innerHTML = cardsHtml;
  }

  bindAddToCart(grid);
  bindCompareButtons(grid);
  initMobileFilters();
  initSortPills();
  syncFilterChips();

  if (loadMoreWrapper) {
    loadMoreWrapper.style.display = displayed < total ? 'flex' : 'none';
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
    layout.innerHTML = '<p style="padding:4rem 0;text-align:center;color:var(--gray)">Коляска не найдена. <a href="' + pageUrl('catalog.html') + '" style="color:var(--gold)">Вернуться в каталог</a></p>';
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
        <img src="${product.img}" alt="${product.name}" id="mainProductImg" onerror="fixProductImg(this,'${escAttr(product.name)}')">
      </div>
      <div class="product-thumbs">
        ${thumbs.map((src, i) => `
          <button type="button" class="product-thumb${i === 0 ? ' active' : ''}" data-src="${src}" aria-label="Фото ${i + 1}">
            <img src="${src}" alt="" onerror="fixProductImg(this,'${escAttr(product.name)}')">
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
      <div class="product-highlights">
        <span>Проверено</span>
        <span>Без скрытых дефектов</span>
        <span>Бронь в WhatsApp</span>
      </div>
      <p class="product-desc">${product.desc}</p>
      <div class="product-actions">
        <button class="btn btn-primary btn-lg add-to-cart-btn" data-id="${product.id}">В корзину</button>
        <button class="btn btn-ghost btn-lg compare-toggle-btn" data-compare-id="${product.id}">Сравнить</button>
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
    thumb.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      layout.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const mainImg = document.getElementById('mainProductImg');
      if (mainImg) mainImg.src = thumb.dataset.src;
    });
  });

  bindAddToCart(layout);
  bindCompareButtons(layout);

  const related = sortProducts(
    PRODUCTS.filter(p => p.type === product.type && p.id !== product.id),
    'newest'
  ).slice(0, 3);
  if (related.length > 0) {
    const relatedSection = document.getElementById('relatedSection');
    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedSection && relatedGrid) {
      relatedGrid.innerHTML = related.map((p, i) => buildProductCard(p, i)).join('');
      relatedSection.style.display = 'block';
      bindAddToCart(relatedGrid);
      bindCompareButtons(relatedGrid);
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

function bindCompareButtons(container) {
  if (!window.Compare || !container) return;
  window.Compare.bind(container);
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    initHeader();
    initMobileMenu();
    initBottomNav();
    initIndexPage();
    initCatalogPage();
    initProductPage();
  } catch (err) {
    console.error('Ошибка инициализации сайта:', err);
    const grid = document.getElementById('catalogGrid') || document.getElementById('featuredGrid');
    if (grid && !grid.children.length) {
      grid.innerHTML = '<p style="padding:2rem;color:var(--gray);grid-column:1/-1">Не удалось загрузить каталог. Обновите страницу (Ctrl+F5).</p>';
    }
  }
});

window.updateBottomCartCount = updateBottomCartCount;
