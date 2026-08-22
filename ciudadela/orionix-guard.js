// orionix-guard.js
(function() {
  const sesionRaw = localStorage.getItem("orionix_sesion");
  let authed = false;
  if (sesionRaw) {
    try {
      const s = JSON.parse(sesionRaw);
      if (s && (s.uid || s.email || s.nombre)) {
        authed = true;
      }
    } catch(e) {}
  }

  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const publicPages = ["auth.html", "login.html", "portal.html"];

  if (!authed && !publicPages.includes(currentFile)) {
    sessionStorage.setItem("orionix_redirect_after_login", window.location.href);
    window.location.href = "auth.html";
  }
})();
