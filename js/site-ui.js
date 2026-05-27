(function () {
  const base = window.SITE_BASE || '/bu-kolyasochka/';

  function injectMobileChrome() {
    if (document.getElementById('mobileMenu')) return;

    const navActions = document.querySelector('.nav-actions');
    navActions?.querySelectorAll('.icon-btn:not([data-cart-open])').forEach(btn => btn.remove());
    if (navActions && !document.getElementById('burgerBtn')) {
      const burger = document.createElement('button');
      burger.type = 'button';
      burger.className = 'burger';
      burger.id = 'burgerBtn';
      burger.setAttribute('aria-label', 'Открыть меню');
      burger.innerHTML = '<span></span><span></span><span></span>';
      navActions.insertBefore(burger, navActions.firstChild);
    }

    const links = Array.from(document.querySelectorAll('.nav-links a')).map((a) => ({
      href: a.getAttribute('href'),
      label: a.textContent.trim(),
      active: a.classList.contains('active'),
    }));

    const menuHtml = links
      .map(
        (l) =>
          `<a href="${l.href}" class="mobile-nav-link${l.active ? ' active' : ''}">${l.label}</a>`
      )
      .join('');

    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
      <aside class="mobile-menu" id="mobileMenu" aria-label="Меню">
        <div class="mobile-menu-head">
          <span class="mobile-menu-title">КрохаКруг</span>
          <button type="button" class="mobile-menu-close" id="mobileMenuClose" aria-label="Закрыть">×</button>
        </div>
        <nav class="mobile-nav">${menuHtml}</nav>
        <div class="mobile-menu-wa">
          <a class="btn-primary" href="${base}catalog.html" style="display:block;text-align:center;width:100%">Весь каталог</a>
        </div>
      </aside>`
    );
  }

  function bindMobileMenu() {
    const burger = document.getElementById('burgerBtn') || document.querySelector('.burger');
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const closeBtn = document.getElementById('mobileMenuClose');
    if (!burger || !menu || !overlay) return;

    const open = () => {
      menu.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      menu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', open);
    overlay.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);
    menu.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', close);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectMobileChrome();
    bindMobileMenu();
  });
})();
