// Cart state stored in localStorage
const CART_KEY = 'bukolyasochka_cart';
const WHATSAPP_NUMBER = '79000000000'; // Replace with real number

const Cart = {
  items: [],

  init() {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      try { this.items = JSON.parse(saved); } catch (e) { this.items = []; }
    }
    this.render();
    this.bindEvents();
  },

  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
  },

  add(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const existing = this.items.find(i => i.id === productId);
    if (!existing) {
      this.items.push({ id: productId, name: product.name, price: product.price, img: product.img });
    }
    this.save();
    this.render();
    this.open();
  },

  remove(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.save();
    this.render();
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price, 0);
  },

  render() {
    const countEl = document.getElementById('cartCount');
    const itemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');

    if (countEl) {
      if (this.items.length > 0) {
        countEl.textContent = this.items.length;
        countEl.style.display = 'flex';
      } else {
        countEl.style.display = 'none';
      }
    }
    if (typeof updateBottomCartCount === 'function') {
      updateBottomCartCount(this.items.length);
    }

    if (!itemsEl) return;

    if (this.items.length === 0) {
      itemsEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
    } else {
      if (emptyEl) emptyEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'block';

      itemsEl.innerHTML = this.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img class="cart-item-img" src="${item.img}" alt="${item.name}" loading="lazy">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${formatPrice(item.price)}</p>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Удалить">✕</button>
        </div>
      `).join('');

      itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => this.remove(Number(btn.dataset.id)));
      });
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
    if (this.items.length === 0) return;
    const lines = this.items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join('\n');
    const total = formatPrice(this.total());
    const text = encodeURIComponent(`Здравствуйте! Хочу купить:\n${lines}\nИтого: ${total}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
  },

  bindEvents() {
    document.getElementById('cartToggle')?.addEventListener('click', () => this.open());
    document.getElementById('cartClose')?.addEventListener('click', () => this.close());
    document.getElementById('cartOverlay')?.addEventListener('click', () => this.close());
    document.getElementById('checkoutBtn')?.addEventListener('click', () => this.checkout());
  }
};

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

document.addEventListener('DOMContentLoaded', () => Cart.init());
