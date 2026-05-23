const WHATSAPP_NUMBER = '79000000000'; // Replace with real number
const PAGE_SIZE = 12;

// ─── Utilities ──────────────────────────────────────────────────────────────

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

function getConditionLabel(c) { return CONDITIONS[c] || c; }
function getTypeLabel(t) { return TYPES[t] || t; }

function getParams() {
  return new URLSearchParams(window.location.search);
}

function buildProductCard(product) {
  const discount = product.newPrice
    ? Math.round((1 - product.price / product.newPrice) * 100)
    : null;

  return `
    <article class="product-card" data-id="${product.id}">
      <a href="product.html?id=${product.id}" class="product-card-link">
        <div class="product-card-img-wrap">
          <img src="${getProductImg(product)}" alt="${product.name}" class="product-card-img" loading="lazy">
          <div class="product-card-overlay">
            <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">В корзину</button>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Здравствуйте! Интересует: ' + product.name + ' за ' + formatPrice(product.price))}"
               class="btn btn-ghost btn-sm" target="_blank" rel="noopener">WhatsApp</a>
          </div>
          ${discount ? `<span class="product-card-badge">−${discount}%</span>` : ''}
          <span class="product-card-condition">${getConditionLabel(product.condition)}</span>
        </div>
        <div class="product-card-info">
          <p class="product-card-brand">${product.brand}</p>
          <h3 class="product-card-name">${product.name}</h3>
          <div class="product-card-prices">
            <span class="product-card-price">${formatPrice(product.price)}</span>
            ${product.newPrice ? `<span class="product-card-old">${formatPrice(product.newPrice)}</span>` : ''}
          </div>
        </div>
      </a>
    </article>
  `;
}

// ─── Page Loader ────────────────────────────────────────────────────────────

function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 400);
  });
}

// ─── Header ─────────────────────────────────────────────────────────────────

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ─── Mobile Menu ────────────────────────────────────────────────────────────

function initMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const burger = document.getElementById('burgerBtn');
  const close = document.getElementById('mobileMenuClose');

  if (!menu) return;

  const open = () => {
    menu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  burger?.addEventListener('click', open);
  close?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  menu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ─── Index Page ─────────────────────────────────────────────────────────────

function initIndexPage() {
  if (!document.getElementById('featuredGrid')) return;

  // Category counts
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

  // Featured: latest 8 products
  const featured = [...PRODUCTS].slice(0, 8);
  const grid = document.getElementById('featuredGrid');
  grid.innerHTML = featured.map(buildProductCard).join('');
  bindAddToCart(grid);
}

function pluralize(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

// ─── Catalog Page ───────────────────────────────────────────────────────────

let catalogState = {
  type: '',
  condition: '',
  sort: 'default',
  page: 1
};

function initCatalogPage() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  // Read URL params
  const params = getParams();
  if (params.get('type')) catalogState.type = params.get('type');
  if (params.get('condition')) catalogState.condition = params.get('condition');

  // Activate matching filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    if (catalogState[filter] === value) {
      btn.closest('.filter-group').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });

  // Filter events
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btn.closest('.filter-group').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      catalogState[filter] = btn.dataset.value;
      catalogState.page = 1;
      renderCatalog();
    });
  });

  // Sort events
  document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      catalogState.sort = btn.dataset.sort;
      catalogState.page = 1;
      renderCatalog();
    });
  });

  // Reset
  const resetFn = () => {
    catalogState = { type: '', condition: '', sort: 'default', page: 1 };
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      if (b.dataset.value === '' || b.dataset.sort === 'default') b.classList.add('active');
    });
    renderCatalog();
  };
  document.getElementById('filterReset')?.addEventListener('click', resetFn);
  document.getElementById('emptyReset')?.addEventListener('click', resetFn);

  // Load more
  document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    catalogState.page++;
    renderCatalog(true);
  });

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

  if (subtitle) subtitle.textContent = `${total} ${pluralize(total, 'коляска', 'коляски', 'колясок')}`;

  if (total === 0) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
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

  if (loadMoreWrapper) {
    loadMoreWrapper.style.display = shown < total ? 'flex' : 'none';
  }
}

// ─── Product Page ───────────────────────────────────────────────────────────

function initProductPage() {
  const layout = document.getElementById('productLayout');
  if (!layout) return;

  const id = Number(getParams().get('id'));
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    layout.innerHTML = '<p style="padding:4rem 0;text-align:center;color:var(--gray)">Коляска не найдена. <a href="catalog.html" style="color:var(--gold)">Вернуться в каталог</a></p>';
    return;
  }

  // Update page title and breadcrumb
  document.title = `${product.name} — Б/У Колясочка`;
  const breadEl = document.getElementById('breadcrumbCurrent');
  if (breadEl) breadEl.textContent = product.name;

  const waText = encodeURIComponent(`Здравствуйте! Интересует: ${product.name} за ${formatPrice(product.price)}`);
  const discount = product.newPrice ? Math.round((1 - product.price / product.newPrice) * 100) : null;

  const baseIdx = (product.id - 1) % STROLLER_PHOTOS.length;
  const thumbPhotos = [0, 1, 2, 3].map(i => STROLLER_PHOTOS[(baseIdx + i) % STROLLER_PHOTOS.length]);

  layout.innerHTML = `
    <div class="product-gallery">
      <div class="product-main-img">
        <img src="${thumbPhotos[0]}" alt="${product.name}" id="mainProductImg">
      </div>
      <div class="product-thumbs">
        ${thumbPhotos.map((src, i) => `
          <div class="product-thumb ${i === 0 ? 'active' : ''}" data-src="${src}">
            <img src="${src}" alt="${product.name} фото ${i + 1}" loading="lazy">
          </div>
        `).join('')}
      </div>
    </div>
    <div class="product-details">
      <div class="product-brand">${product.brand}</div>
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
        <button class="btn btn-primary btn-lg add-to-cart-btn" data-id="${product.id}" style="flex:1">В корзину</button>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waText}" class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener" style="flex:1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          Купить в WhatsApp
        </a>
      </div>

      <div class="product-guarantees">
        <div class="guarantee-item">
          <span class="guarantee-icon">✓</span>
          <span>Проверено перед продажей</span>
        </div>
        <div class="guarantee-item">
          <span class="guarantee-icon">✓</span>
          <span>Честное описание состояния</span>
        </div>
        <div class="guarantee-item">
          <span class="guarantee-icon">✓</span>
          <span>Быстрый ответ в WhatsApp</span>
        </div>
      </div>
    </div>
  `;

  bindAddToCart(layout);

  // Thumbnail gallery switching
  layout.querySelectorAll('.product-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      layout.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const mainImg = document.getElementById('mainProductImg');
      if (mainImg) mainImg.src = thumb.dataset.src;
    });
  });

  // Related products (same type, different id)
  const related = PRODUCTS.filter(p => p.type === product.type && p.id !== product.id).slice(0, 4);
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

// ─── Add to Cart binding ─────────────────────────────────────────────────────

function bindAddToCart(container) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      Cart.add(Number(btn.dataset.id));
    });
  });
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initMobileMenu();
  initIndexPage();
  initCatalogPage();
  initProductPage();
});
