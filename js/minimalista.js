(function () {
  const base = window.SITE_BASE || '/bu-kolyasochka/';

  function minUrl(path) {
    return base + 'minimalista/' + String(path).replace(/^\//, '');
  }

  function swatchColor(name) {
    const map = {
      'Чёрный': '#1a1a1a',
      'Серый': '#9a9a9a',
      'Синий': '#4a6a8a',
      'Бежевый': '#c4b5a0',
      'Красный': '#8b3a3a',
      'Зелёный': '#5a7a5a',
      'Белый': '#f0f0f0',
    };
    return map[name] || '#b8b8b8';
  }

  function minPlaceholder(name) {
    const safe = String(name).replace(/[<>&"']/g, '').slice(0, 36);
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">' +
      '<rect fill="#f2f2f2" width="800" height="800"/>' +
      '<text x="400" y="400" fill="#999" font-family="sans-serif" font-size="18" text-anchor="middle" dominant-baseline="middle">' +
      safe +
      '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  window.minFixImg = function (imgEl, name) {
    if (!imgEl || imgEl.dataset.fallback) return;
    imgEl.dataset.fallback = '1';
    imgEl.src = minPlaceholder(name || 'Коляска');
  };

  function badgeText(p) {
    const d = discount(p);
    if (d >= 40) return { text: '−' + d + '%', cls: 'min-card-badge' };
    if (p.condition === 'likenew') return { text: 'Новинка', cls: 'min-card-badge' };
    if (d > 0) return { text: 'Sale', cls: 'min-card-badge' };
    return null;
  }

  function productCardMin(p, index) {
    const d = discount(p);
    const badge = badgeText(p);
    const typeLabel = getTypeLabel(p.type).toUpperCase();
    return (
      '<article class="min-card" data-id="' +
      p.id +
      '">' +
      '<a href="' +
      minUrl('product.html?id=' + p.id) +
      '" class="min-card-link">' +
      '<div class="min-card-media">' +
      '<span class="min-card-label">' +
      escAttr(p.brand) +
      ' / ' +
      typeLabel +
      '</span>' +
      (badge ? '<span class="' + badge.cls + '">' + badge.text + '</span>' : '') +
      '<img src="' +
      p.img +
      '" alt="' +
      escAttr(p.name) +
      '" loading="lazy" onerror="minFixImg(this,\'' +
      escAttr(p.name) +
      "')\">" +
      '<button type="button" class="min-quick" data-qv="' +
      p.id +
      '" aria-label="Быстрый просмотр">' +
      '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
      '</button></div>' +
      '<h3 class="min-card-title">' +
      p.name +
      '</h3>' +
      '<p class="min-card-price">' +
      formatPrice(p.price) +
      (p.newPrice ? ' <s>' + formatPrice(p.newPrice) + '</s>' : '') +
      '</p>' +
      '<div class="min-swatches" aria-hidden="true">' +
      '<span class="min-swatch is-active" style="background:' +
      swatchColor(p.color) +
      '"></span>' +
      '<span class="min-swatch" style="background:#e8e4dc"></span>' +
      '<span class="min-swatch" style="background:#d4d4d4"></span>' +
      '</div></a>' +
      '<div class="min-card-actions">' +
      '<button type="button" class="min-add add-to-cart-btn" data-id="' +
      p.id +
      '">В корзину</button>' +
      '</div></article>'
    );
  }

  function bindQuickView(root) {
    root.querySelectorAll('[data-qv]').forEach((btn) => {
      if (btn.dataset.qvBound) return;
      btn.dataset.qvBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(Number(btn.dataset.qv));
      });
    });
  }

  function ensureQuickView() {
    if (document.getElementById('minQv')) return;
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div class="min-qv" id="minQv" aria-hidden="true">' +
        '<div class="min-qv-backdrop" data-qv-close></div>' +
        '<div class="min-qv-panel" role="dialog" aria-label="Быстрый просмотр">' +
        '<button type="button" class="min-qv-close" data-qv-close aria-label="Закрыть">×</button>' +
        '<div class="min-qv-img" id="minQvImg"></div>' +
        '<div class="min-qv-body" id="minQvBody"></div></div></div>'
    );
    document.querySelectorAll('[data-qv-close]').forEach((el) => {
      el.addEventListener('click', closeQuickView);
    });
  }

  function openQuickView(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    ensureQuickView();
    const d = discount(p);
    document.getElementById('minQvImg').innerHTML =
      '<img src="' +
      p.img +
      '" alt="' +
      escAttr(p.name) +
      '" onerror="minFixImg(this,\'' +
      escAttr(p.name) +
      "')\">";
    document.getElementById('minQvBody').innerHTML =
      '<p class="min-prod-brand">' +
      escAttr(p.brand) +
      '</p>' +
      '<h2 class="min-prod-title">' +
      p.name +
      '</h2>' +
      '<p class="min-prod-price">' +
      formatPrice(p.price) +
      (p.newPrice ? ' <s>' + formatPrice(p.newPrice) + '</s>' : '') +
      '</p>' +
      (d ? '<p class="min-prod-install">Экономия <b>−' + d + '%</b> от цены новой</p>' : '') +
      '<div class="min-prod-cta">' +
      '<button type="button" class="min-btn min-btn--dark min-btn--block add-to-cart-btn" data-id="' +
      p.id +
      '">В корзину</button>' +
      '<a class="min-btn min-btn--outline min-btn--block" href="' +
      minUrl('product.html?id=' + p.id) +
      '">Подробнее</a></div>';
    bindAddToCart(document.getElementById('minQv'));
    const qv = document.getElementById('minQv');
    qv.classList.add('is-open');
    qv.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const qv = document.getElementById('minQv');
    if (!qv) return;
    qv.classList.remove('is-open');
    qv.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initHeader() {
    const header = document.querySelector('.min-header');
    if (!header) return;
    const syncAnnounceHeight = () => {
      const announce = document.querySelector('.min-announce');
      if (announce) {
        document.documentElement.style.setProperty('--announce-h', announce.offsetHeight + 'px');
      }
    };
    syncAnnounceHeight();
    window.addEventListener('resize', syncAnnounceHeight, { passive: true });
    const onHero = header.classList.contains('min-header--hero');
    const onScroll = () => {
      if (!onHero) return;
      header.classList.toggle('is-solid', window.scrollY > 48);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = document.getElementById('minBurger');
    const drawer = document.getElementById('minDrawer');
    const overlay = document.getElementById('minOverlay');
    const closeBtn = document.getElementById('minDrawerClose');

    const closeMenu = () => {
      burger?.setAttribute('aria-expanded', 'false');
      drawer?.classList.remove('is-open');
      overlay?.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      burger?.setAttribute('aria-expanded', 'true');
      drawer?.classList.add('is-open');
      overlay?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    burger?.addEventListener('click', () => {
      if (drawer?.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    overlay?.addEventListener('click', closeMenu);
    closeBtn?.addEventListener('click', closeMenu);
    drawer?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  }

  function initHeroSlider() {
    const track = document.getElementById('minHeroTrack');
    if (!track) return;
    const slides = track.children.length;
    let idx = 0;
    const dots = document.querySelectorAll('.min-hero-dot');

    const go = (i) => {
      idx = (i + slides) % slides;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.forEach((d, n) => d.classList.toggle('is-active', n === idx));
    };

    dots.forEach((d, n) => d.addEventListener('click', () => go(n)));
    let timer = setInterval(() => go(idx + 1), 6000);
    track.closest('.min-hero-slider')?.addEventListener('mouseenter', () => clearInterval(timer));
    track.closest('.min-hero-slider')?.addEventListener('mouseleave', () => {
      timer = setInterval(() => go(idx + 1), 6000);
    });
  }

  function patchCartLinks() {
    const empty = document.getElementById('cartEmpty');
    if (empty) {
      const link = empty.querySelector('a');
      if (link) link.href = minUrl('catalog.html');
    }
  }

  function initHome() {
    const grid = document.getElementById('minFeatured');
    const bestsellers = document.getElementById('minBestsellers');
    if (!grid && !bestsellers) return;

    const newest = [...PRODUCTS].sort((a, b) => b.id - a.id);
    if (grid) {
      grid.innerHTML = newest.slice(0, 4).map((p, i) => productCardMin(p, i)).join('');
      bindAddToCart(grid);
      bindQuickView(grid);
    }
    if (bestsellers) {
      bestsellers.innerHTML = newest.slice(0, 8).map((p, i) => productCardMin(p, i)).join('');
      bindAddToCart(bestsellers);
      bindQuickView(bestsellers);
    }
  }

  function initCatalog() {
    const grid = document.getElementById('minCatalogGrid');
    if (!grid) return;

    let filtered = [...PRODUCTS];
    let page = 1;
    const PER = 12;

    const params = new URLSearchParams(location.search);
    const typeFilter = params.get('type');
    if (typeFilter) filtered = filtered.filter((p) => p.type === typeFilter);

    function render() {
      const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
      if (page > totalPages) page = totalPages;
      const start = (page - 1) * PER;
      const slice = filtered.slice(start, start + PER);
      grid.innerHTML =
        slice.map((p, i) => productCardMin(p, i)).join('') ||
        '<div class="min-empty"><p>Ничего не найдено</p></div>';
      const meta = document.getElementById('minCatalogCount');
      if (meta) meta.textContent = countLabel(filtered.length);
      bindAddToCart(grid);
      bindQuickView(grid);
      renderPagination(totalPages);
      const info = document.getElementById('minPageInfo');
      if (info && filtered.length) {
        info.textContent =
          'Показано ' + (start + 1) + '–' + Math.min(start + PER, filtered.length) + ' из ' + filtered.length;
      }
    }

    function renderPagination(totalPages) {
      const nav = document.getElementById('minPagination');
      if (!nav) return;
      nav.innerHTML = '';
      const prev = document.createElement('button');
      prev.className = 'min-page-btn';
      prev.textContent = '‹';
      prev.disabled = page === 1;
      prev.onclick = () => {
        page--;
        render();
        scrollTo({ top: 0, behavior: 'smooth' });
      };
      nav.appendChild(prev);
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
          const b = document.createElement('button');
          b.className = 'min-page-btn' + (i === page ? ' is-active' : '');
          b.textContent = i;
          b.onclick = () => {
            page = i;
            render();
            scrollTo({ top: 0, behavior: 'smooth' });
          };
          nav.appendChild(b);
        }
      }
      const next = document.createElement('button');
      next.className = 'min-page-btn';
      next.textContent = '›';
      next.disabled = page === totalPages;
      next.onclick = () => {
        page++;
        render();
        scrollTo({ top: 0, behavior: 'smooth' });
      };
      nav.appendChild(next);
    }

    document.querySelectorAll('.min-sort-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.min-sort-btn').forEach((b) => b.classList.remove('is-on'));
        btn.classList.add('is-on');
        const t = btn.textContent.trim();
        filtered.sort((a, b) =>
          t.includes('Дешевле')
            ? a.price - b.price
            : t.includes('Дороже')
              ? b.price - a.price
              : t.includes('Скидка')
                ? discount(b) - discount(a)
                : b.year - a.year || b.id - a.id
        );
        page = 1;
        render();
      });
    });

    const title = document.getElementById('minCatalogTitle');
    if (title && typeFilter) title.textContent = getTypeLabel(typeFilter);

    render();
  }

  function initProduct() {
    const mount = document.getElementById('minProductMount');
    if (!mount) return;

    const id = Number(new URLSearchParams(location.search).get('id')) || 1;
    const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
    document.title = product.name + ' — КрохаКруг';
    const d = discount(product);
    const waText = encodeURIComponent(
      'Здравствуйте! Интересует ' + product.name + ' за ' + formatPrice(product.price)
    );
    const related = PRODUCTS.filter((p) => p.type === product.type && p.id !== product.id)
      .slice(0, 4)
      .map((p, i) => productCardMin(p, i))
      .join('');

    const thumbs = [product.img, product.img, product.img, product.img];

    mount.innerHTML =
      '<div class="min-breadcrumb"><a href="' +
      minUrl('index.html') +
      '">Главная</a><s>/</s><a href="' +
      minUrl('catalog.html') +
      '">Каталог</a><s>/</s><span>' +
      product.name +
      '</span></div>' +
      '<div class="min-product">' +
      '<div class="min-gallery">' +
      '<div class="min-gallery-main" id="minGalleryMain">' +
      '<img src="' +
      product.img +
      '" alt="' +
      escAttr(product.name) +
      '" id="minGalleryImg" onerror="minFixImg(this,\'' +
      escAttr(product.name) +
      "')\">" +
      '<button type="button" class="min-gallery-nav min-gallery-nav--prev" id="minGalPrev" aria-label="Назад">‹</button>' +
      '<button type="button" class="min-gallery-nav min-gallery-nav--next" id="minGalNext" aria-label="Вперёд">›</button></div>' +
      '<div class="min-gallery-thumbs" id="minThumbs">' +
      thumbs
        .map(
          (src, i) =>
            '<button type="button" class="min-thumb' +
            (i === 0 ? ' is-active' : '') +
            '" data-src="' +
            src +
            '"><img src="' +
            src +
            '" alt="" onerror="minFixImg(this,\'\')"></button>'
        )
        .join('') +
      '</div></div>' +
      '<div class="min-prod-info">' +
      '<div class="min-prod-badges">' +
      '<span class="min-badge">' +
      getConditionLabel(product.condition) +
      '</span>' +
      (d ? '<span class="min-badge min-badge--sale">−' + d + '%</span>' : '') +
      '</div>' +
      '<p class="min-prod-brand">' +
      product.brand +
      '</p>' +
      '<h1 class="min-prod-title">' +
      product.name +
      '</h1>' +
      '<p class="min-prod-price">' +
      formatPrice(product.price) +
      (product.newPrice ? ' <s>' + formatPrice(product.newPrice) + '</s>' : '') +
      '</p>' +
      '<p class="min-prod-install">или <b>' +
      installment(product.price) +
      ' ₽/мес</b> в рассрочку на 12 месяцев</p>' +
      '<p class="min-prod-meta">' +
      getTypeLabel(product.type) +
      ' · ' +
      product.year +
      ' · ' +
      product.color +
      '</p>' +
      '<div class="min-prod-cta">' +
      '<button type="button" class="min-btn min-btn--dark min-btn--block add-to-cart-btn" data-id="' +
      product.id +
      '">В корзину</button>' +
      '<a class="min-btn min-btn--block min-btn--wa" href="https://wa.me/' +
      window.WHATSAPP_NUMBER +
      '?text=' +
      waText +
      '" target="_blank" rel="noopener">WhatsApp</a></div>' +
      '<p class="min-prod-desc">' +
      product.desc +
      '</p></div></div>' +
      '<section class="min-section" style="padding-top:0"><div class="min-section-head"><h2>Похожие модели</h2><a class="min-link" href="' +
      minUrl('catalog.html') +
      '">Весь каталог</a></div>' +
      '<div class="min-products" id="minRelated">' +
      related +
      '</div></section>';

    bindAddToCart(mount);
    bindQuickView(document.getElementById('minRelated'));

    let galIdx = 0;
    const galImg = document.getElementById('minGalleryImg');
    const thumbBtns = mount.querySelectorAll('.min-thumb');
    const setGal = (i) => {
      galIdx = i;
      galImg.src = thumbs[i];
      thumbBtns.forEach((t, n) => t.classList.toggle('is-active', n === i));
    };
    thumbBtns.forEach((t, n) => t.addEventListener('click', () => setGal(n)));
    document.getElementById('minGalPrev')?.addEventListener('click', () =>
      setGal((galIdx - 1 + thumbs.length) % thumbs.length)
    );
    document.getElementById('minGalNext')?.addEventListener('click', () =>
      setGal((galIdx + 1) % thumbs.length)
    );

    const galMain = document.getElementById('minGalleryMain');
    if (galMain) {
      let touchX = 0;
      galMain.addEventListener(
        'touchstart',
        (e) => {
          touchX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );
      galMain.addEventListener(
        'touchend',
        (e) => {
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) < 40) return;
          if (dx < 0) setGal((galIdx + 1) % thumbs.length);
          else setGal((galIdx - 1 + thumbs.length) % thumbs.length);
        },
        { passive: true }
      );
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHeroSlider();
    initHome();
    initCatalog();
    initProduct();
    patchCartLinks();
    document.querySelectorAll('[data-cart-open]').forEach((btn) => {
      btn.addEventListener('click', () => Cart.open());
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeQuickView();
    });
  });
})();
