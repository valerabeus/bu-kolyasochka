(function () {
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

  document.addEventListener('DOMContentLoaded', bindMobileMenu);
})();
