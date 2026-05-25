const CART_KEY = 'bukolyasochka_cart';
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
      document.body.insertAdjacentHTML('beforeend', `<div class="cart-overlay" id="cartOverlay"></div><aside class="cart-drawer" id="cartDrawer" aria-label="Корзина"><div class="cart-drawer-head"><strong>Корзина</strong><button id="cartClose" aria-label="Закрыть">×</button></div><div class="cart-empty" id="cartEmpty">Корзина пуста<br><a href="${pageUrl('catalog.html')}">Перейти в каталог</a></div><div class="cart-items" id="cartItems"></div><div class="cart-drawer-footer" id="cartFooter"><div class="cart-total"><span>Итого</span><strong id="cartTotal">0 ₽</strong></div><button id="checkoutBtn">Оформить через WhatsApp</button></div></aside>`);
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
      itemsEl.innerHTML = this.items.map(item => `<div class="cart-item" data-id="${item.id}"><img src="${item.img}" alt="${escAttr(item.name)}" onerror="fixProductImg(this,'${escAttr(item.name)}')"><div><p>${item.name}</p><strong>${formatPrice(item.price)}</strong></div><button data-id="${item.id}" aria-label="Удалить">×</button></div>`).join('');
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
    const lines = this.items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join('\n');
    window.open(`https://wa.me/${window.WHATSAPP_NUMBER}?text=${encodeURIComponent(`Здравствуйте! Хочу купить:\n${lines}\nИтого: ${formatPrice(this.total())}`)}`, '_blank', 'noopener');
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
