import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const basePath = '/bu-kolyasochka';
const port = Number(process.env.PORT) || 8765;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function safeFile(relPath) {
  const file = path.resolve(repoRoot, relPath);
  const rel = path.relative(repoRoot, file);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return file;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === '/') {
    res.writeHead(302, { Location: `${basePath}/index.html` });
    res.end();
    return;
  }

  if (!pathname.startsWith(basePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Откройте: http://127.0.0.1:${port}${basePath}/index.html`);
    return;
  }

  let rel = pathname.slice(basePath.length) || '/index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  rel = rel.replace(/^\//, '').replace(/\//g, path.sep);

  const file = safeFile(rel);
  if (!file) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 ${pathname}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}${basePath}/index.html`;
  console.log('Сервер запущен');
  console.log(url);
  console.log('Остановка: Ctrl+C');
});
