const http = require('http');
const { execFile } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 8765;
const ALLOWED_ORIGIN = 'https://kevinruizbolsota-svg.github.io';
const TOKEN_FILE = path.join(__dirname, '.axel-token');
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

function getToken() {
  if (fs.existsSync(TOKEN_FILE)) return fs.readFileSync(TOKEN_FILE, 'utf8').trim();
  const token = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(TOKEN_FILE, token, { mode: 0o600 });
  return token;
}

const TOKEN = getToken();

function headers() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-AXEL-Token',
    'Vary': 'Origin'
  };
}

function send(res, status, data) {
  res.writeHead(status, headers());
  res.end(JSON.stringify(data));
}

function authorized(req) {
  return req.headers.origin === ALLOWED_ORIGIN && req.headers['x-axel-token'] === TOKEN;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 30000) req.destroy();
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

async function askGroq(message, history = []) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { ok: false, configured: false, error: 'GROQ_API_KEY no configurada en AXEL Bridge.' };
  }

  const messages = [
    {
      role: 'system',
      content: 'Eres AXEL, el agente local de Kevin Ruiz (KRC). Eres preciso, directo y práctico. Puedes razonar sobre desarrollo, Windows, GitHub, terminal, ORIONIX y el ecosistema KRC. No inventes acciones que no hayas ejecutado. Si una acción requiere el terminal local, indica al usuario que puede ejecutarse desde el cuerpo/terminal de AXEL.'
    },
    ...history.slice(-10).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 4000) })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.25, max_tokens: 1200 })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { ok: false, configured: true, error: data?.error?.message || `Groq HTTP ${response.status}` };
  }

  return { ok: true, configured: true, model: GROQ_MODEL, answer: data?.choices?.[0]?.message?.content || '' };
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
    return send(res, 200, {
      ok: true,
      service: 'AXEL Bridge',
      host: HOST,
      port: PORT,
      brain: Boolean(process.env.GROQ_API_KEY),
      model: GROQ_MODEL
    });
  }

  if ((req.url === '/exec' || req.url === '/chat') && req.method === 'POST') {
    if (!authorized(req)) return send(res, 403, { ok: false, error: 'Origen o token no autorizado' });
    try {
      const body = await readBody(req);

      if (req.url === '/exec') {
        const command = String(body.command || '').trim();
        if (!command) return send(res, 400, { ok: false, error: 'Falta command' });
        if (command.length > 4000) return send(res, 413, { ok: false, error: 'Comando demasiado largo' });
        const result = await runPowerShell(command);
        return send(res, 200, result);
      }

      const message = String(body.message || '').trim();
      if (!message) return send(res, 400, { ok: false, error: 'Falta message' });
      if (message.length > 8000) return send(res, 413, { ok: false, error: 'Mensaje demasiado largo' });
      const result = await askGroq(message, Array.isArray(body.history) ? body.history : []);
      return send(res, result.ok ? 200 : 503, result);
    } catch (err) {
      return send(res, 400, { ok: false, error: err.message });
    }
  }

  send(res, 404, { ok: false, error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log('==============================================');
  console.log(' AXEL BRIDGE · CABEZA + CUERPO');
  console.log('==============================================');
  console.log(` Local API: http://${HOST}:${PORT}`);
  console.log(` Allowed origin: ${ALLOWED_ORIGIN}`);
  console.log(` AXEL TOKEN: ${TOKEN}`);
  console.log(` AI brain: ${process.env.GROQ_API_KEY ? 'GROQ ONLINE' : 'NO CONFIGURADO'}`);
  console.log('');
  console.log('No cierres esta ventana mientras AXEL esté conectado.');
});
