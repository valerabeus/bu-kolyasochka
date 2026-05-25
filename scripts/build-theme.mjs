import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const themeLinks = `${fontLink}
<link rel="stylesheet" href="/bu-kolyasochka/css/theme.css">
<link rel="stylesheet" href="/bu-kolyasochka/css/assistant.css">`;

function extractStyle(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1].trim() : '';
}

function loadPageCss(htmlFile, sourceFile) {
  const fromHtml = extractStyle(fs.readFileSync(path.join(root, htmlFile), 'utf8'));
  if (fromHtml) return fromHtml;
  const sourcePath = path.join(root, sourceFile);
  return fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, 'utf8').trim() : '';
}

const indexStyle = loadPageCss('index.html', 'css/sources/home.css');
const catalogExtra = loadPageCss('catalog.html', 'css/sources/catalog.css');

const productExtra = loadPageCss('product.html', 'css/sources/product.css');

const tokens = `/* ===== КрохаКруг — unified theme ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #F9F8F6;
  --white: #FFFFFF;
  --cream: #F9F8F6;
  --cream2: #F4F4F5;
  --cream3: #E4E4E7;
  --ink: #18181B;
  --ink2: #71717A;
  --ink3: #A1A1AA;
  --mid: #71717A;
  --surface: #FFFFFF;
  --green: #22C55E;
  --green-light: #DCFCE7;
  --green-mid: #15803D;
  --accent: #E05C3A;
  --blush: #E05C3A;
  --blush-light: #FFF5F3;
  --sand: #F59E0B;
  --sand-light: #FEF3C7;
  --border: #E4E4E7;
  --border2: #F4F4F5;
  --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 28px rgba(0, 0, 0, 0.09);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.12);
  --r: 12px;
  --r-sm: 8px;
  --sidebar: 230px;
  --nav-h: 62px;
  --font-display: 'Manrope', system-ui, sans-serif;
  --font-body: 'Manrope', system-ui, sans-serif;
  --radius: var(--r);
  --radius-sm: var(--r-sm);
  --radius-md: var(--r);
  --radius-lg: var(--r);
  --bg: var(--cream2);
  --warn: var(--blush);
  --warn-light: var(--blush-light);
  --gold-light: var(--sand-light);
  --accent-light: var(--green-light);
  --accent-text: var(--green);
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
  font-size: 15px;
  line-height: 1.55;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
a { text-decoration: none; color: inherit; }
img { display: block; max-width: 100%; }
.pcard-link { color: inherit; }

nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255, 255, 255, 0.93);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; height: var(--nav-h);
  padding: 0 24px; gap: 8px;
}
.logo {
  font-size: 1.2rem; font-weight: 800; color: var(--ink);
  margin-right: auto; letter-spacing: -0.02em;
}
.logo span { color: var(--accent); }
.nav-links { display: flex; gap: 2px; list-style: none; flex-wrap: wrap; }
.nav-links a, .nav-links li a {
  padding: 7px 14px; border-radius: 8px;
  font-size: 0.83rem; font-weight: 600; color: var(--mid);
  transition: 0.15s;
}
.nav-links a:hover, .nav-links a.active { background: #F4F4F5; color: var(--ink); }
.nav-actions { display: flex; gap: 6px; margin-left: 16px; align-items: center; }
.nav-icon-btn, .nav-btn, .icon-btn {
  width: 38px; height: 38px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--white);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: 0.15s; position: relative; color: var(--ink);
}
.nav-icon-btn:hover, .nav-btn:hover, .icon-btn:hover { border-color: var(--ink); }
.nav-icon-btn svg, .nav-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; }
.btn-primary {
  padding: 0 20px; height: 38px; border-radius: 10px;
  background: var(--ink); color: #fff; border: none;
  font-family: inherit; font-size: 0.83rem; font-weight: 700; cursor: pointer;
}
.btn-primary:hover { background: var(--accent); }
.cart-badge, .cart-dot {
  position: absolute; top: 6px; right: 6px;
  min-width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent); border: 2px solid var(--white);
  font-size: 0; display: flex; align-items: center; justify-content: center;
}
.cart-badge[data-cart-count]:not([style*="display: none"]) {
  min-width: 16px; height: 16px; font-size: 9px; font-weight: 700; color: #fff;
}
.burger {
  display: none; flex-direction: column; gap: 5px;
  cursor: pointer; padding: 4px; background: none; border: none;
}
.burger span {
  display: block; width: 22px; height: 1.5px;
  background: var(--ink); border-radius: 2px;
}
@media (max-width: 900px) {
  .nav-links { display: none; }
  .burger { display: flex; }
}
body[data-page="catalog"] nav { height: var(--nav-h); }
body[data-page="catalog"] .nav-inner { height: 100%; padding: 0 20px; max-width: 1200px; }
body[data-page="catalog"] .page-wrap { max-width: 1200px; }

.hero-right {
  background: linear-gradient(145deg, var(--green) 0%, #1a3d2c 55%, #2a5c42 100%);
}

.hero-right::before {
  content: '';
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212, 132, 122, 0.25), transparent 70%);
  top: -80px;
  right: -60px;
  pointer-events: none;
}

.hero-right::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  bottom: 20%;
  left: 10%;
  pointer-events: none;
}

.btn-fill {
  background: linear-gradient(135deg, var(--ink), var(--green));
  box-shadow: var(--shadow-sm);
}

.btn-fill:hover {
  background: linear-gradient(135deg, var(--green), var(--green-mid));
  box-shadow: var(--shadow-md);
}

.product-card:hover, .prod-card:hover {
  box-shadow: var(--shadow-md);
}

.cat-tile:hover {
  box-shadow: var(--shadow-sm);
}

.hero-title em, .section-title em, .catalog-title em {
  color: var(--green);
  font-style: italic;
}

.cta-bottom {
  background: linear-gradient(135deg, var(--ink) 0%, #2a2824 50%, var(--green) 120%);
}

/* Guide & compare (legacy markup) */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248, 243, 234, 0.94);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}
.header-inner {
  max-width: 1140px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.header .logo {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.15;
  color: var(--ink);
}
.nav { display: flex; gap: 22px; flex-wrap: wrap; }
.nav-link {
  font-size: 14px;
  color: var(--ink2);
  transition: color 0.2s;
}
.nav-link:hover, .nav-link--active { color: var(--green); font-weight: 500; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.social-icons { display: flex; gap: 8px; }
.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: grid;
  place-items: center;
  color: var(--ink2);
  transition: all 0.2s;
}
.social-icon:hover { border-color: var(--green-mid); color: var(--green); background: var(--green-light); }
.cart-toggle {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--ink2);
}
.cart-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 50%;
  background: var(--green);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  display: none;
  align-items: center;
  justify-content: center;
}
.page-hero, .guide-hero {
  padding: 48px 0 32px;
  background: linear-gradient(180deg, var(--surface) 0%, transparent 100%);
}
.page-hero h1, .guide-hero h1 {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 12px;
}
.page-hero p, .guide-hero p { color: var(--ink2); max-width: 640px; line-height: 1.7; }
.guide-grid, .compare-table-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
}
.guide-card, .scenario-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.guide-card:hover, .scenario-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.compare-table { width: 100%; border-collapse: collapse; }
.compare-table th, .compare-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border2);
  text-align: left;
  font-size: 14px;
}
.compare-table th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink3);
  background: var(--cream2);
}
.content-page main, .legal-page main {
  max-width: 820px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}
.legal-page h1 {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 44px);
  font-weight: 500;
  margin: 16px 0 24px;
}
.legal-page p {
  line-height: 1.75;
  margin: 0 0 12px;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: var(--r-sm);
  color: var(--ink2);
}
.legal-page a { color: var(--green); font-weight: 500; }

/* Content pages (delivery, payment, checkout) */
.page-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}
.page-content h1 {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 500;
  margin-bottom: 8px;
}
.page-content .lead { color: var(--ink2); margin-bottom: 28px; line-height: 1.7; }
.info-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 22px 24px;
  margin-bottom: 14px;
  box-shadow: var(--shadow-sm);
}
.info-card h2 { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: var(--ink); }
.info-card p { font-size: 14px; color: var(--ink2); line-height: 1.65; }

/* Cart, mobile menu, guide/compare, footer */
.cart-overlay {
  position: fixed; inset: 0; background: rgba(26, 24, 20, 0.45); z-index: 2000;
  opacity: 0; pointer-events: none; transition: opacity 0.25s;
}
.cart-overlay.active { opacity: 1; pointer-events: all; }
.cart-drawer {
  position: fixed; right: 0; top: 0; bottom: 0; width: min(420px, 100vw);
  background: var(--surface); z-index: 2001; transform: translateX(100%);
  transition: transform 0.35s ease; display: flex; flex-direction: column;
  border-left: 1px solid var(--border); box-shadow: var(--shadow-lg);
}
.cart-drawer.active { transform: translateX(0); }
.cart-drawer-header, .cart-drawer-head {
  padding: 18px 22px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.cart-drawer-title, .cart-drawer-head strong { font-size: 16px; font-weight: 600; }
.cart-drawer-close, .cart-drawer-head button, #cartClose {
  width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border);
  background: transparent; color: var(--ink3); font-size: 18px;
}
.cart-drawer-body { flex: 1; overflow-y: auto; padding: 0 22px; }
.cart-empty { text-align: center; color: var(--ink3); padding: 48px 16px; line-height: 1.6; }
.cart-items { display: flex; flex-direction: column; }
.cart-item {
  display: grid; grid-template-columns: 64px 1fr auto; gap: 12px; align-items: center;
  padding: 16px 0; border-bottom: 1px solid var(--border2);
}
.cart-item img { width: 64px; height: 64px; object-fit: cover; border-radius: var(--r-sm); background: var(--cream2); }
.cart-item p { font-size: 13px; font-weight: 500; margin-bottom: 4px; }
.cart-item strong { color: var(--green); font-size: 14px; }
.cart-drawer-footer {
  padding: 18px 22px; border-top: 1px solid var(--border);
}
.cart-total { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
.cart-total-price, #cartTotal { font-size: 20px; font-weight: 700; }
#checkoutBtn {
  width: 100%; padding: 14px; background: var(--ink); color: #fff; border: none;
  border-radius: var(--r-sm); font-size: 14px; font-weight: 600; cursor: pointer;
}
#checkoutBtn:hover { background: var(--green); }

.mobile-menu-overlay {
  position: fixed; inset: 0; background: rgba(26, 24, 20, 0.4); z-index: 1099;
  opacity: 0; pointer-events: none; transition: opacity 0.25s;
}
.mobile-menu-overlay.active { opacity: 1; pointer-events: all; }
.mobile-menu {
  position: fixed; top: 0; right: 0; bottom: 0; width: min(300px, 88vw);
  background: var(--surface); z-index: 1100; transform: translateX(100%);
  transition: transform 0.35s ease; display: flex; flex-direction: column;
  border-left: 1px solid var(--border);
}
.mobile-menu.active { transform: translateX(0); }
.mobile-menu-head {
  padding: 16px 20px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.mobile-menu-title { font-size: 15px; font-weight: 600; }
.mobile-menu-close { font-size: 20px; color: var(--ink3); }
.mobile-nav { flex: 1; overflow-y: auto; }
.mobile-nav-link {
  display: block; padding: 16px 20px; border-bottom: 1px solid var(--border2);
  font-size: 16px; color: var(--ink);
}
.mobile-nav-link:hover { color: var(--green); background: var(--green-light); }
.mobile-menu-wa { padding: 20px; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
.btn-sm { padding: 10px 18px; font-size: 13px; }
.btn-lg { padding: 14px 24px; font-size: 14px; }
.btn-whatsapp { background: var(--green); color: #fff; border-radius: var(--r-sm); }
.btn-whatsapp:hover { background: var(--green-mid); }

.guide-page, .compare-page { padding-top: calc(var(--nav-h) + 8px); min-height: 100vh; }
.page-hero { padding: 36px 0 28px; }
.page-hero-grid {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 24px; align-items: start;
}
.page-hero-title {
  font-family: var(--font-display);
  font-size: clamp(30px, 4.5vw, 48px);
  font-weight: 500; line-height: 1.1; color: var(--ink); margin-bottom: 14px;
}
.page-hero-sub { color: var(--ink2); line-height: 1.7; max-width: 640px; }
.guide-hero-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r); padding: 24px; box-shadow: var(--shadow-sm);
}
.guide-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.guide-nav a {
  font-size: 12px; padding: 8px 14px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--surface); color: var(--ink2);
}
.guide-nav a:hover { border-color: var(--green-mid); color: var(--green); }
.guide-article, .scenario-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r); padding: 28px; margin-bottom: 20px;
}
.guide-article h2 { font-family: var(--font-display); font-size: 26px; margin-bottom: 12px; color: var(--ink); }
.guide-article p, .guide-article li { color: var(--ink2); line-height: 1.75; }
.guide-article ul { margin: 16px 0 0 20px; }
.choice-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.choice-step {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r); padding: 20px;
}
.faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
.faq-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r); padding: 22px;
}
.compare-table-wrap { overflow-x: auto; margin-top: 20px; }
.compare-topbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin: 20px 0; }
.compare-products { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px; }

.footer {
  background: var(--ink); color: var(--cream); padding: 48px 0 0; margin-top: 60px;
}
.footer .container { padding-bottom: 0; }
.footer-grid {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1.2fr; gap: 32px;
  padding-bottom: 32px;
}
.footer-logo { font-family: var(--font-display); font-size: 22px; margin-bottom: 8px; color: var(--cream); }
.footer-tagline, .footer-text { color: rgba(248, 243, 234, 0.65); font-size: 14px; line-height: 1.6; }
.footer-col-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--sand); margin-bottom: 12px; }
.footer-link { display: block; color: rgba(248, 243, 234, 0.75); font-size: 14px; margin-bottom: 8px; }
.footer-link:hover { color: var(--cream); }
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 16px 0;
  display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between;
}
.footer-copy { font-size: 12px; color: rgba(248, 243, 234, 0.5); }

@media (max-width: 900px) {
  .header .nav { display: none; }
  .header .burger { display: flex; }
  .page-hero-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .footer-grid { grid-template-columns: 1fr; }
}

`;

const productDetailCss = `
body[data-page="product"] { padding-top: var(--nav-h); }
body[data-page="product"] .page-wrap {
  max-width: 1140px; margin: 0 auto; padding: 20px 20px 80px;
}
body[data-page="product"] .product-detail-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r);
  overflow: hidden; display: grid; grid-template-columns: 1fr 1fr;
}
body[data-page="product"] .detail-gallery { background: var(--cream2); }
body[data-page="product"] .detail-main-img {
  position: relative; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; overflow: hidden;
}
body[data-page="product"] .detail-main-img img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
}
body[data-page="product"] .detail-main-img svg { width: 100px; height: 100px; opacity: 0.15; }
body[data-page="product"] .detail-thumbs {
  display: flex; gap: 6px; padding: 12px 16px; border-top: 1px solid var(--border); flex-wrap: wrap;
}
body[data-page="product"] .detail-thumbs span {
  min-width: 52px; height: 48px; border-radius: var(--r-sm); background: var(--cream3);
  font-size: 10px; color: var(--ink3); display: grid; place-items: center; padding: 0 6px;
}
body[data-page="product"] .detail-info { padding: 32px 36px; }
body[data-page="product"] .detail-title {
  font-family: var(--font-display); font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 500; line-height: 1.1; margin: 8px 0 12px;
}
body[data-page="product"] .detail-subtitle { font-size: 13px; color: var(--ink3); margin-bottom: 18px; }
body[data-page="product"] .condition-block {
  background: var(--green-light); border-radius: var(--r-sm); padding: 14px 16px; margin-bottom: 20px;
}
body[data-page="product"] .condition-block span { display: block; margin-top: 6px; color: var(--ink2); font-size: 14px; line-height: 1.6; }
body[data-page="product"] .detail-price { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
body[data-page="product"] .detail-price span { font-size: 32px; font-weight: 700; }
body[data-page="product"] .detail-price del { color: var(--ink3); }
body[data-page="product"] .detail-price em {
  font-style: normal; font-size: 12px; color: var(--blush);
  background: var(--blush-light); padding: 4px 10px; border-radius: 999px;
}
body[data-page="product"] .installment-note { color: var(--ink2); font-size: 14px; margin-bottom: 22px; }
body[data-page="product"] .specs-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px;
}
body[data-page="product"] .specs-grid div {
  background: var(--cream); border: 1px solid var(--border2); border-radius: var(--r-sm); padding: 12px;
}
body[data-page="product"] .specs-grid small { display: block; color: var(--ink3); font-size: 11px; margin-bottom: 4px; }
body[data-page="product"] .cta-block { display: grid; gap: 10px; margin-bottom: 18px; }
body[data-page="product"] .btn-primary {
  width: 100%; padding: 14px; background: var(--ink); color: #fff; border: none;
  border-radius: var(--r-sm); font-size: 14px; font-weight: 600; cursor: pointer;
}
body[data-page="product"] .btn-primary:hover { background: var(--green); }
body[data-page="product"] .btn-secondary {
  display: block; text-align: center; padding: 13px; border: 1px solid var(--border);
  border-radius: var(--r-sm); color: var(--ink); background: transparent;
}
body[data-page="product"] .trust-strip {
  display: flex; flex-wrap: wrap; gap: 12px; padding-top: 14px; border-top: 1px solid var(--border);
  font-size: 12px; color: var(--ink3);
}
body[data-page="product"] .related-block { margin-top: 40px; }
body[data-page="product"] .related-block h2 {
  font-family: var(--font-display); font-size: 28px; margin-bottom: 20px;
}
body[data-page="product"] .related-block .products-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px;
}
body[data-page="product"] .product-badges {
  position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 2;
}
body[data-page="product"] .pbadge {
  font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
}
body[data-page="product"] .pbadge-green { background: var(--green-light); color: var(--green); }
body[data-page="product"] .pbadge-sand { background: var(--sand-light); color: #7a5a10; }
body[data-page="product"] .pbadge-red { background: var(--blush-light); color: var(--blush); }
@media (max-width: 800px) {
  body[data-page="product"] .product-detail-card { grid-template-columns: 1fr; }
  body[data-page="product"] .detail-info { padding: 24px 20px; }
}
`;

// Strip duplicate :root and resets from extracted blocks
function stripBase(css) {
  return css
    .replace(/\/\*[\s\S]*?──[\s\S]*?──[\s\S]*?\*\//g, '')
    .replace(/^\s*\*,[\s\S]*?padding:\s*0;\s*\}/m, '')
    .replace(/:root\s*\{[\s\S]*?\}/m, '')
    .replace(/html\s*\{\s*scroll-behavior[\s\S]*?\}/m, '')
    .replace(/body\s*\{[\s\S]*?antialiased;\s*\}/m, '')
    .replace(/\.serif[\s\S]*?\}/m, '')
    .replace(/\.container[\s\S]*?\}/m, '')
    .replace(/^a\s*\{[\s\S]*?\}/m, '')
    .replace(/^img\s*\{[\s\S]*?\}/m, '');
}

function stripNavBlocks(css) {
  return css
    .replace(/\/\*[\s\S]*?NAV[\s\S]*?\*\/[\s\S]*?\.burger span[\s\S]*?\}/gi, '')
    .replace(/^nav\s*\{[\s\S]*?\n\}/gm, '')
    .replace(/^\.nav-inner[\s\S]*?\n\}/gm, '')
    .replace(/^\.logo[\s\S]*?\n\}/gm, '')
    .replace(/^\.nav-links[\s\S]*?\n\}/gm, '')
    .replace(/^\.nav-actions[\s\S]*?\n\}/gm, '')
    .replace(/^\.nav-btn[\s\S]*?\n\}/gm, '')
    .replace(/^\.cart-dot[\s\S]*?\n\}/gm, '')
    .replace(/^\.burger[\s\S]*?\n\}/gm, '');
}

const catalogOnly = stripNavBlocks(
  stripBase(catalogExtra).replace(stripBase(indexStyle), '')
);

const productOnly = stripNavBlocks(stripBase(productExtra));

const theme = [
  tokens,
  '/* === Home === */\n',
  stripBase(indexStyle),
  '\n/* === Catalog === */\n',
  catalogOnly,
  '\n/* === Product === */\n',
  productOnly,
].join('\n');

fs.writeFileSync(path.join(root, 'css', 'theme.css'), theme, 'utf8');

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));

for (const file of htmlFiles) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  const hadStyle = /<style>[\s\S]*?<\/style>/.test(html);

  if (hadStyle) {
    html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<\/style>/i, themeLinks);
    html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]+>\s*<style>[\s\S]*?<\/style>/i, themeLinks);
    html = html.replace(/<style>[\s\S]*?<\/style>\s*/gi, '');
    html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant[^>]+>\s*/gi, '');
    if (!html.includes('css/theme.css')) {
      html = html.replace('</head>', `${themeLinks}\n</head>`);
    }
  }

  if (file === 'kak-vybrat.html' || file === 'compare.html') {
    html = html.replace(
      /<link rel="stylesheet" href="\/bu-kolyasochka\/css\/style\.css">/,
      themeLinks
    );
    if (!html.includes('css/theme.css')) {
      html = html.replace('</head>', `${themeLinks}\n</head>`);
    }
  }

  if (/class="legal-page"/.test(html) === false && ['privacy.html', 'oferta.html', 'returns.html'].includes(file)) {
    html = html.replace('<body>', '<body class="legal-page">');
    if (!html.includes('theme.css')) {
      html = html.replace('</head>', `${themeLinks}\n</head>`);
      html = html.replace(/<style>[\s\S]*?<\/style>/, '');
    }
  }

  if (!html.includes('js/site-ui.js') && /burgerBtn|id="burger"/.test(html)) {
    html = html.replace(
      '</body>',
      '<script src="/bu-kolyasochka/js/site-ui.js"></script>\n</body>'
    );
  }

  fs.writeFileSync(path.join(root, file), html, 'utf8');
}

console.log('theme.css written,', htmlFiles.length, 'html files processed');
