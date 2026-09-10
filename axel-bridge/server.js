const http = require('http');
const { execFile } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 8765;
const ALLOWED_ORIGIN = 'https://kevinruizbolsota-svg.github.io';
const TOKEN_FILE = path.join(__dirname, '.axel-token');

function getToken() {
  if (fs.existsSync(TOKEN_FILE)) return fs.readFileSync(TOKEN_FILE, 'utf8').trim();
  const token = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(TOKEN_FILE, token, { mode: 0o600 });
  return token;
}

const TOKEN = getToken();

function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-AXEL-Token',
    'Vary': 'Origin'
  });
  res.end(body);
}

function authorized(req) {
  return req.headers.origin === ALLOWED_ORIGIN && req.headers['x-axel-token'] === TOKEN;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 20000) req.destroy();
    });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); }
      catch (e) { reject(new Error('JSON inválido')); }
    });
    req.on('error', reject);
  });
}

function runPowerShell(command, timeoutMs = 30000) {
  return new Promise((resolve) => {
    execFile('powershell.exe', [
      '-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
      '-Command', command
    ], { windowsHide: true, timeout: timeoutMs, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        code: error && typeof error.code === 'number' ? error.code : 0,
        stdout: stdout || '',
        stderr: stderr || (error ? String(error.message) : '')
      });
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-AXEL-Token',
      'Vary': 'Origin'
    });
    return res.end();
  }

  if (req.url === '/status' && req.method === 'GET') {
    return send(res, 200, { ok: true, service: 'AXEL Bridge', host: HOST, port: PORT });
  }

  if (req.url === '/exec' && req.method === 'POST') {
    if (!authorized(req)) return send(res, 403, { ok: false, error: 'Origen o token no autorizado' });
    try {
      const body = await readBody(req);
      const command = String(body.command || '').trim();
      if (!command) return send(res, 400, { ok: false, error: 'Falta command' });
      if (command.length > 4000) return send(res, 413, { ok: false, error: 'Comando demasiado largo' });
      const result = await runPowerShell(command);
      return send(res, 200, result);
    } catch (err) {
      return send(res, 400, { ok: false, error: err.message });
    }
  }

  send(res, 404, { ok: false, error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log('==============================================');
  console.log(' AXEL BRIDGE · WINDOWS TERMINAL');
  console.log('==============================================');
  console.log(` Local API: http://${HOST}:${PORT}`);
  console.log(` Allowed origin: ${ALLOWED_ORIGIN}`);
  console.log(` AXEL TOKEN: ${TOKEN}`);
  console.log('');
  console.log('No cierres esta ventana mientras AXEL esté conectado.');
});
