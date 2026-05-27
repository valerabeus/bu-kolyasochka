import fs from 'fs';
import { execSync } from 'child_process';

const themeLinks = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/bu-kolyasochka/css/theme.css">
<link rel="stylesheet" href="/bu-kolyasochka/css/assistant.css">`;

let html = execSync('git show 7ff0301:index.html', { encoding: 'utf8' });
html = html.replace(
  /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<\/style>/i,
  themeLinks
);
html = html.replace(/<style>[\s\S]*?<\/style>\s*/i, '');
html = html.replace(
  /(<button class="nav-icon-btn")([^>]*aria-label="Корзина")/g,
  '$1 data-cart-open$2'
);
html = html.replace(
  /<span class="cart-badge">\d+<\/span>/g,
  '<span class="cart-badge" data-cart-count style="display:none">0</span>'
);

fs.writeFileSync('index.html', html);
const navCount = (html.match(/<!-- NAV -->/g) || []).length;
const featCount = (html.match(/id="featuredGrid"/g) || []).length;
console.log('restored index.html — nav:', navCount, 'featured:', featCount, 'lines:', html.split('\n').length);
