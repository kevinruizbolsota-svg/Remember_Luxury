#!/usr/bin/env python3
"""
ORIONIX Motor v3 — Bucle autónomo Ollama → GitHub
Modelos disponibles: qwen2.5-coder:14b-16k (principal), qwen2.5:14b, llama3.1:8b
"""

import requests
import json
import base64
import time
import re
import os
from datetime import datetime

# ─── CONFIGURACIÓN ───────────────────────────────────────────────
GITHUB_TOKEN   = os.environ.get("GITHUB_TOKEN", "TU_TOKEN_AQUI")
GITHUB_REPO    = "kevinruizbolsota-svg/Remember_Luxury"
GITHUB_BRANCH  = "main"
GITHUB_PATH    = "ciudadela"

OLLAMA_URL     = "http://localhost:11434/api/chat"
MODELO_DEFAULT = "qwen2.5-coder:14b-16k"

N8N_QUEUE_URL  = "https://lkevinruizl.app.n8n.cloud/webhook/orionix-queue"

INTERVALO_POLL = 60   # segundos entre polls cuando no hay misión
MAX_TOKENS     = 8000
TIMEOUT_OLLAMA = 300  # 5 minutos máximo por generación

# ─── GITHUB API ──────────────────────────────────────────────────

def github_get_sha(ruta_archivo: str) -> str | None:
    """Obtiene el SHA actual de un archivo en GitHub (necesario para actualizar)."""
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{ruta_archivo}"
    headers = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    r = requests.get(url, headers=headers, timeout=15)
    if r.status_code == 200:
        return r.json().get("sha")
    return None

def github_commit(ruta_archivo: str, contenido: str, mensaje: str) -> dict:
    """Sube o actualiza un archivo en GitHub."""
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{ruta_archivo}"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
    }
    b64 = base64.b64encode(contenido.encode("utf-8")).decode("ascii")
    sha = github_get_sha(ruta_archivo)
    body = {"message": mensaje, "content": b64, "branch": GITHUB_BRANCH}
    if sha:
        body["sha"] = sha
    r = requests.put(url, headers=headers, data=json.dumps(body), timeout=30)
    return r.json()

# ─── OLLAMA ──────────────────────────────────────────────────────

def generar_html(descripcion: str, pagina: str, modelo: str) -> str:
    """Llama a Ollama y extrae el HTML generado."""
    prompt = f"""Eres un desarrollador web experto en diseño de lujo. 
Genera una página HTML completa y profesional para ORIONIX.

PÁGINA: {pagina}
INSTRUCCIÓN: {descripcion}

REQUISITOS OBLIGATORIOS:
- HTML completo con DOCTYPE, head y body
- Fuentes: Cinzel y Cormorant Garamond de Google Fonts
- Colores: fondo #0b0b0d (cosmos negro), dorado #e8c86a, texto blanco
- Favicon: <link rel="icon" href="favicon.svg">
- Meta og:image: https://raw.githubusercontent.com/kevinruizbolsota-svg/Remember_Luxury/main/ciudadela/unnamed.png
- Logo ORIONIX en nav con link a index.html
- Diseño responsive y elegante
- CSS inline en <style> (no archivos externos)
- JavaScript vanilla si es necesario

Responde SOLO con el código HTML completo entre ```html y ```, sin explicaciones."""

    payload = {
        "model": modelo,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
        "options": {"num_predict": MAX_TOKENS, "temperature": 0.7}
    }

    r = requests.post(OLLAMA_URL, json=payload, timeout=TIMEOUT_OLLAMA)
    r.raise_for_status()
    respuesta = r.json()["message"]["content"]

    # Extraer bloque HTML
    match = re.search(r"```html\s*([\s\S]+?)```", respuesta, re.IGNORECASE)
    if match:
        return match.group(1).strip()

    # Si no tiene marcadores, intentar extraer directamente
    if "<!DOCTYPE" in respuesta.upper() or "<html" in respuesta.lower():
        start = respuesta.lower().find("<!doctype")
        if start == -1:
            start = respuesta.lower().find("<html")
        return respuesta[start:].strip()

    # Devolver tal cual como último recurso
    return respuesta.strip()

# ─── N8N QUEUE ──────────────────────────────────────────────────

def obtener_mision() -> dict | None:
    """Pide la siguiente misión pendiente a n8n."""
    try:
        r = requests.post(N8N_QUEUE_URL, json={"accion": "obtener_pendiente"}, timeout=15)
        data = r.json()
        if data.get("ok") and data.get("mision"):
            return data["mision"]
    except Exception as e:
        print(f"[ERROR] No pude contactar n8n: {e}")
    return None

def reportar_resultado(mision_id: int, titulo: str, exito: bool, resultado_url: str = "", error: str = ""):
    """Reporta el resultado de una misión a n8n."""
    try:
        requests.post(N8N_QUEUE_URL, json={
            "accion": "completar_mision",
            "id": mision_id,
            "titulo": titulo,
            "exito": exito,
            "resultado_url": resultado_url,
            "error": error,
        }, timeout=15)
    except Exception as e:
        print(f"[WARN] No pude reportar resultado: {e}")

def agregar_mision(titulo: str, descripcion: str, pagina: str, modelo: str = MODELO_DEFAULT):
    """Agrega una misión nueva a la cola desde este script."""
    r = requests.post(N8N_QUEUE_URL, json={
        "accion": "nueva_mision",
        "titulo": titulo,
        "descripcion": descripcion,
        "pagina": pagina,
        "modelo": modelo,
    }, timeout=15)
    return r.json()

# ─── BUCLE PRINCIPAL ─────────────────────────────────────────────

def ejecutar_mision(mision: dict):
    mision_id = mision["id"]
    titulo    = mision.get("titulo", "Sin título")
    descripcion = mision.get("descripcion", "Crea una página HTML para ORIONIX")
    pagina    = mision.get("pagina", "nueva_pagina.html")
    modelo    = mision.get("modelo") or MODELO_DEFAULT
    ruta      = f"{GITHUB_PATH}/{pagina}"

    print(f"\n{'='*60}")
    print(f"[MISIÓN #{mision_id}] {titulo}")
    print(f"  Página:  {pagina}")
    print(f"  Modelo:  {modelo}")
    print(f"  Inicio:  {datetime.now().strftime('%H:%M:%S')}")
    print(f"{'='*60}")

    try:
        print("[1/3] Generando HTML con Ollama...")
        html = generar_html(descripcion, pagina, modelo)
        print(f"  → {len(html)} caracteres generados")

        print("[2/3] Subiendo a GitHub...")
        commit_msg = f"feat(motor): {titulo} — Auto-deploy ORIONIX Motor v3"
        resultado = github_commit(ruta, html, commit_msg)

        if "content" in resultado or "commit" in resultado:
            url = f"https://kevinruizbolsota-svg.github.io/Remember_Luxury/{ruta}"
            print(f"[3/3] ✅ Éxito → {url}")
            reportar_resultado(mision_id, titulo, True, url)
        else:
            error_msg = resultado.get("message", "Error desconocido de GitHub")
            print(f"[3/3] ❌ Error GitHub: {error_msg}")
            reportar_resultado(mision_id, titulo, False, error=error_msg)

    except requests.exceptions.Timeout:
        err = f"Timeout después de {TIMEOUT_OLLAMA}s — timeout por modelo muy lento"
        print(f"[ERROR] {err}")
        reportar_resultado(mision_id, titulo, False, error=err)
    except Exception as e:
        print(f"[ERROR] {e}")
        reportar_resultado(mision_id, titulo, False, error=str(e))

def loop_principal():
    print("\n" + "█"*60)
    print("  ORIONIX MOTOR v3 — ACTIVO")
    print(f"  Ollama: {OLLAMA_URL}")
    print(f"  Queue:  {N8N_QUEUE_URL}")
    print(f"  Poll:   cada {INTERVALO_POLL}s")
    print("█"*60 + "\n")

    while True:
        mision = obtener_mision()
        if mision:
            ejecutar_mision(mision)
            # Poll inmediato para ver si hay más misiones
            time.sleep(3)
        else:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Sin misiones pendientes. Esperando {INTERVALO_POLL}s...")
            time.sleep(INTERVALO_POLL)

# ─── CLI ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "agregar":
        # Uso: python motor_v3.py agregar "Título" "Descripción" "pagina.html"
        if len(sys.argv) < 5:
            print("Uso: python motor_v3.py agregar <titulo> <descripcion> <pagina.html>")
            sys.exit(1)
        resultado = agregar_mision(sys.argv[2], sys.argv[3], sys.argv[4])
        print(f"Misión agregada: {json.dumps(resultado, indent=2)}")
    else:
        # Modo bucle
        if not GITHUB_TOKEN or GITHUB_TOKEN == "TU_TOKEN_AQUI":
            print("[ERROR] Falta GITHUB_TOKEN. Ejecútalo así:")
            print('  $env:GITHUB_TOKEN = "ghp_tu_token_aqui"')
            print("  python motor_v3.py")
            sys.exit(1)
        loop_principal()
