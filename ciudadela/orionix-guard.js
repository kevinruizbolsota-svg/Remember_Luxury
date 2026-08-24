// REMEMBER LUXURY — acceso obligatorio
(function () {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  if (currentFile === "auth.html") return;

  function hasSession() {
    try {
      const raw = localStorage.getItem("orionix_sesion");
      if (!raw) return false;
      const s = JSON.parse(raw);
      return !!(s && (s.uid || s.email || s.nombre));
    } catch (_) {
      return false;
    }
  }

  const loginUrl = window.location.origin + "/Remember_Luxury/ciudadela/auth.html";

  if (!hasSession()) {
    sessionStorage.setItem("orionix_redirect_after_login", window.location.href);
    window.location.replace(loginUrl);
    return;
  }

  // Incluso con sesión, los enlaces quedan bajo control normal.
  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) return;

    // Si ya hay sesión, deja navegar normalmente.
  }, true);
})();