(function () {
  const path = location.pathname;
  const marker = '/bu-kolyasochka';

  if (path === marker || (path.endsWith(marker) && !path.endsWith(marker + '/'))) {
    location.replace(path + '/' + location.search + location.hash);
    return;
  }

  const idx = path.indexOf(marker);
  window.SITE_BASE = idx !== -1 ? marker + '/' : '/';
})();
