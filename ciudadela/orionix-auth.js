/**
 * ORIONIX · Protección de páginas v1.0
 * Incluir en cualquier página protegida:
 *   <script src="orionix-auth.js"></script>
 * Si el usuario no está logueado → redirige a auth.html
 * Expone: window.ORIONIX_USER, window.ORIONIX_IS_ADMIN
 */

(function () {
  const ADMIN_EMAIL = 'kevin.ruiz.bolsota@gmail.com';
  const AUTH_PAGE   = 'auth.html';

  // Inject Firebase if not already loaded
  function loadFirebase(cb) {
    if (window.firebase && window.firebase.auth) { cb(); return; }
    const scripts = [
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
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
      apiKey:            'AIzaSyDZoywcYKSBrAk_iwSMN4rnw7goLSltj7A',
      authDomain:        'las-cronicas-de-krc.firebaseapp.com',
      projectId:         'las-cronicas-de-krc',
      storageBucket:     'las-cronicas-de-krc.firebasestorage.app',
      messagingSenderId: '636206734640',
      appId:             '1:636206734640:web:40c52672294155c6d77cf5',
    };
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    const auth = firebase.auth();

    auth.onAuthStateChanged(user => {
      if (!user) {
        // Not logged in → redirect to auth
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.replace(AUTH_PAGE + '?return=' + returnTo);
      } else {
        window.ORIONIX_USER     = user;
        window.ORIONIX_IS_ADMIN = user.email === ADMIN_EMAIL;

        // Dispatch event so page can react
        document.dispatchEvent(new CustomEvent('orionix:auth', {
          detail: { user, isAdmin: window.ORIONIX_IS_ADMIN }
        }));
      }
    });
  }

  loadFirebase(initAuth);
})();
