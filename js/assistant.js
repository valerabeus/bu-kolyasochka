const CatalogAssistant = {
  isOpen: false,

  init() {
    if (!Array.isArray(window.PRODUCTS) && typeof PRODUCTS === 'undefined') return;
    this.createWidget();
    this.bindEvents();
    this.say('Здравствуйте! Напишите возраст ребенка, бюджет, город/дороги и что важно: компактность, люлька, двойня или активные прогулки. Покажу подходящие варианты из текущего каталога.');
  },

  catalog() {
    return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
  },

  createWidget() {
    if (document.getElementById('assistantWidget')) return;
    const wrap = document.createElement('section');
    wrap.className = 'assistant-widget';
    wrap.id = 'assistantWidget';
    wrap.setAttribute('aria-label', 'Подбор коляски по каталогу');
    wrap.innerHTML = `
      <button type="button" class="assistant-fab" id="assistantFab" aria-expanded="false">
        <span>Каталог</span>
        <strong>Подбор</strong>
      </button>
      <div class="assistant-panel" id="assistantPanel" aria-live="polite">
        <div class="assistant-head">
          <div>
            <p>Помощь с выбором</p>
            <strong>Ищем только среди товаров сайта</strong>
          </div>
          <button type="button" class="assistant-close" id="assistantClose" aria-label="Закрыть">×</button>
        </div>
        <div class="assistant-quick">
          <button type="button" data-assistant-prompt="Бюджет до 30000, нужна компактная прогулочная коляска для города">До 30 000</button>
          <button type="button" data-assistant-prompt="Нужна коляска для двойни в хорошем состоянии">Для двойни</button>
          <button type="button" data-assistant-prompt="Хочу почти новую премиальную коляску, бюджет до 75000">Премиум</button>
        </div>
        <div class="assistant-messages" id="assistantMessages"></div>
        <form class="assistant-form" id="assistantForm">
          <input id="assistantInput" type="text" autocomplete="off" placeholder="Например: до 40 000, для города, ребенок 8 месяцев">
          <button type="submit">Найти</button>
        </form>
      </div>
    `;
    document.body.appendChild(wrap);
  },

  bindEvents() {
    document.getElementById('assistantFab')?.addEventListener('click', () => this.toggle());
    document.getElementById('assistantClose')?.addEventListener('click', () => this.close());
    document.getElementById('assistantForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('assistantInput');
      const value = input.value.trim();
      if (!value) return;
      input.value = '';
      this.handle(value);
    });
    document.querySelectorAll('[data-assistant-prompt]').forEach(button => {
      button.addEventListener('click', () => this.handle(button.dataset.assistantPrompt));
    });
  },

  open() {
    this.isOpen = true;
    document.getElementById('assistantWidget')?.classList.add('active');
    document.getElementById('assistantFab')?.setAttribute('aria-expanded', 'true');
    setTimeout(() => document.getElementById('assistantInput')?.focus(), 80);
  },

  close() {
    this.isOpen = false;
    document.getElementById('assistantWidget')?.classList.remove('active');
    document.getElementById('assistantFab')?.setAttribute('aria-expanded', 'false');
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  say(text, products) {
    const box = document.getElementById('assistantMessages');
    if (!box) return;
    const message = document.createElement('div');
    message.className = 'assistant-message assistant-message--bot';
    message.innerHTML = `<p>${text}</p>`;
    if (products && products.length) {
      message.innerHTML += `
        <div class="assistant-results">
          ${products.map(product => `
            <a href="${pageUrl('product.html?id=' + product.id)}" class="assistant-result">
              <img src="${product.img}" alt="${product.name}" onerror="fixProductImg(this,'${escAttr(product.name)}')">
              <span>
                <strong>${product.name}</strong>
                <small>${getTypeLabel(product.type)} · ${getConditionLabel(product.condition)} · ${formatPrice(product.price)}</small>
              </span>
            </a>
          `).join('')}
        </div>
      `;
    }
    box.appendChild(message);
    box.scrollTop = box.scrollHeight;
  },

  user(text) {
    const box = document.getElementById('assistantMessages');
    if (!box) return;
    const message = document.createElement('div');
    message.className = 'assistant-message assistant-message--user';
    message.textContent = text;
    box.appendChild(message);
    box.scrollTop = box.scrollHeight;
  },

  handle(text) {
    this.open();
    this.user(text);
    const matches = this.search(text);
    const reply = this.buildReply(text, matches);
    this.say(reply, matches.slice(0, 3));
  },

  search(text) {
    const query = text.toLowerCase();
    const budget = this.extractBudget(query);
    const typeHints = [
      ['twin', ['двойн', 'погод', 'двоих', 'близнец']],
      ['sport', ['бег', 'лес', 'парк', 'внедорож', 'актив', 'снег', 'плох']],
      ['transformer', ['люльк', 'новорож', '2 в 1', 'универс', 'трансформ']],
      ['stroller', ['прогул', 'компакт', 'самолет', 'путеше', 'город', 'легк']]
    ];
    const conditionHints = [
      ['likenew', ['как новая', 'почти нов', 'идеальн']],
      ['excellent', ['отлич', 'премиум', 'свеже']]
    ];

    return this.catalog()
      .map(product => {
        let score = 0;
        const haystack = [product.name, product.brand, product.color, product.desc, getTypeLabel(product.type), getConditionLabel(product.condition)].join(' ').toLowerCase();

        query.split(/\s+/).filter(Boolean).forEach(word => {
          if (word.length > 2 && haystack.includes(word)) score += 2;
        });

        typeHints.forEach(([type, words]) => {
          if (words.some(word => query.includes(word)) && product.type === type) score += 9;
        });
        conditionHints.forEach(([condition, words]) => {
          if (words.some(word => query.includes(word)) && product.condition === condition) score += 5;
        });

        if (budget) {
          if (product.price <= budget) score += 8;
          else score -= Math.min(8, Math.ceil((product.price - budget) / 10000));
        }
        if (query.includes('дешев') || query.includes('эконом')) score += Math.max(0, 6 - Math.floor(product.price / 15000));
        if (query.includes('премиум') || query.includes('топ')) score += product.newPrice && product.newPrice > 90000 ? 5 : 0;

        return { product, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
      .map(item => item.product)
      .slice(0, 5);
  },

  extractBudget(query) {
    const direct = query.match(/(?:до|бюджет|за)\s*(\d{2,3})(?:\s?000|к|тыс)?/);
    if (!direct) return null;
    const value = Number(direct[1]);
    if (!value) return null;
    return value < 1000 ? value * 1000 : value;
  },

  buildReply(text, matches) {
    if (!matches.length) {
      return 'По текущему каталогу точного совпадения не нашлось. Попробуйте указать бюджет, тип коляски и сценарий: город, путешествия, двойня, плохие дороги или новорожденный.';
    }

    const best = matches[0];
    const reasons = [
      `${best.name} выглядит самым близким вариантом: ${getTypeLabel(best.type).toLowerCase()}, состояние "${getConditionLabel(best.condition).toLowerCase()}", цена ${formatPrice(best.price)}.`,
      `Список собран только из товаров текущего каталога и отсортирован по совпадению с запросом.`
    ];

    if (matches.length > 1) {
      reasons.push(`Для сравнения также посмотрите ${matches.slice(1, 3).map(product => product.name).join(' и ')}.`);
    }

    return reasons.join(' ');
  }
};

window.CatalogAssistant = CatalogAssistant;
document.addEventListener('DOMContentLoaded', () => CatalogAssistant.init());
