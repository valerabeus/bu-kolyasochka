import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const designDir =
  process.argv[2] ||
  path.join(process.env.USERPROFILE || '', 'Downloads', 'krohakrug-design');

const read = (p) => fs.readFileSync(p, 'utf8');
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s, 'utf8');
};

function extractStyle(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  return m ? m[1].trim() : '';
}

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!m) return '';
  return m[1].replace(/<script[\s\S]*?<\/script>/gi, '').trim();
}

function extractFooter(html) {
  const m = html.match(/<footer[\s\S]*?<\/footer>/i);
  return m ? m[0] : '';
}

function extractNav(html) {
  const m = html.match(/<nav[\s\S]*?<\/nav>/i);
  return m ? m[0] : '';
}

const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const themeLinks = `${fontLink}
<link rel="stylesheet" href="/bu-kolyasochka/css/theme.css">
<link rel="stylesheet" href="/bu-kolyasochka/css/assistant.css">`;

const scriptsBlock = `<script src="/bu-kolyasochka/js/products.js"></script>
<script src="/bu-kolyasochka/js/cart.js"></script>
<script src="/bu-kolyasochka/js/main.js"></script>`;

function pageShell({ title, desc, page, bodyHtml, extraScript = '', extraHead = '' }) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<script src="/bu-kolyasochka/js/site.js"></script>
${themeLinks}
${extraHead}
</head>
<body data-page="${page}">
${bodyHtml}
${scriptsBlock}
${extraScript}
<script src="/bu-kolyasochka/js/assistant.js"></script>
<script src="/bu-kolyasochka/js/site-ui.js"></script>
</body>
</html>`;
}

function wireNav(navHtml, active = '') {
  let n = navHtml.replace(
    /<span class="cart-dot"><\/span>/g,
    '<span class="cart-dot" data-cart-count style="display:none">0</span>'
  );
  n = n.replace(
    /(<button class="icon-btn)([^>]*)(><svg[^>]*><path d="M6 2 3 6)/,
    '$1 nav-btn" data-cart-open aria-label="Корзина"$3'
  );
  if (active) {
    n = n.replace(
      new RegExp(`<a href="${active.replace('.', '\\.')}"([^>]*class="[^"]*")?`),
      (m) => m.replace(/class="active"\s*/g, '').replace(/<a /, '<a class="active" ')
    );
    n = n.replace(
      new RegExp(`<a href="${active.replace('.', '\\.')}"(?![^>]*class="active")`),
      `<a class="active" href="${active}"`
    );
  }
  return n;
}

const catalogHtml = read(path.join(designDir, 'kk_catalog.html'));
const catalogStyle = extractStyle(catalogHtml);
const catalogNav = wireNav(extractNav(catalogHtml), 'catalog.html');
const catalogFooter = extractFooter(catalogHtml);

write(path.join(root, 'css/sources/catalog.css'), catalogStyle);

const catalogScript = `<script>let currentPage=1,currentView='grid',PER_PAGE=12,filtered=[...PRODUCTS];
function typeLong(p){return p.type==='transformer'?(p.name.includes('3')||p.name.includes('Complete')?'Трансформер 3-в-1':'Трансформер 2-в-1'):getTypeLabel(p.type)}
function condClass(c){return c==='likenew'?'':c==='excellent'?' p-cond-ok':''}
function badgeHtml(p){const d=discount(p);if(d>=50)return'<span class="p-badge pb-red">−'+d+'%</span>';if(p.condition==='likenew')return'<span class="p-badge pb-green">'+getConditionLabel(p.condition)+'</span>';return'<span class="p-badge pb-orange">Выгодно</span>'}
function renderCard(p,idx){const d=discount(p),delay=(idx%PER_PAGE)*.04;return '<article class="pcard" style="animation-delay:'+delay+'s"><a href="'+pageUrl('product.html?id='+p.id)+'" class="pcard-link"><div class="pcard-img">'+strollerIcon()+'<img src="'+p.img+'" alt="'+escAttr(p.name)+'" onerror="fixProductImg(this,\\''+escAttr(p.name)+'\\')"><span class="p-badge '+((p.condition==='likenew')?'pb-green':(d?'pb-red':'pb-orange'))+'">'+(d?'−'+d+'%':getConditionLabel(p.condition))+'</span></div><div class="pcard-body"><div class="p-brand">'+p.brand+'</div><div class="p-name">'+p.name+'</div><div class="p-cond'+condClass(p.condition)+'">'+getConditionLabel(p.condition)+'</div></a><div class="pcard-foot"><div><div class="p-price">'+formatPrice(p.price)+'</div>'+(p.newPrice?'<div class="p-old">'+formatPrice(p.newPrice)+'</div>':'')+'</div><button class="add-btn add-to-cart-btn" data-id="'+p.id+'" aria-label="В корзину">+</button></div></article>'}
function applyFilters(){const min=Number(document.getElementById('priceMin')?.value||0),max=Number(document.getElementById('priceMax')?.value||999999);filtered=PRODUCTS.filter(p=>p.price>=min&&p.price<=max);currentPage=1;renderGrid()}
function renderGrid(){const grid=document.getElementById('productsGrid'),total=filtered.length,totalPages=Math.max(1,Math.ceil(total/PER_PAGE));if(currentPage>totalPages)currentPage=totalPages;const start=(currentPage-1)*PER_PAGE,slice=filtered.slice(start,start+PER_PAGE);grid.innerHTML=slice.map(renderCard).join('')||'<div class="empty-state"><p>Ничего не найдено</p></div>';const tc=document.getElementById('totalCount');if(tc)tc.textContent=total+' '+(total===1?'товар':total<5?'товара':'товаров');const pi=document.getElementById('pageInfo');if(pi)pi.textContent=total?'Показано '+(start+1)+'–'+Math.min(start+PER_PAGE,total)+' из '+total:'';bindAddToCart(grid);renderPagination(totalPages)}
function renderPagination(totalPages){const nav=document.getElementById('pagination');if(!nav)return;const prev=nav.querySelector('.page-btn.arrow:first-child'),next=nav.querySelector('.page-btn.arrow:last-child');nav.querySelectorAll('.page-btn:not(.arrow),.page-dots').forEach(e=>e.remove());let lastDots=false;for(let i=1;i<=totalPages;i++){if(i===1||i===totalPages||(i>=currentPage-1&&i<=currentPage+1)){const b=document.createElement('button');b.className='page-btn'+(i===currentPage?' active':'');b.textContent=i;b.onclick=()=>goPage(i);nav.insertBefore(b,next);lastDots=false}else if(!lastDots){const s=document.createElement('span');s.className='page-dots';s.textContent='…';nav.insertBefore(s,next);lastDots=true}}if(prev)prev.disabled=currentPage===1;if(next)next.disabled=currentPage===totalPages}
function goPage(p){const total=Math.ceil(filtered.length/PER_PAGE);if(p<1||p>total)return;currentPage=p;renderGrid();scrollTo({top:0,behavior:'smooth'})}
function setSort(btn){document.querySelectorAll('.sort-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');const t=btn.textContent.trim();filtered.sort((a,b)=>t.includes('Дешевле')?a.price-b.price:t.includes('Дороже')?b.price-a.price:t.includes('Скидка')?discount(b)-discount(a):b.year-a.year||b.id-a.id);currentPage=1;renderGrid()}
function setPriceChip(el,min,max){document.querySelectorAll('.pc').forEach(c=>c.classList.remove('on'));el.classList.add('on');const pm=document.getElementById('priceMin'),px=document.getElementById('priceMax');if(pm)pm.value=min;if(px)px.value=max;applyFilters()}
function clearAllFilters(){document.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);document.querySelectorAll('.pc').forEach(c=>c.classList.remove('on'));const pm=document.getElementById('priceMin'),px=document.getElementById('priceMax');if(pm)pm.value=0;if(px)px.value=150000;filtered=[...PRODUCTS];currentPage=1;renderGrid()}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('priceMin')?.addEventListener('change',applyFilters);document.getElementById('priceMax')?.addEventListener('change',applyFilters);renderGrid()});</script>`;

const catalogBody = `${catalogNav}
<div class="page-top">
  <div class="pt-inner">
    <div class="breadcrumb"><a href="index.html">Главная</a><s>›</s><span>Все коляски</span></div>
    <div class="pt-row">
      <div>
        <h1 class="page-title">Все коляски</h1>
        <div class="count-tag" id="totalCount">62 товара</div>
      </div>
      <div class="sort-row">
        <span class="sort-label">Сортировка:</span>
        <button type="button" class="sort-btn on" onclick="setSort(this)">Новые</button>
        <button type="button" class="sort-btn" onclick="setSort(this)">Дешевле</button>
        <button type="button" class="sort-btn" onclick="setSort(this)">Дороже</button>
        <button type="button" class="sort-btn" onclick="setSort(this)">Скидка</button>
      </div>
    </div>
  </div>
</div>
<div class="layout">
  <aside class="sidebar">
    <div class="sb-head">
      <span class="sb-title">Фильтры</span>
      <button type="button" class="sb-reset" onclick="clearAllFilters()">Сбросить</button>
    </div>
    <div class="filter-group">
      <div class="fg-name">Цена, ₽</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <input type="number" id="priceMin" value="0" placeholder="От" style="padding:8px;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:.8rem">
        <input type="number" id="priceMax" value="150000" placeholder="До" style="padding:8px;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:.8rem">
      </div>
      <div class="price-chips">
        <div class="pc" onclick="setPriceChip(this,0,10000)">до 10 000</div>
        <div class="pc" onclick="setPriceChip(this,10000,30000)">10–30 тыс</div>
        <div class="pc" onclick="setPriceChip(this,30000,70000)">30–70 тыс</div>
        <div class="pc" onclick="setPriceChip(this,70000,150000)">от 70 тыс</div>
      </div>
    </div>
    <div class="filter-group">
      <div class="fg-name">Состояние</div>
      <div class="filter-opts">
        <label class="fopt"><input type="checkbox"/><span class="fopt-label">Как новое</span><span class="fopt-count">23</span></label>
        <label class="fopt"><input type="checkbox"/><span class="fopt-label">Отличное</span><span class="fopt-count">38</span></label>
        <label class="fopt"><input type="checkbox"/><span class="fopt-label">Хорошее</span><span class="fopt-count">19</span></label>
      </div>
    </div>
    <button type="button" class="sb-apply" onclick="applyFilters()">Показать результаты</button>
  </aside>
  <div>
    <div class="products" id="productsGrid"></div>
    <nav class="pagination" id="pagination" aria-label="Пагинация" style="display:flex;align-items:center;justify-content:center;gap:6px;margin:24px 0 8px">
      <button type="button" class="page-btn arrow" onclick="goPage(currentPage-1)" aria-label="Назад">‹</button>
      <button type="button" class="page-btn arrow" onclick="goPage(currentPage+1)" aria-label="Вперёд">›</button>
    </nav>
    <p id="pageInfo" style="text-align:center;font-size:.78rem;color:var(--mid);margin-bottom:40px"></p>
  </div>
</div>
${catalogFooter}`;

write(
  path.join(root, 'catalog.html'),
  pageShell({
    title: 'Каталог колясок — КрохаКруг',
    desc: 'Каталог проверенных б/у колясок: Bugaboo, Stokke, Cybex. Рассрочка и доставка по России.',
    page: 'catalog',
    bodyHtml: catalogBody,
    extraScript: catalogScript,
  })
);

const productStyle = extractStyle(read(path.join(designDir, 'kk_product.html')));
write(path.join(root, 'css/sources/product.css'), productStyle);

write(
  path.join(root, 'product.html'),
  pageShell({
    title: 'Карточка товара — КрохаКруг',
    desc: 'Карточка проверенной б/у коляски: состояние, цена, рассрочка, доставка по РФ.',
    page: 'product',
    bodyHtml: `${wireNav(extractNav(read(path.join(designDir, 'kk_product.html'))))}<div class="wrap" id="productMount"></div>${extractFooter(read(path.join(designDir, 'kk_product.html')))}`,
  })
);

const homeStyle = `${catalogStyle}
/* HOME */
.hero{display:grid;grid-template-columns:1.1fr .9fr;gap:32px;max-width:1200px;margin:0 auto;padding:48px 24px 40px;align-items:center}
.hero-tag{display:inline-flex;padding:6px 14px;border-radius:999px;background:#FFF5F3;color:var(--accent);font-size:.72rem;font-weight:700;margin-bottom:16px}
.hero h1{font-size:clamp(2rem,4.5vw,3.2rem);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin-bottom:14px}
.hero h1 em{font-style:normal;color:var(--accent)}
.hero-lead{color:var(--mid);font-size:1rem;line-height:1.7;margin-bottom:24px;max-width:520px}
.hero-cta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:28px}
.btn-hero{padding:0 26px;height:48px;border-radius:12px;background:var(--ink);color:#fff;border:none;font-family:inherit;font-size:.9rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.btn-hero:hover{background:var(--accent)}
.btn-hero-ghost{padding:0 22px;height:48px;border-radius:12px;border:1.5px solid var(--border);background:var(--white);font-family:inherit;font-size:.88rem;font-weight:700;color:var(--ink);display:inline-flex;align-items:center}
.hero-stats{display:flex;gap:28px;flex-wrap:wrap}
.hero-stats div strong{display:block;font-size:1.35rem;font-weight:800}
.hero-stats div span{font-size:.75rem;color:var(--mid);font-weight:600}
.hero-visual{border-radius:var(--r);overflow:hidden;aspect-ratio:4/3;background:#F4F4F5;border:1px solid var(--border)}
.hero-visual img{width:100%;height:100%;object-fit:cover}
.sec-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.sec-title{font-size:1.35rem;font-weight:800;letter-spacing:-.02em}
.sec-link{font-size:.82rem;font-weight:700;color:var(--accent)}
.cats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
.cat{background:var(--white);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:.2s}
.cat:hover{box-shadow:0 8px 24px rgba(0,0,0,.08);transform:translateY(-2px)}
.cat-img{height:100px;overflow:hidden;background:#F4F4F5}
.cat-name{padding:10px 12px 2px;font-size:.82rem;font-weight:700}
.cat-count{padding:0 12px 12px;font-size:.72rem;color:var(--mid)}
.how-wrap{max-width:1200px;margin:0 auto;padding:0 24px 56px}
.how-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.how-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:22px}
.how-num{font-size:1.5rem;font-weight:800;color:var(--accent);margin-bottom:8px}
.how-card h3{font-size:.92rem;font-weight:800;margin-bottom:6px}
.how-card p{font-size:.8rem;color:var(--mid);line-height:1.6}
.contact-wrap{max-width:1200px;margin:0 auto;padding:0 24px 64px}
.contact-block{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:40px;text-align:center}
.contact-block h2{font-size:1.5rem;font-weight:800;margin-bottom:8px}
.contact-block p{color:var(--mid);margin-bottom:20px}
.contact-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.btn-tg,.btn-wa{padding:0 22px;height:44px;border-radius:10px;border:none;font-family:inherit;font-size:.85rem;font-weight:700;color:#fff;cursor:pointer}
.btn-tg{background:#2AABEE}.btn-wa{background:#25D366}
.pcard-link{color:inherit}
.empty-state{text-align:center;padding:48px;color:var(--mid)}
.page-btn{min-width:36px;height:36px;border-radius:8px;border:1px solid var(--border);background:var(--white);font-weight:700;cursor:pointer}
.page-btn.active,.page-btn:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
.page-btn.arrow:disabled{opacity:.4;cursor:not-allowed}
.page-dots{padding:0 6px;color:var(--mid)}
.pcard .pcard-img svg{position:absolute;inset:0;margin:auto;width:64px;height:64px;opacity:.15;pointer-events:none}
@media(max-width:900px){.hero{grid-template-columns:1fr}.cats{grid-template-columns:repeat(3,1fr)}.how-steps{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.cats{grid-template-columns:repeat(2,1fr)}.how-steps{grid-template-columns:1fr}}
`;

write(path.join(root, 'css/sources/home.css'), homeStyle);

const homeNav = wireNav(catalogNav).replace(/<a class="active" href="catalog\.html"/, '<a href="catalog.html"');
const homeBody = `${homeNav}
<section class="hero">
  <div>
    <div class="hero-tag">Проверено перед продажей</div>
    <h1>Б/у коляски <em>премиум-брендов</em> без переплат</h1>
    <p class="hero-lead">КрохаКруг — проверенные коляски Bugaboo, Stokke, Cybex и других брендов. Рассрочка 0%, доставка по России, возврат 14 дней.</p>
    <div class="hero-cta">
      <a href="catalog.html" class="btn-hero">Смотреть каталог</a>
      <a href="index.html#how" class="btn-hero-ghost">Как купить</a>
    </div>
    <div class="hero-stats">
      <div><strong data-products-count>62+</strong><span>позиций в каталоге</span></div>
      <div><strong>−54%</strong><span>от цены новой</span></div>
      <div><strong>14 дн</strong><span>возврат без вопросов</span></div>
    </div>
  </div>
  <div class="hero-visual">
    <img src="https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=900&q=80" alt="Коляска Bugaboo"/>
  </div>
</section>
<div class="wrap" style="padding-bottom:48px">
  <div class="sec-head"><h2 class="sec-title">Категории</h2><a href="catalog.html" class="sec-link">Все товары →</a></div>
  <div class="cats">
    <a href="catalog.html?type=stroller" class="cat"><div class="cat-img"><img src="https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=300&q=75" alt=""/></div><div class="cat-name">Прогулочные</div><div class="cat-count">28 товаров</div></a>
    <a href="catalog.html?type=newborn" class="cat"><div class="cat-img"><img src="https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=300&q=75" alt=""/></div><div class="cat-name">Для новорождённых</div><div class="cat-count">11 товаров</div></a>
    <a href="catalog.html?type=transformer" class="cat"><div class="cat-img"><img src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&q=75" alt=""/></div><div class="cat-name">Трансформеры</div><div class="cat-count">40 товаров</div></a>
    <a href="catalog.html?type=twin" class="cat"><div class="cat-img"><img src="https://images.unsplash.com/photo-1544126592-807ade215a0b?w=300&q=75" alt=""/></div><div class="cat-name">Для двойни</div><div class="cat-count">5 товаров</div></a>
    <a href="catalog.html?type=sport" class="cat"><div class="cat-img"><img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&q=75" alt=""/></div><div class="cat-name">Спортивные</div><div class="cat-count">8 товаров</div></a>
    <a href="catalog.html?price=budget" class="cat"><div class="cat-img"><img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=75" alt=""/></div><div class="cat-name">До 15 000 ₽</div><div class="cat-count">31 товар</div></a>
  </div>
</div>
<div class="wrap" style="padding-bottom:56px">
  <div class="sec-head"><h2 class="sec-title">Свежие поступления</h2><a href="catalog.html" class="sec-link">Весь каталог →</a></div>
  <div class="products" id="featuredGrid"></div>
</div>
<div class="how-wrap" id="how">
  <div class="sec-head"><h2 class="sec-title">Как это работает</h2></div>
  <div class="how-steps">
    <div class="how-card"><div class="how-num">01</div><h3>Выбираете коляску</h3><p>Каталог с фильтрами и ИИ-помощником по подбору.</p></div>
    <div class="how-card"><div class="how-num">02</div><h3>Проверяем состояние</h3><p>12-точечный осмотр перед публикацией объявления.</p></div>
    <div class="how-card"><div class="how-num">03</div><h3>Оформляете заказ</h3><p>Корзина, WhatsApp или рассрочка без переплат.</p></div>
    <div class="how-card"><div class="how-num">04</div><h3>Получаете с доставкой</h3><p>СДЭК, Boxberry или самовывоз в Москве и МО.</p></div>
  </div>
</div>
<div class="contact-wrap" id="contact">
  <div class="contact-block">
    <h2>Остались вопросы?</h2>
    <p>Напишите в мессенджер — подберём коляску и ответим по доставке и рассрочке.</p>
    <div class="contact-btns">
      <a class="btn-tg" href="https://t.me/" target="_blank" rel="noopener">Telegram</a>
      <a class="btn-wa" href="https://wa.me/79000000000" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </div>
</div>
${catalogFooter}`;

write(
  path.join(root, 'index.html'),
  pageShell({
    title: 'КрохаКруг — б/у коляски с проверкой',
    desc: 'Проверенные б/у коляски от 3 900 ₽. Bugaboo, Stokke, Cybex. Доставка по России, рассрочка, возврат 14 дней.',
    page: 'home',
    bodyHtml: homeBody,
  })
);

const staticMap = [
  ['kk_delivery.html', 'delivery.html', 'delivery', 'Доставка колясок — КрохаКруг', 'Доставка по России: СДЭК, Boxberry, самовывоз в Москве.'],
  ['kk_payment.html', 'payment.html', 'payment', 'Рассрочка — КрохаКруг', 'Рассрочка 0% на коляски: Тинькофф, Сбер, Яндекс Сплит.'],
  ['kk_checkout.html', 'checkout.html', 'checkout', 'Как купить — КрохаКруг', 'Как оформить заказ на б/у коляску в КрохаКруг.'],
  ['kk_compare.html', 'compare.html', 'compare', 'Сравнение колясок — КрохаКруг', 'Сравните модели колясок по параметрам.'],
  ['kk_kak-vybrat.html', 'kak-vybrat.html', 'guide', 'Как выбрать коляску — КрохаКруг', 'Гид по выбору б/у коляски для новорождённого и прогулок.'],
  ['kk_oferta.html', 'oferta.html', 'legal', 'Публичная оферта — КрохаКруг', 'Публичная оферта интернет-магазина КрохаКруг.'],
  ['kk_privacy.html', 'privacy.html', 'legal', 'Политика конфиденциальности — КрохаКруг', 'Политика обработки персональных данных.'],
  ['kk_returns.html', 'returns.html', 'legal', 'Возврат и обмен — КрохаКруг', 'Условия возврата и обмена товаров.'],
];

for (const [src, out, page, title, desc] of staticMap) {
  const html = read(path.join(designDir, src));
  const styleText = extractStyle(html);
  const nav = wireNav(extractNav(html), out.includes('catalog') ? 'catalog.html' : out.includes('kak') ? 'kak-vybrat.html' : '');
  const inner = extractBody(html).replace(/<nav[\s\S]*?<\/nav>/i, '').replace(/<footer[\s\S]*?<\/footer>/i, '');
  const footer = extractFooter(html);
  const extraCss = page === 'legal' ? '\nbody.legal-page .wrap main,.legal-content{max-width:820px;margin:0 auto;padding:32px 0 80px}' : '';
  write(
    path.join(root, out),
    pageShell({
      title,
      desc,
      page,
      bodyHtml: `${nav}${inner}${footer}`,
      extraHead: `<style>${styleText}${extraCss}</style>`,
    })
  );
  if (page === 'legal') {
    let legal = read(path.join(root, out));
    if (!legal.includes('class="legal-page"')) {
      legal = legal.replace('<body data-page="legal">', '<body data-page="legal" class="legal-page">');
      write(path.join(root, out), legal);
    }
  }
}

let mainJs = read(path.join(root, 'js/main.js'));
mainJs = mainJs.replace(/КолясочкиPRO/g, 'КрохаКруг');
mainJs = mainJs.replace(
  /function productCard[\s\S]*?}\nfunction bindAddToCart/,
  `function productCard(product, index = 0) {
  const d = discount(product);
  return '<article class="pcard" style="animation-delay:' + (index * 0.04) + 's"><a href="' + pageUrl('product.html?id=' + product.id) + '" class="pcard-link"><div class="pcard-img">' + strollerIcon() + '<img src="' + product.img + '" alt="' + escAttr(product.name) + '" onerror="fixProductImg(this,\\'' + escAttr(product.name) + '\\')"><span class="p-badge ' + (product.condition === 'likenew' ? 'pb-green' : d ? 'pb-red' : 'pb-orange') + '">' + (d ? '−' + d + '%' : getConditionLabel(product.condition)) + '</span></div><div class="pcard-body"><div class="p-brand">' + product.brand + '</div><div class="p-name">' + product.name + '</div><div class="p-cond">' + getConditionLabel(product.condition) + '</div></a><div class="pcard-foot"><div><div class="p-price">' + formatPrice(product.price) + '</div>' + (product.newPrice ? '<div class="p-old">' + formatPrice(product.newPrice) + '</div>' : '') + '</div><button class="add-btn add-to-cart-btn" data-id="' + product.id + '" aria-label="В корзину">+</button></div></article>';
}
function bindAddToCart`
);

mainJs = mainJs.replace(
  /function initProductPage\(\) \{[\s\S]*?\n\}/,
  `function initProductPage() {
  const mount = document.getElementById('productMount');
  if (!mount) return;
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  document.title = product.name + ' — КрохаКруг';
  const d = discount(product);
  const waText = encodeURIComponent('Здравствуйте! Интересует ' + product.name + ' за ' + formatPrice(product.price));
  const related = PRODUCTS.filter(p => p.type === product.type && p.id !== product.id).slice(0, 4).map((p, i) => productCard(p, i)).join('');
  mount.innerHTML = '<div class="breadcrumb"><a href="' + pageUrl('index.html') + '">Главная</a><s>›</s><a href="' + pageUrl('catalog.html') + '">Каталог</a><s>›</s><span>' + product.name + '</span></div><div class="product-grid"><div class="gallery"><div class="gallery-main">' + strollerIcon() + '<img src="' + product.img + '" alt="' + escAttr(product.name) + '" onerror="fixProductImg(this,\\'' + escAttr(product.name) + '\\')"></div></div><div class="prod-info"><div class="prod-badges"><span class="prod-badge pb-green">' + getConditionLabel(product.condition) + '</span>' + (d ? '<span class="prod-badge pb-red">−' + d + '%</span>' : '') + '</div><div class="prod-brand">' + product.brand + '</div><h1 class="prod-name">' + product.name + '</h1><div class="prod-type">' + getTypeLabel(product.type) + ' · ' + product.year + ' · ' + product.color + '</div><div class="prod-cond">Состояние: ' + getConditionLabel(product.condition) + '</div><div class="price-block"><div class="price-row"><span class="price-now">' + formatPrice(product.price) + '</span>' + (product.newPrice ? '<span class="price-old">' + formatPrice(product.newPrice) + '</span><span class="price-save">−' + d + '%</span>' : '') + '</div><div class="price-monthly">или <b>' + installment(product.price) + ' ₽/мес</b> в рассрочку на 12 месяцев</div></div><div class="cta-block"><button class="btn-cart add-to-cart-btn" data-id="' + product.id + '">В корзину</button><a class="btn-buy" href="https://wa.me/' + window.WHATSAPP_NUMBER + '?text=' + waText + '" target="_blank" rel="noopener">Купить в WhatsApp</a></div><div class="guarantees"><div class="guar"><div class="guar-icon">🛡️</div><div class="guar-text"><b>12-точечная проверка</b>Шасси, ткань, колёса, тормоза</div></div><div class="guar"><div class="guar-icon">↩️</div><div class="guar-text"><b>Возврат 14 дней</b>Без вопросов</div></div><div class="guar"><div class="guar-icon">📦</div><div class="guar-text"><b>Доставка 2–7 дней</b>По всей России</div></div></div><p style="font-size:.88rem;color:var(--mid);line-height:1.75">' + product.desc + '</p></div></div><div class="related"><h2>Похожие товары</h2><div class="rel-grid products">' + related + '</div></div>';
  bindAddToCart(mount);
}`
);

write(path.join(root, 'js/main.js'), mainJs);

execSync('node scripts/build-theme.mjs', { cwd: root, stdio: 'inherit' });

console.log('KrohaKrug import complete from', designDir);
