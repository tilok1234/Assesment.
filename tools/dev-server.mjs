import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const host = '127.0.0.1';
const portFlag = process.argv.indexOf('--port');
const requestedPort = portFlag >= 0 ? Number(process.argv[portFlag + 1]) : Number(process.env.PORT || 4173);
const port = Number.isInteger(requestedPort) && requestedPort > 0 ? requestedPort : 4173;
const shouldOpen = process.argv.includes('--open');
const entryFile = 'Sprite Assembler.dc.html';

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.css', 'text/css; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
]);

function send(res, statusCode, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`);
    const decodedPath = decodeURIComponent(requestUrl.pathname);
    const relativePath = decodedPath === '/' ? entryFile : decodedPath.replace(/^\/+/, '');
    const target = path.resolve(root, relativePath);

    if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
      send(res, 403, 'Forbidden');
      return;
    }

    const info = await stat(target);
    if (!info.isFile()) {
      send(res, 404, 'Not found');
      return;
    }

    const contentType = contentTypes.get(path.extname(target).toLowerCase()) || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    createReadStream(target).pipe(res);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      send(res, 404, 'Not found');
      return;
    }
    send(res, 500, 'Internal server error');
  }
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  console.log(`Sprite Assembler is running at ${url}`);
  console.log('Press Ctrl+C to stop.');

  if (shouldOpen) {
    if (process.platform === 'win32') {
      spawn('cmd.exe', ['/c', 'start', '', url], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      }).unref();
    } else {
      console.log(`Open ${url} in your browser.`);
    }
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Run with --port <number> to choose another port.`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
