import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">`;

const themeLinks = `${fontLink}
<link rel="stylesheet" href="/bu-kolyasochka/css/theme.css">
<link rel="stylesheet" href="/bu-kolyasochka/css/assistant.css">`;

function extractStyle(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1].trim() : '';
}

const indexStyle = extractStyle(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
const catalogExtra = extractStyle(fs.readFileSync(path.join(root, 'catalog.html'), 'utf8'));
const productStyle = extractStyle(fs.readFileSync(path.join(root, 'product.html'), 'utf8'));

const tokens = `/* ===== KolysockiPRO — unified theme ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #f8f3ea;
  --cream2: #efe6d8;
  --cream3: #e4d9c8;
  --ink: #1a1814;
  --ink2: #4a4540;
  --ink3: #8a8278;
  --surface: #fffcf7;
  --green: #234b35;
  --green-light: #e3f0e8;
  --green-mid: #3d7a58;
  --blush: #d4847a;
  --blush-light: #fae8e5;
  --sand: #c49a4a;
  --sand-light: #f9f0e0;
  --border: rgba(26, 24, 20, 0.1);
  --border2: rgba(26, 24, 20, 0.06);
  --shadow-sm: 0 4px 20px rgba(26, 24, 20, 0.06);
  --shadow-md: 0 12px 40px rgba(26, 24, 20, 0.1);
  --shadow-lg: 0 24px 64px rgba(35, 75, 53, 0.14);
  --r: 18px;
  --r-sm: 10px;
  --sidebar: 256px;
  --nav-h: 68px;
  --font-display: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Source Sans 3', 'DM Sans', system-ui, sans-serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--cream);
  color: var(--ink);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  position: relative;
}

body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.serif { font-family: var(--font-display); }
.container { max-width: 1140px; margin: 0 auto; padding: 0 20px; }
a { text-decoration: none; color: inherit; }
img { display: block; max-width: 100%; }

/* Typography overrides */
.logo, .hero-title, .section-title, .catalog-title, .stat-val, .why-big-title,
.inst-title, .cta-bottom-title, .footer-logo, .product-name, .prod-name, .empty-title,
.detail-title, .related-block h2 {
  font-family: var(--font-display) !important;
}

body, .btn-fill, .btn-ghost, .nav-links, input, select, button {
  font-family: var(--font-body);
}

nav {
  box-shadow: 0 1px 0 var(--border), 0 8px 32px rgba(26, 24, 20, 0.04);
}

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

const catalogOnly = stripBase(catalogExtra)
  .replace(stripBase(indexStyle), '')
  .replace(/\/\*[\s\S]*?NAV[\s\S]*?\*\/[\s\S]*?\.burger span[\s\S]*?\}/m, '');

const theme = [
  tokens,
  '/* === Home === */\n',
  stripBase(indexStyle),
  '\n/* === Catalog === */\n',
  catalogOnly,
  '\n/* === Product === */\n',
  stripBase(productStyle),
].join('\n');

fs.writeFileSync(path.join(root, 'css', 'theme.css'), theme, 'utf8');

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));

for (const file of htmlFiles) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  const hadStyle = /<style>[\s\S]*?<\/style>/.test(html);

  if (hadStyle) {
    html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<\/style>/i, themeLinks);
    html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]+>\s*<style>[\s\S]*?<\/style>/i, themeLinks);
    html = html.replace(/<style>[\s\S]*?<\/style>\s*/i, '');
    html = html.replace(/<link rel="stylesheet" href="\/bu-kolyasochka\/css\/assistant\.css">\s*/gi, '');
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

  fs.writeFileSync(path.join(root, file), html, 'utf8');
}

console.log('theme.css written,', htmlFiles.length, 'html files processed');
