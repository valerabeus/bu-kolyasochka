# AGENTS.md

## Cursor Cloud specific instructions

This is a **purely static HTML/CSS/JS website** with no build tools, no package manager, and no dependencies to install. There is no lint, test, or build step configured in the repository.

### Running the dev server

All HTML pages reference assets under the `/bu-kolyasochka/` base path (designed for GitHub Pages). To serve locally:

```bash
mkdir -p /tmp/serve-root
ln -sfn /workspace /tmp/serve-root/bu-kolyasochka
python3 -m http.server 8080 --directory /tmp/serve-root
```

Then open `http://localhost:8080/bu-kolyasochka/index.html`.

### Key pages

| Page | URL |
|---|---|
| Homepage | `/bu-kolyasochka/index.html` |
| Catalog | `/bu-kolyasochka/catalog.html` |
| Product detail | `/bu-kolyasochka/product.html?id=<N>` (IDs 1–50) |

### Gotchas

- **Base path**: `js/site.js` sets `window.SITE_BASE` to `/bu-kolyasochka/` based on the URL path. All internal links and asset paths use this base. Do not serve at root `/` or assets will 404.
- **Product images**: The repo has no `img/` directory. `products.js` references `img/img_N.png` files, but the `fixProductImg()` fallback renders inline SVG placeholders when images fail to load. This is expected behavior locally.
- **Cart state**: Stored in `localStorage` under key `bukolyasochka_cart`. Clear it to reset cart state.
- **Checkout**: Redirects to `wa.me/79000000000` (WhatsApp). This is a placeholder number and the external redirect is expected to fail in isolated environments.
