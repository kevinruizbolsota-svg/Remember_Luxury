/**
 * EL PARCHE IA — WIDGET SUPREMO KABALION SUITE
 * La esquina de los calle • Orionix Ecosystem
 * Compatible con Shopify, Webflow, WordPress o cualquier HTML.
 */

(function () {
  if (document.getElementById('el-parche-widget-root')) return;

  const RENDER_BASE = "https://n8n-latest-4uo1.onrender.com";
  const WHATSAPP_URL = "https://wa.me/573106150016?text=";

  let activeMode = 'paisa';

  // 1. INYECTAR ESTILOS CSS
  const style = document.createElement('style');
  style.id = 'el-parche-styles';
  style.textContent = `
    #el-parche-btn-launcher {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 99999;
      background: linear-gradient(135deg, #ffd700 0%, #c59b27 100%);
      color: #080b11;
      border: 1px solid rgba(255,215,0,0.6);
      border-radius: 50px;
      padding: 13px 22px;
      font-family: 'Cinzel', serif, system-ui;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 1.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.35);
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #el-parche-btn-launcher:hover {
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 15px 40px rgba(255,215,0,0.5);
    }

    #el-parche-modal {
      position: fixed;
      right: 24px;
      bottom: 85px;
      width: min(440px, calc(100vw - 32px));
      height: min(650px, calc(100vh - 110px));
      z-index: 100000;
      background: rgba(10, 14, 24, 0.96);
      border: 1px solid rgba(217, 180, 101, 0.35);
      border-radius: 20px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(217,180,101,0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      backdrop-filter: blur(20px);
      animation: parcheFadeIn 0.25s ease-out;
    }
    #el-parche-modal.is-open { display: flex; }
    @keyframes parcheFadeIn {
      from { opacity: 0; transform: translateY(15px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .ep-header {
      background: rgba(15, 20, 35, 0.9);
      border-bottom: 1px solid rgba(217, 180, 101, 0.2);
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ep-brand { display: flex; align-items: center; gap: 10px; }
    .ep-emblem {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(217,180,101,0.15); border: 1px solid #ffd700;
      display: grid; place-items: center; color: #ffd700; font-weight: bold;
    }
    .ep-title h4 { margin: 0; font-size: 0.95rem; color: #ffd700; font-weight: 700; letter-spacing: 0.5px; }
    .ep-title small { font-size: 0.72rem; color: #94a3b8; }
    .ep-close {
      background: transparent; border: none; color: #94a3b8; font-size: 1.4rem;
      cursor: pointer; padding: 4px 8px; border-radius: 6px;
    }
    .ep-close:hover { color: #fff; background: rgba(255,255,255,0.08); }

    .ep-modes {
      display: flex;
      gap: 6px;
      padding: 10px 14px;
      background: rgba(5, 8, 15, 0.85);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      overflow-x: auto;
    }
    .ep-mode-chip {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 5px 12px;
      font-size: 0.72rem;
      color: #cbd5e1;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ep-mode-chip.active {
      background: rgba(217,180,101,0.2);
      border-color: #ffd700;
      color: #ffd700;
      font-weight: 600;
    }

    .ep-msgs {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    .ep-msg {
      max-width: 86%;
      padding: 12px 15px;
      border-radius: 14px;
      font-size: 0.88rem;
      line-height: 1.45;
      word-break: break-word;
    }
    .ep-msg.user {
      align-self: flex-end;
      background: rgba(217, 180, 101, 0.18);
      border: 1px solid rgba(217, 180, 101, 0.4);
      color: #fff;
    }
    .ep-msg.bot {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
    }
    .ep-msg img {
      max-width: 100%; border-radius: 8px; margin-top: 8px; border: 1px solid #ffd700; display: block;
    }

    .ep-input-area {
      padding: 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
      background: rgba(8, 12, 20, 0.95);
      display: flex;
      gap: 8px;
    }
    .ep-input {
      flex: 1;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(217, 180, 101, 0.25);
      border-radius: 10px;
      padding: 10px 14px;
      color: #fff;
      font-size: 0.88rem;
      outline: none;
      resize: none;
      min-height: 42px;
      max-height: 100px;
      font-family: inherit;
    }
    .ep-input:focus { border-color: #ffd700; }
    .ep-send {
      background: #ffd700; color: #080b11; border: none; border-radius: 10px;
      padding: 0 16px; font-weight: 700; font-size: 0.85rem; cursor: pointer;
      display: grid; place-items: center; transition: all 0.2s;
    }
    .ep-send:hover { filter: brightness(1.15); }
    .ep-send:disabled { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  // 2. CREAR ELEMENTOS HTML
  const root = document.createElement('div');
  root.id = 'el-parche-widget-root';
  root.innerHTML = `
    <button id="el-parche-btn-launcher">
      <span>☕</span>
      <span>EL PARCHE IA</span>
    </button>

    <div id="el-parche-modal">
      <div class="ep-header">
        <div class="ep-brand">
          <div class="ep-emblem">✦</div>
          <div class="ep-title">
            <h4>El Parche • La esquina de los calle</h4>
            <small id="ep-mode-label">Asesor Oficial • Tienda & IA</small>
          </div>
        </div>
        <button class="ep-close" id="ep-close-btn">&times;</button>
      </div>

      <div class="ep-modes">
        <div class="ep-mode-chip active" data-mode="paisa">☕ Asesor Paisa</div>
        <div class="ep-mode-chip" data-mode="axel">⚡ AXEL (Groq 120B)</div>
        <div class="ep-mode-chip" data-mode="flux">🎨 Pintar FLUX</div>
        <div class="ep-mode-chip" data-mode="catalogo">🛍️ Catálogo</div>
        <div class="ep-mode-chip" data-mode="whatsapp">📲 Pedir WhatsApp</div>
      </div>

      <div class="ep-msgs" id="ep-msg-list">
        <div class="ep-msg bot">
          ¡Qué hubo parce! Bienvenido a <b>La esquina de los calle</b>. Pida un tintico ☕ y cuénteme qué está buscando hoy. Desde la aguja hasta la mansión, le colaboramos con todo.
        </div>
      </div>

      <div class="ep-input-area">
        <textarea class="ep-input" id="ep-text-input" placeholder="Pregunta sobre productos o crea una imagen..." rows="1"></textarea>
        <button class="ep-send" id="ep-send-btn">Enviar</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // 3. LOGICA Y EVENTOS
  const modal = document.getElementById('el-parche-modal');
  const launcher = document.getElementById('el-parche-btn-launcher');
  const closeBtn = document.getElementById('ep-close-btn');
  const sendBtn = document.getElementById('ep-send-btn');
  const textInput = document.getElementById('ep-text-input');
  const msgList = document.getElementById('ep-msg-list');
  const modeLabel = document.getElementById('ep-mode-label');

  launcher.onclick = () => { modal.classList.toggle('is-open'); textInput.focus(); };
  closeBtn.onclick = () => { modal.classList.remove('is-open'); };

  document.querySelectorAll('.ep-mode-chip').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.ep-mode-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeMode = chip.dataset.mode;

      if (activeMode === 'paisa') {
        modeLabel.innerText = 'Asesor Oficial • Tienda & IA';
        textInput.placeholder = 'Pregunta sobre productos, pedidos o charla conmigo...';
      } else if (activeMode === 'axel') {
        modeLabel.innerText = '⚡ AXEL Cerebro Central • Groq 120B';
        textInput.placeholder = 'Consulta estratégica o técnica...';
      } else if (activeMode === 'flux') {
        modeLabel.innerText = '🎨 Forja Visual FLUX 8K';
        textInput.placeholder = 'Describe la imagen que quieres pintar...';
      } else if (activeMode === 'catalogo') {
        showCatalog();
      } else if (activeMode === 'whatsapp') {
        window.open(WHATSAPP_URL + encodeURIComponent('Hola! Estoy en El Parche y quiero hacer una consulta.'), '_blank');
      }
    };
  });

  function addMsg(text, isUser = false, imgUrl = null) {
    const d = document.createElement('div');
    d.className = `ep-msg ${isUser ? 'user' : 'bot'}`;
    let html = `<div>${text}</div>`;
    if (imgUrl) {
      html += `<img src="${imgUrl}" alt="Generada"><br><a href="${imgUrl}" target="_blank" style="color:#ffd700; font-size:0.75rem;">Ver en alta calidad ↗</a>`;
    }
    d.innerHTML = html;
    msgList.appendChild(d);
    msgList.scrollTop = msgList.scrollHeight;
  }

  function showCatalog() {
    addMsg(`🛍️ <b>Catálogos Destacados:</b><br><br>
    • <a href="/collections/el-parche-paisa" target="_blank" style="color:#ffd700;">🌿 El Parche Paisa (282 productos)</a><br>
    • <a href="/collections/bolsos-y-accesorios" target="_blank" style="color:#ffd700;">👜 Bolsos & Accesorios (35 productos)</a><br>
    • <a href="/collections/difusores-fuego-alquimico" target="_blank" style="color:#ffd700;">🔥 Difusores & Fuego Alquímico</a><br>
    • <a href="/collections/all" target="_blank" style="color:#ffd700;">✨ Ver Todo el Catálogo</a><br><br>
    ¿Quieres pedir algo? ¡Escríbeme o dale al botón de WhatsApp!`);
  }

  async function handleSend() {
    const q = textInput.value.trim();
    if (!q || sendBtn.disabled) return;
    textInput.value = '';
    addMsg(q, true);
    sendBtn.disabled = true;

    try {
      if (activeMode === 'flux' || q.toLowerCase().startsWith('/imagen') || q.toLowerCase().startsWith('pinta')) {
        const prompt = q.replace(/^\/imagen/i, '').replace(/^(pinta|crea una imagen)/i, '').trim() || q;
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' ultra luxury 8k cinematic lighting')}?width=1024&height=1024&nologo=true&model=flux`;
        addMsg(`🎨 Imagen forjada para: "${prompt}"`, false, imgUrl);
      } else if (activeMode === 'axel') {
        const res = await fetch(`${RENDER_BASE}/webhook/portal-central`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accion: 'consultar', prompt: q })
        });
        const data = await res.json();
        addMsg(data.respuesta || JSON.stringify(data));
      } else {
        // MODO PAISA
        try {
          const res = await fetch("https://bedixienygfeqtadzeng.supabase.co/functions/v1/parche_paisa", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: q,
              mode: 'parche',
              style: 'paisa',
              store: "La esquina de los calle: Tienda colombiana. WhatsApp: 573106150016."
            })
          });
          const d = await res.json();
          addMsg(d.answer || d.message);
        } catch(e) {
          addMsg("¡Qué hubo mi rey! Con todo el gusto le atiendo. Para pedidos directos escríbanos al WhatsApp 3106150016.");
        }
      }
    } catch(err) {
      addMsg("Error al conectar con el servidor: " + err.message);
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.onclick = handleSend;
  textInput.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

})();
