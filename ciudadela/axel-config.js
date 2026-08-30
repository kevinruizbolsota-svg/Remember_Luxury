window.AXEL_CONFIG={
  SUPABASE_URL:'https://bedixienygfeqtadzeng.supabase.co',
  SUPABASE_PUBLISHABLE_KEY:'sb_publishable_5x2EPwxu-C7TB_M3-KaQSQ_hznGilvL'
};

// AXEL internal mind architecture. No private provider keys are stored here.
(function(){
  function loadMind(){
    if(document.getElementById('axelMindScript')) return;
    var s=document.createElement('script');
    s.id='axelMindScript'; s.src='axel-mind.js'; s.async=false;
    document.head.appendChild(s);
  }
  function addButton(){
    loadMind();
    if(document.getElementById('axelCredentialsBtn')) return;
    var b=document.createElement('a');
    b.id='axelCredentialsBtn'; b.href='axel-credentials.html'; b.textContent='🔐 CREDENCIALES IA';
    b.setAttribute('aria-label','Abrir gestor de credenciales IA');
    b.style.cssText='position:fixed;right:18px;bottom:18px;z-index:99999;border:1px solid #e8c86a;background:#17130a;color:#e8c86a;padding:13px 16px;border-radius:12px;text-decoration:none;font:800 12px system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 12px 36px #000b;letter-spacing:.4px';
    document.body.appendChild(b);
    var side=document.querySelector('.side');
    if(side && !document.getElementById('axelCredentialsNav')){
      var n=document.createElement('a'); n.id='axelCredentialsNav'; n.href='axel-credentials.html'; n.textContent='🔐 Credenciales IA';
      n.style.cssText='display:block;width:100%;text-align:left;box-sizing:border-box;border:1px solid #5b4d29;background:#17130a;color:#e8c86a;padding:11px;border-radius:10px;margin:8px 0 3px;text-decoration:none;font:700 13px system-ui,-apple-system,"Segoe UI",sans-serif';
      side.appendChild(n);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addButton); else addButton();
})();
