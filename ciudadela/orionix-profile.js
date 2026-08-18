/**
 * ORIONIX · Profile Universal Component v2.0
 * Componente flotante autoinyectable — funciona en toda la ciudadela.
 * Incluir al final del <body>: <script src="orionix-profile.js"></script>
 *
 * Características:
 * - Botón circular flotante fijo (esquina inferior derecha)
 * - Panel lateral deslizable con diseño único
 * - Personalización contextual por página
 * - Cambio de tema en tiempo real (persiste en localStorage)
 * - Sesión, navegación, accesos rápidos
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────────── */
  const PAGE_MAP = {
    'hub.html':         { label: 'Hub Principal',        icon: '⌂', color: '#e8c86a' },
    'agentes.html':     { label: 'Agentes',              icon: '✦', color: '#b87333' },
    'tienda.html':      { label: 'Tienda',               icon: '◇', color: '#e8c86a' },
    'articulos.html':   { label: 'Catálogo',             icon: '▣', color: '#e8c86a' },
    'carrito.html':     { label: 'Carrito',              icon: '◈', color: '#4ade80' },
    'admin.html':       { label: 'Arquitecto',           icon: '◆', color: '#f87171' },
    'nexus.html':       { label: 'NEXUS Chat',           icon: '⬡', color: '#3d8fd1' },
    'kabalion-2d.html': { label: 'Kabalion 2D',         icon: '◉', color: '#9b59b6' },
    'comunidad.html':   { label: 'Comunidad',            icon: '◎', color: '#2ecc71' },
    'hogar.html':       { label: 'Hogar',                icon: '⊕', color: '#e8c86a' },
    'mi-universo.html': { label: 'Mi Universo',          icon: '✧', color: '#e8c86a' },
    'auth.html':        { label: 'Acceso',               icon: '⊙', color: '#e8c86a' },
    'portal.html':      { label: 'Portal',               icon: '⊗', color: '#e8c86a' },
    'monitor.html':     { label: 'Monitor',              icon: '⊞', color: '#2ecc71' },
    'mesa-mando.html':  { label: 'Mesa de Mando',        icon: '⊟', color: '#6a3d9a' },
  };

  // Opciones de personalización específicas por página
  const PAGE_PERSONAL = {
    'hub.html': [
      { id: 'hub_layout', label: 'Disposición del Hub', type: 'select', opts: ['Grid Cards','Lista Vertical','Compacto'], default: 'Grid Cards' },
      { id: 'hub_anim', label: 'Animaciones', type: 'toggle', default: true },
      { id: 'hub_clock', label: 'Reloj visible', type: 'toggle', default: true },
    ],
    'agentes.html': [
      { id: 'ag_layout', label: 'Vista de Agentes', type: 'select', opts: ['Tarjetas','Panel Split','Compacto'], default: 'Tarjetas' },
      { id: 'ag_axel', label: 'Mostrar AXEL', type: 'toggle', default: true },
      { id: 'ag_mesa', label: 'Mesa siempre visible', type: 'toggle', default: true },
    ],
    'nexus.html': [
      { id: 'nx_fontsize', label: 'Tamaño de fuente', type: 'select', opts: ['Pequeño','Mediano','Grande'], default: 'Mediano' },
      { id: 'nx_timestamps', label: 'Mostrar hora', type: 'toggle', default: true },
      { id: 'nx_sound', label: 'Sonido al recibir', type: 'toggle', default: false },
    ],
    'tienda.html': [
      { id: 'tienda_cols', label: 'Columnas del catálogo', type: 'select', opts: ['2','3','4'], default: '3' },
      { id: 'tienda_prices', label: 'Mostrar precios', type: 'toggle', default: true },
      { id: 'tienda_affiliate', label: 'Panel afiliados', type: 'toggle', default: false },
    ],
    'articulos.html': [
      { id: 'art_view', label: 'Vista', type: 'select', opts: ['Grid','Lista','Masonry'], default: 'Grid' },
      { id: 'art_sort', label: 'Orden por defecto', type: 'select', opts: ['Precio ↑','Precio ↓','Nuevo','Nombre'], default: 'Nuevo' },
      { id: 'art_quick', label: 'Vista rápida al hover', type: 'toggle', default: true },
    ],
    'admin.html': [
      { id: 'adm_compact', label: 'Modo compacto', type: 'toggle', default: false },
      { id: 'adm_autosave', label: 'Auto-guardar borrador', type: 'toggle', default: true },
      { id: 'adm_confirm', label: 'Confirmar antes de publicar', type: 'toggle', default: true },
    ],
    'kabalion-2d.html': [
      { id: 'kb_glow', label: 'Glow de nodos', type: 'toggle', default: true },
      { id: 'kb_labels', label: 'Etiquetas visibles', type: 'toggle', default: true },
      { id: 'kb_speed', label: 'Velocidad animación', type: 'select', opts: ['Lenta','Normal','Rápida'], default: 'Normal' },
    ],
    'comunidad.html': [
      { id: 'com_feed', label: 'Vista del feed', type: 'select', opts: ['Cards','Timeline','Compacto'], default: 'Cards' },
      { id: 'com_notif', label: 'Notificaciones', type: 'toggle', default: true },
    ],
    'mi-universo.html': [
      { id: 'univ_grid', label: 'Columnas del mapa', type: 'select', opts: ['3','4','5','6'], default: '4' },
      { id: 'univ_search', label: 'Barra de búsqueda', type: 'toggle', default: true },
    ],
  };

  const TEMAS = {
    gold:   { label: 'Dorado',    main: '#e8c86a', dark: '#b89a40', light: '#f5e0a0', accent: '#e8c86a' },
    purple: { label: 'Púrpura',   main: '#9b59b6', dark: '#6a3d9a', light: '#c39bd3', accent: '#9b59b6' },
    green:  { label: 'Esmeralda', main: '#2ecc71', dark: '#1a7a40', light: '#82e0aa', accent: '#2ecc71' },
    red:    { label: 'Cosmos',    main: '#e84a2a', dark: '#a03020', light: '#f09080', accent: '#e84a2a' },
    blue:   { label: 'Zafiro',    main: '#3d8fd1', dark: '#1a4a7a', light: '#85c1e9', accent: '#3d8fd1' },
    rose:   { label: 'Rosa',      main: '#e86a8c', dark: '#a04060', light: '#f0a0b8', accent: '#e86a8c' },
  };

  const NAV_LINKS = [
    { href: 'hub.html',         label: 'Hub',           icon: '⌂' },
    { href: 'agentes.html',     label: 'Agentes',       icon: '✦' },
    { href: 'nexus.html',       label: 'NEXUS',         icon: '⬡' },
    { href: 'tienda.html',      label: 'Tienda',        icon: '◇' },
    { href: 'comunidad.html',   label: 'Comunidad',     icon: '◎' },
    { href: 'hogar.html',       label: 'Hogar',         icon: '⊕' },
    { href: 'mi-universo.html', label: 'Mi Universo',   icon: '✧' },
    { href: 'admin.html',       label: 'Admin',         icon: '◆', adminOnly: true },
    { href: 'kabalion-2d.html', label: 'Kabalion',      icon: '◉' },
  ];

  /* ─────────────────────────────────────────────────
     ESTADO
  ───────────────────────────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'hub.html';
  const pageInfo    = PAGE_MAP[currentPage] || { label: 'ORIONIX', icon: '✦', color: '#e8c86a' };
  let isOpen = false;
  let activeSection = 'nav'; // nav | personal | theme | settings | payments

  function getSesion() {
    try { return JSON.parse(localStorage.getItem('orionix_sesion') || 'null'); } catch { return null; }
  }
  function getTema() {
    return localStorage.getItem('orionix_tema') || 'gold';
  }
  function getPersonal(key, def) {
    try {
      const store = JSON.parse(localStorage.getItem('orionix_page_personal') || '{}');
      return key in store ? store[key] : def;
    } catch { return def; }
  }
  function setPersonal(key, val) {
    try {
      const store = JSON.parse(localStorage.getItem('orionix_page_personal') || '{}');
      store[key] = val;
      localStorage.setItem('orionix_page_personal', JSON.stringify(store));
    } catch {}
  }
  function applyTema(nombre) {
    const t = TEMAS[nombre] || TEMAS.gold;
    const root = document.documentElement;
    root.style.setProperty('--gold',       t.main);
    root.style.setProperty('--gold-dark',  t.dark);
    root.style.setProperty('--gold-light', t.light);
    root.style.setProperty('--gold-glow',  hexToRgba(t.main, 0.28));
    root.style.setProperty('--orionix-accent', t.accent);
    // Variables alternativas usadas en diferentes páginas
    root.style.setProperty('--accent',     t.main);
    localStorage.setItem('orionix_tema', nombre);
    // Actualizar píldoras
    document.querySelectorAll('.op-theme-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.tema === nombre);
    });
    toast('✦ Tema ' + t.label + ' aplicado');
  }
  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }
  // Aplicar tema guardado
  applyTema(getTema());

  /* ─────────────────────────────────────────────────
     ESTILOS
  ───────────────────────────────────────────────── */
  const STYLES = `
/* ── ORIONIX PROFILE UNIVERSAL ── */
#op-root * { box-sizing: border-box; margin: 0; padding: 0; }

#op-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9000;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  background: var(--gold, #e8c86a);
  background: linear-gradient(135deg, var(--gold-dark, #b89a40), var(--gold, #e8c86a));
  box-shadow: 0 0 0 1.5px rgba(255,255,255,.08), 0 4px 24px rgba(0,0,0,.6), 0 0 20px var(--gold-glow, rgba(232,200,106,.3));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cinzel', serif;
  font-size: .62rem;
  font-weight: 700;
  color: #07070a;
  letter-spacing: 1px;
  transition: all .25s cubic-bezier(.4,0,.2,1);
  outline: none;
  user-select: none;
}
#op-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 1.5px rgba(255,255,255,.15), 0 8px 32px rgba(0,0,0,.7), 0 0 30px var(--gold-glow, rgba(232,200,106,.4));
}
#op-btn:active { transform: scale(.96); }

#op-btn .op-btn-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
#op-btn .op-avatar-text {
  font-family: 'Cinzel', serif;
  font-size: .62rem;
  font-weight: 700;
  color: #07070a;
  letter-spacing: 1px;
  line-height: 1;
}
#op-btn .op-online {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4ade80;
  border: 2px solid #07070a;
  box-shadow: 0 0 8px #4ade80;
  animation: op-pulse 2s ease-in-out infinite;
}
@keyframes op-pulse {
  0%,100% { box-shadow: 0 0 6px #4ade80; }
  50% { box-shadow: 0 0 14px #4ade80, 0 0 24px rgba(74,222,128,.4); }
}

/* PAGE BADGE in button */
#op-btn .op-page-dot {
  position: absolute;
  top: -3px;
  left: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--op-page-color, #e8c86a);
  border: 2px solid #07070a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #07070a;
  font-weight: 700;
}

/* ── BACKDROP ── */
#op-backdrop {
  position: fixed;
  inset: 0;
  z-index: 8999;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(4px);
  opacity: 0;
  visibility: hidden;
  transition: all .3s;
}
#op-backdrop.open {
  opacity: 1;
  visibility: visible;
}

/* ── PANEL ── */
#op-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9001;
  width: 320px;
  max-width: 92vw;
  background: linear-gradient(180deg, #0a0a0e 0%, #07070a 100%);
  border-left: 1px solid rgba(232,200,106,.12);
  box-shadow: -12px 0 60px rgba(0,0,0,.8);
  transform: translateX(100%);
  transition: transform .32s cubic-bezier(.4,0,.2,1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Cormorant Garamond', Georgia, serif;
}
#op-panel.open {
  transform: translateX(0);
}

/* Shimmer line at top */
#op-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold, #e8c86a), transparent);
  animation: op-shimmer 3s linear infinite;
}
@keyframes op-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* ── PANEL HEADER ── */
.op-header {
  padding: 28px 24px 20px;
  border-bottom: 1px solid rgba(232,200,106,.08);
  position: relative;
  flex-shrink: 0;
}
.op-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  color: rgba(240,232,208,.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all .18s;
}
.op-close:hover {
  background: rgba(248,113,113,.1);
  border-color: rgba(248,113,113,.3);
  color: #f87171;
}

.op-user-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.op-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold-dark, #b89a40), var(--gold, #e8c86a));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cinzel', serif;
  font-size: .64rem;
  font-weight: 700;
  color: #07070a;
  flex-shrink: 0;
  box-shadow: 0 0 16px var(--gold-glow, rgba(232,200,106,.2));
}
.op-user-info {}
.op-user-name {
  font-family: 'Cinzel', serif;
  font-size: .55rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--gold, #e8c86a);
  margin-bottom: 3px;
}
.op-user-role {
  font-size: .78rem;
  color: rgba(138,127,104,.7);
  letter-spacing: .4px;
}

/* Page badge */
.op-page-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  background: rgba(255,255,255,.02);
  border: 1px solid rgba(232,200,106,.1);
  font-family: 'Cinzel', serif;
  font-size: .42rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--op-page-color, #e8c86a);
}
.op-page-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

/* ── SECTION TABS ── */
.op-tabs {
  display: flex;
  border-bottom: 1px solid rgba(232,200,106,.08);
  flex-shrink: 0;
}
.op-tab {
  flex: 1;
  padding: 10px 4px;
  text-align: center;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: .36rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(138,127,104,.6);
  border-bottom: 1.5px solid transparent;
  position: relative;
  bottom: -1px;
  transition: all .2s;
  user-select: none;
}
.op-tab:hover { color: rgba(240,232,208,.7); }
.op-tab.active {
  color: var(--gold, #e8c86a);
  border-bottom-color: var(--gold, #e8c86a);
}
.op-tab-icon { display: block; font-size: 12px; margin-bottom: 3px; }

/* ── SCROLLABLE BODY ── */
.op-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(232,200,106,.15) transparent;
}
.op-body::-webkit-scrollbar { width: 3px; }
.op-body::-webkit-scrollbar-track { background: transparent; }
.op-body::-webkit-scrollbar-thumb { background: rgba(232,200,106,.2); border-radius: 4px; }

/* ── SECTION ── */
.op-section {
  display: none;
  padding: 16px 0;
}
.op-section.active { display: block; }

/* ── NAV ITEMS ── */
.op-nav-group {
  padding: 4px 0;
  border-bottom: 1px solid rgba(232,200,106,.04);
}
.op-nav-group:last-child { border-bottom: none; }
.op-nav-label {
  padding: 8px 24px 4px;
  font-family: 'Cinzel', serif;
  font-size: .36rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(138,127,104,.4);
}
.op-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 24px;
  cursor: pointer;
  text-decoration: none;
  color: rgba(240,232,208,.7);
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: .95rem;
  letter-spacing: .3px;
  transition: all .15s;
  position: relative;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}
.op-nav-item:hover {
  background: rgba(232,200,106,.04);
  color: var(--gold-light, #f5e0a0);
  padding-left: 28px;
}
.op-nav-item.current {
  color: var(--gold, #e8c86a);
  background: rgba(232,200,106,.06);
}
.op-nav-item.current::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--gold, #e8c86a);
  box-shadow: 2px 0 8px var(--gold-glow, rgba(232,200,106,.4));
}
.op-nav-icon {
  width: 20px;
  text-align: center;
  flex-shrink: 0;
  font-size: .9rem;
  color: rgba(138,127,104,.6);
  transition: color .15s;
}
.op-nav-item:hover .op-nav-icon,
.op-nav-item.current .op-nav-icon {
  color: var(--gold, #e8c86a);
}
.op-nav-badge {
  margin-left: auto;
  font-family: 'Cinzel', serif;
  font-size: .34rem;
  letter-spacing: 1.5px;
  padding: 2px 7px;
  background: rgba(232,200,106,.1);
  color: var(--gold, #e8c86a);
  border: 1px solid rgba(232,200,106,.2);
  text-transform: uppercase;
}

/* ── PERSONAL SECTION ── */
.op-personal-page {
  padding: 12px 24px;
  margin: 0 0 4px;
}
.op-personal-page-title {
  font-family: 'Cinzel', serif;
  font-size: .46rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--gold, #e8c86a);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.op-personal-page-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(232,200,106,.2), transparent);
}
.op-field {
  margin-bottom: 16px;
}
.op-field label {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: .4rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(138,127,104,.7);
  margin-bottom: 7px;
}
.op-field select,
.op-field input[type=text] {
  width: 100%;
  background: rgba(0,0,0,.4);
  border: 1px solid rgba(232,200,106,.1);
  color: rgba(240,232,208,.85);
  padding: 9px 12px;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: .9rem;
  outline: none;
  appearance: none;
  transition: border-color .2s;
}
.op-field select:focus,
.op-field input[type=text]:focus {
  border-color: rgba(232,200,106,.35);
  background: rgba(232,200,106,.025);
}
.op-field select option { background: #0f0f14; }

/* Toggle */
.op-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
}
.op-toggle-label {
  font-size: .88rem;
  color: rgba(240,232,208,.6);
  letter-spacing: .3px;
}
.op-toggle {
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  cursor: pointer;
}
.op-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}
.op-toggle-track {
  position: absolute;
  inset: 0;
  border-radius: 22px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(232,200,106,.1);
  transition: all .25s;
}
.op-toggle-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(138,127,104,.6);
  transition: all .25s;
}
.op-toggle input:checked ~ .op-toggle-track {
  background: rgba(232,200,106,.12);
  border-color: var(--gold, #e8c86a);
}
.op-toggle input:checked ~ .op-toggle-thumb {
  left: calc(100% - 19px);
  background: var(--gold, #e8c86a);
  box-shadow: 0 0 8px rgba(232,200,106,.5);
}

/* No options state */
.op-no-personal {
  padding: 28px 24px;
  text-align: center;
}
.op-no-personal-icon { font-size: 1.8rem; margin-bottom: 12px; opacity: .4; }
.op-no-personal-text {
  font-size: .82rem;
  color: rgba(138,127,104,.5);
  line-height: 1.6;
  letter-spacing: .3px;
}

/* ── THEME SECTION ── */
.op-theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 16px 24px;
}
.op-theme-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(255,255,255,.02);
  border: 1px solid rgba(255,255,255,.06);
  cursor: pointer;
  transition: all .18s;
  user-select: none;
}
.op-theme-pill:hover {
  background: rgba(255,255,255,.04);
  border-color: rgba(255,255,255,.12);
}
.op-theme-pill.active {
  border-color: var(--gold, #e8c86a);
  background: rgba(232,200,106,.06);
}
.op-theme-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,.15);
  flex-shrink: 0;
  transition: transform .15s;
}
.op-theme-pill.active .op-theme-dot {
  border-color: var(--gold, #e8c86a);
  transform: scale(1.1);
  box-shadow: 0 0 10px currentColor;
}
.op-theme-name {
  font-family: 'Cinzel', serif;
  font-size: .42rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(240,232,208,.6);
}
.op-theme-pill.active .op-theme-name {
  color: var(--gold, #e8c86a);
}

/* ── SETTINGS SECTION ── */
.op-settings-block {
  padding: 14px 24px;
  border-bottom: 1px solid rgba(232,200,106,.05);
}
.op-settings-title {
  font-family: 'Cinzel', serif;
  font-size: .42rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(138,127,104,.5);
  margin-bottom: 12px;
}

/* ── PAYMENTS SECTION ── */
.op-pay-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 16px 24px 8px;
}
.op-pay-stat {
  background: rgba(232,200,106,.03);
  border: 1px solid rgba(232,200,106,.08);
  padding: 12px;
  text-align: center;
}
.op-pay-stat-val {
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  color: var(--gold, #e8c86a);
  margin-bottom: 3px;
}
.op-pay-stat-label {
  font-family: 'Cinzel', serif;
  font-size: .36rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(138,127,104,.5);
}

/* ── FOOTER ── */
.op-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(232,200,106,.06);
  flex-shrink: 0;
}
.op-signout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: rgba(248,113,113,.04);
  border: 1px solid rgba(248,113,113,.12);
  color: rgba(248,113,113,.7);
  font-family: 'Cinzel', serif;
  font-size: .44rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .18s;
  text-align: left;
}
.op-signout:hover {
  background: rgba(248,113,113,.08);
  border-color: rgba(248,113,113,.25);
  color: #f87171;
}

/* ── TOAST ── */
#op-toast {
  position: fixed;
  bottom: 90px;
  right: 28px;
  z-index: 9100;
  font-family: 'Cinzel', serif;
  font-size: .46rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 10px 18px;
  background: rgba(7,7,10,.97);
  border: 1px solid rgba(232,200,106,.25);
  color: var(--gold, #e8c86a);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 24px rgba(0,0,0,.6);
  opacity: 0;
  transform: translateY(8px);
  transition: all .25s;
  pointer-events: none;
  max-width: 240px;
  text-align: center;
}
#op-toast.show {
  opacity: 1;
  transform: translateY(0);
}

/* ── BTN ACTION ── */
.op-btn-action {
  display: block;
  width: calc(100% - 48px);
  margin: 0 24px 12px;
  padding: 12px;
  background: linear-gradient(135deg, var(--gold-dark, #b89a40), var(--gold, #e8c86a));
  border: none;
  color: #07070a;
  font-family: 'Cinzel', serif;
  font-size: .46rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 700;
  transition: opacity .2s, box-shadow .2s;
}
.op-btn-action:hover {
  opacity: .9;
  box-shadow: 0 4px 20px var(--gold-glow, rgba(232,200,106,.3));
}

/* ── DIVIDER ── */
.op-divider {
  height: 1px;
  background: rgba(232,200,106,.06);
  margin: 4px 0;
}

/* Mobile adjustments */
@media (max-width: 480px) {
  #op-btn { bottom: 20px; right: 20px; width: 48px; height: 48px; }
  #op-panel { width: 100%; max-width: 100%; }
}
`;

  /* ─────────────────────────────────────────────────
     BUILD DOM
  ───────────────────────────────────────────────── */
  function buildDOM() {
    // Style
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    // Root wrapper
    const root = document.createElement('div');
    root.id = 'op-root';

    // ── BACKDROP
    const backdrop = document.createElement('div');
    backdrop.id = 'op-backdrop';
    backdrop.onclick = close;
    root.appendChild(backdrop);

    // ── FAB BUTTON
    const btn = document.createElement('button');
    btn.id = 'op-btn';
    btn.onclick = toggle;
    btn.title = 'Mi perfil · ORIONIX';
    btn.style.setProperty('--op-page-color', pageInfo.color);

    const s = getSesion();
    const initials = s
      ? (s.nombre || 'KR').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
      : 'KR';

    btn.innerHTML = `
      <div class="op-btn-inner">
        <span class="op-avatar-text">${initials}</span>
        <span class="op-page-dot">${pageInfo.icon}</span>
        <span class="op-online"></span>
      </div>
    `;
    root.appendChild(btn);

    // ── PANEL
    const panel = document.createElement('div');
    panel.id = 'op-panel';

    // Header
    panel.innerHTML = `
      <div class="op-header">
        <button class="op-close" onclick="document.getElementById('op-root')._close()">✕</button>
        <div class="op-user-row">
          <div class="op-avatar" id="op-avatar-big">${initials}</div>
          <div class="op-user-info">
            <div class="op-user-name" id="op-user-name">${s ? (s.nombre || 'Kevin Ruiz') : 'Kevin Ruiz'}</div>
            <div class="op-user-role" id="op-user-role">${s ? (s.rol === 'admin' ? 'Creador · Admin' : s.rol || 'Visitante') : 'Creador · Admin'}</div>
          </div>
        </div>
        <div class="op-page-badge" style="color:${pageInfo.color}">
          <span class="op-page-badge-dot"></span>
          ${pageInfo.label}
        </div>
      </div>

      <div class="op-tabs">
        <div class="op-tab active" data-section="nav" onclick="document.getElementById('op-root')._tab('nav')">
          <span class="op-tab-icon">⌂</span>Nav
        </div>
        <div class="op-tab" data-section="personal" onclick="document.getElementById('op-root')._tab('personal')">
          <span class="op-tab-icon">✦</span>Página
        </div>
        <div class="op-tab" data-section="theme" onclick="document.getElementById('op-root')._tab('theme')">
          <span class="op-tab-icon">◈</span>Tema
        </div>
        <div class="op-tab" data-section="settings" onclick="document.getElementById('op-root')._tab('settings')">
          <span class="op-tab-icon">⚙</span>Config
        </div>
      </div>

      <div class="op-body">

        <!-- ── SECCIÓN: NAV ── -->
        <div class="op-section active" id="op-sec-nav">
          ${buildNav(s)}
        </div>

        <!-- ── SECCIÓN: PERSONALIZACIÓN DE PÁGINA ── -->
        <div class="op-section" id="op-sec-personal">
          ${buildPersonal()}
        </div>

        <!-- ── SECCIÓN: TEMA ── -->
        <div class="op-section" id="op-sec-theme">
          ${buildTheme()}
        </div>

        <!-- ── SECCIÓN: CONFIGURACIÓN ── -->
        <div class="op-section" id="op-sec-settings">
          ${buildSettings()}
        </div>

      </div>

      <div class="op-footer">
        <button class="op-signout" onclick="document.getElementById('op-root')._signout()">
          <span>⏻</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    `;

    root.appendChild(panel);

    // ── TOAST
    const toastEl = document.createElement('div');
    toastEl.id = 'op-toast';
    root.appendChild(toastEl);

    document.body.appendChild(root);

    // Expose methods via root element
    root._close   = close;
    root._tab     = switchSection;
    root._signout = signout;
  }

  function buildNav(s) {
    const isAdmin = s && s.rol === 'admin';
    const grouped = {
      main:   NAV_LINKS.filter(l => !l.adminOnly && ['hub.html','agentes.html','nexus.html'].includes(l.href)),
      tienda: NAV_LINKS.filter(l => !l.adminOnly && ['tienda.html','articulos.html','carrito.html'].includes(l.href)),
      comm:   NAV_LINKS.filter(l => !l.adminOnly && ['comunidad.html','hogar.html','mi-universo.html','kabalion-2d.html'].includes(l.href)),
      admin:  NAV_LINKS.filter(l => l.adminOnly),
    };

    const renderGroup = (label, links) => links.length === 0 ? '' : `
      <div class="op-nav-group">
        <div class="op-nav-label">${label}</div>
        ${links.map(l => {
          const isCurrent = currentPage === l.href;
          const show = !l.adminOnly || isAdmin;
          if (!show) return '';
          return `<a class="op-nav-item${isCurrent ? ' current' : ''}" href="${l.href}">
            <span class="op-nav-icon">${l.icon}</span>
            <span>${l.label}</span>
            ${isCurrent ? '<span class="op-nav-badge">aquí</span>' : ''}
          </a>`;
        }).join('')}
      </div>
    `;

    return renderGroup('Principal', grouped.main)
         + renderGroup('Tienda', grouped.tienda)
         + renderGroup('Comunidad', grouped.comm)
         + (isAdmin ? renderGroup('Admin', grouped.admin) : '');
  }

  function buildPersonal() {
    const opts = PAGE_PERSONAL[currentPage];
    if (!opts || opts.length === 0) {
      return `<div class="op-no-personal">
        <div class="op-no-personal-icon">${pageInfo.icon}</div>
        <div class="op-no-personal-text">No hay opciones de personalización<br>disponibles para <strong style="color:var(--gold)">${pageInfo.label}</strong>.</div>
      </div>`;
    }

    const fields = opts.map(opt => {
      if (opt.type === 'toggle') {
        const val = getPersonal(opt.id, opt.default);
        return `<div class="op-field">
          <div class="op-toggle-row">
            <span class="op-toggle-label">${opt.label}</span>
            <label class="op-toggle">
              <input type="checkbox" ${val ? 'checked' : ''} onchange="window._opSetPersonal('${opt.id}',this.checked)">
              <div class="op-toggle-track"></div>
              <div class="op-toggle-thumb"></div>
            </label>
          </div>
        </div>`;
      }
      if (opt.type === 'select') {
        const val = getPersonal(opt.id, opt.default);
        const options = opt.opts.map(o => `<option value="${o}" ${val===o?'selected':''}>${o}</option>`).join('');
        return `<div class="op-field">
          <label>${opt.label}</label>
          <select onchange="window._opSetPersonal('${opt.id}',this.value)">${options}</select>
        </div>`;
      }
      return '';
    }).join('');

    return `<div class="op-personal-page">
      <div class="op-personal-page-title">${pageInfo.icon} ${pageInfo.label}</div>
      ${fields}
      <button class="op-btn-action" onclick="window._opApplyPersonal()">Aplicar cambios</button>
    </div>`;
  }

  function buildTheme() {
    const current = getTema();
    return `<div style="padding:16px 24px 8px;">
      <div class="op-personal-page-title">◈ Tema Global</div>
    </div>
    <div class="op-theme-grid">
      ${Object.entries(TEMAS).map(([key, t]) => `
        <div class="op-theme-pill ${current===key?'active':''}" data-tema="${key}" onclick="window._opTheme('${key}',this)">
          <div class="op-theme-dot" style="background:${t.main};color:${t.main}"></div>
          <span class="op-theme-name">${t.label}</span>
        </div>
      `).join('')}
    </div>
    <div class="op-divider" style="margin:12px 24px;height:1px;background:rgba(232,200,106,.06);"></div>
    <div style="padding:0 24px 16px;">
      <div class="op-personal-page-title">◉ Tipografía</div>
      <div class="op-field">
        <label>Fuente principal</label>
        <select onchange="window._opFont(this.value)" id="op-font-sel">
          <option value="Cormorant" ${(localStorage.getItem('orionix_font')||'Cormorant')==='Cormorant'?'selected':''}>Cormorant Garamond</option>
          <option value="Cinzel" ${localStorage.getItem('orionix_font')==='Cinzel'?'selected':''}>Cinzel</option>
          <option value="Georgia" ${localStorage.getItem('orionix_font')==='Georgia'?'selected':''}>Georgia</option>
          <option value="serif" ${localStorage.getItem('orionix_font')==='serif'?'selected':''}>Serif del sistema</option>
        </select>
      </div>
    </div>`;
  }

  function buildSettings() {
    const s = getSesion();
    const cfg = JSON.parse(localStorage.getItem('orionix_config') || '{}');
    return `
    <div class="op-settings-block">
      <div class="op-settings-title">Cuenta</div>
      <div class="op-field">
        <label>Email</label>
        <input type="text" value="${s ? (s.email||'') : 'kevin.ruiz.bolsota@gmail.com'}" readonly style="opacity:.5;cursor:default;">
      </div>
      <div class="op-field">
        <label>Método de acceso</label>
        <input type="text" value="${s ? (s.metodo||'email') : 'admin'}" readonly style="opacity:.5;cursor:default;text-transform:capitalize;">
      </div>
    </div>
    <div class="op-settings-block">
      <div class="op-settings-title">Tienda</div>
      <div class="op-field">
        <label>Nombre</label>
        <input type="text" id="op-cfg-name" value="${cfg.tienda||'ORIONIX MAISON'}">
      </div>
      <div class="op-field">
        <label>Moneda predeterminada</label>
        <select id="op-cfg-moneda">
          <option value="EUR" ${(cfg.moneda||'EUR')==='EUR'?'selected':''}>EUR — Euro</option>
          <option value="USD" ${cfg.moneda==='USD'?'selected':''}>USD — Dólar</option>
          <option value="COP" ${cfg.moneda==='COP'?'selected':''}>COP — Peso</option>
        </select>
      </div>
      <button class="op-btn-action" onclick="window._opSaveConfig()" style="margin:8px 0 0;">Guardar</button>
    </div>
    <div class="op-settings-block">
      <div class="op-settings-title">Pagos</div>
      <div class="op-field">
        <label>PayPal</label>
        <input type="text" id="op-pay-paypal" value="${(JSON.parse(localStorage.getItem('orionix_pagos')||'{}')).paypal||''}">
      </div>
      <div class="op-field">
        <label>Telegram</label>
        <input type="text" id="op-pay-tg" value="${(JSON.parse(localStorage.getItem('orionix_pagos')||'{}')).telegram||''}">
      </div>
      <button class="op-btn-action" onclick="window._opSavePagos()" style="margin:8px 0 0;">Guardar Pagos</button>
    </div>
    <div class="op-settings-block">
      <div class="op-settings-title">Sistema</div>
      <div class="op-field">
        <div class="op-toggle-row">
          <span class="op-toggle-label">Animaciones reducidas</span>
          <label class="op-toggle">
            <input type="checkbox" ${localStorage.getItem('orionix_reduce_anim')==='1'?'checked':''} onchange="window._opReduceAnim(this.checked)">
            <div class="op-toggle-track"></div>
            <div class="op-toggle-thumb"></div>
          </label>
        </div>
      </div>
      <a class="op-nav-item" href="admin.html" style="padding:10px 0;margin-top:4px;">
        <span class="op-nav-icon">◆</span>
        <span>Portal de Productos</span>
      </a>
    </div>`;
  }

  /* ─────────────────────────────────────────────────
     ACTIONS (exposed globally)
  ───────────────────────────────────────────────── */
  window._opTheme = function(name, el) {
    applyTema(name);
    document.querySelectorAll('.op-theme-pill').forEach(p => p.classList.toggle('active', p.dataset.tema === name));
  };

  window._opFont = function(val) {
    localStorage.setItem('orionix_font', val);
    document.body.style.fontFamily = val === 'Cormorant' ? "'Cormorant Garamond',Georgia,serif"
                                   : val === 'Cinzel'   ? "'Cinzel',serif"
                                   : val === 'Georgia'  ? 'Georgia,serif'
                                   : 'serif';
    toast('✦ Fuente aplicada');
  };
  // Apply saved font
  (function() {
    const f = localStorage.getItem('orionix_font');
    if (f) window._opFont(f);
  })();

  window._opSetPersonal = function(key, val) {
    setPersonal(key, val);
    dispatchPersonalEvent(key, val);
  };

  window._opApplyPersonal = function() {
    const opts = PAGE_PERSONAL[currentPage];
    if (!opts) return;
    opts.forEach(opt => {
      const val = getPersonal(opt.id, opt.default);
      dispatchPersonalEvent(opt.id, val);
    });
    toast('✦ Personalización aplicada');
  };

  window._opSaveConfig = function() {
    const data = {
      tienda: document.getElementById('op-cfg-name')?.value || 'ORIONIX MAISON',
      moneda: document.getElementById('op-cfg-moneda')?.value || 'EUR',
    };
    const prev = JSON.parse(localStorage.getItem('orionix_config') || '{}');
    localStorage.setItem('orionix_config', JSON.stringify({...prev, ...data}));
    toast('✦ Configuración guardada');
  };

  window._opSavePagos = function() {
    const data = {
      paypal:   document.getElementById('op-pay-paypal')?.value || '',
      telegram: document.getElementById('op-pay-tg')?.value || '',
    };
    localStorage.setItem('orionix_pagos', JSON.stringify(data));
    toast('✦ Pagos guardados');
  };

  window._opReduceAnim = function(val) {
    localStorage.setItem('orionix_reduce_anim', val ? '1' : '0');
    document.documentElement.style.setProperty('--transition-speed', val ? '0s' : '');
    toast(val ? 'Animaciones reducidas' : 'Animaciones activas');
  };

  function dispatchPersonalEvent(key, val) {
    document.dispatchEvent(new CustomEvent('orionix:personal', { detail: { key, val } }));
  }

  /* ─────────────────────────────────────────────────
     PANEL CONTROL
  ───────────────────────────────────────────────── */
  function toggle() {
    isOpen ? close() : open();
  }
  function open() {
    isOpen = true;
    document.getElementById('op-panel').classList.add('open');
    document.getElementById('op-backdrop').classList.add('open');
    document.getElementById('op-btn').style.transform = 'scale(.9)';
  }
  function close() {
    isOpen = false;
    const panel = document.getElementById('op-panel');
    const backdrop = document.getElementById('op-backdrop');
    const btn = document.getElementById('op-btn');
    if (panel) panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (btn) btn.style.transform = '';
  }
  function switchSection(name) {
    activeSection = name;
    document.querySelectorAll('.op-tab').forEach(t => t.classList.toggle('active', t.dataset.section === name));
    document.querySelectorAll('.op-section').forEach(s => s.classList.toggle('active', s.id === 'op-sec-' + name));
  }
  function signout() {
    localStorage.removeItem('orionix_sesion');
    window.location.href = 'auth.html';
  }

  /* ─────────────────────────────────────────────────
     TOAST
  ───────────────────────────────────────────────── */
  let toastTimer;
  function toast(msg, dur = 2400) {
    const el = document.getElementById('op-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), dur);
  }
  // Expose globally so any page can call it
  window.orionixToast = toast;

  /* ─────────────────────────────────────────────────
     KEYBOARD
  ───────────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) close();
    // Ctrl+/ to toggle
    if (e.ctrlKey && e.key === '/') toggle();
  });

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  function init() {
    buildDOM();

    // Skip on auth page — don't block it
    if (currentPage === 'auth.html') {
      document.getElementById('op-btn').style.display = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
