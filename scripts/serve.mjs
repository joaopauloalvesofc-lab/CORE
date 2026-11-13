import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.json': 'application/json', '.pdf': 'application/pdf',
};

createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== resolve(root) && !file.startsWith(resolve(root) + sep)) {
      res.writeHead(403).end();
      return;
    }
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) {
        const target = new URL(req.url, 'http://localhost');
        res.writeHead(308, { Location: target.pathname + '/' + target.search }).end();
        return;
      }
      file = resolve(file, 'index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Content-Length': body.length,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 : error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500;
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>CORE Gestão</title><h1>${status === 404 ? 'Página não encontrada' : 'Não foi possível abrir esta página'}</h1><a href="/">Voltar ao início</a></html>`);
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`CORE Gestão disponível em http://localhost:${port}`);
}).on('error', error => {
  console.error(`Não foi possível iniciar o site: ${error.message}`);
  process.exitCode = 1;
});
