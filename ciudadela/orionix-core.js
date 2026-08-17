/**
 * ORIONIX CORE v1.0
 * Funciones compartidas para todas las páginas del Centro de Comando.
 * Incluir en cada página: <script src="orionix-core.js"></script>
 */

/* ═══════════════════════════════════════════════
   WEBHOOKS CENTRALES
═══════════════════════════════════════════════ */
const ORIONIX = {
  webhooks: {
    chat:    'https://lkevinruizl.app.n8n.cloud/webhook/kabalion-chat',
    mesa:    'https://lkevinruizl.app.n8n.cloud/webhook/kabalion-mesa',
    tienda:  'https://lkevinruizl.app.n8n.cloud/webhook/orionix-tienda',
    imagen:  'https://lkevinruizl.app.n8n.cloud/webhook/generar-imagen',
    voz:     'https://lkevinruizl.app.n8n.cloud/webhook/axel-voz',
    obsidian:'https://lkevinruizl.app.n8n.cloud/webhook/orionix-obsidian',
  },

  agentes: {
    axel:    { id:'axel',    nombre:'AXEL',        rol:'El Alma Creativa',   color:'#e8c86a', emoji:'✦' },
    claude:  { id:'claude',  nombre:'Claude Code', rol:'El Ingeniero',       color:'#b87333', emoji:'⚙️' },
    chatgpt: { id:'chatgpt', nombre:'ChatGPT',     rol:'El Estratega',       color:'#2ecc71', emoji:'🧠' },
    copilot: { id:'copilot', nombre:'Copilot',     rol:'El Constructor',     color:'#6a3d9a', emoji:'🔧' },
    qwen:    { id:'qwen',    nombre:'Qwen',         rol:'El Diseñador',       color:'#3d6a9a', emoji:'🎨' },
    n8n:     { id:'n8n',     nombre:'n8n',          rol:'El Director',        color:'#e84a2a', emoji:'⚡' },
  },

  paleta: {
    bg:      '#0b0b0d',
    gold:    '#e8c86a',
    goldClaro: '#f5e0a0',
    goldOscuro:'#b89a40',
    texto:   '#f0e8d0',
    purpura: '#6a3d9a',
    border:  'rgba(232,200,106,0.15)',
  },
};

/* ═══════════════════════════════════════════════
   SESIÓN / AUTH (localStorage)
═══════════════════════════════════════════════ */
const ADMIN_EMAIL = 'kevin.ruiz.bolsota@gmail.com';
const SESION_KEY  = 'orionix_sesion';
const CARRITO_KEY = 'orionix_carrito';

function getSesion() {
  try { return JSON.parse(localStorage.getItem(SESION_KEY) || 'null'); }
  catch { return null; }
}

function setSesion(data) {
  // Asignar rol automáticamente
  if (data.email && data.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    data.rol = 'admin';
  } else if (!data.rol) {
    data.rol = 'visitante';
  }
  if (!data.sesion_id) {
    data.sesion_id = 'ses_' + Math.random().toString(36).slice(2, 10);
  }
  localStorage.setItem(SESION_KEY, JSON.stringify(data));
  return data;
}

function cerrarSesion() {
  localStorage.removeItem(SESION_KEY);
  location.href = 'portal.html';
}

function requireAdmin() {
  const s = getSesion();
  if (!s || s.rol !== 'admin') {
    location.href = 'auth.html?next=' + encodeURIComponent(location.pathname);
  }
  return s;
}

function requireLogin() {
  const s = getSesion();
  if (!s) {
    location.href = 'auth.html?next=' + encodeURIComponent(location.pathname);
  }
  return s;
}

function requireAfiliado() {
  const s = getSesion();
  if (!s || (s.rol !== 'afiliado' && s.rol !== 'admin')) {
    location.href = 'auth.html?next=' + encodeURIComponent(location.pathname);
  }
  return s;
}

function generarCodigoAfiliado(email) {
  // Genera código tipo ORIONIX-A3F7 desde el email
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash |= 0;
  }
  return 'ORIONIX-' + Math.abs(hash).toString(36).slice(0,4).toUpperCase();
}

/* ═══════════════════════════════════════════════
   CARRITO (localStorage)
═══════════════════════════════════════════════ */
function getCarrito() {
  try { return JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]'); }
  catch { return []; }
}

function setCarrito(items) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
  actualizarBadgeCarrito();
}

function agregarAlCarrito(producto) {
  const carrito = getCarrito();
  const idx = carrito.findIndex(i => i.id === producto.id);
  if (idx >= 0) {
    carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  setCarrito(carrito);
  mostrarToast('✦ Añadido al carrito', 'ok');
}

function quitarDelCarrito(productoId) {
  setCarrito(getCarrito().filter(i => i.id !== productoId));
}

function calcularTotal(carrito, descuento = 0) {
  const subtotal = carrito.reduce((s, i) => s + (i.precio * (i.cantidad || 1)), 0);
  const descuentoAmt = subtotal * (descuento / 100);
  return { subtotal, descuentoAmt, total: subtotal - descuentoAmt };
}

function actualizarBadgeCarrito() {
  const badge = document.getElementById('carrito-badge');
  if (!badge) return;
  const total = getCarrito().reduce((s, i) => s + (i.cantidad || 1), 0);
  badge.textContent = total || '';
  badge.style.display = total ? 'flex' : 'none';
}

/* ═══════════════════════════════════════════════
   WEBHOOKS / API CALLS
═══════════════════════════════════════════════ */
async function llamarAgente(agente, mensaje, sesion) {
  const s = sesion || getSesion();
  const res = await fetch(ORIONIX.webhooks.chat, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mensaje,
      agente: agente || 'axel',
      sesion: s?.sesion_id || 'web',
    }),
  });
  return res.json();
}

async function llamarMesa(mision, prioridad = 'media') {
  const res = await fetch(ORIONIX.webhooks.mesa, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mision, prioridad, tipo: 'web', origen: 'ciudadela' }),
  });
  return res.json();
}

async function llamarTienda(accion, datos) {
  const res = await fetch(ORIONIX.webhooks.tienda, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accion, datos }),
  });
  return res.json();
}

/* ═══════════════════════════════════════════════
   UI HELPERS
═══════════════════════════════════════════════ */
function mostrarToast(msg, tipo = '', duracion = 3000) {
  let toast = document.getElementById('orionix-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'orionix-toast';
    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:9999;
      font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:2px;
      padding:10px 20px;border-radius:8px;border:1px solid;
      background:rgba(7,7,10,.95);backdrop-filter:blur(16px);
      transition:all .3s;opacity:0;transform:translateY(10px);
      pointer-events:none;text-transform:uppercase;
    `;
    document.body.appendChild(toast);
  }
  const colores = { ok:'#4ade80', err:'#f87171', '':'#e8c86a' };
  toast.style.color = colores[tipo] || '#e8c86a';
  toast.style.borderColor = (colores[tipo] || '#e8c86a').replace(')', ',0.3)').replace('rgb','rgba');
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, duracion);
}

function renderNavbar(paginaActual = '') {
  const s = getSesion();
  const nav = document.getElementById('orionix-nav');
  if (!nav) return;

  const links = [
    { href: 'tienda.html',      label: 'Tienda' },
    { href: 'agentes.html',     label: 'Agentes' },
    { href: 'comunidad.html',   label: 'Comunidad' },
    { href: 'hogar.html',       label: 'Hogar' },
    { href: 'mi-universo.html', label: 'Mi Universo' },
  ];

  nav.innerHTML = `
    <a href="hub.html" class="nav-logo">ORIONIX</a>
    <div class="nav-links">
      ${links.map(l => `
        <a href="${l.href}" class="nav-link ${paginaActual === l.href ? 'active' : ''}">${l.label}</a>
      `).join('')}
    </div>
    <div class="nav-user">
      ${s ? `
        <span class="nav-username">${s.nombre || s.email}</span>
        ${s.rol === 'admin' ? '<a href="admin.html" class="nav-admin">⚙ Admin</a>' : ''}
        <button onclick="cerrarSesion()" class="nav-logout">Salir</button>
      ` : `
        <a href="auth.html" class="nav-enter">Entrar</a>
      `}
      <a href="carrito.html" class="nav-cart">
        🛒 <span id="carrito-badge" style="display:none"></span>
      </a>
    </div>
  `;
  actualizarBadgeCarrito();
}

/* ═══════════════════════════════════════════════
   STARFIELD (canvas de estrellas — fondo cosmos)
   Uso: OrionixStarfield.init('canvas-id')
═══════════════════════════════════════════════ */
const OrionixStarfield = {
  init(canvasId, numStars = 150) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stars = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random(),
        s: Math.random() * 0.005 + 0.002,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(st => {
        st.o += st.s;
        if (st.o > 1 || st.o < 0) st.s *= -1;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,200,106,${st.o * 0.6})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
  }
};

/* ═══════════════════════════════════════════════
   FIREBASE CONFIG (proyecto: las-cronicas-de-krc)
═══════════════════════════════════════════════ */
ORIONIX.firebase = {
  apiKey:            "AIzaSyC_REEMPLAZAR",
  authDomain:        "las-cronicas-de-krc.firebaseapp.com",
  projectId:         "las-cronicas-de-krc",
  storageBucket:     "las-cronicas-de-krc.appspot.com",
  messagingSenderId: "REEMPLAZAR",
  appId:             "REEMPLAZAR"
};

/* ═══════════════════════════════════════════════
   ALIASES — exponer funciones en el objeto ORIONIX
   para que las páginas puedan llamar ORIONIX.xxx()
═══════════════════════════════════════════════ */
ORIONIX.getSesion              = getSesion;
ORIONIX.setSesion              = setSesion;
ORIONIX.cerrarSesion           = cerrarSesion;
ORIONIX.requireAdmin           = requireAdmin;
ORIONIX.requireLogin           = requireLogin;
ORIONIX.generarCodigoAfiliado  = generarCodigoAfiliado;
ORIONIX.getCarrito             = getCarrito;
ORIONIX.setCarrito             = setCarrito;
ORIONIX.agregarAlCarrito       = agregarAlCarrito;
ORIONIX.calcularTotal          = calcularTotal;
ORIONIX.llamarAgente           = llamarAgente;
ORIONIX.llamarMesa             = llamarMesa;
ORIONIX.llamarTienda           = llamarTienda;
ORIONIX.mostrarToast           = mostrarToast;

// Alias iniciarCosmos → OrionixStarfield.init
ORIONIX.iniciarCosmos = function(canvasId, color, numStars) {
  OrionixStarfield.init(canvasId, numStars || 150);
};

/* ═══════════════════════════════════════════════
   AUTO-INIT al cargar cualquier página
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar(location.pathname.split('/').pop());
  actualizarBadgeCarrito();
});
