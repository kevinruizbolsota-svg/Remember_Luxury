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
// Interceptar TODOS los enlaces

// Interceptar TODOS los enlaces del sitio: si no hay sesión, el clic siempre
// pasa primero por auth.html y luego vuelve al destino original.
document.addEventListener("click", function (event) {
  const link = event.target.closest("a[href]");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  if (
    href.startsWith("#") ||
    href.startsWith("javascript:") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    link.target === "_blank"
  ) return;

  let destination;
  try {
    destination = new URL(link.href, window.location.href);
  } catch (e) {
    return;
  }

  // Solo protegemos enlaces internos del mismo sitio.
  if (destination.origin !== window.location.origin) return;
  if (destination.pathname.endsWith("/auth.html")) return;

  if (!authed) {
    event.preventDefault();
    event.stopPropagation();
    sessionStorage.setItem(
      "orionix_redirect_after_login",
      destination.href
    );
    window.location.href =
      window.location.origin + "/Remember_Luxury/ciudadela/auth.html";
  }
}, true);
