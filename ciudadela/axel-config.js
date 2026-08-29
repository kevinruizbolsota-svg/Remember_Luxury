window.AXEL_CONFIG={
  SUPABASE_URL:'https://bedixienygfeqtadzeng.supabase.co',
  SUPABASE_PUBLISHABLE_KEY:'PON_AQUI_LA_CLAVE_PUBLICABLE_DE_SUPABASE'
};

// Secure credential manager entry point. Private provider keys are never stored here.
(function(){
  function addButton(){
    if(document.getElementById('axelCredentialsBtn')) return;
    var b=document.createElement('a');
    b.id='axelCredentialsBtn';
    b.href='axel-credentials.html';
    b.textContent='🔐 CREDENCIALES IA';
    b.setAttribute('aria-label','Abrir gestor de credenciales IA');
    b.style.cssText='position:fixed;right:18px;bottom:18px;z-index:9999;border:1px solid #e8c86a;background:#17130a;color:#e8c86a;padding:11px 14px;border-radius:11px;text-decoration:none;font:700 12px system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 10px 30px #0008;letter-spacing:.3px';
    document.body.appendChild(b);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addButton); else addButton();
})();
