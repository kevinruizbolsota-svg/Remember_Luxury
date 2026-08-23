/**
 * ORIONIX KRC -- Sistema de Moneda y Checkout Universal
 * Injectar en: articulos.html, carrito.html, tienda.html
 *
 * Funciones:
 * - KRC Coins: saldo, ganar, gastar
 * - Modal de checkout: KRC / WhatsApp / PayPal
 * - Notificación de pedido a n8n
 * v2 -- fix: confirmarPago sin JSON en onclick
 */

(function () {
  'use strict';

  const WEBHOOK = 'https://lkevinruizl.app.n8n.cloud/webhook/orionix-checkout';
  const WHATSAPP_NUM = '34000000000';
  const PAYPAL_EMAIL = 'kevin.ruiz.bolsota@gmail.com';
  const KRC_RATE = 10;

  function getKRC() {
    var s = JSON.parse(localStorage.getItem('orionix_sesion') || '{}');
    return parseInt(s.krc || 0);
  }
  function setKRC(n) {
    var s = JSON.parse(localStorage.getItem('orionix_sesion') || '{}');
    s.krc = Math.max(0, parseInt(n));
    localStorage.setItem('orionix_sesion', JSON.stringify(s));
    updateKRCDisplays();
  }
  function addKRC(n) { setKRC(getKRC() + n); }
  function spendKRC(n) {
    var bal = getKRC();
    if (bal < n) return false;
    setKRC(bal - n);
    return true;
  }
  function eurosToKRC(eur) { return Math.floor(parseFloat(eur) * KRC_RATE); }

  function updateKRCDisplays() {
    var krc = getKRC();
    document.querySelectorAll('[data-krc-balance]').forEach(function (el) {
      el.textContent = krc.toLocaleString('es-ES') + ' KRC';
    });
  }

  function getSesion() {
    try { return JSON.parse(localStorage.getItem('orionix_sesion') || '{}'); }
    catch (e) { return {}; }
  }

  function getCart() {
    return JSON.parse(localStorage.getItem('orionix_cart') || '[]');
  }
  function getCartTotal() {
    return getCart().reduce(function (a, i) { return a + (parseFloat(i.precio || i.price || 0) * (i.qty || 1)); }, 0);
  }

  function injectCSS() {
    if (document.getElementById('orionix-krc-css')) return;
    var style = document.createElement('style');
    style.id = 'orionix-krc-css';
    style.textContent = `
.krc-badge-float {
  position: fixed; bottom: 80px; left: 20px; z-index: 890;
  background: linear-gradient(135deg, #0b0b0d, #1a1408);
  border: 1px solid rgba(232,200,106,0.4);
  border-radius: 30px; padding: 8px 16px;
  font-family: 'Cinzel', serif; font-size: .65rem;
  letter-spacing: .1em; color: #e8c86a;
  box-shadow: 0 4px 20px rgba(232,200,106,0.2);
  cursor: pointer; transition: all .3s;
  display: flex; align-items: center; gap: 8px;
}
.krc-badge-float:hover {
  border-color: #e8c86a;
  box-shadow: 0 0 25px rgba(232,200,106,0.4);
  transform: translateY(-2px);
}
#krc-checkout-overlay {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(5,10,24,0.92);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity .3s;
}
#krc-checkout-overlay.open { opacity: 1; pointer-events: all; }
#krc-checkout-box {
  background: linear-gradient(180deg, #080e1e, #050a14);
  border: 1px solid rgba(232,200,106,0.3);
  border-radius: 24px; padding: 36px;
  width: 100%; max-width: 480px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(232,200,106,0.1);
  font-family: 'Cormorant Garamond', serif;
  color: #f0e8d0;
}
.krc-modal-title {
  font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 900;
  color: #e8c26a; letter-spacing: .15em; text-align: center;
  margin-bottom: 6px; text-shadow: 0 0 20px rgba(232,200,106,0.4);
}
.krc-modal-sub { text-align: center; color: rgba(240,232,208,0.5); font-size: .9rem; font-style: italic; margin-bottom: 24px; }
.krc-divider { height: 1px; background: linear-gradient(90deg,transparent,rgba(232,200,106,0.3),transparent); margin: 20px 0; }
.krc-order-summary { background: rgba(255,255,255,0.03); border: 1px solid rgba(232,200,106,0.12); border-radius: 12px; padding: 16px; margin-bottom: 20px; }
.krc-order-item { display: flex; justify-content: space-between; font-size: .95rem; padding: 4px 0; }
.krc-order-total { display: flex; justify-content: space-between; font-family: 'Cinzel', serif; font-size: 1.1rem; font-weight: 900; color: #e8c26a; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(232,200,106,0.2); }
.krc-field { margin-bottom: 14px; }
.krc-field label { display: block; font-family: 'Cinzel', serif; font-size: .6rem; letter-spacing: .1em; color: rgba(232,200,106,0.7); margin-bottom: 6px; text-transform: uppercase; }
.krc-field input { width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(232,200,106,0.2); border-radius: 10px; color: #f0e8d0; font-family: inherit; font-size: 1rem; outline: none; transition: border-color .2s; }
.krc-field input:focus { border-color: #e8c86a; }
.krc-methods { display: flex; flex-direction: column; gap: 12px; margin: 20px 0; }
.krc-method { border: 2px solid rgba(232,200,106,0.15); border-radius: 14px; padding: 16px 20px; cursor: pointer; transition: all .25s; display: flex; align-items: center; gap: 14px; }
.krc-method:hover { border-color: rgba(232,200,106,0.4); background: rgba(232,200,106,0.05); }
.krc-method.selected { border-color: #e8c86a; background: rgba(232,200,106,0.08); }
.krc-method.disabled { opacity: 0.4; cursor: not-allowed; }
.krc-method-icon { font-size: 1.8rem; flex-shrink: 0; }
.krc-method-name { font-family: 'Cinzel', serif; font-size: .85rem; font-weight: 700; color: #e8c26a; letter-spacing: .1em; }
.krc-method-desc { font-size: .85rem; color: rgba(240,232,208,0.5); margin-top: 2px; }
.krc-method-badge { margin-left: auto; padding: 4px 10px; border-radius: 20px; font-family: 'Cinzel', serif; font-size: .55rem; letter-spacing: .1em; background: rgba(232,200,106,0.15); color: #e8c26a; white-space: nowrap; }
.krc-method.krc-coin-method { background: linear-gradient(135deg, rgba(232,200,106,0.08), rgba(184,154,64,0.04)); border-color: rgba(232,200,106,0.3); }
.krc-coin-balance { text-align: center; padding: 12px; background: rgba(232,200,106,0.06); border-radius: 10px; font-family: 'Cinzel', serif; margin-top: 8px; }
.krc-coin-balance .krc-big-num { font-size: 1.8rem; color: #e8c26a; font-weight: 900; }
.krc-coin-balance .krc-small { font-size: .7rem; color: rgba(232,200,106,0.6); letter-spacing: .1em; }
.krc-btn-confirm { width: 100%; padding: 16px; border: none; border-radius: 12px; font-family: 'Cinzel', serif; font-size: .85rem; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; cursor: pointer; background: linear-gradient(135deg, #e8c26a, #b89a40); color: #050a14; transition: all .3s; margin-top: 8px; }
.krc-btn-confirm:hover { box-shadow: 0 0 30px rgba(232,200,106,0.5); transform: translateY(-2px); }
.krc-btn-confirm:disabled { opacity: .5; cursor: wait; transform: none; }
.krc-btn-cancel { width: 100%; padding: 12px; border: 1px solid rgba(232,200,106,0.2); border-radius: 12px; background: transparent; color: rgba(240,232,208,0.5); font-family: 'Cinzel', serif; font-size: .7rem; letter-spacing: .1em; cursor: pointer; transition: all .25s; margin-top: 8px; }
.krc-btn-cancel:hover { border-color: rgba(232,200,106,0.4); color: #e8c26a; }
#krc-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(100px); background: rgba(5,10,24,.97); border: 1px solid rgba(232,200,106,0.4); color: #e8c26a; font-family: 'Cinzel', serif; font-size: .65rem; letter-spacing: .1em; padding: 14px 28px; border-radius: 12px; z-index: 9999; transition: transform .35s; text-align: center; }
#krc-toast.on { transform: translateX(-50%) translateY(0); }
.krc-success { text-align: center; padding: 20px 0; }
.krc-success-icon { font-size: 3.5rem; margin-bottom: 16px; display: block; }
.krc-success-title { font-family: 'Cinzel', serif; font-size: 1.3rem; color: #e8c26a; margin-bottom: 10px; }
.krc-success-msg { color: rgba(240,232,208,0.6); font-size: 1rem; line-height: 1.6; margin-bottom: 20px; }
.krc-earned { display: inline-block; padding: 10px 24px; background: rgba(232,200,106,0.12); border: 1px solid rgba(232,200,106,0.3); border-radius: 30px; font-family: 'Cinzel', serif; font-size: .85rem; color: #e8c26a; margin-bottom: 20px; }
    `;
    document.head.appendChild(style);
  }

  function buildModal() {
    if (document.getElementById('krc-checkout-overlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'krc-checkout-overlay';
    overlay.innerHTML = '<div id="krc-checkout-box"></div>';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeCheckout();
    });
    document.body.appendChild(overlay);
    var toast = document.createElement('div');
    toast.id = 'krc-toast';
    document.body.appendChild(toast);
  }

  function buildBadge() {
    if (document.getElementById('krc-badge-float')) return;
    var badge = document.createElement('div');
    badge.id = 'krc-badge-float';
    badge.className = 'krc-badge-float';
    badge.innerHTML = '<span>💢</span><span data-krc-balance>' + getKRC().toLocaleString('es-ES') + ' KRC</span>';
    badge.addEventListener('click', function () {
      showKRCToast('💢 Tienes ' + getKRC().toLocaleString('es-ES') + ' KRC - usalos al pagar');
    });
    document.body.appendChild(badge);
  }

  function showKRCToast(msg) {
    var t = document.getElementById('krc-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    setTimeout(function () { t.classList.remove('on'); }, 3500);
  }

  function openCheckout(productData) {
    var box = document.getElementById('krc-checkout-box');
    var overlay = document.getElementById('krc-checkout-overlay');
    if (!box || !overlay) return;

    var cart = productData ? [productData] : getCart();
    if (!cart.length) { showKRCToast('Tu carrito está vacío'); return; }

    var total = cart.reduce(function (a, i) {
      return a + (parseFloat(i.precio || i.price || 0) * (i.qty || 1));
    }, 0);

    // Guardar carrito y total en memoria para confirmarPago
    window._krcCurrentCart = cart;
    window._krcCurrentTotal = total;

    var krcBalance = getKRC();
    var krcEquiv = Math.floor(total * 100);
    var canPayKRC = krcBalance >= krcEquiv;
    var sesion = getSesion();

    var itemsHtml = cart.map(function (i) {
      return '<div class="krc-order-item"><span>' + (i.nombre || i.title || 'Producto') + ' x' + (i.qty || 1) + '</span><span>€' + parseFloat(i.precio || i.price || 0).toFixed(2) + '</span></div>';
    }).join('');

    box.innerHTML = '';
    box.innerHTML =
      '<div class="krc-modal-title">✦ CHECKOUT ORIONIX ✦</div>' +
      '<div class="krc-modal-sub">Elige cómo quieres pagar</div>' +
      '<div class="krc-order-summary">' + itemsHtml +
      '<div class="krc-order-total"><span>TOTAL</span><span>€</span>' + total.toFixed(2) + '</span></div></div>' +
      '<div class="krc-field"><label>Tu nombre</label>' +
      '<input type="text" id="krc-nombre" placeholder="Kevin Ruiz" value="' + (sesion.nombre || '').replace(/\"/g, '&quot;') + '"></div>' +
      '<div class="krc-field"><label>Telegram</label>' +
      '<input type="text" id="krc-telegram" placeholder="@tu_telegram"></div>' +
      '<div class="krc-divider"></div>' +
      '<div style="font-family:\'Cinzel\',serif;font-size:.65rem;letter-spacing:.12em;color:rgba(232,200,106,0.7);margin-bottom:12px;text-transform:uppercase;">Método de Pago</div>' +
      '<div class="krc-methods">' +
      // KRC
      '<div class="krc-method krc-coin-method ' + (canPayKRC ? '' : 'disabled') + '" data-method="krc" onclick="window.ORIONIX_KRC.selectMethod(this,\'krc\')">' +
      '<span class="krc-method-icon">💢</span>' +
      '<div class="krc-method-info"><div class="krc-method-name">KRC</div>' +
      '<div class="krc-method-desc">' + (canPayKRC ? 'Pagar con ' + krcEquiv + ' KRC' : 'Saldo insuficiente (' + krcBalance + '/' + krcEquiv + ' KRC)') + '</div></div>' +
      '<div class="krc-method-badge">' + krcBalance.toLocaleString('es-ES') + ' KRC</div></div>' +
      // WhatsApp
      '<div class="krc-method" data-method="whatsapp" onclick="window.ORIONIX_KRC.selectMethod(this,\'whatsapp\')">' +
      '<span class="krc-method-icon">📺</span>' +
      '<div class="krc-method-info"><div class="krc-method-name">WhatsApp</div><div class="krc-method-desc">Coordina el pago con ORIONIX</div></div>' +
      '<div class="krc-method-badge">VIP</div></div>' +
      // PayPal
      '<div class="krc-method" data-method="paypal" onclick="window.ORIONIX_KRC.selectMethod(this,\'paypal\')">' +
      '<span class="krc-method-icon">💷</span>' +
      '<div class="krc-method-info"><div class="krc-method-name">PayPal</div><div class="krc-method-desc">Pago seguro con tarjeta o PayPal</div></div>' +
      '<div class="krc-method-badge">SEGURO</div></div>' +
      '</div>' + // end methods
      '<div class="krc-coin-balance" id="krc-coins-earned-preview" style="display:none">' +
      '<div class="krc-small">GANARASAL COMPRAR</div>' +
      '<div class="krc-big-num">+' + eurosToKRC(total) + ' KRC</div>' +
      '<div class="krc-small">para pr�ximas compras</div></div>' +
      // Botón -- SIN JSON en onclick
      '<button class="krc-btn-confirm" id="krc-btn-confirm" onclick="window.ORIONIX_KRC.confirmarPago()">CONFIRMAR PEDIDO →</button>' +
      '<button class="krc-btn-cancel" onclick="window.ORIONIX_KRC.closeCheckout()">Cancelar</button>';

    var defaultMethod = canPayKRC ? 'krc' : 'whatsapp';
    var defaultEl = box.querySelector('[data-method="' + defaultMethod + '"]');
    if (defaultEl) {
      defaultEl.classList.add('selected');
      selectedMethod = defaultMethod;
      if (defaultMethod !== 'krc') {
        var preview = document.getElementById('krc-coins-earned-preview');
        if (preview) preview.style.display = 'block';
      }
    }
    overlay.classList.add('open');
  }

  var selectedMethod = 'whatsapp';

  function selectMethod(el, method) {
    if (el.classList.contains('disabled')) return;
    document.querySelectorAll('.krc-method').forEach(function (m) { m.classList.remove('selected'); });
    el.classList.add('selected');
    selectedMethod = method;
    var preview = document.getElementById('krc-coins-earned-preview');
    if (preview) preview.style.display = (method === 'krc') ? 'none' : 'block';
  }

  function closeCheckout() {
    var overlay = document.getElementById('krc-checkout-overlay');
    if (overlay) overlay.classList.remove('open');
    selectedMethod = 'whatsapp';
  }

  // Lee de _wrcCurrentCart -- sin pasar JSON por onclick
  function confirmarPago() {
    var nombre = (document.getElementById('krc-nombre') || {}).value || '';
    var telegram = (document.getElementById('krc-telegram') || {}).value || '';
    if (!nombre.trim()) { showKRCToast('💦 Por favor escribe tu nombre'); return; }

    var cart = window._krcCurrentCart || getCart();
    var total = window._krcCurrentTotal || getCartTotal();
    if (!cart.length) { showKRCToast('Tu carrito está vacío'); return; }

    var btn = document.getElementById('krc-btn-confirm');
    if (btn) { btn.disabled = true; btn.textContent = 'Procesando…'; }

    if (selectedMethod === 'whatsapp') {
      var lineas = cart.map(function (i) {
        return '• ' + (i.nombre || i.title || 'Producto') + ' x' + (i.qty || 1) + ' — €' + parseFloat(i.precio || i.price || 0).toFixed(2);
      });
      var msgTexto = '🛍 Hola ORIONIX, quiero hacer un pedido:\n\n' +
        lineas.join('\n') +
        '\n\nTotal: \nNombre: ' + nombre +
        '\nTelegram: ' + (telegram || 'no indicado');
      window.open('https://wa.me/' + WHATSAPP_NUM + '?text=' + encodeURIComponent(msgTexto), '_blank');
      registrarPedido(cart, total, nombre, telegram, 'whatsapp', 0);

    } else if (selectedMethod === 'paypal') {
      var paypalUser = PAYPAL_EMAIL.split('@')[0].replace(/\./g, '');
      var paypalUrl = 'https://www.paypal.com/paypalme/' + paypalUser + '/' + total.toFixed(2) + 'EUR';
      window.open(paypalUrl, '_blank');
      registrarPedido(cart, total, nombre, telegram, 'paypal', 0);

    } else if (selectedMethod === 'krc') {
      var krcEquiv = Math.floor(total * 100);
      if (!spendKRC(krcEquiv)) {
        showKRCToast('Saldo KRC insuficiente');
        if (btn) { btn.disabled = false; btn.textContent = 'CONFIRMARPEDIDO →'; }
        return;
      }
      registrarPedido(cart, total, nombre, telegram, 'krc', krcEquiv);
    }
  }

  function registrarPedido(cart, total, nombre, telegram, metodo, krc_usado) {
    var items = cart.map(function (i) { return { nombre: i.nombre || i.title, precio: i.precio || i.price, qty: i.qty || 1 }; });
    var krcGanados = metodo === 'krc' ? 0 : eurosToKRC(total);
    fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ metodo, total, krc_usado, nombre, telegram, items }) })
      .then(function (r) { return r.json(); })
      .then(function (data) { if (krcGanados > 0) addKRC(krcGanados); mostrarExito(data.orden_id || 'ORX-' + Date.now(), krcGanados, metodo); })
      .catch(function () { if (krcGanados > 0) addKRC(krcGanados); mostrarExito('ORX-' + Date.now(), krcGanados, metodo); });
  }

  function mostrarExito(orden_id, krcGanados, metodo) {
    var box = document.getElementById('krc-checkout-box');
    if (!box) return;
    var metodosDesc = {
      whatsapp: 'Te hemos abierto WhatsApp. Un agente ORIONIX confirmar� el pago.',
      paypal: 'Te hemos redirigido a PayPal. Completa el pago en la nueva ventana.',
      krc: 'TDBIC: deducidos de tu saldo! Pedido confirmado.'
    };
    box.innerHTML =
      '<div class="krc-success">' +
      '<span class="krc-success-icon">✐</span>' +
      '<div class="krc-success-title">¡PEDIDO RECIBIDO!</div>' +
      '<div class="krc-success-msg">' + (metodosDesc[metodo] || 'Pedido procesado.') + '</div>' +
      '<div style="font-family:\'Cinzel\',serif;font-size:.7rem;color:rgba(232,200,106,0.5);letter-spacing:.1em;margin-bottom:16px;">ORDEN: ' + orden_id + '</div>' +
      (krcGanados > 0 ? '<div class="krc-earned">💢 +' + krcGanados + ' KRC ganados</div>' : '') +
      '<button class="krc-btn-confirm" onclick="window.ORIONIX_KRC.closeCheckout()" style="max-width:200px;margin:0 auto">CONTINUAR →</button>' +
      '</div>';
    if (metodo !== 'whatsapp') localStorage.removeItem('orionix_cart');
  }

  function patchBuyButtons() {
    document.querySelectorAll('.btn-buy, [data-buy-btn], .btn-checkout').forEach(function (btn) {
      if (btn.dataset.krcPatched) return;
      btn.dataset.krcPatched = '1';
      if (btn.classList.contains('btn-checkout')) {
        btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); openCheckout(null); });
      }
    });
  }

  window.ORIONIX_KRC = {
    open: openCheckout,
    close: closeCheckout,
    closeCheckout: closeCheckout,
    selectMethod: selectMethod,
    confirmarPago: confirmarPago,
    getKRC: getKRC,
    addKRC: addKRC,
    showToast: showKRCToast,
  };

  window.procederPago = function () { openCheckout(null); };

  function init() {
    injectCSS();
    buildModal();
    buildBadge();
    updateKRCDisplays();
    patchBuyButtons();
    var sesion = getSesion();
    if (!sesion.krc_welcome && !sesion.krc) {
      addKRC(50);
      var s = getSesion(); s.krc_welcome = true; localStorage.setItem('orionix_sesion', JSON.stringify(s));
      setTimeout(function () { showKRCToast('💢 ¡Bienvenido! Te regalamos 50 KRC para empezar'); }, 1500);
    }
    var obs = new MutationObserver(function () { patchBuyButtons(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
