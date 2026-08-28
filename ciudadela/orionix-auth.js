/**
 * ORIONIX · Protección de páginas v1.1
 * Redirige usuarios no autenticados a auth.html y expone la identidad autenticada.
 */
(function () {
  const ADMIN_EMAILS = new Set([
    'kevin.ruiz.calle@gmail.com',
    'kevin.ruiz.bolsota@gmail.com',
    'kevin.ruiz.diamante@gmail.com'
  ]);
  const AUTH_PAGE = 'auth.html';

  function loadFirebase(cb) {
    if (window.firebase && window.firebase.auth) { cb(); return; }
    const scripts = [
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js'
    ];
    let loaded = 0;
    scripts.forEach(src => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => { if (++loaded === scripts.length) cb(); };
      document.head.appendChild(s);
    });
  }

  function initAuth() {
    const cfg = {
      apiKey: 'AIzaSyDZoywcYKSBrAk_iwSMN4rnw7goLSltj7A',
      authDomain: 'las-cronicas-de-krc.firebaseapp.com',
      projectId: 'las-cronicas-de-krc',
      storageBucket: 'las-cronicas-de-krc.firebasestorage.app',
      messagingSenderId: '636206734640',
      appId: '1:636206734640:web:40c52672294155c6d77cf5'
    };
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    const auth = firebase.auth();

    auth.onAuthStateChanged(user => {
      if (!user) {
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.replace(AUTH_PAGE + '?return=' + returnTo);
        return;
      }
      const email = (user.email || '').trim().toLowerCase();
      window.ORIONIX_USER = user;
      window.ORIONIX_IS_ADMIN = ADMIN_EMAILS.has(email);
      window.ORIONIX_ROLE = window.ORIONIX_IS_ADMIN ? 'creador' : 'usuario';
      document.dispatchEvent(new CustomEvent('orionix:auth', {
        detail: { user, isAdmin: window.ORIONIX_IS_ADMIN, role: window.ORIONIX_ROLE }
      }));
    });
  }

  loadFirebase(initAuth);
})();
