const COMPARE_KEY = 'bukolyasochka_compare';
const COMPARE_LIMIT = 4;

const Compare = {
  ids: [],

  init() {
    this.ids = this.readIds();
    this.syncFromUrl();
    this.renderPage();
    this.updateButtons();
  },

  readIds() {
    try {
      const saved = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
      return Array.isArray(saved) ? saved.map(Number).filter(Boolean).slice(0, COMPARE_LIMIT) : [];
    } catch (e) {
      return [];
    }
  },

  save() {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(this.ids));
    this.syncUrl();
    this.renderPage();
    this.updateButtons();
  },

  syncFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('ids');
    if (!raw) return;

    const ids = raw.split(',')
      .map(id => Number(id.trim()))
      .filter(id => PRODUCTS.some(product => product.id === id))
      .slice(0, COMPARE_LIMIT);

    if (ids.length) {
      this.ids = ids;
      localStorage.setItem(COMPARE_KEY, JSON.stringify(this.ids));
    }
  },

  syncUrl() {
    if (document.body.dataset.page !== 'compare') return;
    const query = this.ids.length ? '?ids=' + this.ids.join(',') : '';
    history.replaceState(null, '', window.location.pathname + query);
  },

  has(id) {
    return this.ids.includes(Number(id));
  },

  toggle(id) {
    id = Number(id);
    if (!PRODUCTS.some(product => product.id === id)) return;

    if (this.has(id)) {
      this.ids = this.ids.filter(itemId => itemId !== id);
    } else {
      if (this.ids.length >= COMPARE_LIMIT) this.ids.shift();
      this.ids.push(id);
    }

    this.save();
  },

  bind(container) {
    container.querySelectorAll('[data-compare-id]').forEach(button => {
      if (button.dataset.compareBound) return;
      button.dataset.compareBound = '1';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        this.toggle(button.dataset.compareId);
      });
    });
    this.updateButtons(container);
  },

  updateButtons(scope) {
    const root = scope || document;
    root.querySelectorAll('[data-compare-id]').forEach(button => {
      const active = this.has(button.dataset.compareId);
      button.classList.toggle('is-active', active);
      button.textContent = active ? 'В сравнении' : 'Сравнить';
    });

    document.querySelectorAll('[data-compare-count]').forEach(el => {
      el.textContent = this.ids.length;
      el.style.display = this.ids.length ? 'inline-flex' : 'none';
    });
  },

  products() {
    return this.ids
      .map(id => PRODUCTS.find(product => product.id === id))
      .filter(Boolean);
  },

  getSummary(products) {
    if (!products.length) {
      return 'Добавьте 2-4 коляски из каталога, и помощник кратко сравнит их по цене, состоянию и сценарию использования.';
    }

    const cheapest = products.reduce((best, product) => product.price < best.price ? product : best, products[0]);
    const newest = products.reduce((best, product) => product.year > best.year ? product : best, products[0]);
    const bestCondition = products.find(product => product.condition === 'likenew') ||
      products.find(product => product.condition === 'excellent') ||
      products[0];

    return [
      `Самая доступная модель: ${cheapest.name} за ${formatPrice(cheapest.price)}.`,
      `Самая свежая по году: ${newest.name}, ${newest.year}.`,
      `Лучшее состояние в подборке: ${bestCondition.name} (${getConditionLabel(bestCondition.condition)}).`,
      `Если важна универсальность, смотрите трансформеры; для города и поездок удобнее прогулочные; для двух детей выбирайте модели "Для двойни".`
    ].join(' ');
  },

  renderPage() {
    const grid = document.getElementById('compareProducts');
    const table = document.getElementById('compareTable');
    const empty = document.getElementById('compareEmpty');
    const summary = document.getElementById('compareAiSummary');
    if (!grid || !table) return;

    const products = this.products();
    if (summary) summary.textContent = this.getSummary(products);

    if (!products.length) {
      grid.innerHTML = '';
      table.innerHTML = '';
      if (empty) empty.style.display = 'grid';
      return;
    }

    if (empty) empty.style.display = 'none';
    grid.innerHTML = products.map(product => `
      <article class="compare-picked-card">
        <img src="${product.img}" alt="${product.name}" onerror="fixProductImg(this,'${escAttr(product.name)}')">
        <div>
          <p>${product.brand}</p>
          <h3>${product.name}</h3>
          <strong>${formatPrice(product.price)}</strong>
        </div>
        <button type="button" class="compare-remove" data-remove-compare="${product.id}" aria-label="Убрать из сравнения">×</button>
      </article>
    `).join('');

    const rows = [
      ['Цена', product => formatPrice(product.price)],
      ['Цена новой', product => product.newPrice ? formatPrice(product.newPrice) : '—'],
      ['Экономия', product => product.newPrice ? Math.round((1 - product.price / product.newPrice) * 100) + '%' : '—'],
      ['Бренд', product => product.brand],
      ['Тип', product => getTypeLabel(product.type)],
      ['Состояние', product => getConditionLabel(product.condition)],
      ['Год', product => product.year],
      ['Цвет', product => product.color],
      ['Описание', product => product.desc]
    ];

    table.innerHTML = `
      <div class="compare-table-head" style="--cols:${products.length}">
        <span>Параметр</span>
        ${products.map(product => `<a href="${pageUrl('product.html?id=' + product.id)}">${product.name}</a>`).join('')}
      </div>
      ${rows.map(([label, getter]) => `
        <div class="compare-row" style="--cols:${products.length}">
          <span class="compare-param">${label}</span>
          ${products.map(product => `<span>${getter(product)}</span>`).join('')}
        </div>
      `).join('')}
    `;

    grid.querySelectorAll('[data-remove-compare]').forEach(button => {
      button.addEventListener('click', () => this.toggle(button.dataset.removeCompare));
    });
  }
};

window.Compare = Compare;
document.addEventListener('DOMContentLoaded', () => Compare.init());
