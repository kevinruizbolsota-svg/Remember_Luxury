// orionix-guard.js
(function () {
  // auth.html es la única puerta pública del sitio.
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const publicPages = ["auth.html"];

  if (publicPages.includes(currentFile)) return;

  const sesionRaw = localStorage.getItem("orionix_sesion");
  let authed = false;

  if (sesionRaw) {
    try {
      const s = JSON.parse(sesionRaw);
      authed = !!(s && (s.uid || s.email || s.nombre));
    } catch (e) {}
  }

  if (!authed) {
    // Guarda exactamente la página que el visitante quería abrir.
    sessionStorage.setItem(
      "orionix_redirect_after_login",
      window.location.href
    );

    // Evita bucles y lleva siempre a la página oficial de acceso.
    const base = window.location.origin + window.location.pathname.split("/ciudadela/")[0];
    window.location.href =
      base + "/ciudadela/auth.html";
  }
})();