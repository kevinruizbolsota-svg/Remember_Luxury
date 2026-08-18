/**
 * ORIONIX Universal Chat Input Component v1.0
 * Mic | Files (image/video/PDF/any) | Modes (Chat/Imagen/Video/Web)
 * Incluir en cualquier página: <script src="orionix-chat.js"></script>
 * Usar: OrionixChat.mount('#contenedor', config)
 */

window.OrionixChat = (function () {

  /* ── CONSTANTES ─────────────────────────────── */
  const VOICE_WEBHOOK = 'https://lkevinruizl.app.n8n.cloud/webhook/axel-voz';
  const MAX_FILE_MB   = 8; // base64 safe para webhooks n8n (~11MB raw = ~8MB real)
  const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

  const MODES = {
    chat:  { id:'chat',   icon:'💬', label:'Chat',    hint:'Escribe un mensaje...',                    color:'#e8c86a' },
    image: { id:'image',  icon:'🖼️', label:'Imagen',  hint:'Describe la imagen que quieres crear...', color:'#60a5fa' },
    video: { id:'video',  icon:'🎥', label:'Video',   hint:'Describe el video o pega una URL...',      color:'#f87171' },
    web:   { id:'web',    icon:'🌐', label:'Web',     hint:'Describe la página web que quieres...',    color:'#4ade80' },
  };

  const CSS = `
.orx-chat-root * { box-sizing:border-box; margin:0; padding:0; }

/* ── INPUT AREA ─── */
.orx-input-area {
  background: rgba(10,10,14,0.92);
  border: 1px solid rgba(232,200,106,0.18);
  border-radius: 12px;
  padding: 10px 12px;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* ── MODE BAR ─── */
.orx-mode-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.orx-mode-btn {
  font-family: 'Cinzel', serif;
  font-size: .44rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(232,200,106,0.15);
  background: transparent;
  color: rgba(240,232,208,0.45);
  cursor: pointer;
  transition: all .22s;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.orx-mode-btn:hover { color: rgba(240,232,208,0.8); border-color: rgba(232,200,106,0.35); }
.orx-mode-btn.active {
  color: var(--orx-mode-color, #e8c86a);
  border-color: var(--orx-mode-color, #e8c86a);
  background: rgba(232,200,106,0.07);
  box-shadow: 0 0 10px rgba(232,200,106,0.1);
}

/* ── FILE PREVIEWS ─── */
.orx-previews {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 4px 0;
}
.orx-preview-item {
  position: relative;
  border-radius: 7px;
  overflow: hidden;
  border: 1px solid rgba(232,200,106,0.2);
  background: rgba(0,0,0,0.4);
  flex-shrink: 0;
}
.orx-preview-item img {
  width: 60px; height: 60px;
  object-fit: cover; display: block;
}
.orx-preview-item .orx-file-thumb {
  width: 60px; height: 60px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 3px; padding: 4px;
}
.orx-preview-item .orx-file-thumb .orx-ficon { font-size: 1.4rem; }
.orx-preview-item .orx-file-thumb .orx-fname {
  font-size: .5rem; color: rgba(240,232,208,0.6);
  text-align: center; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
  max-width: 56px;
}
.orx-preview-item .orx-remove-file {
  position: absolute; top: 3px; right: 3px;
  width: 16px; height: 16px; border-radius: 50%;
  background: rgba(248,113,113,0.85);
  border: none; cursor: pointer; color: #fff;
  font-size: .6rem; display: flex; align-items: center; justify-content: center;
  line-height: 1;
}

/* ── TEXT ROW ─── */
.orx-text-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.orx-textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #f0e8d0;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  min-height: 36px;
  max-height: 160px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.orx-textarea::placeholder { color: rgba(138,127,104,0.45); }
.orx-textarea::-webkit-scrollbar { width: 3px; }
.orx-textarea::-webkit-scrollbar-thumb { background: rgba(232,200,106,0.2); }

/* ── ACTION BTNS ─── */
.orx-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.orx-icon-btn {
  width: 36px; height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(232,200,106,0.15);
  background: transparent;
  color: rgba(240,232,208,0.45);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  transition: all .22s;
  flex-shrink: 0;
  position: relative;
}
.orx-icon-btn:hover { color: #e8c86a; border-color: rgba(232,200,106,0.4); }
.orx-icon-btn.recording {
  color: #f87171 !important;
  border-color: #f87171 !important;
  animation: orx-pulse 1s ease-in-out infinite;
}
.orx-icon-btn.processing {
  color: #e8c86a !important;
  border-color: rgba(232,200,106,0.4) !important;
  animation: orx-spin 1s linear infinite;
}
@keyframes orx-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(248,113,113,0.4)} 50%{box-shadow:0 0 0 6px rgba(248,113,113,0)} }
@keyframes orx-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

.orx-send-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #b89a40, #e8c86a, #f5e0a0);
  background-size: 200% auto;
  color: #07070a;
  font-family: 'Cinzel', serif;
  font-size: .52rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-position .4s, box-shadow .3s;
  flex-shrink: 0;
}
.orx-send-btn:hover { background-position: right center; box-shadow: 0 0 16px rgba(232,200,106,0.25); }
.orx-send-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── STATUS ─── */
.orx-status {
  font-family: 'Cinzel', serif;
  font-size: .44rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(138,127,104,0.7);
  display: none;
  text-align: center;
  padding: 4px 0 0;
}
.orx-status.visible { display: block; }
.orx-status.ok  { color: #4ade80; }
.orx-status.err { color: #f87171; }

/* ── FILE INPUT hidden ─── */
.orx-file-input { display: none; }

/* ── MODE BADGE (se inyecta en el header del agente) ─── */
.orx-mode-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Cinzel', serif;
  font-size: .44rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 12px;
  border: 1px solid;
  vertical-align: middle;
  margin-left: 8px;
  transition: all .3s;
  white-space: nowrap;
}
`;

  /* ── HELPERS ─────────────────────────────────── */
  function fileIcon(type) {
    if (!type) return '📎';
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.includes('pdf'))      return '📄';
    if (type.includes('audio'))    return '🎵';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('text') || type.includes('json') || type.includes('javascript')) return '📝';
    return '📎';
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // data URL
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function injectCSS() {
    if (document.getElementById('orx-chat-css')) return;
    const style = document.createElement('style');
    style.id = 'orx-chat-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /* ── RECORDER ────────────────────────────────── */
  class Recorder {
    constructor() {
      this.stream    = null;
      this.recorder  = null;
      this.chunks    = [];
      this.recording = false;
    }

    async start() {
      this.stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.chunks   = [];
      this.recorder = new MediaRecorder(this.stream);
      this.recorder.ondataavailable = e => { if (e.data.size > 0) this.chunks.push(e.data); };
      this.recorder.start(200);
      this.recording = true;
    }

    stop() {
      return new Promise(resolve => {
        this.recorder.onstop = () => {
          // Prefer webm, fallback to whatever was captured
          const mimeType = this.recorder.mimeType || 'audio/webm';
          const blob = new Blob(this.chunks, { type: mimeType });
          this.stream.getTracks().forEach(t => t.stop());
          this.recording = false;
          resolve({ blob, mimeType });
        };
        this.recorder.stop();
      });
    }
  }

  /* ── MAIN INSTANCE ───────────────────────────── */
  class ChatInput {
    /**
     * @param {HTMLElement} container  — elemento donde se monta
     * @param {Object} config
     *   onSend(payload)  — callback con { text, mode, files:[{name,type,dataUrl}] }
     *   badgeEl          — (opcional) HTMLElement donde inyectar el badge de modo
     *   placeholder      — texto por defecto del textarea
     *   sendLabel        — texto del botón enviar (default 'Enviar')
     */
    constructor(container, config = {}) {
      this.container  = container;
      this.config     = config;
      this.mode       = 'chat';
      this.files      = [];   // { file, dataUrl, name, type }
      this.recorder   = new Recorder();
      this.transcribing = false;

      injectCSS();
      this._render();
      this._bind();
    }

    /* ── RENDER ── */
    _render() {
      this.root = document.createElement('div');
      this.root.className = 'orx-chat-root';
      this.root.innerHTML = `
        <div class="orx-input-area">

          <!-- MODE BAR -->
          <div class="orx-mode-bar">
            ${Object.values(MODES).map(m => `
              <button class="orx-mode-btn${m.id==='chat'?' active':''}"
                data-mode="${m.id}"
                style="--orx-mode-color:${m.color}">
                ${m.icon} ${m.label}
              </button>`).join('')}
          </div>

          <!-- FILE PREVIEWS -->
          <div class="orx-previews" id="orx-previews-${this._uid}" style="display:none"></div>

          <!-- TEXT + ACTIONS -->
          <div class="orx-text-row">
            <textarea class="orx-textarea"
              id="orx-textarea-${this._uid}"
              rows="1"
              placeholder="${this.config.placeholder || MODES.chat.hint}"></textarea>

            <div class="orx-actions">
              <!-- MIC -->
              <button class="orx-icon-btn" id="orx-mic-${this._uid}" title="Micrófono">🎙️</button>

              <!-- FILE PICKER -->
              <button class="orx-icon-btn" id="orx-file-${this._uid}" title="Adjuntar archivo">📎</button>
              <input class="orx-file-input" id="orx-fileinput-${this._uid}"
                type="file" multiple accept="*/*">

              <!-- SEND -->
              <button class="orx-send-btn" id="orx-send-${this._uid}">
                ${this.config.sendLabel || 'Enviar'}
              </button>
            </div>
          </div>

          <!-- STATUS -->
          <div class="orx-status" id="orx-status-${this._uid}"></div>
        </div>
      `;
      this.container.appendChild(this.root);

      // Refs
      this.$modeBar  = this.root.querySelector('.orx-mode-bar');
      this.$previews = this.root.querySelector(`#orx-previews-${this._uid}`);
      this.$textarea = this.root.querySelector(`#orx-textarea-${this._uid}`);
      this.$mic      = this.root.querySelector(`#orx-mic-${this._uid}`);
      this.$fileBtn  = this.root.querySelector(`#orx-file-${this._uid}`);
      this.$fileInp  = this.root.querySelector(`#orx-fileinput-${this._uid}`);
      this.$send     = this.root.querySelector(`#orx-send-${this._uid}`);
      this.$status   = this.root.querySelector(`#orx-status-${this._uid}`);
    }

    get _uid() {
      if (!this.__uid) this.__uid = Math.random().toString(36).slice(2,7);
      return this.__uid;
    }

    /* ── BIND ── */
    _bind() {
      // Mode buttons
      this.$modeBar.addEventListener('click', e => {
        const btn = e.target.closest('.orx-mode-btn');
        if (!btn) return;
        this._setMode(btn.dataset.mode);
      });

      // Auto-resize textarea
      this.$textarea.addEventListener('input', () => {
        this.$textarea.style.height = 'auto';
        this.$textarea.style.height = Math.min(this.$textarea.scrollHeight, 160) + 'px';
      });

      // Enter to send (Shift+Enter = newline)
      this.$textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._send(); }
      });

      // Mic
      this.$mic.addEventListener('click', () => this._toggleMic());

      // File picker
      this.$fileBtn.addEventListener('click', () => this.$fileInp.click());
      this.$fileInp.addEventListener('change', e => this._handleFiles(e.target.files));

      // Send
      this.$send.addEventListener('click', () => this._send());

      // Paste images
      this.$textarea.addEventListener('paste', e => {
        const items = e.clipboardData?.items || [];
        for (const item of items) {
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) this._addFile(file);
          }
        }
      });

      // Drag & drop on input area
      const area = this.root.querySelector('.orx-input-area');
      area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor='rgba(232,200,106,0.6)'; });
      area.addEventListener('dragleave', () => { area.style.borderColor=''; });
      area.addEventListener('drop', e => {
        e.preventDefault(); area.style.borderColor='';
        const files = e.dataTransfer?.files;
        if (files?.length) this._handleFiles(files);
      });
    }

    /* ── MODE ── */
    _setMode(modeId) {
      this.mode = modeId;
      const m = MODES[modeId] || MODES.chat;

      // Update mode buttons
      this.$modeBar.querySelectorAll('.orx-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === modeId);
      });

      // Update placeholder
      this.$textarea.placeholder = m.hint;

      // Update badge in agent header if configured
      if (this.config.badgeEl) {
        this.config.badgeEl.innerHTML = `<span class="orx-mode-badge"
          style="color:${m.color};border-color:${m.color};background:${m.color}18">
          ${m.icon} ${m.label}
        </span>`;
      }

      // Callback
      if (this.config.onModeChange) this.config.onModeChange(modeId, m);
    }

    /* ── FILES ── */
    async _handleFiles(fileList) {
      for (const file of fileList) {
        await this._addFile(file);
      }
      this.$fileInp.value = ''; // reset so same file can be re-selected
    }

    async _addFile(file) {
      // Size check
      if (file.size > MAX_FILE_BYTES) {
        // For video we allow URL workaround
        if (file.type.startsWith('video/')) {
          this._showStatus(`⚠️ Video demasiado grande (${(file.size/1024/1024).toFixed(0)}MB > ${MAX_FILE_MB}MB). Pega la URL del video en su lugar.`, 'err', 6000);
        } else {
          this._showStatus(`⚠️ Archivo muy grande (${(file.size/1024/1024).toFixed(0)}MB). Máximo ${MAX_FILE_MB}MB por archivo.`, 'err', 5000);
        }
        return;
      }

      try {
        const dataUrl = await fileToBase64(file);
        const entry   = { file, dataUrl, name: file.name, type: file.type || 'application/octet-stream' };
        this.files.push(entry);
        this._renderPreviews();
      } catch(e) {
        this._showStatus('Error al leer el archivo.', 'err', 3000);
      }
    }

    _renderPreviews() {
      if (!this.files.length) {
        this.$previews.style.display = 'none';
        this.$previews.innerHTML = '';
        return;
      }
      this.$previews.style.display = 'flex';
      this.$previews.innerHTML = this.files.map((f, i) => {
        const isImg = f.type.startsWith('image/');
        const thumb = isImg
          ? `<img src="${f.dataUrl}" alt="${f.name}">`
          : `<div class="orx-file-thumb">
               <span class="orx-ficon">${fileIcon(f.type)}</span>
               <span class="orx-fname">${f.name.split('.')[0]}</span>
             </div>`;
        return `<div class="orx-preview-item">
          ${thumb}
          <button class="orx-remove-file" data-idx="${i}">✕</button>
        </div>`;
      }).join('');

      // Remove file buttons
      this.$previews.querySelectorAll('.orx-remove-file').forEach(btn => {
        btn.addEventListener('click', () => {
          this.files.splice(parseInt(btn.dataset.idx), 1);
          this._renderPreviews();
        });
      });
    }

    /* ── MIC ── */
    async _toggleMic() {
      if (this.transcribing) return;

      if (this.recorder.recording) {
        // STOP & transcribe
        this.$mic.className = 'orx-icon-btn processing';
        this.$mic.textContent = '⏳';
        this.$mic.title = 'Transcribiendo...';
        this._showStatus('Transcribiendo audio...', '', 0);

        try {
          const { blob, mimeType } = await this.recorder.stop();
          this.transcribing = true;

          // Convert to base64 via FileReader (reliable cross-browser)
          const dataUrl = await fileToBase64(blob);
          const base64  = dataUrl.split(',')[1];

          const res  = await fetch(VOICE_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64, mimeType: 'audio/webm' }),
          });
          const data = await res.json();

          if (data.ok && data.texto) {
            const cur = this.$textarea.value.trim();
            this.$textarea.value = cur ? cur + ' ' + data.texto : data.texto;
            this.$textarea.dispatchEvent(new Event('input'));
            this.$textarea.focus();
            this._showStatus('✦ Transcripción lista', 'ok', 3000);
          } else {
            this._showStatus(data.mensaje || 'No se entendió. Intenta de nuevo.', 'err', 4000);
          }
        } catch(e) {
          this._showStatus('Error de transcripción — verifica tu conexión.', 'err', 4000);
        }

        this.transcribing = false;
        this.$mic.className = 'orx-icon-btn';
        this.$mic.textContent = '🎙️';
        this.$mic.title = 'Micrófono';

      } else {
        // START recording
        try {
          await this.recorder.start();
          this.$mic.className = 'orx-icon-btn recording';
          this.$mic.textContent = '⏹️';
          this.$mic.title = 'Detener grabación';
          this._showStatus('● Grabando... (pulsa de nuevo para detener)', '', 0);
        } catch(e) {
          if (e.name === 'NotAllowedError') {
            this._showStatus('Micrófono bloqueado — permite el acceso en tu navegador.', 'err', 5000);
          } else {
            this._showStatus('No se pudo acceder al micrófono: ' + e.message, 'err', 5000);
          }
        }
      }
    }

    /* ── SEND ── */
    async _send() {
      const text = this.$textarea.value.trim();
      if (!text && !this.files.length) return;

      const payload = {
        text,
        mode:  this.mode,
        modeLabel: MODES[this.mode]?.label || 'Chat',
        files: this.files.map(f => ({
          name:    f.name,
          type:    f.type,
          dataUrl: f.dataUrl,
          size:    f.file.size,
        })),
      };

      // Reset
      this.$textarea.value = '';
      this.$textarea.style.height = 'auto';
      this.files = [];
      this._renderPreviews();

      if (this.config.onSend) {
        await this.config.onSend(payload);
      }
    }

    /* ── STATUS ── */
    _showStatus(msg, type = '', duration = 4000) {
      this.$status.textContent = msg;
      this.$status.className   = 'orx-status visible' + (type ? ' ' + type : '');
      if (duration > 0) {
        setTimeout(() => {
          this.$status.className = 'orx-status';
        }, duration);
      }
    }

    /* ── PUBLIC API ── */
    getValue()        { return this.$textarea.value; }
    setValue(v)       { this.$textarea.value = v; this.$textarea.dispatchEvent(new Event('input')); }
    getMode()         { return this.mode; }
    setMode(m)        { this._setMode(m); }
    showStatus(m,t,d) { this._showStatus(m,t,d); }
    focus()           { this.$textarea.focus(); }
    clearFiles()      { this.files = []; this._renderPreviews(); }
  }

  /* ── PUBLIC API ─────────────────────────────── */
  return {
    /**
     * Monta el componente en un contenedor
     * @param {string|HTMLElement} selector
     * @param {Object} config - { onSend, badgeEl, onModeChange, placeholder, sendLabel }
     * @returns {ChatInput}
     */
    mount(selector, config = {}) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) { console.error('[OrionixChat] Contenedor no encontrado:', selector); return null; }
      return new ChatInput(el, config);
    },

    MODES,
    MAX_FILE_MB,
  };

})();
