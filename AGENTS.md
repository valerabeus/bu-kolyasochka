# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a zero-dependency, static HTML/CSS/vanilla-JS e-commerce site ("Б/У Колясочка" — used premium baby strollers). There is no build step, no package manager, and no backend. All product data is hardcoded in `js/products.js`.

### Running the dev server

The site expects to be served under the `/bu-kolyasochka/` path prefix (matching the GitHub Pages deployment path). To serve locally:

```bash
mkdir -p /tmp/site-root && ln -sfn /workspace /tmp/site-root/bu-kolyasochka
python3 -m http.server 8080 --directory /tmp/site-root
```

Then open `http://localhost:8080/bu-kolyasochka/index.html`.

Opening files directly via `file://` will **not** work because `js/site.js` computes `SITE_BASE` from the URL path at runtime.

### Pages

- `index.html` — Homepage (hero, categories, featured products, reviews, contact CTA)
- `catalog.html` — Product catalog with filtering (type, condition) and sorting
- `product.html?id=N` — Individual product detail page

### Known issues

- `WHATSAPP_NUMBER` was declared with `const` in both `cart.js` and `main.js`, causing a `SyntaxError` that blocks all JS execution. Fixed by removing the duplicate from `main.js`.

### Lint / test / build

There are no linters, test suites, or build commands configured for this project. Validation is done by manual browser testing.
