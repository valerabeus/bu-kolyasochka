(function () {
  const path = location.pathname;
  const marker = '/bu-kolyasochka';
  const idx = path.indexOf(marker);
  let base;
  if (idx !== -1) {
    base = path.slice(0, idx + marker.length) + '/';
  } else if (location.protocol === 'file:') {
    base = './';
  } else {
    base = '/';
  }
  window.SITE_BASE = base;
  if (!document.querySelector('base')) {
    const el = document.createElement('base');
    el.href = base;
    document.head.appendChild(el);
  }
})();
